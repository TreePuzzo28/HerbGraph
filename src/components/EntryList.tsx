import type { CatalogEntry } from '../types/catalog';
import { EntryLink } from './EntryLink';

interface EntryListProps {
  entries: CatalogEntry[];
  label: string;
}

export function EntryList({ entries, label }: EntryListProps) {
  return (
    <ul aria-label={label}>
      {entries.map((entry) => (
        <li key={entry.id}>
          <EntryLink entry={entry} />
        </li>
      ))}
    </ul>
  );
}
