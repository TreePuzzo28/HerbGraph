import type { CatalogEntry, PublishedCatalog } from '../../src/types/catalog';
import { createEntryIndex, normalizeEntryLabel } from './entryIndex';
import { parseRelationship } from './parseRelationship';
import type { SourceRecord } from './sourceRecord';

type RelationshipField = 'challengeIds' | 'actionIds' | 'herbIds';

interface MutableEntry extends CatalogEntry {
  challengeIds: string[];
  actionIds: string[];
  herbIds: string[];
}

function addUnique(target: string[], value: string) {
  if (!target.includes(value)) {
    target.push(value);
  }
}

export function resolveRelationships(
  records: SourceRecord[],
): PublishedCatalog {
  const index = createEntryIndex(records);
  const errors = [...index.errors];
  const entries = new Map<string, MutableEntry>();

  for (const record of records) {
    entries.set(record.id, {
      id: record.id,
      type: record.type,
      name: record.name,
      ...(record.aliases.length > 0 ? { aliases: record.aliases } : {}),
      ...(record.summary ? { summary: record.summary } : {}),
      ...(record.source ? { source: record.source } : {}),
      challengeIds: [],
      actionIds: [],
      herbIds: [],
      ...(record.apothecaryApplications
        ? { apothecaryApplications: record.apothecaryApplications }
        : {}),
    });
  }

  const resolve = (
    record: SourceRecord,
    value: string,
    field: string,
    expectedType: SourceRecord['type'],
  ): SourceRecord | undefined => {
    let target: string;
    try {
      target = parseRelationship(value, record.sourcePath, field).target;
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
      return undefined;
    }

    const matches = index.byLabel.get(normalizeEntryLabel(target)) ?? [];
    if (matches.length === 0) {
      errors.push(
        `${record.sourcePath}: ${field} link "${value}" does not resolve to an approved entry`,
      );
      return undefined;
    }
    if (matches.length > 1) {
      errors.push(
        `${record.sourcePath}: ${field} link "${value}" is ambiguous across ${matches.map(({ sourcePath }) => sourcePath).join(', ')}`,
      );
      return undefined;
    }

    const match = matches[0];
    if (match.type !== expectedType) {
      errors.push(
        `${record.sourcePath}: ${field} link "${value}" resolves to ${match.type}; expected ${expectedType}`,
      );
      return undefined;
    }
    return match;
  };

  const link = (
    source: SourceRecord,
    value: string,
    field: string,
    expectedType: SourceRecord['type'],
    sourceField: RelationshipField,
    inverseField: RelationshipField,
  ) => {
    const target = resolve(source, value, field, expectedType);
    if (!target) return;
    const sourceEntry = entries.get(source.id);
    const targetEntry = entries.get(target.id);
    if (!sourceEntry || !targetEntry) {
      errors.push(`${source.sourcePath}: failed to index relationship "${value}"`);
      return;
    }
    addUnique(sourceEntry[sourceField], target.id);
    addUnique(targetEntry[inverseField], source.id);
  };

  for (const record of records) {
    record.actions.forEach((value, indexInField) => {
      link(
        record,
        value,
        `actions[${indexInField}]`,
        'action',
        'actionIds',
        record.type === 'herb' ? 'herbIds' : 'challengeIds',
      );
    });
    record.healthChallenges.forEach((value, indexInField) => {
      if (record.type !== 'herb') {
        errors.push(
          `${record.sourcePath}: health_challenges is allowed only on herb records`,
        );
        return;
      }
      link(
        record,
        value,
        `health_challenges[${indexInField}]`,
        'challenge',
        'challengeIds',
        'herbIds',
      );
    });
  }

  if (errors.length > 0) {
    throw new Error(errors.join('\n'));
  }

  const sortedEntries = [...entries.values()]
    .map((entry) => {
      entry.challengeIds.sort();
      entry.actionIds.sort();
      entry.herbIds.sort();
      return entry;
    })
    .sort((left, right) => left.id.localeCompare(right.id, 'en'));

  return { schemaVersion: 1, entries: sortedEntries };
}
