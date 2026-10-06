import { Link, useParams } from 'react-router-dom';
import { getEntryById } from '../data/catalog';
import type { PublishedCatalog } from '../types/catalog';
import { NotFoundPage } from './NotFoundPage';
import { RelatedEntryLinks } from '../components/RelatedEntryLinks';

interface EntryDetailPageProps {
  catalog: PublishedCatalog;
}

const entryTypeLabels = {
  challenge: 'Health challenge',
  action: 'Action',
  herb: 'Herb',
} as const;

const apothecarySections = [
  { field: 'keyChallengesAddressed', heading: 'Key Challenges Addressed' },
  { field: 'bestPreparations', heading: 'Best Preparations' },
  {
    field: 'preparationNotes',
    heading: 'Preparation Notes & Apothecary Secrets',
  },
  { field: 'keyChemistryMechanics', heading: 'Key Chemistry & Mechanics' },
  {
    field: 'safetyContraindications',
    heading: 'Safety & Contraindications',
  },
] as const;

export function EntryDetailPage({ catalog }: EntryDetailPageProps) {
  const { entryId } = useParams();

  if (!entryId) {
    return <NotFoundPage />;
  }

  const entry = getEntryById(catalog, entryId);

  if (!entry) {
    return <NotFoundPage />;
  }

  return (
    <section aria-labelledby="entry-title">
      <p>{entryTypeLabels[entry.type]}</p>
      <h1 id="entry-title">{entry.name}</h1>
      {entry.summary && <p>{entry.summary}</p>}
      {entry.source && (
        <p>
          <strong>Source:</strong> {entry.source}
        </p>
      )}
      {entry.type === 'herb' &&
        apothecarySections.some(({ field }) =>
          Boolean(entry.apothecaryApplications?.[field]),
        ) && (
          <section aria-labelledby="apothecary-applications-title">
            <h2 id="apothecary-applications-title">
              Apothecary & Applications
            </h2>
            {apothecarySections.map(({ field, heading }) => {
              const content = entry.apothecaryApplications?.[field];
              return content ? (
                <details key={field}>
                  <summary>{heading}</summary>
                  <p className="herb-subsection-content">{content}</p>
                </details>
              ) : null;
            })}
          </section>
        )}
      <RelatedEntryLinks catalog={catalog} entry={entry} />
      <p>
        <Link to="/">Back to browse</Link>
      </p>
    </section>
  );
}
