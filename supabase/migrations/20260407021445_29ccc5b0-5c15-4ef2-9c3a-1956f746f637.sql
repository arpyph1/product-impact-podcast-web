
CREATE TABLE public.episode_shownotes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  episode_guid text NOT NULL UNIQUE,
  title text NOT NULL DEFAULT '',
  content_html text NOT NULL DEFAULT '',
  links jsonb NOT NULL DEFAULT '[]'::jsonb,
  video_urls jsonb NOT NULL DEFAULT '[]'::jsonb,
  published boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.episode_shownotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Shownotes are publicly readable"
  ON public.episode_shownotes
  FOR SELECT
  USING (published = true);

CREATE POLICY "Admins can manage shownotes"
  ON public.episode_shownotes
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Editors can manage shownotes"
  ON public.episode_shownotes
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'editor'))
  WITH CHECK (public.has_role(auth.uid(), 'editor'));

CREATE INDEX idx_shownotes_episode_guid ON public.episode_shownotes (episode_guid);
