import { Link } from 'react-router-dom';
import { getRelatedEntries } from '../data/relationships';
import type { CatalogEntry, PublishedCatalog } from '../types/catalog';

const relationshipSections = [
  { field: 'challengeIds', label: 'Health challenges' },
  { field: 'actionIds', label: 'Actions' },
  { field: 'herbIds', label: 'Herbs' },
] as const;

interface RelatedEntryLinksProps {
  catalog: PublishedCatalog;
  entry: CatalogEntry;
}

export function RelatedEntryLinks({
  catalog,
  entry,
}: RelatedEntryLinksProps) {
  const sections = relationshipSections
    .map(({ field, label }) => ({
      label,
      entries: getRelatedEntries(catalog, entry, field),
    }))
    .filter(({ entries }) => entries.length > 0);

  if (sections.length === 0) {
    return <p>No related entries are available.</p>;
  }

  return (
    <div className="related-entry-sections">
      {sections.map(({ label, entries }) => (
        <section aria-label={label} key={label}>
          <h2>{label}</h2>
          <ul>
            {entries.map((relatedEntry) => (
              <li key={relatedEntry.id}>
                <Link to={`/entry/${relatedEntry.id}`}>
                  {relatedEntry.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
