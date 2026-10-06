import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ContentImportPage } from '../src/pages/ContentImportPage';
import '../src/styles/global.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Could not find the content curator root element.');
}

createRoot(rootElement).render(
  <StrictMode>
    <main className="app-shell">
      <header className="app-header">
        <p className="app-title">Herb Knowledge Explorer — Content Curator</p>
      </header>
      <ContentImportPage />
    </main>
  </StrictMode>,
);
