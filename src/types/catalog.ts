export const entryTypes = ['challenge', 'action', 'herb'] as const;

export type EntryType = (typeof entryTypes)[number];

export interface ApothecaryApplications {
  keyChallengesAddressed?: string;
  bestPreparations?: string;
  preparationNotes?: string;
  keyChemistryMechanics?: string;
  safetyContraindications?: string;
}

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
  apothecaryApplications?: ApothecaryApplications;
}

export interface PublishedCatalog {
  schemaVersion: number;
  entries: CatalogEntry[];
}
