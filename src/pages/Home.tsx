import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useCMS } from "@/hooks/useCMS";
import { useRSSFeed } from "@/hooks/useRSSFeed";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeadMeta from "@/components/HeadMeta";
import ContactModal from "@/components/ContactModal";
import CMSPanel from "@/components/CMSPanel";
import PopupAlert from "@/components/PopupAlert";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Play, ChevronLeft, ChevronRight, Mic2, Clock, User, Zap } from "lucide-react";

/* ── types ── */
interface Article {
  id: string; slug: string; title: string; subtitle: string | null; format: string;
  author_slugs: string[]; publish_date: string; read_time_minutes: number | null;
  hero_image_url: string | null; hero_image_alt: string | null; themes: string[];
  overview_bullets?: string[]; is_lead_story?: boolean; meta_description?: string;
}
interface ThemeItem {
  id: string; slug: string; name: string; description: string;
  article_count: number; theme_color: string | null; icon: string | null;
}
interface Sponsor {
  id: string; slug: string; name: string; logo_url: string | null; website_url: string | null;
}

/* ── constants ── */
const FORMAT_LABELS: Record<string, string> = {
  "news-brief": "NEWS", "news-analysis": "ANALYSIS", "release-note": "RELEASE",
  "feature": "FEATURE", "interview": "INTERVIEW", "case-study": "CASE STUDY",
  "opinion": "OPINION", "explainer": "EXPLAINER", "product-review": "REVIEW",
  "research-brief": "RESEARCH",
};

// Particle-style: badges with good contrast on both light images and card backgrounds
const FORMAT_BADGE_STYLES: Record<string, string> = {
  "feature":        "bg-primary text-primary-foreground",
  "news-analysis":  "bg-foreground/80 text-card",
  "case-study":     "bg-teal text-primary-foreground",
  "release-note":   "bg-lavender text-primary-foreground",
  "interview":      "bg-amber text-foreground",
  "opinion":        "bg-coral text-primary-foreground",
  "explainer":      "bg-teal text-primary-foreground",
  "research-brief": "bg-foreground/70 text-card",
  "news-brief":     "bg-primary/90 text-primary-foreground",
  "product-review": "bg-amber text-foreground",
};

// Placeholder gradients per theme for articles without hero images
const THEME_GRADIENTS: Record<string, string> = {
  "ai-product-strategy": "from-blue-600 to-indigo-800",
  "agents-agentic-systems": "from-violet-600 to-purple-800",
  "ux-for-ai": "from-pink-500 to-rose-700",
  "adoption-organizational-change": "from-emerald-600 to-teal-800",
  "evaluation-benchmarking": "from-cyan-500 to-blue-700",
  "go-to-market-distribution": "from-orange-500 to-red-700",
  "data-semantics-knowledge-foundations": "from-sky-500 to-indigo-700",
  "ai-ethics-governance": "from-amber-500 to-orange-700",
};

const THEME_COLORS = [
  "hsl(220, 80%, 50%)", "hsl(182, 55%, 42%)", "hsl(38, 90%, 50%)", "hsl(260, 50%, 58%)",
  "hsl(140, 35%, 45%)", "hsl(4, 75%, 55%)", "hsl(182, 55%, 42%)", "hsl(38, 90%, 50%)",
];

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

function authorName(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

function getThemeGradient(themes: string[]) {
  const first = themes?.[0] || "";
  return THEME_GRADIENTS[first] || "from-slate-600 to-slate-800";
}

/* ── Placeholder image for articles without hero ── */
function PlaceholderImage({ themes, title, className = "" }: { themes: string[]; title: string; className?: string }) {
  const gradient = getThemeGradient(themes);
  return (
    <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center p-6 ${className}`}>
      <span className="font-display font-bold text-white/90 text-center text-sm leading-tight line-clamp-3 drop-shadow-sm">
        {title}
      </span>
    </div>
  );
}

/* ── Skeleton cards ── */
function SkeletonHero() {
  return (
    <div className="relative aspect-[16/9] lg:aspect-[2/1] rounded-xl overflow-hidden bg-muted">
      <Skeleton className="absolute inset-0" />
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 space-y-3">
        <Skeleton className="h-4 w-20 bg-foreground/10" />
        <Skeleton className="h-10 w-3/4 bg-foreground/10" />
        <Skeleton className="h-5 w-1/2 bg-foreground/10" />
      </div>
    </div>
  );
}
function SkeletonArticleCard() {
  return (
    <div className="studio-card overflow-hidden flex flex-col h-full">
      <Skeleton className="aspect-[16/9]" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}

/* ── Horizontal scroll strip ── */
function HorizontalStrip({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => ref.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  return (
    <div className={`relative group/strip ${className}`}>
      <button onClick={() => scroll(-1)} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-card border border-border text-foreground flex items-center justify-center opacity-0 group-hover/strip:opacity-100 transition-opacity -ml-3 shadow-md">
        <ChevronLeft className="w-4 h-4" />
      </button>
      <div ref={ref} className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2" style={{ scrollbarWidth: "none" }}>
        {children}
      </div>
      <button onClick={() => scroll(1)} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-card border border-border text-foreground flex items-center justify-center opacity-0 group-hover/strip:opacity-100 transition-opacity -mr-3 shadow-md">
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

/* ── Section heading ── */
function SectionHeading({ title, count, linkText, linkHref }: { title: string; count?: number; linkText: string; linkHref: string }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2">
        <h2 className="font-display font-bold text-foreground text-xl md:text-2xl tracking-tight">{title}</h2>
        {count !== undefined && count > 0 && (
          <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{count}</span>
        )}
      </div>
      <Link to={linkHref} className="text-sm text-primary hover:underline inline-flex items-center gap-1 flex-shrink-0 font-medium">
        {linkText} <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
  );
}

/* ── Article card (Particle-style) ── */
function ArticleCard({ article }: { article: Article }) {
  return (
    <Link to={`/news/${article.slug}`} className="group studio-card overflow-hidden flex flex-col h-full">
      <div className="relative aspect-[16/9] overflow-hidden">
        {article.hero_image_url ? (
          <img src={article.hero_image_url} alt={article.hero_image_alt || article.title}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" loading="lazy" />
        ) : (
          <PlaceholderImage themes={article.themes} title={article.title} />
        )}
        <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm ${FORMAT_BADGE_STYLES[article.format] || "bg-foreground/70 text-card"}`}>
          {FORMAT_LABELS[article.format] || article.format}
        </span>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2 text-[11px] text-muted-foreground">
          <Zap className="w-3 h-3 text-amber" />
          <span>{timeAgo(article.publish_date)}</span>
          {article.themes.slice(0, 1).map(t => (
            <span key={t} className="text-primary font-medium">{t.replace(/-/g, " ")}</span>
          ))}
        </div>
        <h3 className="font-display font-bold text-foreground text-base md:text-lg leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {article.title}
        </h3>
        {article.subtitle && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{article.subtitle}</p>
        )}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-auto pt-2 border-t border-border">
          {article.author_slugs?.[0] && <span className="font-medium text-foreground/70">{authorName(article.author_slugs[0])}</span>}
          {article.read_time_minutes && <span>· {article.read_time_minutes} min</span>}
        </div>
      </div>
    </Link>
  );
}

/* ── Small card for carousel rows ── */
function SmallCard({ article, badge }: { article: Article; badge?: string }) {
  return (
    <Link to={`/news/${article.slug}`}
      className="group studio-card overflow-hidden flex-shrink-0 snap-start"
      style={{ width: "min(300px, 80vw)" }}>
      <div className="relative aspect-[4/3] overflow-hidden">
        {article.hero_image_url ? (
          <img src={article.hero_image_url} alt={article.hero_image_alt || article.title}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300" loading="lazy" />
        ) : (
          <PlaceholderImage themes={article.themes} title={article.title} />
        )}
        <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm ${FORMAT_BADGE_STYLES[article.format] || "bg-foreground/70 text-card"}`}>
          {badge || FORMAT_LABELS[article.format] || article.format}
        </span>
      </div>
      <div className="p-3">
        <h4 className="font-display font-bold text-foreground text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {article.title}
        </h4>
        <p className="text-[11px] text-muted-foreground mt-1.5 flex items-center gap-1">
          <Zap className="w-2.5 h-2.5 text-amber" />
          {timeAgo(article.publish_date)}
        </p>
      </div>
    </Link>
  );
}

/* ── Episode card ── */
function EpisodeStripCard({ episode }: { episode: any }) {
  const title = (episode.title || "").replace(/&#39;/g, "'").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/<[^>]*>/g, "");
  const desc = (episode.description || "").replace(/<[^>]*>/g, "").replace(/&#39;/g, "'").replace(/&amp;/g, "&").substring(0, 200);

  return (
    <div className="studio-card p-4 md:p-5 flex gap-4 group">
      <div className="flex-shrink-0 w-[100px] h-[100px] md:w-[140px] md:h-[140px] rounded-lg overflow-hidden bg-muted">
        {episode.imageUrl ? (
          <img src={episode.imageUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <Mic2 className="w-8 h-8 text-primary/40" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          {episode.episodeNumber && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary">
              {episode.seasonNumber ? `S${String(episode.seasonNumber).padStart(2, "0")}E${String(episode.episodeNumber).padStart(2, "0")}` : `EP ${episode.episodeNumber}`}
            </span>
          )}
          {episode.duration && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-muted text-muted-foreground">
              {episode.duration}
            </span>
          )}
        </div>
        <h4 className="font-display font-bold text-foreground text-base md:text-lg leading-tight line-clamp-2 mb-1">
          {title}
        </h4>
        <p className="text-sm text-muted-foreground line-clamp-2 md:line-clamp-3 mb-3">{desc}</p>
        <div className="flex items-center gap-3">
          {episode.audioUrl && (
            <button className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:brightness-110 transition-all shadow-sm">
              <Play className="w-4 h-4 ml-0.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   HOMEPAGE
   ════════════════════════════════════════════════ */
export default function Home() {
  const { content, update, updateMany, reset, isEditing, setIsEditing } = useCMS();
  const { episodes, loading: feedLoading } = useRSSFeed(content.rssFeedUrl);
  const { user, canEdit, isAdmin, signInWithGoogle, signOut } = useAuth();
  const [contactOpen, setContactOpen] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [themes, setThemes] = useState<ThemeItem[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(true);

  useEffect(() => {
    const base = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    const headers = { apikey: key };

    Promise.all([
      fetch(`${base}/functions/v1/articles?limit=20`, { headers }).then(r => r.json()),
      fetch(`${base}/functions/v1/themes-api`, { headers }).then(r => r.json()),
      fetch(`${base}/functions/v1/sponsors-api`, { headers }).then(r => r.json()),
    ]).then(([articlesRes, themesRes, sponsorsRes]) => {
      setArticles(articlesRes.data || []);
      setThemes(themesRes.data || []);
      setSponsors(sponsorsRes.data || []);
      setArticlesLoading(false);
    }).catch(() => setArticlesLoading(false));
  }, []);

  const leadArticle = articles.find(a => a.is_lead_story) || articles[0];
  const secondaryArticles = articles.filter(a => a !== leadArticle).slice(0, 4);
  const releases = articles.filter(a => a.format === "release-note").slice(0, 6);
  const caseStudies = articles.filter(a => a.format === "case-study").slice(0, 4);
  const features = articles.filter(a => a.format === "feature").slice(0, 3);
  const explainers = articles.filter(a => a.format === "explainer").slice(0, 3);
  const twoEpisodes = episodes.slice(0, 2);

  const handleToggleEdit = () => {
    if (!user) { signInWithGoogle(); return; }
    if (canEdit) setIsEditing(v => !v);
  };

  return (
    <div className={isEditing ? "cms-editing" : ""}>
      <HeadMeta content={content} />
      <Navbar
        content={content} isEditing={isEditing} onToggleEdit={handleToggleEdit}
        onContactClick={() => setContactOpen(true)} onUpdate={update}
        canEdit={canEdit} user={user} onSignIn={signInWithGoogle} onSignOut={signOut}
      />

      <main className="min-h-screen bg-background pt-24">
        {/* ── 1. HERO STORY (Particle-style) ── */}
        <section className="container mx-auto px-4 md:px-6 pt-4 pb-8">
          {articlesLoading ? (
            <SkeletonHero />
          ) : leadArticle ? (
            <Link to={`/news/${leadArticle.slug}`} className="group relative block rounded-xl overflow-hidden shadow-lg">
              <div className="relative aspect-[16/9] lg:aspect-[2/1]">
                {leadArticle.hero_image_url ? (
                  <img src={leadArticle.hero_image_url} alt={leadArticle.hero_image_alt || leadArticle.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700" />
                ) : (
                  <PlaceholderImage themes={leadArticle.themes} title="" className="absolute inset-0" />
                )}
                <div className="absolute inset-0 particle-hero-overlay" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 lg:p-12">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider shadow-sm ${FORMAT_BADGE_STYLES[leadArticle.format] || "bg-primary text-primary-foreground"}`}>
                      {FORMAT_LABELS[leadArticle.format] || leadArticle.format}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-white/70">
                      <Zap className="w-3 h-3 text-amber" /> {timeAgo(leadArticle.publish_date)}
                    </span>
                    {leadArticle.themes.slice(0, 2).map(t => (
                      <span key={t} className="px-2 py-0.5 rounded-full bg-white/15 backdrop-blur-sm text-[10px] text-white/80 uppercase tracking-wider">
                        {t.replace(/-/g, " ")}
                      </span>
                    ))}
                  </div>
                  <h1 className="font-display font-bold text-white leading-[1.1] tracking-tight mb-3"
                    style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)" }}>
                    {leadArticle.title}
                  </h1>
                  {leadArticle.subtitle && (
                    <p className="text-white/80 text-base md:text-lg max-w-2xl line-clamp-2 mb-3">{leadArticle.subtitle}</p>
                  )}
                  <div className="flex items-center gap-3 text-sm text-white/60">
                    {leadArticle.author_slugs?.[0] && (
                      <span className="font-medium text-white/80">{authorName(leadArticle.author_slugs[0])}</span>
                    )}
                    {leadArticle.read_time_minutes && <span>· {leadArticle.read_time_minutes} min read</span>}
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            <SkeletonHero />
          )}
        </section>

        {/* ── 2. SECONDARY 2×2 ARTICLE GRID ── */}
        <section className="container mx-auto px-4 md:px-6 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {articlesLoading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonArticleCard key={i} />)
              : secondaryArticles.length > 0
                ? [...secondaryArticles, ...Array(Math.max(0, 4 - secondaryArticles.length)).fill(null)].slice(0, 4).map((a, i) =>
                    a ? <ArticleCard key={a.id} article={a} /> : <SkeletonArticleCard key={`skel-${i}`} />
                  )
                : Array.from({ length: 4 }).map((_, i) => <SkeletonArticleCard key={i} />)
            }
          </div>
          <div className="mt-4 text-right">
            <Link to="/news" className="text-sm text-primary hover:underline inline-flex items-center gap-1 font-medium">
              All articles <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </section>

        {/* ── 3. LATEST EPISODES ── */}
        <section className="container mx-auto px-4 md:px-6 py-10 border-t border-border">
          <SectionHeading title="Latest Episodes" linkText="All episodes" linkHref="/podcast" />
          {twoEpisodes.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4 md:gap-5">
              {twoEpisodes.map((ep, i) => <EpisodeStripCard key={i} episode={ep} />)}
            </div>
          ) : feedLoading ? (
            <div className="grid md:grid-cols-2 gap-4">
              {[0, 1].map(i => <Skeleton key={i} className="h-44 rounded-xl" />)}
            </div>
          ) : null}
        </section>

        {/* ── 4. THEMES ROW ── */}
        {themes.length > 0 && (
          <section className="container mx-auto px-4 md:px-6 py-10 border-t border-border">
            <SectionHeading title="Themes" count={themes.length} linkText="View all" linkHref="/themes" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {themes.map((theme, i) => (
                <Link key={theme.id} to={`/themes/${theme.slug}`}
                  className="studio-card overflow-hidden group">
                  <div className="h-1.5 rounded-t-lg" style={{ background: THEME_COLORS[i % 8] }} />
                  <div className="p-4">
                    <h3 className="font-display font-bold text-foreground text-sm mb-1 group-hover:text-primary transition-colors">
                      {theme.name}
                    </h3>
                    <p className="text-[11px] text-muted-foreground line-clamp-2 mb-2">{theme.description}</p>
                    <span className="text-[11px] text-primary font-semibold">
                      {theme.article_count} article{theme.article_count !== 1 ? "s" : ""}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── 5. LATEST RELEASES ── */}
        <section className="container mx-auto px-4 md:px-6 py-10 border-t border-border">
          <SectionHeading title="Latest Releases" linkText="All releases" linkHref="/news/format/release-note" />
          <HorizontalStrip>
            {releases.length > 0
              ? releases.map(a => <SmallCard key={a.id} article={a} badge="RELEASE" />)
              : Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex-shrink-0 snap-start" style={{ width: "min(300px, 80vw)" }}>
                    <Skeleton className="aspect-[4/3] rounded-xl" />
                  </div>
                ))
            }
          </HorizontalStrip>
        </section>

        {/* ── 6. CASE STUDIES ── */}
        <section className="container mx-auto px-4 md:px-6 py-10 border-t border-border">
          <SectionHeading title="Case Studies" linkText="All case studies" linkHref="/news/format/case-study" />
          <HorizontalStrip>
            {caseStudies.length > 0
              ? caseStudies.map(a => <SmallCard key={a.id} article={a} badge="CASE STUDY" />)
              : Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex-shrink-0 snap-start" style={{ width: "min(300px, 80vw)" }}>
                    <Skeleton className="aspect-[16/9] rounded-xl" />
                  </div>
                ))
            }
          </HorizontalStrip>
        </section>

        {/* ── 7. FEATURES ── */}
        <section className="container mx-auto px-4 md:px-6 py-10 border-t border-border">
          <SectionHeading title="Features" linkText="All features" linkHref="/news/format/feature" />
          <div className="grid md:grid-cols-3 gap-4 md:gap-5">
            {features.length > 0
              ? features.map(a => <ArticleCard key={a.id} article={a} />)
              : Array.from({ length: 3 }).map((_, i) => <SkeletonArticleCard key={i} />)
            }
          </div>
        </section>

        {/* ── 8. FROM THE FIELD GUIDE ── */}
        {explainers.length > 0 && (
          <section className="container mx-auto px-4 md:px-6 py-10 border-t border-border">
            <SectionHeading title="From the Field Guide" linkText="Browse" linkHref="/news/format/explainer" />
            <div className="grid md:grid-cols-3 gap-4">
              {explainers.map(a => (
                <Link key={a.id} to={`/news/${a.slug}`} className="studio-card p-5 group">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal mb-2 block">EXPLAINER</span>
                  <h4 className="font-display font-bold text-foreground text-base mb-2 group-hover:text-primary transition-colors">
                    {a.title}
                  </h4>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {a.subtitle || a.meta_description || ""}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── 9. VOICES ── */}
        <section className="container mx-auto px-4 md:px-6 py-10 border-t border-border">
          <h2 className="font-display font-bold text-foreground text-xl md:text-2xl tracking-tight mb-1">Voices</h2>
          <p className="text-sm text-muted-foreground mb-5">Hosted by</p>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { name: content.host1Name || "Arpy Dragffy", role: "Founder, PH1 Research · Co-host, Product Impact Podcast", img: content.host1ImageUrl, slug: "arpy-dragffy", bio: content.host1Bio },
              { name: content.host2Name || "Brittany Hobbs", role: "Co-host, Product Impact Podcast", img: content.host2ImageUrl, slug: "brittany-hobbs", bio: content.host2Bio },
            ].map(host => (
              <div key={host.slug} className="studio-card p-5 flex gap-4">
                <div className="flex-shrink-0 w-20 h-20 md:w-[110px] md:h-[110px] rounded-xl overflow-hidden bg-muted">
                  {host.img ? (
                    <img src={host.img} alt={host.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                      <User className="w-8 h-8 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-display font-bold text-foreground text-base">{host.name}</h4>
                  <p className="text-xs text-muted-foreground mb-2">{host.role}</p>
                  {host.bio && <p className="text-sm text-foreground/70 line-clamp-2">{host.bio}</p>}
                  <Link to={`/people/${host.slug}`} className="text-xs text-primary hover:underline mt-2 inline-block font-medium">
                    View profile →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 10. NEWSLETTER ── */}
        <section className="container mx-auto px-4 md:px-6 py-10 border-t border-border">
          <div className="studio-card p-8 md:p-12 text-center bg-gradient-to-br from-primary/5 to-transparent">
            <h2 className="font-display font-bold text-foreground text-2xl md:text-3xl mb-3">Stay in the loop</h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Get the latest news, analysis, and case studies on AI product impact delivered weekly.
            </p>
            <a href={content.subscribeUrl || content.substackUrl || "#"} target="_blank" rel="noopener noreferrer"
              className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:brightness-110 transition-all inline-block shadow-sm">
              Subscribe to Newsletter
            </a>
          </div>
        </section>

        {/* ── 11. PARTNER RIBBON ── */}
        {sponsors.length > 0 && (
          <section className="container mx-auto px-4 md:px-6 py-10 border-t border-border">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-foreground text-xl tracking-tight">Partners</h2>
              <Link to="/partnerships" className="text-sm text-primary hover:underline inline-flex items-center gap-1 font-medium">
                Become a partner <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="flex items-center gap-8 overflow-x-auto pb-2">
              {sponsors.map(s => (
                <a key={s.id} href={s.website_url || "#"} target="_blank" rel="noopener noreferrer"
                  className="flex-shrink-0 opacity-40 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
                  {s.logo_url ? (
                    <img src={s.logo_url} alt={s.name} className="h-10 object-contain" />
                  ) : (
                    <span className="text-sm font-medium text-muted-foreground">{s.name}</span>
                  )}
                </a>
              ))}
            </div>
          </section>
        )}

        <div className="py-6" />
      </main>

      <Footer content={content} isEditing={isEditing} onUpdate={update} onContactClick={() => setContactOpen(true)}
        canEdit={canEdit} user={user} onSignIn={signInWithGoogle} onSignOut={signOut} onToggleEdit={handleToggleEdit} />

      {contactOpen && <ContactModal content={content} isEditing={isEditing} onUpdate={update} onClose={() => setContactOpen(false)} defaultInquiryType="" />}
      <PopupAlert content={content} />
      {isEditing && canEdit && <CMSPanel content={content} onUpdate={update} onReset={reset} onClose={() => setIsEditing(false)} isAdmin={isAdmin} />}
    </div>
  );
}
