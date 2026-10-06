import { useMemo, useState } from 'react';
import { zipSync, strToU8 } from 'fflate';
import {
  parseSourceForCuration,
  serializeCuratedRecord,
  validateCuratedRelationships,
  apothecarySectionFields,
  type CuratedRecord,
} from '../content/curation';

interface ReviewItem {
  id: string;
  filename: string;
  record?: CuratedRecord;
  error?: string;
  approved: boolean;
}

const fieldLabels: Record<string, string> = {
  type: 'Entry type',
  title: 'Title',
  aliases: 'Aliases',
  summary: 'Summary',
  source: 'Source',
  actions: 'Actions',
  health_challenges: 'Health challenges',
  keyChallengesAddressed: 'Key Challenges Addressed',
  bestPreparations: 'Best Preparations',
  preparationNotes: 'Preparation Notes & Apothecary Secrets',
  keyChemistryMechanics: 'Key Chemistry & Mechanics',
  safetyContraindications: 'Safety & Contraindications',
};

function recordPreview(record: CuratedRecord): Array<[string, string]> {
  const fields: Array<[string, string]> = [
    ['type', record.type],
    ['title', record.title],
  ];
  if (record.aliases) fields.push(['aliases', record.aliases.join(', ')]);
  if (record.summary) fields.push(['summary', record.summary]);
  if (record.source) fields.push(['source', record.source]);
  if (record.actions) fields.push(['actions', record.actions.join('\n')]);
  if (record.health_challenges) {
    fields.push(['health_challenges', record.health_challenges.join('\n')]);
  }
  if (record.type === 'herb') {
    for (const { field, heading } of apothecarySectionFields) {
      fields.push([
        heading,
        record.apothecaryApplications?.[field] ??
          'Not found in the selected note — this subsection will not be included.',
      ]);
    }
  }
  return fields;
}

export function ContentImportPage() {
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [fileError, setFileError] = useState<string>();
  const [downloaded, setDownloaded] = useState(false);
  const [strictValidation, setStrictValidation] = useState(true);
  const approvedRecords = useMemo(
    () =>
      items
        .filter((item): item is ReviewItem & { record: CuratedRecord } =>
          item.approved && Boolean(item.record),
        )
        .map(({ record }) => record),
    [items],
  );
  const relationshipErrors = useMemo(
    () => validateCuratedRelationships(approvedRecords, strictValidation),
    [approvedRecords, strictValidation],
  );

  const itemsByType = useMemo(() => {
    const grouped = {
      herb: [] as ReviewItem[],
      action: [] as ReviewItem[],
      challenge: [] as ReviewItem[],
      error: [] as ReviewItem[],
    };
    for (const item of items) {
      if (item.error) {
        grouped.error.push(item);
      } else if (item.record?.type === 'herb') {
        grouped.herb.push(item);
      } else if (item.record?.type === 'action') {
        grouped.action.push(item);
      } else if (item.record?.type === 'challenge') {
        grouped.challenge.push(item);
      }
    }
    return grouped;
  }, [items]);

  const summaryStats = useMemo(() => {
    const approvedByType: Record<'herb' | 'action' | 'challenge', number> = {
      herb: 0,
      action: 0,
      challenge: 0,
    };
    for (const item of items) {
      if (item.approved && item.record) {
        approvedByType[item.record.type]++;
      }
    }
    return {
      total: items.length,
      approved: approvedRecords.length,
      approvedByType,
      validByType: {
        herb: itemsByType.herb.length,
        action: itemsByType.action.length,
        challenge: itemsByType.challenge.length,
      },
      errors: itemsByType.error.length,
    };
  }, [items, approvedRecords.length, itemsByType]);

  async function addFiles(fileList: FileList | null) {
    if (!fileList?.length) return;
    setFileError(undefined);
    setDownloaded(false);
    const files = Array.from(fileList);
    const parsedItems = await Promise.all(
      files.map(async (file, index): Promise<ReviewItem> => {
        const id = `${file.name}:${file.size}:${file.lastModified}:${index}`;
        if (!file.name.toLocaleLowerCase('en').endsWith('.md')) {
          return {
            id,
            filename: file.name,
            error: `${file.name}: select a Markdown file with a .md extension.`,
            approved: false,
          };
        }
        try {
          const contents = await file.text();
          const result = parseSourceForCuration(file.name, contents);
          return result.record
            ? {
                id,
                filename: file.name,
                record: result.record,
                approved: false,
              }
            : {
                id,
                filename: file.name,
                error: result.error ?? `${file.name}: could not parse this file.`,
                approved: false,
              };
        } catch (error) {
          return {
            id,
            filename: file.name,
            error:
              error instanceof Error
                ? `${file.name}: ${error.message}`
                : `${file.name}: file could not be read.`,
            approved: false,
          };
        }
      }),
    );

    const nameCounts = new Map<string, number>();
    const existingNames = new Set(
      items.map((item) => item.filename.toLocaleLowerCase('en')),
    );
    for (const item of parsedItems) {
      const key = item.filename.toLocaleLowerCase('en');
      if (existingNames.has(key)) {
        nameCounts.set(key, 2);
      } else {
        nameCounts.set(key, (nameCounts.get(key) ?? 0) + 1);
      }
    }
    const collisions = [...nameCounts.entries()]
      .filter(([, count]) => count > 1)
      .map(
        ([key]) =>
          parsedItems.find(
            (item) => item.filename.toLocaleLowerCase('en') === key,
          )?.filename ?? key,
      );
    const seenNames = new Set<string>();
    for (const item of items) {
      const key = item.filename.toLocaleLowerCase('en');
      seenNames.add(key);
    }
    const uniqueItems = parsedItems.filter((item) => {
      const key = item.filename.toLocaleLowerCase('en');
      if (
        collisions.some((filename) => filename.toLocaleLowerCase('en') === key) ||
        seenNames.has(key)
      ) {
        return false;
      }
      seenNames.add(key);
      return true;
    });
    setItems([...items, ...uniqueItems]);
    if (collisions.length > 0) {
      setFileError(
        `Duplicate filename(s) not added: ${collisions.join(', ')}. Select files with unique names so imported entry IDs stay predictable.`,
      );
    }
  }

  function approveRecord(id: string, approved: boolean) {
    setDownloaded(false);
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, approved } : item,
      ),
    );
  }

  function removeRecord(id: string) {
    setDownloaded(false);
    setItems((current) => current.filter((item) => item.id !== id));
  }

  function downloadApprovedRecords() {
    const files: Record<string, Uint8Array> = {};
    for (const record of approvedRecords) {
      const safeFilename = record.filename.replace(/[\\/]/g, '_');
      files[`content/approved/${safeFilename}`] = strToU8(
        serializeCuratedRecord(record),
      );
    }
    const archive = zipSync(files, { level: 6 });
    const url = URL.createObjectURL(
      new Blob([archive], { type: 'application/zip' }),
    );
    const link = document.createElement('a');
    link.href = url;
    link.download = 'approved-herb-content.zip';
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setDownloaded(true);
  }

  return (
    <section aria-labelledby="content-import-title" className="content-import">
      <h1 id="content-import-title">Prepare approved content</h1>
      <p>
        Select the Obsidian Markdown records you want to review. This page reads
        the files locally in your browser; it does not upload their contents.
        Only the fields and herb-template sections shown below can be exported.
      </p>
      <p>
        The original files are never changed. Unmapped note-body sections and
        unsupported frontmatter fields are left out of the export.
      </p>

      <label className="file-picker">
        <span>Select Markdown files</span>
        <input
          type="file"
          accept=".md,text/markdown,text/plain"
          multiple
          onChange={(event) => {
            void addFiles(event.currentTarget.files);
            event.currentTarget.value = '';
          }}
        />
      </label>
      {fileError && <p role="alert">{fileError}</p>}
      {items.length > 0 && (
        <div className="button-group">
          <button
            type="button"
            className="secondary-button"
            onClick={() => {
              setItems(items.map(item => ({ ...item, approved: true })));
            }}
          >
            Approve all
          </button>
          <button
            type="button"
            className="secondary-button"
            onClick={() => {
              setItems([]);
              setDownloaded(false);
              setFileError(undefined);
            }}
          >
            Clear all selections
          </button>
        </div>
      )}

      <label className="validation-toggle">
        <input
          type="checkbox"
          checked={strictValidation}
          onChange={(event) => setStrictValidation(event.currentTarget.checked)}
        />
        <span>
          <strong>Strict validation</strong>
          <em>
            {strictValidation
              ? 'Requires all relationships to exist'
              : 'Allows partial imports (checks for duplicates only)'}
          </em>
        </span>
      </label>

      {items.length > 0 && (
        <div className="content-import-layout">
          <aside className="import-summary-sidebar">
            <h2>Selection Summary</h2>
            <dl className="summary-stats">
              <dt>Total records</dt>
              <dd>{summaryStats.total}</dd>

              <dt>Approved for export</dt>
              <dd className="stat-approved">{summaryStats.approved}</dd>

              <dt>Herbs</dt>
              <dd>
                <span className="stat-count">{summaryStats.validByType.herb}</span>
                {summaryStats.approvedByType.herb > 0 && (
                  <span className="stat-approved-count">
                    ({summaryStats.approvedByType.herb} approved)
                  </span>
                )}
              </dd>

              <dt>Actions</dt>
              <dd>
                <span className="stat-count">{summaryStats.validByType.action}</span>
                {summaryStats.approvedByType.action > 0 && (
                  <span className="stat-approved-count">
                    ({summaryStats.approvedByType.action} approved)
                  </span>
                )}
              </dd>

              <dt>Health challenges</dt>
              <dd>
                <span className="stat-count">
                  {summaryStats.validByType.challenge}
                </span>
                {summaryStats.approvedByType.challenge > 0 && (
                  <span className="stat-approved-count">
                    ({summaryStats.approvedByType.challenge} approved)
                  </span>
                )}
              </dd>

              {summaryStats.errors > 0 && (
                <>
                  <dt>Parse errors</dt>
                  <dd className="stat-error">{summaryStats.errors}</dd>
                </>
              )}
            </dl>
          </aside>

          <main className="import-records-container">
            <h2>Review selected records ({items.length})</h2>
            <p>
              Nothing is exported until you check the approval box on each record
              you want included. Review every displayed value, especially
              relationships and herb subsection text.
            </p>

            {summaryStats.errors > 0 && (
              <section className="records-section" aria-labelledby="errors-heading">
                <h3 id="errors-heading">Parse Errors</h3>
                <div className="review-records">
                  {itemsByType.error.map((item) => (
                    <article className="review-record error" key={item.id}>
                      <div className="review-record-heading">
                        <h4>{item.filename}</h4>
                        <button
                          type="button"
                          className="secondary-button"
                          onClick={() => removeRecord(item.id)}
                        >
                          Remove
                        </button>
                      </div>
                      {item.error && <p role="alert">{item.error}</p>}
                    </article>
                  ))}
                </div>
              </section>
            )}

            {itemsByType.herb.length > 0 && (
              <section
                className="records-section"
                aria-labelledby="herbs-heading"
              >
                <h3 id="herbs-heading">Herbs ({itemsByType.herb.length})</h3>
                <div className="review-records">
                  {itemsByType.herb.map((item) => (
                    <ReviewRecordItem
                      key={item.id}
                      item={item}
                      onApprove={approveRecord}
                      onRemove={removeRecord}
                      typeLabel="Herb"
                    />
                  ))}
                </div>
              </section>
            )}

            {itemsByType.action.length > 0 && (
              <section
                className="records-section"
                aria-labelledby="actions-heading"
              >
                <h3 id="actions-heading">Actions ({itemsByType.action.length})</h3>
                <div className="review-records">
                  {itemsByType.action.map((item) => (
                    <ReviewRecordItem
                      key={item.id}
                      item={item}
                      onApprove={approveRecord}
                      onRemove={removeRecord}
                      typeLabel="Action"
                    />
                  ))}
                </div>
              </section>
            )}

            {itemsByType.challenge.length > 0 && (
              <section
                className="records-section"
                aria-labelledby="challenges-heading"
              >
                <h3 id="challenges-heading">
                  Health Challenges ({itemsByType.challenge.length})
                </h3>
                <div className="review-records">
                  {itemsByType.challenge.map((item) => (
                    <ReviewRecordItem
                      key={item.id}
                      item={item}
                      onApprove={approveRecord}
                      onRemove={removeRecord}
                      typeLabel="Health Challenge"
                    />
                  ))}
                </div>
              </section>
            )}
          </main>
        </div>
      )}

      {approvedRecords.length > 0 && (
        <section aria-labelledby="approval-summary-title">
          <h2 id="approval-summary-title">
            Approved for export: {approvedRecords.length}
          </h2>
          {relationshipErrors.length > 0 && (
            <div role="alert" className="import-validation-errors">
              <p>
                Resolve these relationship issues before exporting. Add and
                approve any linked records that should be part of this import.
              </p>
              <ul>
                {relationshipErrors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </div>
          )}
          <button
            type="button"
            onClick={downloadApprovedRecords}
            disabled={relationshipErrors.length > 0}
          >
            Download approved import files (.zip)
          </button>
          {downloaded && (
            <p role="status">
              Download created. Extract it at the repository root, inspect the
              files under content/approved/, then run the content importer.
            </p>
          )}
        </section>
      )}
    </section>
  );
}

interface ReviewRecordItemProps {
  item: ReviewItem;
  onApprove: (id: string, approved: boolean) => void;
  onRemove: (id: string) => void;
  typeLabel: string;
}

function ReviewRecordItem({
  item,
  onApprove,
  onRemove,
  typeLabel,
}: ReviewRecordItemProps) {
  if (!item.record) return null;

  return (
    <article className="review-record">
      <div className="review-record-heading">
        <span className="record-type-badge">{typeLabel}</span>
        <h4>{item.record.title}</h4>
        <button
          type="button"
          className="secondary-button"
          onClick={() => onRemove(item.id)}
        >
          Remove
        </button>
      </div>
      <p className="source-filename">Source file: {item.filename}</p>
      <dl className="record-preview">
        {recordPreview(item.record).map(([key, value], index) => (
          <div key={`${key}-${index}`}>
            <dt>{fieldLabels[key] ?? key}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      {item.record.type === 'herb' && (
        <p className="curation-note">
          Only text under the five recognized H3 headings inside Apothecary &
          Applications is included. A subsection absent from the note will not
          be exported.
        </p>
      )}
      {item.record.omittedMetadataKeys.length > 0 && (
        <p className="curation-note">
          Ignored frontmatter field names:{' '}
          {item.record.omittedMetadataKeys.join(', ')}. Their values are not
          included.
        </p>
      )}
      <label className="approval-control">
        <input
          type="checkbox"
          checked={item.approved}
          onChange={(event) => onApprove(item.id, event.currentTarget.checked)}
        />
        I reviewed and approve this record for inclusion.
      </label>
    </article>
  );
}
