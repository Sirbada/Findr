create table if not exists escrow_transactions (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null,
  listing_type text not null,
  buyer_id uuid references auth.users(id) on delete cascade,
  seller_id uuid references auth.users(id) on delete cascade,
  amount integer not null,          -- in XAF
  platform_fee integer not null,    -- 3% of amount
  status text default 'held',       -- 'held' | 'released' | 'disputed' | 'refunded'
  payment_method text,
  payment_reference text,
  held_at timestamptz default now(),
  released_at timestamptz,
  disputed_at timestamptz,
  dispute_reason text,
  created_at timestamptz default now()
);
alter table escrow_transactions enable row level security;
create policy "Buyer or seller can view escrow"
  on escrow_transactions for select using (auth.uid() = buyer_id or auth.uid() = seller_id);
create policy "Buyer can create escrow"
  on escrow_transactions for insert with check (auth.uid() = buyer_id);
create policy "Buyer can update escrow status"
  on escrow_transactions for update using (auth.uid() = buyer_id);
