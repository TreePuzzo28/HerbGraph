import type { CatalogEntry, PublishedCatalog } from '../types/catalog';

export type RelationshipField = 'challengeIds' | 'actionIds' | 'herbIds';

export function getRelatedEntries(
  catalog: PublishedCatalog,
  entry: CatalogEntry,
  field: RelationshipField,
): CatalogEntry[] {
  const uniqueIds = new Set(entry[field]);

  return [...uniqueIds]
    .map((id) => catalog.entries.find((candidate) => candidate.id === id))
    .filter((candidate): candidate is CatalogEntry => candidate !== undefined);
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
