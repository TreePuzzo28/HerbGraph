import { Link } from 'react-router-dom';
import type { PublishedCatalog } from '../types/catalog';

interface BrowsePageProps {
  catalog: PublishedCatalog;
}

export function BrowsePage({ catalog }: BrowsePageProps) {
  const starterEntries = [
    'challenge:restless-mind',
    'action:calming',
    'herb:sample-leaf',
  ]
    .map((id) => catalog.entries.find((entry) => entry.id === id))
    .filter((entry) => entry !== undefined);

  return (
    <section aria-labelledby="browse-title">
      <h1 id="browse-title">Explore sample entries</h1>
      <p>
        These synthetic entries demonstrate how links between entry types work.
      </p>
      <ul>
        {starterEntries.map((entry) => (
          <li key={entry.id}>
            <Link to={`/entry/${entry.id}`}>
              {entry.name} ({entry.type})
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
