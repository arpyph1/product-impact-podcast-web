
-- Table for storing the classification rule config
CREATE TABLE public.tagging_rules (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_by uuid
);

-- Single-row pattern: seed with default config
INSERT INTO public.tagging_rules (config) VALUES ('{
  "themes": {},
  "focus": {},
  "settings": {
    "title_multiplier": 2.0,
    "desc_multiplier": 1.0,
    "theme_threshold": 3,
    "focus_threshold": 2,
    "max_themes": 3,
    "max_focus": 2,
    "focus_dominance_ratio": 2.0
  }
}'::jsonb);

ALTER TABLE public.tagging_rules ENABLE ROW LEVEL SECURITY;

-- Anyone can read rules (needed by edge function with service role, and admin UI)
CREATE POLICY "Rules are publicly readable"
  ON public.tagging_rules FOR SELECT USING (true);

-- Only admins can update rules
CREATE POLICY "Admins can update rules"
  ON public.tagging_rules FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Table for storing episode tags (results of classification)
CREATE TABLE public.episode_tags (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  episode_guid text NOT NULL UNIQUE,
  title text NOT NULL DEFAULT '',
  title_norm text NOT NULL DEFAULT '',
  description_norm text NOT NULL DEFAULT '',
  full_norm text NOT NULL DEFAULT '',
  themes text[] NOT NULL DEFAULT '{}',
  focus text[] NOT NULL DEFAULT '{}',
  theme_scores jsonb NOT NULL DEFAULT '{}'::jsonb,
  focus_scores jsonb NOT NULL DEFAULT '{}'::jsonb,
  classified_at timestamp with time zone NOT NULL DEFAULT now(),
  feed_url text NOT NULL DEFAULT ''
);

ALTER TABLE public.episode_tags ENABLE ROW LEVEL SECURITY;

-- Publicly readable (episodes are public content)
CREATE POLICY "Episode tags are publicly readable"
  ON public.episode_tags FOR SELECT USING (true);

-- Only service role (edge function) inserts/updates — no user-facing writes
-- The edge function uses the service role key, which bypasses RLS

CREATE INDEX idx_episode_tags_guid ON public.episode_tags (episode_guid);
CREATE INDEX idx_episode_tags_themes ON public.episode_tags USING GIN (themes);
CREATE INDEX idx_episode_tags_focus ON public.episode_tags USING GIN (focus);
