import { createRoot } from 'react-dom/client';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Could not find the application root element.');
}

createRoot(rootElement).render(
  <main>
    <h1>Herb Knowledge Explorer</h1>
    <p>Application setup is ready.</p>
  </main>,
);
