import { HashRouter, Route, Routes } from 'react-router-dom';
import type { PublishedCatalog } from '../types/catalog';
import { BrowsePage } from '../pages/BrowsePage';
import { EntryDetailPage } from '../pages/EntryDetailPage';
import { NotFoundPage } from '../pages/NotFoundPage';

interface AppRouterProps {
  catalog: PublishedCatalog;
}

export function AppRouter({ catalog }: AppRouterProps) {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<BrowsePage catalog={catalog} />} />
        <Route
          path="/:entryType"
          element={<BrowsePage catalog={catalog} />}
        />
        <Route
          path="/entry/:entryId"
          element={<EntryDetailPage catalog={catalog} />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </HashRouter>
  );
}
