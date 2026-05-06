import { Route, Routes } from 'react-router-dom';
import Sidebar, { MobileNav } from './components/Sidebar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AddGame from './pages/AddGame.jsx';
import Library from './pages/Library.jsx';
import Ranking from './pages/Ranking.jsx';
import GameDetail from './pages/GameDetail.jsx';
import Settings from './pages/Settings.jsx';

export default function App() {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 min-w-0 px-4 sm:px-6 md:px-10 py-6 md:py-10 pb-24 md:pb-10 max-w-[1400px] mx-auto w-full">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<AddGame />} />
          <Route path="/library" element={<Library />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/game/:id" element={<GameDetail />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <MobileNav />
    </div>
  );
}

function NotFound() {
  return (
    <div className="card p-10 text-center">
      <h2 className="font-display text-2xl font-bold">Page not found</h2>
      <p className="text-muted mt-2">That route doesn't exist.</p>
    </div>
  );
}
