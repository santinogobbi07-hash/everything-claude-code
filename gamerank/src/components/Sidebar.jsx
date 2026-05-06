import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  PlusIcon,
  LibraryIcon,
  TrophyIcon,
  SettingsIcon,
  GamepadIcon
} from './Icons.jsx';

const NAV = [
  { to: '/', label: 'Dashboard', icon: HomeIcon, end: true },
  { to: '/add', label: 'Add Game', icon: PlusIcon },
  { to: '/library', label: 'Library', icon: LibraryIcon },
  { to: '/ranking', label: 'Ranking', icon: TrophyIcon },
  { to: '/settings', label: 'Settings', icon: SettingsIcon }
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex md:flex-col w-60 shrink-0 border-r border-edge bg-bg-surface/70 backdrop-blur sticky top-0 h-screen">
      <div className="px-5 py-6 flex items-center gap-2.5 border-b border-edge">
        <div className="w-9 h-9 rounded-lg bg-accent text-bg flex items-center justify-center shadow-glow">
          <GamepadIcon width={22} height={22} />
        </div>
        <div>
          <div className="font-display text-lg leading-tight font-bold tracking-tight">
            Game<span className="text-accent">Rank</span>
          </div>
          <div className="text-[10px] uppercase tracking-widest text-muted">co-op tracker</div>
        </div>
      </div>
      <nav className="flex-1 p-3 flex flex-col gap-1">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-accent/10 text-accent border border-accent/30'
                  : 'text-slate-300 hover:bg-bg-elevated hover:text-white border border-transparent'
              ].join(' ')
            }
          >
            <Icon width={18} height={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 text-[11px] text-muted border-t border-edge">
        <p>Stored locally · No account needed</p>
      </div>
    </aside>
  );
}

export function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-bg-surface border-t border-edge z-30">
      <ul className="flex justify-around">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                [
                  'flex flex-col items-center justify-center py-2 text-[10px] font-medium gap-1',
                  isActive ? 'text-accent' : 'text-muted hover:text-white'
                ].join(' ')
              }
            >
              <Icon width={20} height={20} />
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
