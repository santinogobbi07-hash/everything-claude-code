import { useState } from 'react';
import { useGames } from '../context/GameContext.jsx';

export default function Settings() {
  const { players, updatePlayers, games } = useGames();
  const [p1, setP1] = useState(players.p1);
  const [p2, setP2] = useState(players.p2);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    updatePlayers({ p1: p1.trim() || 'Player 1', p2: p2.trim() || 'Player 2' });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const handleExport = () => {
    const data = JSON.stringify({ players, games }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gamerank-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetData = () => {
    if (
      window.confirm(
        'Delete all GameRank data from this browser? This cannot be undone.'
      )
    ) {
      window.localStorage.removeItem('gamerank.games');
      window.localStorage.removeItem('gamerank.players');
      window.location.reload();
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      <header>
        <div className="text-xs uppercase tracking-widest text-accent font-semibold">
          Configuration
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold mt-1">Settings</h1>
        <p className="text-muted mt-1 text-sm">Customize player names and manage your data.</p>
      </header>

      <form onSubmit={handleSave} className="card p-5 space-y-4">
        <h2 className="font-display text-lg font-semibold">Player Names</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Player 1</label>
            <input className="input" value={p1} onChange={(e) => setP1(e.target.value)} />
          </div>
          <div>
            <label className="label">Player 2</label>
            <input className="input" value={p2} onChange={(e) => setP2(e.target.value)} />
          </div>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-edge">
          {saved ? (
            <span className="text-accent text-sm">Saved ✓</span>
          ) : (
            <span className="text-muted text-sm">Names show up in ratings and rankings.</span>
          )}
          <button type="submit" className="btn-primary">
            Save
          </button>
        </div>
      </form>

      <section className="card p-5 space-y-4">
        <h2 className="font-display text-lg font-semibold">Data</h2>
        <p className="text-sm text-muted">
          GameRank stores everything in your browser via <code>localStorage</code>. No account, no
          server.
        </p>
        <div className="flex flex-wrap gap-3">
          <button onClick={handleExport} className="btn-ghost">
            Export JSON
          </button>
          <button onClick={handleResetData} className="btn-danger">
            Reset all data
          </button>
        </div>
      </section>
    </div>
  );
}
