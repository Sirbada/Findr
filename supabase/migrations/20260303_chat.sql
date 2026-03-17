create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid,
  listing_type text,
  buyer_id uuid references auth.users(id) on delete cascade,
  seller_id uuid references auth.users(id) on delete cascade,
  last_message_at timestamptz default now(),
  created_at timestamptz default now(),
  unique(listing_id, listing_type, buyer_id, seller_id)
);
alter table conversations enable row level security;
create policy "Participants can view conversation"
  on conversations for select using (auth.uid() = buyer_id or auth.uid() = seller_id);
create policy "Buyer can create conversation"
  on conversations for insert with check (auth.uid() = buyer_id);
create policy "Participants can update conversation"
  on conversations for update using (auth.uid() = buyer_id or auth.uid() = seller_id);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id) on delete cascade,
  sender_id uuid references auth.users(id) on delete cascade,
  content text not null,
  read_at timestamptz,
  created_at timestamptz default now()
);
alter table messages enable row level security;
create policy "Participants can view messages"
  on messages for select using (
    exists (
      select 1 from conversations c
      where c.id = messages.conversation_id
      and (c.buyer_id = auth.uid() or c.seller_id = auth.uid())
    )
  );
create policy "Participants can send messages"
  on messages for insert with check (
    auth.uid() = sender_id and
    exists (
      select 1 from conversations c
      where c.id = messages.conversation_id
      and (c.buyer_id = auth.uid() or c.seller_id = auth.uid())
    )
  );
