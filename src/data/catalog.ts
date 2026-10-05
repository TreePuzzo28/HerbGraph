import { z } from 'zod';
import type { CatalogEntry, EntryType, PublishedCatalog } from '../types/catalog';

const catalogEntrySchema = z
  .object({
    id: z.string().min(1),
    type: z.enum(['challenge', 'action', 'herb']),
    name: z.string().trim().min(1),
    aliases: z.array(z.string().trim().min(1)).optional(),
    summary: z.string().optional(),
    source: z.string().optional(),
    challengeIds: z.array(z.string()),
    actionIds: z.array(z.string()),
    herbIds: z.array(z.string()),
  })
  .strict();

const publishedCatalogSchema = z
  .object({
    schemaVersion: z.number().int().positive(),
    entries: z.array(catalogEntrySchema),
  })
  .strict();

export function parseCatalog(value: unknown): PublishedCatalog {
  return publishedCatalogSchema.parse(value);
}

export async function loadCatalog(
  fetcher: typeof fetch = fetch,
): Promise<PublishedCatalog> {
  const response = await fetcher(`${import.meta.env.BASE_URL}data/catalog.json`);

  if (!response.ok) {
    throw new Error(`Could not load the published catalog (${response.status}).`);
  }

  return parseCatalog(await response.json());
}

export function getEntryById(
  catalog: PublishedCatalog,
  id: string,
): CatalogEntry | undefined {
  return catalog.entries.find((entry) => entry.id === id);
}

export function getEntriesByType(
  catalog: PublishedCatalog,
  type: EntryType,
): CatalogEntry[] {
  return catalog.entries
    .filter((entry) => entry.type === type)
    .sort(
      (left, right) =>
        left.name.localeCompare(right.name, 'en', {
          sensitivity: 'base',
        }) || left.id.localeCompare(right.id),
    );
}

export function getEntryType(type: string): EntryType | undefined {
  if (
    type === 'challenge' ||
    type === 'challenges' ||
    type === 'health_challenge' ||
    type === 'health-challenges'
  ) {
    return 'challenge';
  }

  if (type === 'action' || type === 'actions') {
    return 'action';
  }

  if (type === 'herb' || type === 'herbs') {
    return 'herb';
  }

  return undefined;
}
