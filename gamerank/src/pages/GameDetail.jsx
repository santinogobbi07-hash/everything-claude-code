import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useGames } from '../context/GameContext.jsx';
import {
  CATEGORIES,
  computeCombinedScore,
  computePlayerScore,
  fmtScore,
  gameStatus
} from '../utils/scoring.js';
import CoverImage from '../components/CoverImage.jsx';
import CoverPicker from '../components/CoverPicker.jsx';
import StatusBadge, { GenreBadge, PlatformBadge } from '../components/StatusBadge.jsx';
import RatingForm from '../components/RatingForm.jsx';
import { TrashIcon } from '../components/Icons.jsx';

function CategoryBars({ review }) {
  return (
    <div className="space-y-2">
      {CATEGORIES.map(({ key, label }) => {
        const v = Number(review?.[key]) || 0;
        const pct = (v / 10) * 100;
        return (
          <div key={key}>
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">{label}</span>
              <span className="tabular-nums font-semibold">{v ? v : '—'}</span>
            </div>
            <div className="h-2 bg-bg-elevated rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-gradient-to-r from-accent-dim to-accent"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PlayerPanel({ name, review, onSave, onClear }) {
  const [editing, setEditing] = useState(false);
  const score = computePlayerScore(review);
  const hasReview = score != null;

  if (editing || !hasReview) {
    return (
      <div>
        <RatingForm
          playerName={name}
          initial={review}
          onSave={(r) => {
            onSave(r);
            setEditing(false);
          }}
          onClear={
            hasReview
              ? () => {
                  onClear();
                  setEditing(false);
                }
              : null
          }
        />
        {hasReview && (
          <button
            onClick={() => setEditing(false)}
            className="mt-2 text-xs text-muted hover:text-white"
          >
            Cancel edit
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="card p-5 space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted">Reviewer</div>
          <h3 className="font-display text-xl font-bold">{name}</h3>
        </div>
        <div className="text-right">
          <div className="text-3xl font-display font-bold text-accent leading-none">
            {fmtScore(score)}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-muted">final score</div>
        </div>
      </header>
      <CategoryBars review={review} />
      {review.note && (
        <blockquote className="border-l-2 border-accent/50 pl-3 text-sm text-slate-300 italic">
          “{review.note}”
        </blockquote>
      )}
      <div className="flex justify-end gap-2 pt-2 border-t border-edge">
        <button onClick={() => setEditing(true)} className="btn-ghost text-sm">
          Edit
        </button>
      </div>
    </div>
  );
}

export default function GameDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getGame, updateGame, updateReview, deleteGame, players } = useGames();
  const game = getGame(id);
  const [editingCover, setEditingCover] = useState(false);

  if (!game) {
    return (
      <div className="card p-10 text-center space-y-3">
        <h2 className="font-display text-2xl font-bold">Game not found</h2>
        <p className="text-muted">It may have been deleted.</p>
        <Link to="/library" className="btn-primary mt-2 inline-flex">
          Back to Library
        </Link>
      </div>
    );
  }

  const combined = computeCombinedScore(game);
  const status = gameStatus(game, players);

  const handleDelete = () => {
    if (window.confirm(`Delete "${game.title}"? This cannot be undone.`)) {
      deleteGame(game.id);
      navigate('/library');
    }
  };

  return (
    <div className="space-y-6">
      <nav className="text-sm text-muted flex items-center gap-2">
        <Link to="/library" className="hover:text-white">
          Library
        </Link>
        <span>/</span>
        <span className="text-slate-200 truncate">{game.title}</span>
      </nav>

      <header className="card overflow-hidden grid md:grid-cols-[260px_1fr] gap-0">
        <div className="md:h-full relative group">
          <CoverImage src={game.cover} title={game.title} className="md:h-full" />
          <button
            type="button"
            onClick={() => setEditingCover(true)}
            className="absolute bottom-2 right-2 px-2 py-1 text-[11px] font-semibold rounded-md bg-bg/80 border border-edge backdrop-blur hover:bg-bg-elevated transition opacity-0 group-hover:opacity-100"
          >
            {game.cover ? 'Change cover' : 'Add cover'}
          </button>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold leading-tight">
                {game.title}
              </h1>
              <div className="flex flex-wrap gap-2 mt-3">
                <GenreBadge genre={game.genre} />
                <PlatformBadge platform={game.platform} />
                <StatusBadge status={status} />
              </div>
            </div>
            <button onClick={handleDelete} className="btn-danger text-sm" title="Delete game">
              <TrashIcon width={16} height={16} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-2">
            <Stat label={players.p1} value={fmtScore(computePlayerScore(game.reviews.p1))} />
            <Stat label={players.p2} value={fmtScore(computePlayerScore(game.reviews.p2))} />
            <Stat label="Combined" value={fmtScore(combined)} highlight />
          </div>

          <div className="text-xs text-muted mt-auto">
            Added {new Date(game.dateAdded).toLocaleDateString()}
          </div>
        </div>
      </header>

      <section className="grid md:grid-cols-2 gap-5">
        <PlayerPanel
          name={players.p1}
          review={game.reviews.p1}
          onSave={(r) => updateReview(game.id, 'p1', r)}
          onClear={() =>
            updateReview(game.id, 'p1', { gameplay: 0, story: 0, graphics: 0, vibe: 0, note: '' })
          }
        />
        <PlayerPanel
          name={players.p2}
          review={game.reviews.p2}
          onSave={(r) => updateReview(game.id, 'p2', r)}
          onClear={() =>
            updateReview(game.id, 'p2', { gameplay: 0, story: 0, graphics: 0, vibe: 0, note: '' })
          }
        />
      </section>

      {editingCover && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setEditingCover(false)}
        >
          <div
            className="card p-5 max-w-lg w-full space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold">Cover image</h3>
              <button
                onClick={() => setEditingCover(false)}
                className="text-muted hover:text-white text-xl leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <CoverPicker
              value={game.cover}
              onChange={(v) => updateGame(game.id, { cover: v })}
              title={game.title}
            />
            <div className="flex justify-end pt-2 border-t border-edge">
              <button onClick={() => setEditingCover(false)} className="btn-primary">
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, highlight }) {
  return (
    <div
      className={`rounded-lg p-3 border ${
        highlight ? 'bg-accent/10 border-accent/30' : 'bg-bg-elevated border-edge'
      }`}
    >
      <div className="text-[10px] uppercase tracking-wider text-muted">{label}</div>
      <div
        className={`font-display text-2xl font-bold tabular-nums leading-none mt-1 ${
          highlight ? 'text-accent' : 'text-slate-100'
        }`}
      >
        {value}
      </div>
    </div>
  );
}
