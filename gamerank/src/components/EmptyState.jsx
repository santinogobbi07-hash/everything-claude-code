import { Link } from 'react-router-dom';
import { GamepadIcon, PlusIcon } from './Icons.jsx';

export default function EmptyState({
  title = 'No games yet',
  description = 'Add your first co-op game to get started.',
  to = '/add',
  ctaLabel = 'Add Game'
}) {
  return (
    <div className="card p-10 flex flex-col items-center text-center gap-4">
      <div className="w-14 h-14 rounded-xl bg-bg-elevated flex items-center justify-center text-accent">
        <GamepadIcon width={28} height={28} />
      </div>
      <div>
        <h3 className="font-display text-xl font-bold">{title}</h3>
        <p className="text-muted text-sm mt-1 max-w-sm">{description}</p>
      </div>
      {to && (
        <Link to={to} className="btn-primary">
          <PlusIcon width={16} height={16} /> {ctaLabel}
        </Link>
      )}
    </div>
  );
}
