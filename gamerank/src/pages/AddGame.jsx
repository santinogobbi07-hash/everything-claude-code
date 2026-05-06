import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGames } from '../context/GameContext.jsx';
import CoverImage from '../components/CoverImage.jsx';

const GENRES = [
  'Action',
  'Adventure',
  'RPG',
  'Shooter',
  'Strategy',
  'Puzzle',
  'Platformer',
  'Sports',
  'Racing',
  'Simulation',
  'Horror',
  'Indie',
  'Other'
];

const PLATFORMS = [
  'PC',
  'PlayStation 5',
  'PlayStation 4',
  'Xbox Series X/S',
  'Xbox One',
  'Nintendo Switch',
  'Steam Deck',
  'Mobile',
  'Other'
];

export default function AddGame() {
  const navigate = useNavigate();
  const { addGame } = useGames();
  const [form, setForm] = useState({
    title: '',
    cover: '',
    genre: 'Action',
    platform: 'PC',
    dateAdded: new Date().toISOString().slice(0, 10)
  });
  const [error, setError] = useState('');

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Title is required');
      return;
    }
    const id = addGame({
      ...form,
      dateAdded: new Date(form.dateAdded).toISOString()
    });
    navigate(`/game/${id}`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <header>
        <div className="text-xs uppercase tracking-widest text-accent font-semibold">
          New Entry
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold mt-1">Add a Game</h1>
        <p className="text-muted mt-1 text-sm">
          Enter the basics now — both players can rate it afterwards.
        </p>
      </header>

      <div className="grid md:grid-cols-[1fr_240px] gap-6">
        <form onSubmit={handleSubmit} className="card p-5 space-y-4">
          <div>
            <label className="label">Title *</label>
            <input
              className="input"
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder="e.g. It Takes Two"
              autoFocus
            />
          </div>
          <div>
            <label className="label">Cover Image URL</label>
            <input
              className="input"
              value={form.cover}
              onChange={(e) => update('cover', e.target.value)}
              placeholder="https://..."
              type="url"
            />
            <p className="text-[11px] text-muted mt-1">Optional — paste a direct link to a cover image.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Genre</label>
              <select
                className="input"
                value={form.genre}
                onChange={(e) => update('genre', e.target.value)}
              >
                {GENRES.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Platform</label>
              <select
                className="input"
                value={form.platform}
                onChange={(e) => update('platform', e.target.value)}
              >
                {PLATFORMS.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Date Added</label>
            <input
              type="date"
              className="input"
              value={form.dateAdded}
              onChange={(e) => update('dateAdded', e.target.value)}
            />
          </div>
          {error && <div className="text-red-400 text-sm">{error}</div>}
          <div className="flex justify-end gap-3 pt-2 border-t border-edge">
            <button type="button" onClick={() => navigate(-1)} className="btn-ghost">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Game
            </button>
          </div>
        </form>

        <aside className="space-y-3">
          <div className="text-xs uppercase tracking-widest text-muted">Preview</div>
          <div className="card overflow-hidden">
            <CoverImage src={form.cover} title={form.title || 'Untitled game'} />
            <div className="p-4">
              <div className="font-display font-semibold line-clamp-2">
                {form.title || 'Untitled game'}
              </div>
              <div className="text-xs text-muted mt-1">
                {form.genre} · {form.platform}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
