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

// Pings the Supabase project to verify URL + key + schema + permissions.
// Returns a structured result the UI can render plainly.
export async function testConnection() {
  const cfg = getSupabaseConfig();
  if (!cfg) {
    return { ok: false, stage: 'config', message: 'No URL or key saved.' };
  }
  const client = getSupabase();
  if (!client) {
    return { ok: false, stage: 'config', message: 'Could not create Supabase client.' };
  }
  try {
    const gamesRes = await client.from('games').select('id', { count: 'exact', head: true });
    if (gamesRes.error) {
      return {
        ok: false,
        stage: 'games',
        message: gamesRes.error.message,
        hint: gamesRes.error.message?.includes('does not exist')
          ? 'The "games" table is missing. Did the SQL setup run in this project?'
          : gamesRes.error.message?.toLowerCase().includes('row-level security')
          ? 'RLS is blocking access. Re-run the SQL setup snippet.'
          : 'Check the Project URL and the anon public key.'
      };
    }
    const settingsRes = await client
      .from('settings')
      .select('players')
      .eq('id', 1)
      .maybeSingle();
    if (settingsRes.error) {
      return {
        ok: false,
        stage: 'settings',
        message: settingsRes.error.message,
        hint: 'The "settings" table looks misconfigured. Re-run the SQL setup snippet.'
      };
    }
    return {
      ok: true,
      stage: 'ok',
      message: 'Connected.',
      counts: {
        games: gamesRes.count ?? 0,
        hasSettings: Boolean(settingsRes.data)
      },
      url: cfg.url
    };
  } catch (err) {
    return {
      ok: false,
      stage: 'network',
      message: err?.message || String(err),
      hint: 'Check the Project URL — it should look like https://xxxxx.supabase.co'
    };
  }
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
