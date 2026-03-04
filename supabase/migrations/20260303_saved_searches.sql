create table if not exists saved_searches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  category text not null,           -- 'housing' | 'cars' | 'services' | 'emplois'
  filters jsonb not null default '{}',
  label text,
  alert_frequency text default 'daily', -- 'instant' | 'daily' | 'weekly'
  last_alerted_at timestamptz,
  created_at timestamptz default now()
);
alter table saved_searches enable row level security;
create policy "Users manage own saved searches"
  on saved_searches for all using (auth.uid() = user_id);
