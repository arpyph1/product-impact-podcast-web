import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCMS } from "@/hooks/useCMS";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeadMeta from "@/components/HeadMeta";
import { Loader2, ArrowLeft, ChevronRight } from "lucide-react";

const FORMAT_LABELS: Record<string, string> = {
  "news-brief": "News Brief", "news-analysis": "News Analysis", "release-note": "Release",
  "feature": "Feature", "interview": "Interview", "case-study": "Case Study",
  "opinion": "Opinion", "explainer": "Explainer", "product-review": "Product Review",
  "research-brief": "Research Brief",
};

export default function Article() {
  const { slug } = useParams<{ slug: string }>();
  const { content, update, isEditing, setIsEditing } = useCMS();
  const { user, canEdit, signInWithGoogle, signOut } = useAuth();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/articles?slug=${encodeURIComponent(slug)}`;
    fetch(url, { headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY } })
      .then(r => r.json())
      .then(result => { setArticle(result.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);

  // Inject JSON-LD
  useEffect(() => {
    if (!article) return;
    const jsonLd = article.schema_jsonld || {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      headline: article.title,
      description: article.meta_description,
      datePublished: article.publish_date,
      dateModified: article.last_updated || article.publish_date,
      image: article.hero_image_url,
      author: (article.author_slugs || []).map((s: string) => ({
        "@type": "Person",
        name: s.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
        url: `https://productimpactpod.com/people/${s}`,
      })),
      publisher: {
        "@type": "Organization",
        name: "Product Impact Podcast",
        url: "https://productimpactpod.com",
      },
      mainEntityOfPage: `https://productimpactpod.com/news/${article.slug}`,
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, [article]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Article not found.</p>
        <Link to="/news" className="text-primary hover:underline">← Back to News</Link>
      </div>
    );
  }

  const authorNames = (article.author_slugs || []).map((s: string) =>
    s.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())
  );

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

      <main className="min-h-screen bg-background pt-32">
        <article className="container mx-auto px-6 max-w-3xl">
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
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/20 text-primary">
              {FORMAT_LABELS[article.format] || article.format}
            </span>
            {(article.themes || []).map((t: string) => (
              <Link key={t} to={`/themes/${t}`} className="px-3 py-1 rounded-full text-xs font-medium border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-all">
                {t.replace(/-/g, " ")}
              </Link>
            ))}
          </div>

          {/* Title */}
          <h1 className="font-display font-black text-foreground leading-tight mb-3"
            style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}>
            {article.title}
          </h1>
          {article.subtitle && (
            <p className="text-xl text-muted-foreground leading-relaxed mb-6">{article.subtitle}</p>
          )}

          {/* Author byline */}
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border">
            <div>
              <div className="flex items-center gap-2">
                {authorNames.map((name: string, i: number) => (
                  <Link key={i} to={`/people/${article.author_slugs[i]}`} className="text-sm font-semibold text-foreground hover:text-primary transition-colors">
                    {name}
                  </Link>
                ))}
              </div>
              {article.byline_role && <p className="text-xs text-muted-foreground mt-0.5">{article.byline_role}</p>}
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                <time dateTime={article.publish_date}>
                  {new Date(article.publish_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </time>
                {article.read_time_minutes && <span>{article.read_time_minutes} min read</span>}
                {article.word_count && <span>{article.word_count.toLocaleString()} words</span>}
              </div>
            </div>
          </div>

          {/* Hero image */}
          {article.hero_image_url && (
            <figure className="mb-8">
              <img src={article.hero_image_url} alt={article.hero_image_alt || article.title} className="w-full rounded-lg" />
              {article.hero_image_credit && (
                <figcaption className="text-xs text-muted-foreground mt-2 text-center">{article.hero_image_credit}</figcaption>
              )}
            </figure>
          )}

          {/* Article body */}
          <div
            className="prose prose-invert prose-lg max-w-none mb-12
              prose-headings:font-display prose-headings:font-bold prose-headings:text-foreground
              prose-p:text-secondary-foreground prose-p:leading-relaxed
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground
              prose-strong:text-foreground
              prose-li:text-secondary-foreground"
            dangerouslySetInnerHTML={{ __html: article.content_html }}
          />

          {/* FAQs */}
          {article.faqs && article.faqs.length > 0 && (
            <div className="border-t border-border pt-8 mb-12">
              <h2 className="font-display font-bold text-foreground text-xl mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {article.faqs.map((faq: any, i: number) => (
                  <details key={i} className="studio-card p-4 group">
                    <summary className="font-medium text-foreground cursor-pointer list-none flex items-center justify-between">
                      {faq.question}
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-open:rotate-90 transition-transform" />
                    </summary>
                    <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          )}

          {/* Entity references */}
          {article.entities && article.entities.length > 0 && (
            <div className="border-t border-border pt-8 mb-12">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Referenced In This Article</h3>
              <div className="flex flex-wrap gap-2">
                {article.entities.map((ref: any) => {
                  const entity = ref.entities;
                  if (!entity) return null;
                  const typeRoute = entity.type === "person" ? "people" : entity.type === "concept" ? "concepts" : entity.type === "organization" ? "organizations" : entity.type === "framework" ? "frameworks" : entity.type === "source" ? "sources" : "products";
                  return (
                    <Link
                      key={entity.id}
                      to={`/${typeRoute}/${entity.slug}`}
                      className="px-3 py-1.5 rounded-full text-xs font-medium border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-all"
                    >
                      {entity.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          <div className="pb-12">
            <Link to="/news" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
              <ArrowLeft className="w-4 h-4" /> Back to News
            </Link>
          </div>
        </article>
      </main>

      <Footer content={content} isEditing={isEditing} onUpdate={update} onContactClick={() => {}} canEdit={canEdit} user={user} onSignIn={signInWithGoogle} onSignOut={signOut} />
    </div>
  );
}
