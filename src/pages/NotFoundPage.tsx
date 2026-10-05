import { Link } from 'react-router-dom';

interface NotFoundPageProps {
  entryName?: string;
}

export function NotFoundPage({ entryName }: NotFoundPageProps) {
  return (
    <section aria-labelledby="not-found-title">
      <h1 id="not-found-title">Entry not found</h1>
      <p>
        {entryName
          ? `The ${entryName} entry may have been removed or is not available.`
          : 'This entry may have been removed or is not available.'}
      </p>
      <Link to="/">Back to browse</Link>
    </section>
  );
}
