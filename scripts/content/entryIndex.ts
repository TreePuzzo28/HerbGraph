import type { SourceRecord } from './sourceRecord';

function normalizeLabel(value: string): string {
  return value.normalize('NFKC').trim().toLocaleLowerCase('en');
}

export interface EntryIndex {
  byLabel: Map<string, SourceRecord[]>;
  errors: string[];
}

export function createEntryIndex(records: SourceRecord[]): EntryIndex {
  const byLabel = new Map<string, SourceRecord[]>();
  const idOwners = new Map<string, SourceRecord>();
  const errors: string[] = [];

  for (const record of records) {
    const existingOwner = idOwners.get(record.id);
    if (existingOwner) {
      errors.push(
        `${existingOwner.sourcePath} and ${record.sourcePath}: duplicate entry ID "${record.id}"`,
      );
    } else {
      idOwners.set(record.id, record);
    }

    const filename = record.sourcePath
      .split(/[\\/]/)
      .at(-1)
      ?.replace(/\.md$/i, '');
    const labels = new Set([record.name, ...(filename ? [filename] : []), ...record.aliases]);
    for (const label of labels) {
      const key = normalizeLabel(label);
      const owners = byLabel.get(key) ?? [];
      if (!owners.some((owner) => owner.id === record.id)) {
        owners.push(record);
        byLabel.set(key, owners);
      }
    }
  }

  for (const [label, owners] of byLabel) {
    if (owners.length > 1) {
      errors.push(
        `${owners.map(({ sourcePath }) => sourcePath).join(' and ')}: ambiguous title, filename, or alias "${label}"`,
      );
    }
  }

  return { byLabel, errors };
}

export function normalizeEntryLabel(value: string): string {
  return normalizeLabel(value);
}
