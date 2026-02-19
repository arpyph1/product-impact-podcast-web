
-- Single-row table to store CMS content as JSON
CREATE TABLE public.cms_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cms_content ENABLE ROW LEVEL SECURITY;

-- Anyone can read (public website)
CREATE POLICY "CMS content is publicly readable"
  ON public.cms_content FOR SELECT
  USING (true);

-- Insert the default row with empty data (will be merged with app defaults)
INSERT INTO public.cms_content (data) VALUES ('{}'::jsonb);
