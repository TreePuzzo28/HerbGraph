import { HashRouter, Route, Routes } from 'react-router-dom';
import { BrowsePage } from '../pages/BrowsePage';
import { EntryDetailPage } from '../pages/EntryDetailPage';

export function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<BrowsePage />} />
        <Route path="/:entryType" element={<BrowsePage />} />
        <Route path="/entry/:entryId" element={<EntryDetailPage />} />
        <Route path="*" element={<p>Page not found.</p>} />
      </Routes>
    </HashRouter>
  );
}
