create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  reviewer_id uuid references auth.users(id) on delete cascade,
  reviewee_id uuid references auth.users(id) on delete cascade,
  listing_id uuid,
  listing_type text,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamptz default now(),
  unique(reviewer_id, reviewee_id, listing_id)
);
alter table reviews enable row level security;
create policy "Anyone can view reviews"
  on reviews for select using (true);
create policy "Authenticated users can create reviews"
  on reviews for insert with check (auth.uid() = reviewer_id);
create policy "Reviewer can update own review"
  on reviews for update using (auth.uid() = reviewer_id);
