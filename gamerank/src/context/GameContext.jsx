import { createContext, useCallback, useContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { emptyReview } from '../utils/scoring.js';

const GameContext = createContext(null);

const DEFAULT_PLAYERS = { p1: 'Player 1', p2: 'Player 2' };

function uid() {
  return `g_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function GameProvider({ children }) {
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
    (id, patch) => {
      setGames((prev) => prev.map((g) => (g.id === id ? { ...g, ...patch } : g)));
    },
    [setGames]
  );

  const updateReview = useCallback(
    (id, who, review) => {
      setGames((prev) =>
        prev.map((g) =>
          g.id === id
            ? {
                ...g,
                reviews: {
                  ...g.reviews,
                  [who]: { ...g.reviews?.[who], ...review }
                }
              }
            : g
        )
      );
    },
    [setGames]
  );

  const deleteGame = useCallback(
    (id) => {
      setGames((prev) => prev.filter((g) => g.id !== id));
    },
    [setGames]
  );

  const updatePlayers = useCallback(
    (next) => {
      setPlayers((prev) => ({ ...prev, ...next }));
    },
    [setPlayers]
  );

  const getGame = useCallback((id) => games.find((g) => g.id === id) || null, [games]);

  const value = useMemo(
    () => ({
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

export function useGames() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGames must be used inside GameProvider');
  return ctx;
}
