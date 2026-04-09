
-- Create entity_type enum
CREATE TYPE public.entity_type AS ENUM ('concept','person','organization','framework','source','product');

-- ============================================================
-- Extend existing episode_shownotes table
-- ============================================================
ALTER TABLE public.episode_shownotes ADD COLUMN IF NOT EXISTS slug text UNIQUE;
ALTER TABLE public.episode_shownotes ADD COLUMN IF NOT EXISTS meta_description text;
ALTER TABLE public.episode_shownotes ADD COLUMN IF NOT EXISTS schema_jsonld jsonb;
ALTER TABLE public.episode_shownotes ADD COLUMN IF NOT EXISTS published_at timestamptz;
ALTER TABLE public.episode_shownotes ADD COLUMN IF NOT EXISTS episode_number int;
ALTER TABLE public.episode_shownotes ADD COLUMN IF NOT EXISTS season_number int;
ALTER TABLE public.episode_shownotes ADD COLUMN IF NOT EXISTS duration text;
ALTER TABLE public.episode_shownotes ADD COLUMN IF NOT EXISTS themes text[] DEFAULT '{}';
ALTER TABLE public.episode_shownotes ADD COLUMN IF NOT EXISTS lenses text[] DEFAULT '{}';
ALTER TABLE public.episode_shownotes ADD COLUMN IF NOT EXISTS hosts text[] DEFAULT '{}';
ALTER TABLE public.episode_shownotes ADD COLUMN IF NOT EXISTS guests jsonb DEFAULT '[]';
ALTER TABLE public.episode_shownotes ADD COLUMN IF NOT EXISTS transcript_markdown text;

-- ============================================================
-- articles table
-- ============================================================
CREATE TABLE public.articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  subtitle text,
  format text NOT NULL DEFAULT 'news-brief',
  author_slugs text[] NOT NULL DEFAULT '{}',
  byline_role text,
  dateline text,
  publish_date date NOT NULL,
  last_updated timestamptz DEFAULT now(),
  read_time_minutes int,
  word_count int,
  meta_description text NOT NULL DEFAULT '',
  hero_image_url text,
  hero_image_alt text,
  hero_image_credit text,
  content_markdown text NOT NULL DEFAULT '',
  content_html text NOT NULL DEFAULT '',
  themes text[] NOT NULL DEFAULT '{}',
  lenses text[] NOT NULL DEFAULT '{}',
  topics text[] DEFAULT '{}',
  primary_podcast_episode_guid text,
  schema_jsonld jsonb,
  canonical_url text NOT NULL DEFAULT '',
  published boolean DEFAULT false,
  cms_locked_themes boolean DEFAULT false,
  cms_locked_meta boolean DEFAULT false,
  cms_locked_schema boolean DEFAULT false,
  cms_locked_hero boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_articles_publish_date ON public.articles(publish_date DESC);
CREATE INDEX idx_articles_published ON public.articles(published) WHERE published = true;
CREATE INDEX idx_articles_format ON public.articles(format);
CREATE INDEX idx_articles_themes ON public.articles USING GIN(themes);
CREATE INDEX idx_articles_topics ON public.articles USING GIN(topics);
CREATE INDEX idx_articles_slug ON public.articles(slug);

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Articles are publicly readable"
  ON public.articles FOR SELECT
  USING (true);

CREATE POLICY "Admins and editors can insert articles"
  ON public.articles FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Admins and editors can update articles"
  ON public.articles FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Admins can delete articles"
  ON public.articles FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- entities table (knowledge graph)
-- ============================================================
CREATE TABLE public.entities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type public.entity_type NOT NULL,
  slug text NOT NULL,
  name text NOT NULL,
  aliases text[] DEFAULT '{}',
  description text,
  long_form text,
  external_links jsonb DEFAULT '[]',
  metadata jsonb DEFAULT '{}',
  themes text[] DEFAULT '{}',
  lenses text[] DEFAULT '{}',
  canonical_url text NOT NULL DEFAULT '',
  schema_jsonld jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(type, slug)
);

CREATE INDEX idx_entities_type_slug ON public.entities(type, slug);
CREATE INDEX idx_entities_themes ON public.entities USING GIN(themes);

ALTER TABLE public.entities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Entities are publicly readable"
  ON public.entities FOR SELECT
  USING (true);

CREATE POLICY "Admins and editors can insert entities"
  ON public.entities FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Admins and editors can update entities"
  ON public.entities FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Admins can delete entities"
  ON public.entities FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- article_entities join table
-- ============================================================
CREATE TABLE public.article_entities (
  article_id uuid NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  entity_id uuid NOT NULL REFERENCES public.entities(id) ON DELETE CASCADE,
  relevance text DEFAULT 'mention',
  PRIMARY KEY (article_id, entity_id)
);

CREATE INDEX idx_article_entities_entity ON public.article_entities(entity_id);

ALTER TABLE public.article_entities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Article entities are publicly readable"
  ON public.article_entities FOR SELECT
  USING (true);

CREATE POLICY "Admins and editors can insert article_entities"
  ON public.article_entities FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Admins and editors can update article_entities"
  ON public.article_entities FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Admins can delete article_entities"
  ON public.article_entities FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- episode_entities join table
-- ============================================================
CREATE TABLE public.episode_entities (
  episode_guid text NOT NULL,
  entity_id uuid NOT NULL REFERENCES public.entities(id) ON DELETE CASCADE,
  relevance text DEFAULT 'mention',
  context text,
  timestamp_text text,
  speaker text,
  is_first_appearance boolean DEFAULT false,
  PRIMARY KEY (episode_guid, entity_id)
);

CREATE INDEX idx_episode_entities_entity ON public.episode_entities(entity_id);

ALTER TABLE public.episode_entities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Episode entities are publicly readable"
  ON public.episode_entities FOR SELECT
  USING (true);

CREATE POLICY "Admins and editors can insert episode_entities"
  ON public.episode_entities FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Admins and editors can update episode_entities"
  ON public.episode_entities FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Admins can delete episode_entities"
  ON public.episode_entities FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- episode_faqs
-- ============================================================
CREATE TABLE public.episode_faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  episode_guid text NOT NULL,
  question text NOT NULL,
  answer text NOT NULL,
  position int DEFAULT 0
);

CREATE INDEX idx_episode_faqs_episode ON public.episode_faqs(episode_guid);

ALTER TABLE public.episode_faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Episode FAQs are publicly readable"
  ON public.episode_faqs FOR SELECT
  USING (true);

CREATE POLICY "Admins and editors can manage episode_faqs"
  ON public.episode_faqs FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- ============================================================
-- article_faqs
-- ============================================================
CREATE TABLE public.article_faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  question text NOT NULL,
  answer text NOT NULL,
  position int DEFAULT 0
);

CREATE INDEX idx_article_faqs_article ON public.article_faqs(article_id);

ALTER TABLE public.article_faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Article FAQs are publicly readable"
  ON public.article_faqs FOR SELECT
  USING (true);

CREATE POLICY "Admins and editors can manage article_faqs"
  ON public.article_faqs FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- ============================================================
-- themes table
-- ============================================================
CREATE TABLE public.themes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  long_form_intro text,
  meta_description text,
  target_search_queries text[],
  schema_jsonld jsonb,
  hero_image_url text,
  theme_color text,
  icon text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Themes are publicly readable"
  ON public.themes FOR SELECT
  USING (true);

CREATE POLICY "Admins and editors can manage themes"
  ON public.themes FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- Seed the 8 canonical themes
INSERT INTO public.themes (slug, name, description) VALUES
  ('ai-product-strategy', 'AI Product Strategy', 'How product leaders integrate AI into strategy, roadmaps, and competitive positioning'),
  ('adoption-organizational-change', 'Adoption & Organizational Change', 'How organizations adopt AI tools, manage change, and measure impact'),
  ('agents-agentic-systems', 'Agents & Agentic Systems', 'Autonomous AI agents, multi-agent architectures, and agentic workflows'),
  ('data-semantics-knowledge-foundations', 'Data, Semantics & Knowledge Foundations', 'Data quality, knowledge graphs, semantic layers, and the foundations AI needs'),
  ('evaluation-benchmarking', 'Evaluation & Benchmarking', 'How to measure AI performance, evaluate models, and benchmark products'),
  ('go-to-market-distribution', 'Go-to-Market & Distribution', 'AI product distribution, pricing, GTM strategy, and market dynamics'),
  ('governance-risk-trust', 'Governance, Risk & Trust', 'AI governance, safety, trust, regulation, and responsible deployment'),
  ('ux-experience-design-for-ai', 'UX & Experience Design for AI', 'Designing human-AI interactions, AI UX patterns, and experience design');

-- ============================================================
-- lenses table
-- ============================================================
CREATE TABLE public.lenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  audience text,
  meta_description text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.lenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lenses are publicly readable"
  ON public.lenses FOR SELECT
  USING (true);

CREATE POLICY "Admins and editors can manage lenses"
  ON public.lenses FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- Seed the 4 canonical lenses
INSERT INTO public.lenses (slug, name, description, audience) VALUES
  ('business-lens', 'Business Lens', 'Strategic and commercial perspectives on AI product impact', 'C-suite, VPs, founders'),
  ('product-lens', 'Product Lens', 'Product management and design perspectives on AI', 'PMs, founders, product designers'),
  ('societal-lens', 'Societal Lens', 'Broader societal implications of AI products', 'Policymakers, researchers, the public'),
  ('technical-lens', 'Technical Lens', 'Engineering and technical perspectives on AI products', 'Engineers, ML researchers');

-- ============================================================
-- sponsors table (replaces CMS-only sponsor config)
-- ============================================================
CREATE TABLE public.sponsors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  tagline text,
  description text,
  logo_url text,
  website_url text,
  cta_text text,
  tier text,
  active boolean DEFAULT true,
  display_order int DEFAULT 0,
  themes text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sponsors are publicly readable"
  ON public.sponsors FOR SELECT
  USING (true);

CREATE POLICY "Admins and editors can manage sponsors"
  ON public.sponsors FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- ============================================================
-- Enable realtime for articles (for live content updates)
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.articles;
