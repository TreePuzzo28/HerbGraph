import type { ApothecaryApplications, EntryType } from '../../src/types/catalog';

export interface SourceRecord {
  sourcePath: string;
  id: string;
  type: EntryType;
  name: string;
  aliases: string[];
  summary?: string;
  source?: string;
  actions: string[];
  healthChallenges: string[];
  apothecaryApplications?: ApothecaryApplications;
}
