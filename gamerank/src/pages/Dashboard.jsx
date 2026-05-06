import { Link } from 'react-router-dom';
import { useGames } from '../context/GameContext.jsx';
import {
  computeCombinedScore,
  fmtScore,
  isReviewComplete
} from '../utils/scoring.js';
import GameCard from '../components/GameCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { PlusIcon, TrophyIcon } from '../components/Icons.jsx';

function StatCard({ label, value, sub }) {
  return (
    <div className="card p-5">
      <div className="text-xs uppercase tracking-widest text-muted">{label}</div>
      <div className="font-display text-3xl font-bold mt-2">{value}</div>
      {sub && <div className="text-xs text-muted mt-1">{sub}</div>}
    </div>
  );
}

export default function Dashboard() {
  const { games } = useGames();

  const total = games.length;
  const reviewed = games.filter(
    (g) => isReviewComplete(g.reviews?.p1) && isReviewComplete(g.reviews?.p2)
  );
  const reviewedCount = reviewed.length;
  const avgCombined =
    reviewedCount === 0
      ? null
      : reviewed.reduce((sum, g) => sum + computeCombinedScore(g), 0) / reviewedCount;

  const lastAdded = [...games]
    .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
    .slice(0, 1)[0];

  const topRated = [...reviewed]
    .sort((a, b) => computeCombinedScore(b) - computeCombinedScore(a))
    .slice(0, 1)[0];

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-accent font-semibold">
            Co-op Tracker
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold mt-1">Dashboard</h1>
          <p className="text-muted mt-1 text-sm md:text-base">
            Your two-player rating overview at a glance.
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/add" className="btn-primary">
            <PlusIcon width={16} height={16} /> Quick Add
          </Link>
          <Link to="/ranking" className="btn-ghost">
            <TrophyIcon width={16} height={16} /> Ranking
          </Link>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Games" value={total} sub="Added to your library" />
        <StatCard
          label="Reviewed"
          value={reviewedCount}
          sub={total ? `${Math.round((reviewedCount / total) * 100)}% complete` : '—'}
        />
        <StatCard
          label="Average Combined"
          value={fmtScore(avgCombined)}
          sub={reviewedCount ? 'Across reviewed games' : 'No reviews yet'}
        />
      </section>

      {games.length === 0 ? (
        <EmptyState />
      ) : (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {lastAdded && (
            <div>
              <h2 className="font-display text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent rounded-full" /> Last Added
              </h2>
              <GameCard game={lastAdded} />
            </div>
          )}
          {topRated && (
            <div>
              <h2 className="font-display text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" /> Top Rated
              </h2>
              <GameCard game={topRated} />
            </div>
          )}
        </section>
      )}
    </div>
  );
}
