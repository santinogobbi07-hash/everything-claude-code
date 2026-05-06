import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGames } from '../context/GameContext.jsx';
import {
  computeCombinedScore,
  computePlayerScore,
  fmtScore,
  isReviewComplete
} from '../utils/scoring.js';
import CoverImage from '../components/CoverImage.jsx';
import { GenreBadge, PlatformBadge } from '../components/StatusBadge.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { MedalIcon, SearchIcon } from '../components/Icons.jsx';

function MedalOrRank({ rank }) {
  if (rank <= 3) {
    return (
      <div className="flex flex-col items-center justify-center w-12">
        <MedalIcon rank={rank} width={36} height={36} />
      </div>
    );
  }
  return (
    <div className="w-12 text-center font-display text-xl font-bold text-muted">#{rank}</div>
  );
}

export default function Ranking() {
  const { games, players } = useGames();
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState('all');
  const [platform, setPlatform] = useState('all');

  const ranked = useMemo(() => {
    return games
      .filter((g) => isReviewComplete(g.reviews?.p1) && isReviewComplete(g.reviews?.p2))
      .map((g) => ({ ...g, _combined: computeCombinedScore(g) }))
      .sort((a, b) => b._combined - a._combined);
  }, [games]);

  const genres = useMemo(
    () => ['all', ...Array.from(new Set(ranked.map((g) => g.genre).filter(Boolean))).sort()],
    [ranked]
  );
  const platforms = useMemo(
    () => ['all', ...Array.from(new Set(ranked.map((g) => g.platform).filter(Boolean))).sort()],
    [ranked]
  );

  const filtered = ranked.filter((g) => {
    if (genre !== 'all' && g.genre !== genre) return false;
    if (platform !== 'all' && g.platform !== platform) return false;
    if (query.trim() && !g.title.toLowerCase().includes(query.trim().toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <header>
        <div className="text-xs uppercase tracking-widest text-accent font-semibold">
          Leaderboard
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold mt-1">Ranking</h1>
        <p className="text-muted mt-1 text-sm">
          Sorted by combined score. Only games rated by both players appear.
        </p>
      </header>

      {ranked.length === 0 ? (
        <EmptyState
          title="Nothing ranked yet"
          description="Both players need to review a game before it joins the leaderboard."
          to={games.length === 0 ? '/add' : '/library'}
          ctaLabel={games.length === 0 ? 'Add Game' : 'Go Rate Games'}
        />
      ) : (
        <>
          <div className="card p-4 grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-3">
            <div className="relative">
              <SearchIcon
                width={16}
                height={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                className="input pl-9"
                placeholder="Search ranked games..."
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

          <ol className="space-y-3">
            {filtered.map((g, idx) => {
              const rank = ranked.findIndex((x) => x.id === g.id) + 1;
              const p1 = computePlayerScore(g.reviews.p1);
              const p2 = computePlayerScore(g.reviews.p2);
              return (
                <li key={g.id}>
                  <Link
                    to={`/game/${g.id}`}
                    className="card card-hover flex items-center gap-4 p-3 sm:p-4"
                  >
                    <MedalOrRank rank={rank} />
                    <div className="w-14 h-20 sm:w-16 sm:h-24 shrink-0 rounded-md overflow-hidden">
                      <CoverImage
                        src={g.cover}
                        title={g.title}
                        aspect=""
                        className="w-full h-full"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-display font-semibold truncate">{g.title}</div>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        <GenreBadge genre={g.genre} />
                        <PlatformBadge platform={g.platform} />
                      </div>
                      <div className="hidden sm:flex gap-4 mt-2 text-xs text-muted">
                        <span>
                          {players.p1}:{' '}
                          <span className="text-slate-200 font-semibold tabular-nums">
                            {fmtScore(p1)}
                          </span>
                        </span>
                        <span>
                          {players.p2}:{' '}
                          <span className="text-slate-200 font-semibold tabular-nums">
                            {fmtScore(p2)}
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-display font-bold text-2xl sm:text-3xl text-accent leading-none">
                        {fmtScore(g._combined)}
                      </div>
                      <div className="text-[10px] uppercase tracking-wider text-muted mt-1">
                        combined
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ol>

          {filtered.length === 0 && (
            <div className="card p-8 text-center text-muted">No ranked games match your filters.</div>
          )}
        </>
      )}
    </div>
  );
}
