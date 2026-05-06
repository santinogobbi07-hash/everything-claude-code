# GameRank

A co-op game rating and ranking tracker for two friends. Each player rates every
game across **Gameplay**, **Story**, **Graphics**, and **Vibe** (1–10). Once both
players have submitted scores, the game enters the leaderboard sorted by combined
score.

## Stack

- React 18 + React Router 6
- Vite
- Tailwind CSS (dark mode only)
- `localStorage` persistence — no backend

## Getting Started

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

## Build

```bash
npm run build
npm run preview
```

## Features

- **Dashboard** — totals, average combined score, Last Added, Top Rated
- **Add Game** — title, cover URL, genre, platform, date added
- **Library** — search, filter by genre/platform, grid of game cards
- **Game Detail** — per-player category breakdown, optional written review (300 chars), status badge
- **Ranking** — sorted leaderboard with medals for top 3, filters & search
- **Settings** — editable player names, export JSON, reset data

## Data

All data lives in `localStorage` under:

- `gamerank.games` — array of game objects
- `gamerank.players` — `{ p1, p2 }` display names

You can export your data as JSON from the Settings page.

## Project Layout

```
src/
├── components/   # Sidebar, GameCard, RatingForm, icons, skeletons...
├── context/      # GameContext (CRUD over localStorage)
├── hooks/        # useLocalStorage
├── pages/        # Dashboard, AddGame, Library, Ranking, GameDetail, Settings
├── utils/        # scoring helpers
├── App.jsx
├── main.jsx
└── index.css
```
