export const entryTypes = ['challenge', 'action', 'herb'] as const;

export type EntryType = (typeof entryTypes)[number];

export interface CatalogEntry {
  id: string;
  type: EntryType;
  name: string;
  aliases?: string[];
  summary?: string;
  source?: string;
  challengeIds: string[];
  actionIds: string[];
  herbIds: string[];
}

export interface PublishedCatalog {
  schemaVersion: number;
  entries: CatalogEntry[];
}
