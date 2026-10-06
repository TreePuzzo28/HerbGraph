import { Link } from 'react-router-dom';
import type { CatalogEntry } from '../types/catalog';

interface EntryLinkProps {
  entry: CatalogEntry;
}

export function EntryLink({ entry }: EntryLinkProps) {
  return <Link to={`/entry/${entry.id}`}>{entry.name}</Link>;
}
