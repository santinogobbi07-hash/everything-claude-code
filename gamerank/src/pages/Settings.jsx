import { useState } from 'react';
import { useGames } from '../context/GameContext.jsx';
import { getSupabaseConfig, saveSupabaseConfig, SETUP_SQL } from '../lib/supabase.js';

export default function Settings() {
  const { players, updatePlayers, games, mode } = useGames();
  const [p1, setP1] = useState(players.p1);
  const [p2, setP2] = useState(players.p2);
  const [saved, setSaved] = useState(false);

  const cfg = getSupabaseConfig();
  const [url, setUrl] = useState(cfg?.url || '');
  const [key, setKey] = useState(cfg?.key || '');
  const [showSql, setShowSql] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    await updatePlayers({ p1: p1.trim() || 'Player 1', p2: p2.trim() || 'Player 2' });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const handleSaveSync = (e) => {
    e.preventDefault();
    saveSupabaseConfig({ url, key });
    window.location.reload();
  };

  const handleDisableSync = () => {
    if (window.confirm('Disconnect from sync? You will go back to browser-only mode.')) {
      saveSupabaseConfig({ url: '', key: '' });
      window.location.reload();
    }
  };

  const handleExport = () => {
    const data = JSON.stringify({ players, games }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `gamerank-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const handleResetData = () => {
    if (window.confirm('Delete all GameRank data from this browser? This cannot be undone.')) {
      window.localStorage.removeItem('gamerank.games');
      window.localStorage.removeItem('gamerank.players');
      window.location.reload();
    }
  };

  const handleCopySql = async () => {
    try {
      await navigator.clipboard.writeText(SETUP_SQL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      <header>
        <div className="text-xs uppercase tracking-widest text-accent font-semibold">
          Configuration
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold mt-1">Settings</h1>
        <p className="text-muted mt-1 text-sm">
          Player names, sync with a friend, and data management.
        </p>
      </header>

      <ModeBadge mode={mode} />

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
            <span className="text-muted text-sm">
              Names appear in ratings and rankings{mode === 'remote' && ' for both players'}.
            </span>
          )}
          <button type="submit" className="btn-primary">
            Save
          </button>
        </div>
      </form>

      <section className="card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Shared Sync</h2>
          {mode === 'remote' && (
            <button onClick={handleDisableSync} className="text-xs text-muted hover:text-red-400">
              Disconnect
            </button>
          )}
        </div>

        <p className="text-sm text-muted">
          Connect a free Supabase project and your friend will see and edit the same library in
          real time. Both of you paste the same two values below.
        </p>

        <details className="rounded-lg border border-edge bg-bg-elevated/40">
          <summary className="cursor-pointer px-4 py-3 text-sm font-medium hover:bg-bg-elevated">
            How to set up sync (one-time, ~3 min)
          </summary>
          <ol className="px-5 py-3 space-y-2 text-sm text-slate-300 list-decimal list-inside">
            <li>
              Go to{' '}
              <a
                className="text-accent underline"
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer"
              >
                supabase.com/dashboard
              </a>{' '}
              and sign in (Google works).
            </li>
            <li>Click <strong>New project</strong>. Pick any name and region. Wait ~2 min.</li>
            <li>
              Open <strong>SQL Editor</strong> from the left sidebar →{' '}
              <strong>New query</strong> → paste the SQL below → click <strong>Run</strong>.
            </li>
            <li>
              Open <strong>Project Settings → API</strong>. Copy{' '}
              <strong>Project URL</strong> and the <strong>anon public</strong> key.
            </li>
            <li>Paste both into the fields below and click <strong>Connect</strong>.</li>
            <li>
              Send your friend the site URL plus those same two values — they paste them in their
              own Settings page and you both see the same library.
            </li>
          </ol>
          <div className="px-4 pb-4">
            <button onClick={() => setShowSql((s) => !s)} className="btn-ghost text-xs">
              {showSql ? 'Hide SQL' : 'Show SQL snippet'}
            </button>
            {showSql && (
              <div className="mt-3">
                <button onClick={handleCopySql} className="btn-ghost text-xs mb-2">
                  {copied ? 'Copied ✓' : 'Copy SQL'}
                </button>
                <pre className="text-[11px] bg-bg-surface border border-edge rounded-lg p-3 overflow-auto max-h-60">
                  <code>{SETUP_SQL}</code>
                </pre>
              </div>
            )}
          </div>
        </details>

        <form onSubmit={handleSaveSync} className="space-y-3">
          <div>
            <label className="label">Project URL</label>
            <input
              className="input"
              placeholder="https://xxxx.supabase.co"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              type="url"
            />
          </div>
          <div>
            <label className="label">Anon public key</label>
            <input
              className="input font-mono text-xs"
              placeholder="eyJhbGciOiJI..."
              value={key}
              onChange={(e) => setKey(e.target.value)}
            />
            <p className="text-[11px] text-muted mt-1">
              The "anon public" key is safe to share. Don't paste the service-role key.
            </p>
          </div>
          <div className="flex justify-end pt-2 border-t border-edge">
            <button type="submit" className="btn-primary" disabled={!url || !key}>
              {mode === 'remote' ? 'Update connection' : 'Connect'}
            </button>
          </div>
        </form>
      </section>

      <section className="card p-5 space-y-4">
        <h2 className="font-display text-lg font-semibold">Data</h2>
        <p className="text-sm text-muted">
          Export your current data, or wipe local storage{' '}
          {mode === 'remote' && '(does not delete anything in Supabase)'}.
        </p>
        <div className="flex flex-wrap gap-3">
          <button onClick={handleExport} className="btn-ghost">
            Export JSON
          </button>
          <button onClick={handleResetData} className="btn-danger">
            Reset local data
          </button>
        </div>
      </section>
    </div>
  );
}

function ModeBadge({ mode }) {
  if (mode === 'remote') {
    return (
      <div className="card p-4 flex items-center gap-3 border-accent/40">
        <span className="w-2 h-2 rounded-full bg-accent animate-pulseSoft" />
        <div className="flex-1">
          <div className="font-semibold">Sync is on</div>
          <div className="text-xs text-muted">
            Changes from either player appear live for the other.
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="card p-4 flex items-center gap-3">
      <span className="w-2 h-2 rounded-full bg-muted" />
      <div className="flex-1">
        <div className="font-semibold">Browser-only mode</div>
        <div className="text-xs text-muted">
          Data is stored only in this browser. Set up sync below to share with a friend.
        </div>
      </div>
    </div>
  );
}
