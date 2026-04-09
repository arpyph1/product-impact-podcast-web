// New publication hub homepage
import { useState, useEffect } from "react";
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
import { Loader2, ArrowRight, Play } from "lucide-react";

interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  format: string;
  author_slugs: string[];
  publish_date: string;
  read_time_minutes: number | null;
  hero_image_url: string | null;
  hero_image_alt: string | null;
  themes: string[];
}

interface ThemeItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  article_count: number;
  theme_color: string | null;
}

const FORMAT_LABELS: Record<string, string> = {
  "news-brief": "News", "news-analysis": "Analysis", "release-note": "Release",
  "feature": "Feature", "interview": "Interview", "case-study": "Case Study",
  "opinion": "Opinion", "explainer": "Explainer", "product-review": "Review",
  "research-brief": "Research",
};

function ArticleCard({ article, large = false }: { article: Article; large?: boolean }) {
  return (
    <Link to={`/news/${article.slug}`} className="group studio-card overflow-hidden hover:border-foreground/20 transition-all flex flex-col h-full">
      {article.hero_image_url && (
        <div className={large ? "aspect-[16/9]" : "aspect-[16/10]"} style={{ overflow: "hidden" }}>
          <img src={article.hero_image_url} alt={article.hero_image_alt || article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        </div>
      )}
      <div className={large ? "p-6" : "p-4"}>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-primary/20 text-primary">
            {FORMAT_LABELS[article.format] || article.format}
          </span>
        </div>
        <h3 className={`font-display font-bold text-foreground leading-tight mb-2 group-hover:text-primary transition-colors ${large ? "text-2xl" : "text-base"}`}>
          {article.title}
        </h3>
        {article.subtitle && large && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{article.subtitle}</p>
        )}
        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-auto">
          <span>{new Date(article.publish_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
          {article.read_time_minutes && <span>{article.read_time_minutes} min</span>}
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const { content, update, updateMany, reset, isEditing, setIsEditing } = useCMS();
  const { episodes, loading: feedLoading } = useRSSFeed(content.rssFeedUrl);
  const { user, canEdit, isAdmin, signInWithGoogle, signOut } = useAuth();
  const [contactOpen, setContactOpen] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [themes, setThemes] = useState<ThemeItem[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(true);

  useEffect(() => {
    const base = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    const headers = { apikey: key };

    Promise.all([
      fetch(`${base}/functions/v1/articles?limit=7`, { headers }).then(r => r.json()),
      fetch(`${base}/functions/v1/themes-api`, { headers }).then(r => r.json()),
    ]).then(([articlesRes, themesRes]) => {
      setArticles(articlesRes.data || []);
      setThemes(themesRes.data || []);
      setArticlesLoading(false);
    }).catch(() => setArticlesLoading(false));
  }, []);

  const leadArticle = articles[0];
  const secondaryArticles = articles.slice(1, 4);
  const latestEpisode = episodes[0];

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

      <main className="min-h-screen bg-background pt-28">
        {/* Tagline */}
        <div className="container mx-auto px-6 py-6 border-b border-border">
          <p className="text-sm text-muted-foreground tracking-wide uppercase">
            AI product impact — news, releases, and case studies
          </p>
        </div>

        {/* Hero section: Lead story + secondary */}
        <section className="container mx-auto px-6 py-10">
          {articlesLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>
          ) : articles.length === 0 ? (
            <div className="text-center py-16 studio-card p-12">
              <h2 className="font-display font-bold text-foreground text-2xl mb-3">Welcome to Product Impact</h2>
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                Articles will appear here once published. Use the API or CMS to publish your first article.
              </p>
              <div className="flex justify-center gap-4">
                <Link to="/podcast" className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:brightness-110 transition-all">
                  Listen to the Podcast
                </Link>
                <Link to="/episodes" className="px-5 py-2.5 rounded-full border border-border text-foreground font-semibold text-sm hover:border-foreground transition-all">
                  Browse Episodes
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Lead story */}
              {leadArticle && (
                <div className="lg:col-span-2">
                  <ArticleCard article={leadArticle} large />
                </div>
              )}
              {/* Secondary stories */}
              <div className="flex flex-col gap-4">
                {secondaryArticles.map(a => (
                  <Link key={a.id} to={`/news/${a.slug}`} className="group studio-card p-4 hover:border-foreground/20 transition-all">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary mb-1 block">
                      {FORMAT_LABELS[a.format] || a.format}
                    </span>
                    <h3 className="font-display font-bold text-foreground text-sm leading-tight group-hover:text-primary transition-colors">
                      {a.title}
                    </h3>
                    <span className="text-[10px] text-muted-foreground mt-1 block">
                      {new Date(a.publish_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </Link>
                ))}
                <Link to="/news" className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-2">
                  All articles <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* Themes row */}
        {themes.length > 0 && (
          <section className="container mx-auto px-6 py-10 border-t border-border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-foreground text-xl uppercase tracking-tight">Themes</h2>
              <Link to="/themes" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {themes.map(theme => (
                <Link key={theme.id} to={`/themes/${theme.slug}`}
                  className="studio-card p-4 hover:border-foreground/20 transition-all group">
                  <h3 className="font-display font-bold text-foreground text-sm mb-1 group-hover:text-primary transition-colors">
                    {theme.name}
                  </h3>
                  <p className="text-[10px] text-muted-foreground line-clamp-2">{theme.description}</p>
                  {theme.article_count > 0 && (
                    <span className="text-[10px] text-primary mt-2 block">{theme.article_count} article{theme.article_count !== 1 ? "s" : ""}</span>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Latest episode strip */}
        {latestEpisode && (
          <section className="container mx-auto px-6 py-10 border-t border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-foreground text-xl uppercase tracking-tight">Latest Episode</h2>
              <Link to="/podcast" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
                All episodes <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="studio-card p-6 flex flex-col md:flex-row items-start gap-6">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <Play className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-bold text-foreground text-lg mb-1">{latestEpisode.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{latestEpisode.description}</p>
                <div className="flex flex-wrap gap-3">
                  {content.spotifyUrl && content.spotifyUrl !== "#" && (
                    <a href={content.spotifyUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Spotify</a>
                  )}
                  {content.appleUrl && content.appleUrl !== "#" && (
                    <a href={content.appleUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Apple Podcasts</a>
                  )}
                  {content.youtubeUrl && content.youtubeUrl !== "#" && (
                    <a href={content.youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground transition-colors">YouTube</a>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Newsletter CTA */}
        <section className="container mx-auto px-6 py-10 border-t border-border">
          <div className="studio-card p-8 text-center">
            <h2 className="font-display font-bold text-foreground text-2xl mb-3">Stay in the loop</h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Get the latest news, analysis, and case studies on AI product impact delivered weekly.
            </p>
            <a href={content.subscribeUrl || content.substackUrl || "#"} target="_blank" rel="noopener noreferrer"
              className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:brightness-110 transition-all inline-block">
              Subscribe to Newsletter
            </a>
          </div>
        </section>

        <div className="py-8" />
      </main>

      <Footer content={content} isEditing={isEditing} onUpdate={update} onContactClick={() => setContactOpen(true)}
        canEdit={canEdit} user={user} onSignIn={signInWithGoogle} onSignOut={signOut} onToggleEdit={handleToggleEdit} />

      {contactOpen && <ContactModal content={content} isEditing={isEditing} onUpdate={update} onClose={() => setContactOpen(false)} defaultInquiryType="" />}
      <PopupAlert content={content} />
      {isEditing && canEdit && <CMSPanel content={content} onUpdate={update} onReset={reset} onClose={() => setIsEditing(false)} isAdmin={isAdmin} />}
    </div>
  );
}
