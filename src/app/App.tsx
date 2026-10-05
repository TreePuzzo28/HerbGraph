import { AppRouter } from './router';

export function App() {
  return (
    <main className="app-shell">
      <header className="app-header">
        <p className="app-title">Herb Knowledge Explorer</p>
      </header>
      <AppRouter />
    </main>
  );
}
