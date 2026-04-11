import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCMS } from "@/hooks/useCMS";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Loader2, ArrowLeft, ChevronRight, Share2, User, Play, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const FORMAT_LABELS: Record<string, string> = {
  "news-brief": "News Brief", "news-analysis": "News Analysis", "release-note": "Release",
  "feature": "Feature", "interview": "Interview", "case-study": "Case Study",
  "opinion": "Opinion", "explainer": "Explainer", "product-review": "Product Review",
  "research-brief": "Research Brief",
};
const FORMAT_COLORS: Record<string, string> = {
  "feature": "bg-coral text-primary-foreground",
  "news-analysis": "bg-teal text-primary-foreground",
  "case-study": "bg-sage text-primary-foreground",
  "release-note": "bg-lavender text-primary-foreground",
  "interview": "bg-amber text-accent-foreground",
  "opinion": "bg-primary text-primary-foreground",
  "explainer": "bg-teal text-primary-foreground",
  "research-brief": "bg-muted text-foreground",
  "news-brief": "bg-primary/80 text-primary-foreground",
  "product-review": "bg-amber text-accent-foreground",
};
const TYPE_ROUTES: Record<string, string> = {
  person: "people", concept: "concepts", organization: "organizations",
  product: "products", framework: "frameworks", source: "sources",
};
const TYPE_LABELS: Record<string, string> = {
  person: "People mentioned", concept: "Concepts", organization: "Organizations",
  product: "Products", framework: "Frameworks", source: "Sources",
};

const THEME_FALLBACK_GRADIENTS: Record<string, string> = {
  "ai-product-strategy": "from-[hsl(4,85%,60%)] to-[hsl(4,85%,35%)]",
  "agents-agentic-systems": "from-[hsl(260,55%,65%)] to-[hsl(260,55%,40%)]",
  "ux-for-ai": "from-[hsl(182,55%,48%)] to-[hsl(182,55%,28%)]",
  "adoption-organizational-change": "from-[hsl(38,95%,58%)] to-[hsl(38,95%,35%)]",
  "evaluation-benchmarking": "from-[hsl(140,35%,52%)] to-[hsl(140,35%,30%)]",
  "go-to-market-distribution": "from-[hsl(4,85%,60%)] to-[hsl(38,95%,45%)]",
  "data-semantics-knowledge": "from-[hsl(182,55%,48%)] to-[hsl(260,55%,50%)]",
  "ai-ethics-governance": "from-[hsl(260,55%,65%)] to-[hsl(182,55%,40%)]",
};

function authorName(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

function stripFirstH1(html: string): string {
  return html.replace(/^\s*<h1[^>]*>[\s\S]*?<\/h1>\s*/i, "");
}

function getThemeFallbackImage(themes: string[]): string | null {
  // Returns null — no real fallback image URL yet (we use gradient instead)
  return null;
}

const SITE_URL = "https://productimpactpod.com";

export default function Article() {
  const { slug } = useParams<{ slug: string }>();
  const { content, update, isEditing, setIsEditing } = useCMS();
  const { user, canEdit, signInWithGoogle, signOut } = useAuth();
  const [article, setArticle] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    const base = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    const headers = { apikey: key };

    fetch(`${base}/functions/v1/articles?slug=${encodeURIComponent(slug)}`, { headers })
      .then(r => r.json())
      .then(result => {
        setArticle(result.data);
        setLoading(false);
        if (result.data?.themes?.[0]) {
          fetch(`${base}/functions/v1/articles?theme=${result.data.themes[0]}&limit=4`, { headers })
            .then(r => r.json())
            .then(rel => setRelated((rel.data || []).filter((a: any) => a.slug !== slug).slice(0, 3)));
        }
      })
      .catch(() => setLoading(false));
  }, [slug]);

  // Per-article meta tags — set document title + meta + OG + Twitter + canonical
  useEffect(() => {
    if (!article) return;

    const articleUrl = article.canonical_url || `${SITE_URL}/news/${article.slug}`;
    const heroImg = article.hero_image_url || "";
    const themeName = (article.themes?.[0] || "").replace(/-/g, " ");

    // Document title
    document.title = `${article.title} | Product Impact`;

    // Helper to upsert meta
    const setMeta = (attr: "name" | "property", key: string, value: string) => {
      if (!value) return null;
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
      el.content = value;
      return el;
    };
    const setLink = (rel: string, href: string) => {
      let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!el) { el = document.createElement("link"); el.rel = rel; document.head.appendChild(el); }
      el.href = href;
      return el;
    };

    const metas = [
      setMeta("name", "description", article.meta_description),
      setMeta("name", "robots", "max-image-preview:large"),
      setMeta("property", "og:type", "article"),
      setMeta("property", "og:title", article.title),
      setMeta("property", "og:description", article.meta_description),
      setMeta("property", "og:image", heroImg),
      setMeta("property", "og:url", articleUrl),
      setMeta("property", "og:site_name", "Product Impact"),
      setMeta("property", "article:published_time", article.publish_date),
      setMeta("property", "article:modified_time", article.updated_at || article.publish_date),
      setMeta("property", "article:section", themeName),
      ...(article.author_slugs || []).map((s: string) =>
        setMeta("property", "article:author", `${SITE_URL}/people/${s}`)
      ),
      ...(article.topics || article.themes || []).map((t: string) =>
        setMeta("property", "article:tag", t.replace(/-/g, " "))
      ),
      setMeta("name", "twitter:card", "summary_large_image"),
      setMeta("name", "twitter:site", "@productimpactpod"),
      setMeta("name", "twitter:title", article.title),
      setMeta("name", "twitter:description", article.meta_description),
      setMeta("name", "twitter:image", heroImg),
    ].filter(Boolean);

    const canonical = setLink("canonical", articleUrl);

    // JSON-LD NewsArticle
    const jsonLd = article.schema_jsonld || {
      "@context": "https://schema.org", "@type": "NewsArticle",
      headline: article.title, description: article.meta_description,
      datePublished: article.publish_date,
      dateModified: article.updated_at || article.publish_date,
      image: heroImg ? [heroImg] : undefined,
      author: (article.author_slugs || []).map((s: string) => ({
        "@type": "Person", name: authorName(s), url: `${SITE_URL}/people/${s}`,
      })),
      publisher: { "@type": "Organization", name: "Product Impact", url: SITE_URL,
        logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png`, width: 600, height: 60 },
      },
      mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);

    // BreadcrumbList
    const bcLd = {
      "@context": "https://schema.org", "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "News", item: `${SITE_URL}/news` },
        { "@type": "ListItem", position: 3, name: article.title, item: articleUrl },
      ],
    };
    const bcScript = document.createElement("script");
    bcScript.type = "application/ld+json";
    bcScript.textContent = JSON.stringify(bcLd);
    document.head.appendChild(bcScript);

    // FAQPage
    let faqScript: HTMLScriptElement | null = null;
    if (article.faqs?.length > 0) {
      faqScript = document.createElement("script");
      faqScript.type = "application/ld+json";
      faqScript.textContent = JSON.stringify({
        "@context": "https://schema.org", "@type": "FAQPage",
        mainEntity: article.faqs.map((f: any) => ({
          "@type": "Question", name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      });
      document.head.appendChild(faqScript);
    }

    return () => {
      document.head.removeChild(script);
      document.head.removeChild(bcScript);
      if (faqScript) try { document.head.removeChild(faqScript); } catch {}
      if (canonical) try { document.head.removeChild(canonical); } catch {}
      // Don't remove upserted metas — they get overwritten next page
    };
  }, [article]);

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>;
  }
  if (!article) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Article not found.</p>
        <Link to="/news" className="text-primary hover:underline">← Back to News</Link>
      </div>
    );
  }

  const authorNames = (article.author_slugs || []).map((s: string) => authorName(s));
  const overviewBullets = article.overview_bullets || [];
  const cleanedHtml = stripFirstH1(article.content_html || "");
  const shareUrl = article.canonical_url || `${SITE_URL}/news/${article.slug}`;
  const firstTheme = article.themes?.[0] || "";
  const themeGradient = THEME_FALLBACK_GRADIENTS[firstTheme] || "from-primary/30 to-primary/10";

  // Group entities by type
  const entityGroups: Record<string, any[]> = {};
  (article.entities || []).forEach((ref: any) => {
    const entity = ref.entities;
    if (!entity) return;
    if (!entityGroups[entity.type]) entityGroups[entity.type] = [];
    entityGroups[entity.type].push(entity);
  });
  const hasEntities = Object.keys(entityGroups).length > 0;

  return (
    <div>
      <Navbar
        content={content} isEditing={isEditing}
        onToggleEdit={() => { if (!user) { signInWithGoogle(); return; } if (canEdit) setIsEditing(v => !v); }}
        onContactClick={() => {}} onUpdate={update} canEdit={canEdit} user={user}
        onSignIn={signInWithGoogle} onSignOut={signOut}
      />

      <main className="min-h-screen bg-background pt-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* ── Main column ── */}
            <article className="flex-1 max-w-[720px] mx-auto lg:mx-0">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "#b0b0b0" }} aria-label="Breadcrumb">
                <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
                <ChevronRight className="w-3 h-3" />
                <Link to="/news" className="hover:text-foreground transition-colors">News</Link>
                <ChevronRight className="w-3 h-3" />
                <span className="truncate max-w-[200px]" style={{ color: "#e5e5e5" }}>{article.title}</span>
              </nav>

              {/* Format + Theme badges */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${FORMAT_COLORS[article.format] || "bg-primary text-primary-foreground"}`}>
                  {FORMAT_LABELS[article.format] || article.format}
                </span>
                {(article.themes || []).map((t: string) => (
                  <Link key={t} to={`/themes/${t}`} className="px-3 py-1 rounded-full text-xs font-medium border border-border hover:border-foreground transition-all" style={{ color: "#d4d4d4" }}>
                    {t.replace(/-/g, " ")}
                  </Link>
                ))}
              </div>

              {/* H1 — article headline */}
              <h1 className="font-display font-[800] tracking-[-0.02em] leading-[1.08] mb-4"
                style={{ fontSize: "clamp(36px, 5vw, 60px)", color: "#f0f0f0" }}>
                {article.title}
              </h1>

              {/* Deck / subtitle */}
              {article.subtitle && (
                <p className="leading-[1.5] mb-6 max-w-[720px]"
                  style={{ fontSize: "clamp(18px, 2.5vw, 22px)", fontWeight: 400, color: "#d4d4d4" }}>
                  {article.subtitle}
                </p>
              )}

              {/* Byline */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-8 pb-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5" style={{ color: "#b0b0b0" }} />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      {authorNames.map((name: string, i: number) => (
                        <Link key={i} to={`/people/${article.author_slugs[i]}`}
                          className="font-semibold hover:underline transition-colors"
                          style={{ fontSize: "16px", color: "hsl(4, 85%, 60%)" }}>
                          {name}
                        </Link>
                      ))}
                    </div>
                    {article.byline_role && <p style={{ fontSize: "14px", color: "#b0b0b0" }}>{article.byline_role}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-3" style={{ fontSize: "14px", color: "#b0b0b0" }}>
                  <time dateTime={article.publish_date}>
                    {new Date(article.publish_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </time>
                  {article.read_time_minutes && <span>· {article.read_time_minutes} min read</span>}
                </div>
                <button onClick={() => navigator.clipboard?.writeText(shareUrl)}
                  className="ml-auto p-2 hover:text-foreground transition-colors" style={{ color: "#b0b0b0" }} title="Copy link">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* Hero image */}
              <figure className="mb-8">
                {article.hero_image_url ? (
                  <img src={article.hero_image_url} alt={article.hero_image_alt || article.title}
                    className="w-full rounded-lg" style={{ aspectRatio: "1.91/1", objectFit: "cover" }} />
                ) : (
                  <div className={`w-full rounded-lg bg-gradient-to-br ${themeGradient} flex items-center justify-center`}
                    style={{ aspectRatio: "1.91/1" }}>
                    <span className="font-display font-bold text-white/20" style={{ fontSize: "clamp(24px, 3vw, 48px)" }}>
                      Product Impact
                    </span>
                  </div>
                )}
                {article.hero_image_credit && (
                  <figcaption className="mt-2 italic" style={{ fontSize: "13px", color: "#9a9a9a" }}>
                    Photo: {article.hero_image_credit}
                  </figcaption>
                )}
              </figure>

              {/* Overview bullets */}
              {overviewBullets.length > 0 && (
                <div className="rounded-xl mb-10"
                  style={{
                    background: "hsl(0 0% 9%)",
                    borderLeft: `4px solid hsl(4, 85%, 60%)`,
                    padding: "32px",
                  }}>
                  <h2 className="uppercase tracking-[0.08em] font-bold mb-4"
                    style={{ fontSize: "11px", color: "hsl(4, 85%, 60%)" }}>
                    Overview
                  </h2>
                  <ul className="space-y-4">
                    {overviewBullets.map((bullet: string, i: number) => (
                      <li key={i} className="flex gap-3 leading-[1.6]" style={{ fontSize: "17px", color: "#e5e5e5" }}>
                        <span className="w-2 h-2 rounded-full flex-shrink-0 mt-2" style={{ background: "hsl(4, 85%, 60%)" }} />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Article body — with proper typography */}
              <div
                className="article-body mb-12"
                dangerouslySetInnerHTML={{ __html: cleanedHtml }}
              />

              {/* Discussed on the Podcast */}
              {article.primary_podcast_episode_guid && (
                <div className="rounded-2xl overflow-hidden mb-12 relative" style={{ background: "hsl(0 0% 7%)" }}>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/15 to-transparent" />
                  <div className="relative p-8 md:p-12">
                    <p className="uppercase tracking-[0.08em] font-bold mb-2" style={{ fontSize: "12px", color: "hsl(4, 85%, 60%)" }}>
                      Discussed on the Product Impact Podcast
                    </p>
                    <h3 className="font-display font-bold text-lg mb-4" style={{ color: "#f0f0f0" }}>
                      Listen to the full episode
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 hover:brightness-110 transition-all cursor-pointer">
                        <Play className="w-6 h-6 ml-0.5" />
                      </div>
                      <div className="flex gap-4 text-sm" style={{ color: "#b0b0b0" }}>
                        {content.spotifyUrl && content.spotifyUrl !== "#" && <a href={content.spotifyUrl} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Spotify</a>}
                        {content.appleUrl && content.appleUrl !== "#" && <a href={content.appleUrl} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Apple Podcasts</a>}
                        {content.youtubeUrl && content.youtubeUrl !== "#" && <a href={content.youtubeUrl} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">YouTube</a>}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* FAQs */}
              {article.faqs && article.faqs.length > 0 && (
                <div className="border-t border-border pt-8 mb-12">
                  <h2 className="font-display font-bold text-xl mb-6" style={{ color: "#f0f0f0" }}>Frequently Asked Questions</h2>
                  <div className="space-y-3">
                    {article.faqs.map((faq: any, i: number) => (
                      <details key={i} className="studio-card p-4 group">
                        <summary className="font-medium cursor-pointer list-none flex items-center justify-between" style={{ color: "#e5e5e5" }}>
                          {faq.question}
                          <ChevronRight className="w-4 h-4 group-open:rotate-90 transition-transform flex-shrink-0 ml-2" style={{ color: "#b0b0b0" }} />
                        </summary>
                        <p className="mt-3 text-sm leading-relaxed" style={{ color: "#d4d4d4" }}>{faq.answer}</p>
                      </details>
                    ))}
                  </div>
                </div>
              )}

              {/* Related articles */}
              {related.length > 0 && (
                <div className="border-t border-border pt-8 mb-12">
                  <h2 className="font-display font-bold text-xl mb-6" style={{ color: "#f0f0f0" }}>
                    Related articles{" "}
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ml-2" style={{ background: "hsl(4, 85%, 60%)", color: "white" }}>
                      {related.length}
                    </span>
                  </h2>
                  <div className="grid md:grid-cols-3 gap-4">
                    {related.map((a: any) => {
                      const relTheme = a.themes?.[0] || "";
                      const relGrad = THEME_FALLBACK_GRADIENTS[relTheme] || "from-primary/30 to-primary/10";
                      return (
                        <Link key={a.id} to={`/news/${a.slug}`} className="studio-card overflow-hidden hover:border-foreground/20 transition-all group">
                          <div className="aspect-[16/9] overflow-hidden">
                            {a.hero_image_url ? (
                              <img src={a.hero_image_url} alt={a.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform" loading="lazy" />
                            ) : (
                              <div className={`w-full h-full bg-gradient-to-br ${relGrad} flex items-center justify-center`}>
                                <span className="font-display font-bold text-white/15 text-sm">Product Impact</span>
                              </div>
                            )}
                          </div>
                          <div className="p-3">
                            <div className="flex gap-1.5 mb-1">
                              {(a.themes || []).slice(0, 2).map((t: string) => (
                                <span key={t} className="text-[10px] uppercase tracking-wider" style={{ color: "hsl(4, 85%, 60%)" }}>{t.replace(/-/g, " ")}</span>
                              ))}
                            </div>
                            <h4 className="font-display font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors" style={{ color: "#e5e5e5" }}>
                              {a.title}
                            </h4>
                            <p className="text-[11px] mt-1" style={{ color: "#b0b0b0" }}>
                              {new Date(a.publish_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Author bio card */}
              {authorNames.length > 0 && (
                <div className="border-t border-border pt-8 mb-12">
                  <div className="studio-card p-6 flex gap-5">
                    <div className="w-[100px] h-[100px] md:w-[140px] md:h-[140px] rounded-full bg-muted flex-shrink-0 flex items-center justify-center overflow-hidden">
                      <User className="w-10 h-10" style={{ color: "#666" }} />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg" style={{ color: "#f0f0f0" }}>
                        <Link to={`/people/${article.author_slugs[0]}`} className="hover:text-primary transition-colors">
                          {authorNames[0]}
                        </Link>
                      </h3>
                      {article.byline_role && <p className="mb-2" style={{ fontSize: "16px", color: "#b0b0b0" }}>{article.byline_role}</p>}
                      <Link to={`/people/${article.author_slugs[0]}`} className="text-sm hover:underline" style={{ color: "hsl(4, 85%, 60%)" }}>
                        View all articles by {authorNames[0]} →
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Soft CTA */}
              <div className="mb-8 leading-relaxed" style={{ fontSize: "14px", color: "#9a9a9a" }}>
                Hosted by Arpy Dragffy and Brittany Hobbs. Arpy runs{" "}
                <a href="https://ph1.ca?utm_source=productimpactpod&utm_medium=article" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: "hsl(4, 85%, 60%)" }}>PH1 Research</a>,
                a product adoption research firm. Arpy also leads{" "}
                <a href="https://aivalueacceleration.com?utm_source=productimpactpod&utm_medium=article" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: "hsl(4, 85%, 60%)" }}>AI Value Acceleration</a>,
                enterprise AI adoption consulting.
              </div>

              {/* Newsletter */}
              <div className="studio-card p-6 md:p-8 text-center mb-12">
                <h3 className="font-display font-bold text-xl mb-2" style={{ color: "#f0f0f0" }}>Stay in the loop</h3>
                <p className="text-sm mb-4" style={{ color: "#b0b0b0" }}>Get AI product impact news delivered weekly.</p>
                <a href={content.subscribeUrl || content.substackUrl || "#"} target="_blank" rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:brightness-110 transition-all inline-block">
                  Subscribe
                </a>
              </div>

              <div className="pb-8">
                <Link to="/news" className="inline-flex items-center gap-2 text-sm hover:underline" style={{ color: "hsl(4, 85%, 60%)" }}>
                  <ArrowLeft className="w-4 h-4" /> Back to News
                </Link>
              </div>
            </article>

            {/* ── Entity sidebar (desktop only) ── */}
            {hasEntities && (
              <aside className="hidden lg:block w-72 flex-shrink-0">
                <div className="sticky top-32 space-y-6">
                  {Object.entries(entityGroups).map(([type, entities]) => (
                    <div key={type}>
                      <h4 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#b0b0b0" }}>
                        {TYPE_LABELS[type] || type}{" "}
                        <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-bold ml-1"
                          style={{ background: "hsl(4, 85%, 60%)", color: "white" }}>
                          {entities.length}
                        </span>
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {entities.map((entity: any) => (
                          <Link key={entity.id} to={`/${TYPE_ROUTES[type] || "concepts"}/${entity.slug}`}
                            className="px-2.5 py-1 rounded-full text-xs font-semibold border border-border hover:border-primary transition-all"
                            style={{ color: "#d4d4d4", fontSize: "15px" }}>
                            {entity.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </aside>
            )}
          </div>

          {/* Mobile entity sections */}
          {hasEntities && (
            <div className="lg:hidden border-t border-border pt-8 pb-12 max-w-[720px] mx-auto">
              {Object.entries(entityGroups).map(([type, entities]) => (
                <div key={type} className="mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#b0b0b0" }}>
                    {TYPE_LABELS[type] || type}{" "}
                    <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-bold ml-1"
                      style={{ background: "hsl(4, 85%, 60%)", color: "white" }}>
                      {entities.length}
                    </span>
                  </h4>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {entities.map((entity: any) => (
                      <Link key={entity.id} to={`/${TYPE_ROUTES[type] || "concepts"}/${entity.slug}`}
                        className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border border-border hover:border-primary transition-all"
                        style={{ color: "#d4d4d4" }}>
                        {entity.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer content={content} isEditing={isEditing} onUpdate={update} onContactClick={() => {}} canEdit={canEdit} user={user} onSignIn={signInWithGoogle} onSignOut={signOut} />
    </div>
  );
}
