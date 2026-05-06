import { createClient } from '@supabase/supabase-js';

const STORAGE_KEY = 'gamerank.supabase';

// Build-time defaults injected by the deploy workflow (optional).
const BUILD_URL = import.meta.env.VITE_SUPABASE_URL || '';
const BUILD_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export function getSupabaseConfig() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed?.url && parsed?.key) return parsed;
    }
  } catch {
    // ignore
  }
  if (BUILD_URL && BUILD_KEY) return { url: BUILD_URL, key: BUILD_KEY };
  return null;
}

export function saveSupabaseConfig({ url, key }) {
  if (!url || !key) {
    window.localStorage.removeItem(STORAGE_KEY);
    return;
  }
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ url: url.trim(), key: key.trim() })
  );
}

let client = null;
export function getSupabase() {
  if (client) return client;
  const cfg = getSupabaseConfig();
  if (!cfg) return null;
  client = createClient(cfg.url, cfg.key, {
    realtime: { params: { eventsPerSecond: 5 } }
  });
  return client;
}

export function isSupabaseConfigured() {
  return Boolean(getSupabaseConfig());
}

// Schema we expect in Supabase (run this SQL in the project's SQL editor):
export const SETUP_SQL = `-- GameRank shared schema
create table if not exists public.games (
  id text primary key,
  title text not null,
  cover text default '',
  genre text default 'Other',
  platform text default 'Other',
  date_added timestamptz not null default now(),
  reviews jsonb not null default '{"p1":{"gameplay":0,"story":0,"graphics":0,"vibe":0,"note":""},"p2":{"gameplay":0,"story":0,"graphics":0,"vibe":0,"note":""}}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.settings (
  id int primary key default 1,
  players jsonb not null default '{"p1":"Player 1","p2":"Player 2"}'::jsonb,
  constraint settings_singleton check (id = 1)
);
insert into public.settings (id) values (1) on conflict (id) do nothing;

alter table public.games enable row level security;
drop policy if exists "anon all games" on public.games;
create policy "anon all games" on public.games
  for all to anon, authenticated using (true) with check (true);

alter table public.settings enable row level security;
drop policy if exists "anon all settings" on public.settings;
create policy "anon all settings" on public.settings
  for all to anon, authenticated using (true) with check (true);

-- Enable realtime so both clients receive change events.
alter publication supabase_realtime add table public.games;
alter publication supabase_realtime add table public.settings;
`;
