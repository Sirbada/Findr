create table if not exists verification_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  document_type text not null,      -- 'national_id' | 'passport' | 'drivers_license'
  document_url text not null,       -- Supabase Storage URL
  selfie_url text,                  -- Optional selfie with document
  status text default 'pending',    -- 'pending' | 'approved' | 'rejected'
  admin_notes text,
  submitted_at timestamptz default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id)
);
alter table verification_requests enable row level security;
create policy "Users can view own verification requests"
  on verification_requests for select using (auth.uid() = user_id);
create policy "Users can create verification requests"
  on verification_requests for insert with check (auth.uid() = user_id);
