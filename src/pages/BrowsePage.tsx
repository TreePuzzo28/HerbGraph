import { useParams } from 'react-router-dom';
import { getEntriesByType, getEntryType } from '../data/catalog';
import type { PublishedCatalog } from '../types/catalog';
import { EntryList } from '../components/EntryList';
import { NotFoundPage } from './NotFoundPage';

interface BrowsePageProps {
  catalog: PublishedCatalog;
}

const browseViews = {
  challenge: {
    heading: 'Health challenges',
    emptyMessage: 'No health challenges are available yet.',
  },
  action: {
    heading: 'Actions',
    emptyMessage: 'No actions are available yet.',
  },
  herb: {
    heading: 'Herbs',
    emptyMessage: 'No herbs are available yet.',
  },
} as const;

export function BrowsePage({ catalog }: BrowsePageProps) {
  const { entryType } = useParams();

  if (!entryType) {
    return (
      <section aria-labelledby="browse-title">
        <h1 id="browse-title">Explore entries</h1>
        <p>Choose a type of entry to start browsing.</p>
      </section>
    );
  }

  const type = getEntryType(entryType);

  if (!type) {
    return <NotFoundPage />;
  }

  const { heading, emptyMessage } = browseViews[type];
  const entries = getEntriesByType(catalog, type);

  return (
    <section aria-labelledby="browse-title">
      <h1 id="browse-title">{heading}</h1>
      {entries.length > 0 ? (
        <EntryList entries={entries} label={heading} />
      ) : (
        <p>{emptyMessage}</p>
      )}
    </section>
  );
}
