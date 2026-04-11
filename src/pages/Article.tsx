import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCMS } from "@/hooks/useCMS";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeadMeta from "@/components/HeadMeta";
import { Loader2, ArrowLeft, ChevronRight, Share2, User, ExternalLink, Play } from "lucide-react";

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

function authorName(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

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
        // Fetch related articles by shared theme
        if (result.data?.themes?.[0]) {
          fetch(`${base}/functions/v1/articles?theme=${result.data.themes[0]}&limit=4`, { headers })
            .then(r => r.json())
            .then(rel => setRelated((rel.data || []).filter((a: any) => a.slug !== slug).slice(0, 3)));
        }
      })
      .catch(() => setLoading(false));
  }, [slug]);

  // Inject JSON-LD + meta
  useEffect(() => {
    if (!article) return;

    // NewsArticle JSON-LD
    const jsonLd = article.schema_jsonld || {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      headline: article.title,
      description: article.meta_description,
      datePublished: article.publish_date,
      dateModified: article.updated_at || article.publish_date,
      image: article.hero_image_url ? [article.hero_image_url] : undefined,
      author: (article.author_slugs || []).map((s: string) => ({
        "@type": "Person",
        name: authorName(s),
        url: `https://productimpactpod.com/people/${s}`,
      })),
      publisher: {
        "@type": "Organization",
        name: "Product Impact",
        url: "https://productimpactpod.com",
        logo: { "@type": "ImageObject", url: "https://productimpactpod.com/logo.png", width: 600, height: 60 },
      },
      mainEntityOfPage: { "@type": "WebPage", "@id": `https://productimpactpod.com/news/${article.slug}` },
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);

    // BreadcrumbList JSON-LD
    const breadcrumbLd = {
      "@context": "https://schema.org", "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://productimpactpod.com/" },
        { "@type": "ListItem", position: 2, name: "News", item: "https://productimpactpod.com/news" },
        { "@type": "ListItem", position: 3, name: article.title, item: `https://productimpactpod.com/news/${article.slug}` },
      ],
    };
    const bcScript = document.createElement("script");
    bcScript.type = "application/ld+json";
    bcScript.textContent = JSON.stringify(breadcrumbLd);
    document.head.appendChild(bcScript);

    // FAQPage JSON-LD
    let faqScript: HTMLScriptElement | null = null;
    if (article.faqs?.length > 0) {
      const faqLd = {
        "@context": "https://schema.org", "@type": "FAQPage",
        mainEntity: article.faqs.map((f: any) => ({
          "@type": "Question", name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      };
      faqScript = document.createElement("script");
      faqScript.type = "application/ld+json";
      faqScript.textContent = JSON.stringify(faqLd);
      document.head.appendChild(faqScript);
    }

    // Canonical link
    const canonical = document.createElement("link");
    canonical.rel = "canonical";
    canonical.href = article.canonical_url || `https://productimpactpod.com/news/${article.slug}`;
    document.head.appendChild(canonical);

    // Robots meta
    const robotsMeta = document.createElement("meta");
    robotsMeta.name = "robots";
    robotsMeta.content = "max-image-preview:large";
    document.head.appendChild(robotsMeta);

    // OG tags
    const ogTags = [
      { property: "og:type", content: "article" },
      { property: "og:title", content: article.title },
      { property: "og:description", content: article.subtitle || article.meta_description },
      { property: "og:image", content: article.hero_image_url },
      { property: "og:url", content: `https://productimpactpod.com/news/${article.slug}` },
      { property: "article:published_time", content: article.publish_date },
      { property: "article:section", content: article.themes?.[0]?.replace(/-/g, " ") || "AI" },
      ...(article.themes || []).map((t: string) => ({ property: "article:tag", content: t.replace(/-/g, " ") })),
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: article.title },
      { name: "twitter:description", content: article.subtitle || article.meta_description },
      { name: "twitter:image", content: article.hero_image_url },
    ];
    const ogElements = ogTags.filter(t => t.content).map(t => {
      const meta = document.createElement("meta");
      if ("property" in t && t.property) meta.setAttribute("property", t.property);
      if ("name" in t && t.name) meta.name = t.name;
      meta.content = t.content;
      document.head.appendChild(meta);
      return meta;
    });

    return () => {
      document.head.removeChild(script);
      document.head.removeChild(bcScript);
      if (faqScript) document.head.removeChild(faqScript);
      document.head.removeChild(canonical);
      document.head.removeChild(robotsMeta);
      ogElements.forEach(el => { try { document.head.removeChild(el); } catch {} });
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

  // Group entities by type
  const entityGroups: Record<string, any[]> = {};
  (article.entities || []).forEach((ref: any) => {
    const entity = ref.entities;
    if (!entity) return;
    if (!entityGroups[entity.type]) entityGroups[entity.type] = [];
    entityGroups[entity.type].push(entity);
  });

  const shareUrl = `https://productimpactpod.com/news/${article.slug}`;

  return (
    <div>
      <HeadMeta content={{
        ...content,
        metaDescription: article.meta_description || content.metaDescription,
        ogTitle: article.title,
        ogDescription: article.subtitle || article.meta_description,
        ogImage: article.hero_image_url || content.ogImage,
      }} />
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
            <article className="flex-1 max-w-3xl">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6" aria-label="Breadcrumb">
                <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
                <ChevronRight className="w-3 h-3" />
                <Link to="/news" className="hover:text-foreground transition-colors">News</Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-foreground truncate max-w-[200px]">{article.title}</span>
              </nav>

              {/* Format + Theme badges */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${FORMAT_COLORS[article.format] || "bg-primary text-primary-foreground"}`}>
                  {FORMAT_LABELS[article.format] || article.format}
                </span>
                {(article.themes || []).map((t: string) => (
                  <Link key={t} to={`/themes/${t}`} className="px-3 py-1 rounded-full text-xs font-medium border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-all">
                    {t.replace(/-/g, " ")}
                  </Link>
                ))}
              </div>

              {/* H1 */}
              <h1 className="font-display font-black text-foreground leading-[1.1] tracking-tight mb-3"
                style={{ fontSize: "clamp(1.8rem, 4vw, 3.5rem)" }}>
                {article.title}
              </h1>
              {article.subtitle && (
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6 max-w-[680px]">{article.subtitle}</p>
              )}

              {/* Byline */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-8 pb-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <User className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      {authorNames.map((name: string, i: number) => (
                        <Link key={i} to={`/people/${article.author_slugs[i]}`} className="text-sm font-semibold text-foreground hover:text-primary transition-colors">
                          {name}
                        </Link>
                      ))}
                    </div>
                    {article.byline_role && <p className="text-xs text-muted-foreground">{article.byline_role}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <time dateTime={article.publish_date}>
                    {new Date(article.publish_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </time>
                  {article.read_time_minutes && <span>· {article.read_time_minutes} min read</span>}
                </div>
                <button onClick={() => navigator.clipboard?.writeText(shareUrl)}
                  className="ml-auto text-muted-foreground hover:text-foreground transition-colors p-2" title="Copy link">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* Hero image */}
              {article.hero_image_url && (
                <figure className="mb-8">
                  <img src={article.hero_image_url} alt={article.hero_image_alt || article.title}
                    className="w-full rounded-lg" style={{ aspectRatio: "1.91/1", objectFit: "cover" }} />
                  {article.hero_image_credit && (
                    <figcaption className="text-[13px] text-muted-foreground mt-2 italic">Photo: {article.hero_image_credit}</figcaption>
                  )}
                </figure>
              )}

              {/* Overview bullets */}
              {overviewBullets.length > 0 && (
                <div className="studio-card p-5 md:p-6 mb-8">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Overview</h2>
                  <ul className="space-y-3">
                    {overviewBullets.map((bullet: string, i: number) => (
                      <li key={i} className="flex gap-3 text-sm text-secondary-foreground leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Article body */}
              <div
                className="prose prose-invert prose-lg max-w-none mb-12
                  prose-headings:font-display prose-headings:font-bold prose-headings:text-foreground
                  prose-h2:text-[28px] prose-h2:md:text-[32px] prose-h2:mt-12 prose-h2:mb-4
                  prose-h3:text-[22px] prose-h3:md:text-[24px] prose-h3:mt-8
                  prose-p:text-secondary-foreground prose-p:leading-[1.7] prose-p:text-[16px] prose-p:md:text-[18px]
                  prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                  prose-blockquote:border-l-primary prose-blockquote:border-l-4 prose-blockquote:text-muted-foreground prose-blockquote:italic prose-blockquote:text-lg
                  prose-strong:text-foreground
                  prose-li:text-secondary-foreground
                  prose-img:rounded-lg prose-img:w-full"
                dangerouslySetInnerHTML={{ __html: article.content_html }}
              />

              {/* Discussed on the Podcast */}
              {article.primary_podcast_episode_guid && (
                <div className="studio-card p-6 md:p-8 mb-12 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent" />
                  <div className="relative">
                    <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Discussed on the Podcast</p>
                    <h3 className="font-display font-bold text-foreground text-lg mb-3">Listen to the full episode</h3>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                        <Play className="w-5 h-5 ml-0.5" />
                      </div>
                      <div className="flex gap-3 text-sm text-muted-foreground">
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
                  <h2 className="font-display font-bold text-foreground text-xl mb-6">Frequently Asked Questions</h2>
                  <div className="space-y-3">
                    {article.faqs.map((faq: any, i: number) => (
                      <details key={i} className="studio-card p-4 group">
                        <summary className="font-medium text-foreground cursor-pointer list-none flex items-center justify-between">
                          {faq.question}
                          <ChevronRight className="w-4 h-4 text-muted-foreground group-open:rotate-90 transition-transform flex-shrink-0 ml-2" />
                        </summary>
                        <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{faq.answer}</p>
                      </details>
                    ))}
                  </div>
                </div>
              )}

              {/* Related articles */}
              {related.length > 0 && (
                <div className="border-t border-border pt-8 mb-12">
                  <h2 className="font-display font-bold text-foreground text-xl mb-6">
                    Related articles <span className="text-sm font-normal text-muted-foreground">{related.length}</span>
                  </h2>
                  <div className="grid md:grid-cols-3 gap-4">
                    {related.map((a: any) => (
                      <Link key={a.id} to={`/news/${a.slug}`} className="studio-card overflow-hidden hover:border-foreground/20 transition-all group">
                        {a.hero_image_url && (
                          <div className="aspect-[16/9] overflow-hidden">
                            <img src={a.hero_image_url} alt={a.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform" loading="lazy" />
                          </div>
                        )}
                        <div className="p-3">
                          <h4 className="font-display font-semibold text-foreground text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">{a.title}</h4>
                          <p className="text-[11px] text-muted-foreground mt-1">
                            {new Date(a.publish_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Author bio card */}
              {authorNames.length > 0 && (
                <div className="border-t border-border pt-8 mb-12">
                  <div className="studio-card p-6 flex gap-5">
                    <div className="w-20 h-20 md:w-[120px] md:h-[120px] rounded-lg bg-muted flex-shrink-0 flex items-center justify-center">
                      <User className="w-8 h-8 text-muted-foreground/30" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-foreground text-lg">{authorNames[0]}</h3>
                      {article.byline_role && <p className="text-xs text-muted-foreground mb-2">{article.byline_role}</p>}
                      <Link to={`/people/${article.author_slugs[0]}`} className="text-sm text-primary hover:underline">
                        View all articles by {authorNames[0]} →
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Soft CTA */}
              <div className="text-sm text-muted-foreground mb-8 leading-relaxed">
                Hosted by Arpy Dragffy and Brittany Hobbs. Arpy runs{" "}
                <a href="https://ph1.ca?utm_source=productimpactpod&utm_medium=article" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">PH1 Research</a>,
                a product adoption research firm. Arpy also leads{" "}
                <a href="https://aivalueacceleration.com?utm_source=productimpactpod&utm_medium=article" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">AI Value Acceleration</a>,
                enterprise AI adoption consulting.
              </div>

              {/* Newsletter */}
              <div className="studio-card p-6 md:p-8 text-center mb-12">
                <h3 className="font-display font-bold text-foreground text-xl mb-2">Stay in the loop</h3>
                <p className="text-sm text-muted-foreground mb-4">Get AI product impact news delivered weekly.</p>
                <a href={content.subscribeUrl || content.substackUrl || "#"} target="_blank" rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:brightness-110 transition-all inline-block">
                  Subscribe
                </a>
              </div>

              <div className="pb-8">
                <Link to="/news" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
                  <ArrowLeft className="w-4 h-4" /> Back to News
                </Link>
              </div>
            </article>

            {/* ── Entity sidebar (desktop only) ── */}
            {Object.keys(entityGroups).length > 0 && (
              <aside className="hidden lg:block w-72 flex-shrink-0">
                <div className="sticky top-32 space-y-6">
                  {Object.entries(entityGroups).map(([type, entities]) => (
                    <div key={type}>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                        {TYPE_LABELS[type] || type} <span className="text-primary">{entities.length}</span>
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {entities.map((entity: any) => (
                          <Link key={entity.id} to={`/${TYPE_ROUTES[type] || "concepts"}/${entity.slug}`}
                            className="px-2.5 py-1 rounded-full text-xs font-medium border border-border text-muted-foreground hover:text-primary hover:border-primary transition-all">
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
          {Object.keys(entityGroups).length > 0 && (
            <div className="lg:hidden border-t border-border pt-8 pb-12 max-w-3xl">
              {Object.entries(entityGroups).map(([type, entities]) => (
                <div key={type} className="mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                    {TYPE_LABELS[type] || type} <span className="text-primary">{entities.length}</span>
                  </h4>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {entities.map((entity: any) => (
                      <Link key={entity.id} to={`/${TYPE_ROUTES[type] || "concepts"}/${entity.slug}`}
                        className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border border-border text-muted-foreground hover:text-primary hover:border-primary transition-all">
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
