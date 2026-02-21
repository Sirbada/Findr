-- Findr migration: game-changer features (trust score, broadcasts, saved items)

BEGIN;

-- Helper: is_pro
CREATE OR REPLACE FUNCTION public.is_pro()
RETURNS BOOLEAN LANGUAGE SQL STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role IN ('pro', 'admin', 'super_admin')
  );
$$;

-- Trust score per user (computed externally, stored here)
CREATE TABLE IF NOT EXISTS public.trust_scores (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL DEFAULT 60 CHECK (score BETWEEN 0 AND 100),
  response_time_minutes INTEGER DEFAULT 120,
  dispute_rate NUMERIC(5,2) DEFAULT 0,
  verified BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Broadcast requests for services (one request, many pros)
CREATE TABLE IF NOT EXISTS public.service_broadcasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.service_categories(id) ON DELETE SET NULL,
  city TEXT NOT NULL,
  neighborhood TEXT,
  details TEXT NOT NULL,
  preferred_date DATE,
  preferred_time TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'quoted', 'closed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Saved items (sync for offline quick save)
CREATE TABLE IF NOT EXISTS public.saved_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('property', 'vehicle', 'service')),
  item_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, item_type, item_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_items_user ON public.saved_items(user_id);
CREATE INDEX IF NOT EXISTS idx_broadcast_city ON public.service_broadcasts(city);

-- RLS
ALTER TABLE public.trust_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_broadcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_items ENABLE ROW LEVEL SECURITY;

-- Trust scores: public can read (displayed on listings)
CREATE POLICY "Public read trust scores" ON public.trust_scores
  FOR SELECT USING (true);

-- Only admins can update trust scores
CREATE POLICY "Admins manage trust scores" ON public.trust_scores
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Broadcasts: users create/read own, pros read all to quote
CREATE POLICY "Users create broadcasts" ON public.service_broadcasts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users read own broadcasts" ON public.service_broadcasts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Pros read broadcasts" ON public.service_broadcasts
  FOR SELECT USING (public.is_pro());

CREATE POLICY "Users update own broadcasts" ON public.service_broadcasts
  FOR UPDATE USING (auth.uid() = user_id);

-- Saved items: users manage own
CREATE POLICY "Users manage saved items" ON public.saved_items
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

COMMIT;
