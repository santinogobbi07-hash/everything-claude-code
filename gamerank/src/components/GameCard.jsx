import { Link } from 'react-router-dom';
import CoverImage from './CoverImage.jsx';
import StatusBadge, { GenreBadge, PlatformBadge } from './StatusBadge.jsx';
import { computeCombinedScore, fmtScore, gameStatus } from '../utils/scoring.js';
import { useGames } from '../context/GameContext.jsx';

export default function GameCard({ game }) {
  const { players } = useGames();
  const combined = computeCombinedScore(game);
  const status = gameStatus(game, players);

  return (
    <Link
      to={`/game/${game.id}`}
      className="group card card-hover overflow-hidden flex flex-col"
    >
      <CoverImage src={game.cover} title={game.title} />
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display font-semibold leading-tight line-clamp-2">{game.title}</h3>
          <div className="text-right shrink-0">
            <div className="text-2xl font-display font-bold text-accent leading-none">
              {fmtScore(combined)}
            </div>
            <div className="text-[10px] uppercase tracking-wider text-muted">combined</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <GenreBadge genre={game.genre} />
          <PlatformBadge platform={game.platform} />
        </div>
        <div className="mt-auto pt-2 border-t border-edge">
          <StatusBadge status={status} />
        </div>
      </div>
    </Link>
  );
}
