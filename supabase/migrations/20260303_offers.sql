create table if not exists offers (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null,
  listing_type text not null,       -- 'housing' | 'cars' | 'services'
  buyer_id uuid references auth.users(id) on delete cascade,
  seller_id uuid references auth.users(id) on delete cascade,
  amount integer not null,          -- in XAF
  message text,
  status text default 'pending',    -- 'pending' | 'accepted' | 'rejected' | 'countered'
  counter_amount integer,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table offers enable row level security;
create policy "Buyer or seller can view offer"
  on offers for select using (auth.uid() = buyer_id or auth.uid() = seller_id);
create policy "Buyer can create offer"
  on offers for insert with check (auth.uid() = buyer_id);
create policy "Seller can update offer status"
  on offers for update using (auth.uid() = seller_id);
