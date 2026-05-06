import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGames } from '../context/GameContext.jsx';
import GameCard from '../components/GameCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { CardSkeleton } from '../components/Skeleton.jsx';
import { SearchIcon, PlusIcon } from '../components/Icons.jsx';

export default function Library() {
  const { games } = useGames();
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState('all');
  const [platform, setPlatform] = useState('all');
  const [loading, setLoading] = useState(false);

  const genres = useMemo(
    () => ['all', ...Array.from(new Set(games.map((g) => g.genre).filter(Boolean))).sort()],
    [games]
  );
  const platforms = useMemo(
    () => ['all', ...Array.from(new Set(games.map((g) => g.platform).filter(Boolean))).sort()],
    [games]
  );

  const filtered = useMemo(() => {
    return games.filter((g) => {
      if (genre !== 'all' && g.genre !== genre) return false;
      if (platform !== 'all' && g.platform !== platform) return false;
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        if (!g.title.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [games, query, genre, platform]);

  if (games.length === 0) {
    return (
      <div className="space-y-6">
        <Header />
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Header />

      <div className="card p-4 grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-3 items-center">
        <div className="relative">
          <SearchIcon
            width={16}
            height={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            className="input pl-9"
            placeholder="Search games..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select
          className="input sm:w-44"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        >
          {genres.map((g) => (
            <option key={g} value={g}>
              {g === 'all' ? 'All Genres' : g}
            </option>
          ))}
        </select>
        <select
          className="input sm:w-48"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
        >
          {platforms.map((p) => (
            <option key={p} value={p}>
              {p === 'all' ? 'All Platforms' : p}
            </option>
          ))}
        </select>
      </div>

      <div className="text-sm text-muted">
        Showing {filtered.length} of {games.length} games
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)
          : filtered.map((g) => <GameCard key={g.id} game={g} />)}
      </div>

      {!loading && filtered.length === 0 && (
        <div className="card p-8 text-center text-muted">No games match your filters.</div>
      )}
    </div>
  );
}

function Header() {
  return (
    <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
      <div>
        <div className="text-xs uppercase tracking-widest text-accent font-semibold">
          Collection
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold mt-1">Game Library</h1>
        <p className="text-muted mt-1 text-sm">All games you've added — rated or not.</p>
      </div>
      <Link to="/add" className="btn-primary">
        <PlusIcon width={16} height={16} /> Add Game
      </Link>
    </header>
  );
}
