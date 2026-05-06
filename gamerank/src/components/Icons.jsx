// Lightweight inline SVG icon set so we avoid an icon dependency.
const base = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round'
};

export function HomeIcon(p) {
  return (
    <svg {...base} {...p}>
      <path d="M3 11l9-8 9 8" />
      <path d="M5 10v10h14V10" />
    </svg>
  );
}

export function PlusIcon(p) {
  return (
    <svg {...base} {...p}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function LibraryIcon(p) {
  return (
    <svg {...base} {...p}>
      <rect x="3" y="3" width="7" height="18" rx="1.5" />
      <rect x="14" y="3" width="7" height="13" rx="1.5" />
      <path d="M14 19h7" />
    </svg>
  );
}

export function TrophyIcon(p) {
  return (
    <svg {...base} {...p}>
      <path d="M8 21h8" />
      <path d="M12 17v4" />
      <path d="M7 4h10v5a5 5 0 01-10 0V4z" />
      <path d="M17 5h3v3a3 3 0 01-3 3" />
      <path d="M7 5H4v3a3 3 0 003 3" />
    </svg>
  );
}

export function SettingsIcon(p) {
  return (
    <svg {...base} {...p}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3h.1a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5h.1a1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8v.1a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" />
    </svg>
  );
}

export function SearchIcon(p) {
  return (
    <svg {...base} {...p}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}

export function StarIcon(p) {
  return (
    <svg {...base} fill="currentColor" stroke="none" {...p}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export function GamepadIcon(p) {
  return (
    <svg {...base} {...p}>
      <path d="M6 11h4M8 9v4" />
      <circle cx="15" cy="11" r="1" fill="currentColor" />
      <circle cx="17" cy="13" r="1" fill="currentColor" />
      <rect x="2" y="6" width="20" height="12" rx="6" />
    </svg>
  );
}

export function TrashIcon(p) {
  return (
    <svg {...base} {...p}>
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
    </svg>
  );
}

export function ChevronRightIcon(p) {
  return (
    <svg {...base} {...p}>
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export function MedalIcon({ rank = 1, ...p }) {
  const colors = {
    1: '#facc15',
    2: '#cbd5e1',
    3: '#d97706'
  };
  const c = colors[rank] || '#7a8699';
  return (
    <svg {...base} {...p} fill="none">
      <circle cx="12" cy="14" r="6" fill={c} stroke={c} />
      <path d="M8 4l4 6 4-6" stroke={c} />
      <text x="12" y="17" textAnchor="middle" fontSize="7" fontWeight="700" fill="#0a0d12" stroke="none">
        {rank}
      </text>
    </svg>
  );
}
