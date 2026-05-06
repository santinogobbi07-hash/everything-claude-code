import { useEffect, useState } from 'react';
import { CATEGORIES, computePlayerScore, emptyReview, fmtScore } from '../utils/scoring.js';

function ScoreSlider({ value, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="range"
        min={1}
        max={10}
        step={1}
        value={value || 1}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 accent-accent"
      />
      <div className="w-9 text-right tabular-nums font-display font-bold text-accent">
        {value || 0}
      </div>
    </div>
  );
}

export default function RatingForm({ playerName, initial, onSave, onClear }) {
  const [review, setReview] = useState(initial || emptyReview());

  useEffect(() => {
    setReview(initial || emptyReview());
  }, [initial]);

  const update = (key, value) => setReview((r) => ({ ...r, [key]: value }));
  const score = computePlayerScore(review);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(review);
  };

  return (
    <form onSubmit={handleSubmit} className="card p-5 space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted">Reviewer</div>
          <h3 className="font-display text-xl font-bold">{playerName}</h3>
        </div>
        <div className="text-right">
          <div className="text-3xl font-display font-bold text-accent leading-none">
            {fmtScore(score)}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-muted">final score</div>
        </div>
      </header>

      <div className="grid gap-4">
        {CATEGORIES.map(({ key, label }) => (
          <div key={key}>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-slate-200">{label}</label>
              <span className="text-[11px] text-muted">1–10</span>
            </div>
            <ScoreSlider value={Number(review[key]) || 0} onChange={(v) => update(key, v)} />
          </div>
        ))}
      </div>

      <div>
        <label className="label">Short Review (optional)</label>
        <textarea
          value={review.note || ''}
          onChange={(e) => update('note', e.target.value.slice(0, 300))}
          rows={3}
          maxLength={300}
          placeholder="A few thoughts on this game..."
          className="input resize-none"
        />
        <div className="text-[11px] text-muted mt-1 text-right">
          {(review.note || '').length}/300
        </div>
      </div>

      <div className="flex justify-between gap-3 pt-2 border-t border-edge">
        {onClear ? (
          <button type="button" onClick={onClear} className="btn-ghost text-sm">
            Clear
          </button>
        ) : (
          <span />
        )}
        <button type="submit" className="btn-primary">
          Save Review
        </button>
      </div>
    </form>
  );
}
