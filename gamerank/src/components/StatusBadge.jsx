export default function StatusBadge({ status }) {
  const tones = {
    good: 'bg-accent/15 text-accent border-accent/30',
    pending: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    neutral: 'bg-slate-500/10 text-slate-300 border-slate-500/30'
  };
  const cls = tones[status.tone] || tones.neutral;
  return <span className={`badge ${cls}`}>{status.label}</span>;
}

export function GenreBadge({ genre }) {
  return (
    <span className="badge bg-bg-elevated border-edge text-slate-300">{genre || 'Other'}</span>
  );
}

export function PlatformBadge({ platform }) {
  return (
    <span className="badge bg-cyan-500/10 border-cyan-500/30 text-cyan-300">
      {platform || 'Other'}
    </span>
  );
}
