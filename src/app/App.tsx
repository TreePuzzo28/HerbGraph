import { useEffect, useState } from 'react';
import { HashRouter } from 'react-router-dom';
import { AppRouter } from './router';
import { loadCatalog } from '../data/catalog';
import type { PublishedCatalog } from '../types/catalog';
import { PrimaryNavigation } from '../components/PrimaryNavigation';

export function App() {
  const [catalog, setCatalog] = useState<PublishedCatalog>();
  const [loadError, setLoadError] = useState<string>();

  useEffect(() => {
    let active = true;

    loadCatalog()
      .then((loadedCatalog) => {
        if (active) {
          setCatalog(loadedCatalog);
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setLoadError(
            error instanceof Error
              ? error.message
              : 'An unknown error occurred while loading the catalog.',
          );
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <HashRouter>
      <main className="app-shell">
        <header className="app-header">
          <p className="app-title">Herb Knowledge Explorer</p>
          <PrimaryNavigation />
        </header>
        {loadError ? (
          <p role="alert">Unable to load app content: {loadError}</p>
        ) : catalog ? (
          <AppRouter catalog={catalog} />
        ) : (
          <p role="status">Loading entries…</p>
        )}
      </main>
    </HashRouter>
  );
}
