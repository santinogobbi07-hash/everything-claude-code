import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { emptyReview } from '../utils/scoring.js';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase.js';

const GameContext = createContext(null);

const DEFAULT_PLAYERS = { p1: 'Player 1', p2: 'Player 2' };

function uid() {
  return `g_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function rowToGame(row) {
  return {
    id: row.id,
    title: row.title,
    cover: row.cover || '',
    genre: row.genre || 'Other',
    platform: row.platform || 'Other',
    dateAdded: row.date_added,
    reviews: row.reviews || { p1: emptyReview(), p2: emptyReview() }
  };
}

function gameToRow(game) {
  return {
    id: game.id,
    title: game.title,
    cover: game.cover,
    genre: game.genre,
    platform: game.platform,
    date_added: game.dateAdded,
    reviews: game.reviews
  };
}

export function GameProvider({ children }) {
  const remote = isSupabaseConfigured();
  if (remote) return <RemoteProvider>{children}</RemoteProvider>;
  return <LocalProvider>{children}</LocalProvider>;
}

// ---------- LOCAL (localStorage) ----------

function LocalProvider({ children }) {
  const [games, setGames] = useLocalStorage('gamerank.games', []);
  const [players, setPlayers] = useLocalStorage('gamerank.players', DEFAULT_PLAYERS);

  const addGame = useCallback(
    (data) => {
      const game = {
        id: uid(),
        title: data.title.trim(),
        cover: data.cover?.trim() || '',
        genre: data.genre?.trim() || 'Other',
        platform: data.platform?.trim() || 'Other',
        dateAdded: data.dateAdded || new Date().toISOString(),
        reviews: { p1: emptyReview(), p2: emptyReview() }
      };
      setGames((prev) => [game, ...prev]);
      return game.id;
    },
    [setGames]
  );

  const updateGame = useCallback(
    (id, patch) => setGames((prev) => prev.map((g) => (g.id === id ? { ...g, ...patch } : g))),
    [setGames]
  );

  const updateReview = useCallback(
    (id, who, review) => {
      setGames((prev) =>
        prev.map((g) =>
          g.id === id
            ? { ...g, reviews: { ...g.reviews, [who]: { ...g.reviews?.[who], ...review } } }
            : g
        )
      );
    },
    [setGames]
  );

  const deleteGame = useCallback(
    (id) => setGames((prev) => prev.filter((g) => g.id !== id)),
    [setGames]
  );

  const updatePlayers = useCallback(
    (next) => setPlayers((prev) => ({ ...prev, ...next })),
    [setPlayers]
  );

  const getGame = useCallback((id) => games.find((g) => g.id === id) || null, [games]);

  const value = useMemo(
    () => ({
      mode: 'local',
      ready: true,
      syncing: false,
      games,
      players,
      addGame,
      updateGame,
      updateReview,
      deleteGame,
      updatePlayers,
      getGame
    }),
    [games, players, addGame, updateGame, updateReview, deleteGame, updatePlayers, getGame]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

// ---------- REMOTE (Supabase) ----------

function RemoteProvider({ children }) {
  const supabase = getSupabase();
  const [games, setGames] = useState([]);
  const [players, setPlayers] = useState(DEFAULT_PLAYERS);
  const [ready, setReady] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const gamesRef = useRef(games);
  gamesRef.current = games;

  useEffect(() => {
    let alive = true;

    async function load() {
      setSyncing(true);
      const [gamesRes, settingsRes] = await Promise.all([
        supabase.from('games').select('*').order('date_added', { ascending: false }),
        supabase.from('settings').select('players').eq('id', 1).maybeSingle()
      ]);
      if (!alive) return;
      if (gamesRes.data) setGames(gamesRes.data.map(rowToGame));
      if (settingsRes.data?.players) setPlayers({ ...DEFAULT_PLAYERS, ...settingsRes.data.players });
      setReady(true);
      setSyncing(false);
    }
    load().catch((err) => {
      console.error('[GameRank] initial load failed', err);
      setReady(true);
      setSyncing(false);
    });

    const channel = supabase
      .channel('gamerank-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'games' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const next = rowToGame(payload.new);
          setGames((prev) => (prev.some((g) => g.id === next.id) ? prev : [next, ...prev]));
        } else if (payload.eventType === 'UPDATE') {
          const next = rowToGame(payload.new);
          setGames((prev) => prev.map((g) => (g.id === next.id ? next : g)));
        } else if (payload.eventType === 'DELETE') {
          setGames((prev) => prev.filter((g) => g.id !== payload.old.id));
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, (payload) => {
        if (payload.new?.players) {
          setPlayers((prev) => ({ ...prev, ...payload.new.players }));
        }
      })
      .subscribe();

    return () => {
      alive = false;
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const addGame = useCallback(
    async (data) => {
      const game = {
        id: uid(),
        title: data.title.trim(),
        cover: data.cover?.trim() || '',
        genre: data.genre?.trim() || 'Other',
        platform: data.platform?.trim() || 'Other',
        dateAdded: data.dateAdded || new Date().toISOString(),
        reviews: { p1: emptyReview(), p2: emptyReview() }
      };
      setGames((prev) => [game, ...prev]);
      setSyncing(true);
      const { error } = await supabase.from('games').insert(gameToRow(game));
      setSyncing(false);
      if (error) {
        console.error('[GameRank] addGame failed', error);
        setGames((prev) => prev.filter((g) => g.id !== game.id));
        throw error;
      }
      return game.id;
    },
    [supabase]
  );

  const updateGame = useCallback(
    async (id, patch) => {
      const prev = gamesRef.current.find((g) => g.id === id);
      if (!prev) return;
      const next = { ...prev, ...patch };
      setGames((p) => p.map((g) => (g.id === id ? next : g)));
      setSyncing(true);
      const { error } = await supabase.from('games').update(gameToRow(next)).eq('id', id);
      setSyncing(false);
      if (error) console.error('[GameRank] updateGame failed', error);
    },
    [supabase]
  );

  const updateReview = useCallback(
    async (id, who, review) => {
      const prev = gamesRef.current.find((g) => g.id === id);
      if (!prev) return;
      const newReviews = {
        ...prev.reviews,
        [who]: { ...prev.reviews?.[who], ...review }
      };
      setGames((p) => p.map((g) => (g.id === id ? { ...g, reviews: newReviews } : g)));
      setSyncing(true);
      const { error } = await supabase
        .from('games')
        .update({ reviews: newReviews })
        .eq('id', id);
      setSyncing(false);
      if (error) console.error('[GameRank] updateReview failed', error);
    },
    [supabase]
  );

  const deleteGame = useCallback(
    async (id) => {
      setGames((prev) => prev.filter((g) => g.id !== id));
      setSyncing(true);
      const { error } = await supabase.from('games').delete().eq('id', id);
      setSyncing(false);
      if (error) console.error('[GameRank] deleteGame failed', error);
    },
    [supabase]
  );

  const updatePlayers = useCallback(
    async (next) => {
      const merged = { ...players, ...next };
      setPlayers(merged);
      setSyncing(true);
      const { error } = await supabase
        .from('settings')
        .upsert({ id: 1, players: merged }, { onConflict: 'id' });
      setSyncing(false);
      if (error) console.error('[GameRank] updatePlayers failed', error);
    },
    [supabase, players]
  );

  const getGame = useCallback((id) => games.find((g) => g.id === id) || null, [games]);

  const value = useMemo(
    () => ({
      mode: 'remote',
      ready,
      syncing,
      games,
      players,
      addGame,
      updateGame,
      updateReview,
      deleteGame,
      updatePlayers,
      getGame
    }),
    [
      ready,
      syncing,
      games,
      players,
      addGame,
      updateGame,
      updateReview,
      deleteGame,
      updatePlayers,
      getGame
    ]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGames() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGames must be used inside GameProvider');
  return ctx;
}
