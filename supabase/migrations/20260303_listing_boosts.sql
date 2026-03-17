create table if not exists listing_boosts (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null,
  listing_type text not null,
  user_id uuid references auth.users(id) on delete cascade,
  boost_type text not null,         -- 'featured' | 'top' | 'urgent'
  duration_days integer not null,
  amount_paid integer not null,     -- in XAF
  payment_method text,              -- 'mtn_momo' | 'orange_money' | 'paypal'
  payment_reference text,
  status text default 'pending',    -- 'pending' | 'active' | 'expired' | 'cancelled'
  starts_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz default now()
);
alter table listing_boosts enable row level security;
create policy "Users manage own boosts"
  on listing_boosts for all using (auth.uid() = user_id);
