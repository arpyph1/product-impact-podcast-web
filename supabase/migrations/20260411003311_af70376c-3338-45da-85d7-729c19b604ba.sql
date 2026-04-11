ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS overview_bullets text[] DEFAULT '{}';
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS is_lead_story boolean DEFAULT false;