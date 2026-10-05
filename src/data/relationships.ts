import type { CatalogEntry, PublishedCatalog } from '../types/catalog';

export type RelationshipField = 'challengeIds' | 'actionIds' | 'herbIds';

const relationshipTypes = {
  challengeIds: 'challenge',
  actionIds: 'action',
  herbIds: 'herb',
} as const;

export function getRelatedEntries(
  catalog: PublishedCatalog,
  entry: CatalogEntry,
  field: RelationshipField,
): CatalogEntry[] {
  const entriesById = new Map(catalog.entries.map((item) => [item.id, item]));
  const uniqueIds = new Set(entry[field]);

  return [...uniqueIds]
    .map((id) => entriesById.get(id))
    .filter(
      (candidate): candidate is CatalogEntry =>
        candidate?.type === relationshipTypes[field],
    );
}

export function getAllRelatedEntries(
  catalog: PublishedCatalog,
  entry: CatalogEntry,
): CatalogEntry[] {
  const fields: RelationshipField[] = ['challengeIds', 'actionIds', 'herbIds'];
  const seenIds = new Set<string>();
  const related: CatalogEntry[] = [];

  for (const field of fields) {
    for (const candidate of getRelatedEntries(catalog, entry, field)) {
      if (!seenIds.has(candidate.id)) {
        seenIds.add(candidate.id);
        related.push(candidate);
      }
    }
  }

  return related;
}
