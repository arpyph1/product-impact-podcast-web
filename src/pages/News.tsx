import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCMS } from "@/hooks/useCMS";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeadMeta from "@/components/HeadMeta";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";

interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  format: string;
  author_slugs: string[];
  byline_role: string | null;
  publish_date: string;
  read_time_minutes: number | null;
  meta_description: string;
  hero_image_url: string | null;
  hero_image_alt: string | null;
  themes: string[];
  lenses: string[];
  topics: string[];
}

const FORMAT_LABELS: Record<string, string> = {
  "news-brief": "News Brief",
  "news-analysis": "News Analysis",
  "release-note": "Release",
  "feature": "Feature",
  "interview": "Interview",
  "case-study": "Case Study",
  "opinion": "Opinion",
  "explainer": "Explainer",
  "product-review": "Product Review",
  "research-brief": "Research Brief",
};

const FORMAT_COLORS: Record<string, string> = {
  "news-brief": "bg-primary/10 text-primary",
  "news-analysis": "bg-primary/10 text-primary",
  "release-note": "bg-teal/10 text-teal",
  "feature": "bg-amber/10 text-foreground",
  "interview": "bg-lavender/10 text-lavender",
  "case-study": "bg-sage/10 text-sage",
  "opinion": "bg-primary/10 text-primary",
  "explainer": "bg-teal/10 text-teal",
  "product-review": "bg-amber/10 text-foreground",
  "research-brief": "bg-lavender/10 text-lavender",
};

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

export default function News() {
  const { content, update, isEditing, setIsEditing } = useCMS();
  const { user, canEdit, signInWithGoogle, signOut } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [formatFilter, setFormatFilter] = useState<string>("");
  const limit = 12;

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (formatFilter) params.set("format", formatFilter);

    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/articles?${params}`;
    fetch(url, { headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY } })
      .then(r => r.json())
      .then(result => {
        setArticles(result.data || []);
        setTotalCount(result.count || 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [page, formatFilter]);

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div>
      <HeadMeta content={content} />
      <Navbar
        content={content} isEditing={isEditing}
        onToggleEdit={() => { if (!user) { signInWithGoogle(); return; } if (canEdit) setIsEditing(v => !v); }}
        onContactClick={() => {}} onUpdate={update} canEdit={canEdit} user={user}
        onSignIn={signInWithGoogle} onSignOut={signOut}
      />

      <main className="min-h-screen bg-background pt-32">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="pb-8 border-b border-border mb-8">
            <h1 className="font-display font-black text-foreground uppercase tracking-tight"
              style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>
              News
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              AI product impact — news, releases, and case studies about the products transforming how we work
            </p>
          </div>

          {/* Format filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => { setFormatFilter(""); setPage(1); }}
              className={`px-4 py-2 rounded-full text-xs font-medium border transition-all ${
                !formatFilter ? "border-foreground text-foreground bg-foreground/5" : "border-border text-muted-foreground hover:border-foreground"
              }`}
            >
              All
            </button>
            {Object.entries(FORMAT_LABELS).map(([key, label]) => (
              <button
                key={key}
                onClick={() => { setFormatFilter(key); setPage(1); }}
                className={`px-4 py-2 rounded-full text-xs font-medium border transition-all ${
                  formatFilter === key ? "border-foreground text-foreground bg-foreground/5" : "border-border text-muted-foreground hover:border-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Articles grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-lg mb-2">No articles published yet.</p>
              <p className="text-sm">Articles will appear here once published via the API.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
              {articles.map(article => {
                const gradient = THEME_GRADIENTS[article.themes?.[0]] || "from-slate-600 to-slate-800";
                return (
                <Link
                  key={article.id}
                  to={`/news/${article.slug}`}
                  className="group studio-card overflow-hidden"
                >
                  <div className="aspect-[16/9] overflow-hidden">
                    {article.hero_image_url ? (
                      <img
                        src={article.hero_image_url}
                        alt={article.hero_image_alt || article.title}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center p-6`}>
                        <span className="font-display font-bold text-white/90 text-center text-sm leading-tight line-clamp-3 drop-shadow-sm">
                          {article.title}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${FORMAT_COLORS[article.format] || "bg-muted text-muted-foreground"}`}>
                        {FORMAT_LABELS[article.format] || article.format}
                      </span>
                      {article.themes.slice(0, 2).map(t => (
                        <span key={t} className="text-[10px] text-muted-foreground uppercase tracking-wider">{t.replace(/-/g, " ")}</span>
                      ))}
                    </div>
                    <h2 className="font-display font-bold text-foreground text-lg leading-tight mb-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h2>
                    {article.subtitle && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{article.subtitle}</p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{new Date(article.publish_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                      {article.read_time_minutes && <span>{article.read_time_minutes} min read</span>}
                    </div>
                  </div>
                </Link>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pb-12">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded border border-border text-muted-foreground hover:text-foreground disabled:opacity-30 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded text-sm font-medium transition-all ${
                    p === page ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded border border-border text-muted-foreground hover:text-foreground disabled:opacity-30 transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer content={content} isEditing={isEditing} onUpdate={update} onContactClick={() => {}} canEdit={canEdit} user={user} onSignIn={signInWithGoogle} onSignOut={signOut} />
    </div>
  );
}
