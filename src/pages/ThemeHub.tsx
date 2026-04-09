// Theme hub page — /themes/:slug
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCMS } from "@/hooks/useCMS";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeadMeta from "@/components/HeadMeta";
import { Loader2, ChevronRight, ArrowLeft } from "lucide-react";

const FORMAT_LABELS: Record<string, string> = {
  "news-brief": "News", "news-analysis": "Analysis", "release-note": "Release",
  "feature": "Feature", "interview": "Interview", "case-study": "Case Study",
  "opinion": "Opinion", "explainer": "Explainer",
};

export default function ThemeHub() {
  const { slug } = useParams<{ slug: string }>();
  const { content, update, isEditing, setIsEditing } = useCMS();
  const { user, canEdit, signInWithGoogle, signOut } = useAuth();
  const [theme, setTheme] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/themes-api?slug=${encodeURIComponent(slug)}`, {
      headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
    })
      .then(r => r.json())
      .then(result => { setTheme(result.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>;
  }

  if (!theme) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Theme not found.</p>
        <Link to="/themes" className="text-primary hover:underline">← Back to Themes</Link>
      </div>
    );
  }

  const TYPE_ROUTES: Record<string, string> = {
    concept: "concepts", person: "people", organization: "organizations",
    product: "products", framework: "frameworks", source: "sources",
  };

  return (
    <div>
      <HeadMeta content={{ ...content, metaDescription: theme.meta_description || theme.description || content.metaDescription, ogTitle: theme.name }} />
      <Navbar
        content={content} isEditing={isEditing}
        onToggleEdit={() => { if (!user) { signInWithGoogle(); return; } if (canEdit) setIsEditing(v => !v); }}
        onContactClick={() => {}} onUpdate={update} canEdit={canEdit} user={user}
        onSignIn={signInWithGoogle} onSignOut={signOut}
      />

      <main className="min-h-screen bg-background pt-32">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/themes" className="hover:text-foreground transition-colors">Themes</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground">{theme.name}</span>
          </nav>

          <h1 className="font-display font-black text-foreground leading-tight mb-4"
            style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}>
            {theme.name}
          </h1>
          <p className="text-lg text-muted-foreground mb-8">{theme.description}</p>

          {/* Long-form intro */}
          {theme.long_form_intro && (
            <div className="prose prose-invert prose-lg max-w-none mb-12 pb-8 border-b border-border
              prose-headings:font-display prose-headings:font-bold prose-headings:text-foreground
              prose-p:text-secondary-foreground prose-a:text-primary"
              dangerouslySetInnerHTML={{ __html: theme.long_form_intro }}
            />
          )}

          {/* Related entities */}
          {theme.entities && theme.entities.length > 0 && (
            <div className="mb-12">
              <h2 className="font-display font-bold text-foreground text-xl mb-6">Key Concepts & Entities</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {theme.entities.map((entity: any) => (
                  <Link key={entity.id} to={`/${TYPE_ROUTES[entity.type] || "concepts"}/${entity.slug}`}
                    className="studio-card p-4 hover:border-foreground/20 transition-all group">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary">{entity.type}</span>
                    <h3 className="font-display font-bold text-foreground text-sm mt-1 group-hover:text-primary transition-colors">{entity.name}</h3>
                    {entity.description && <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2">{entity.description}</p>}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Articles */}
          {theme.articles && theme.articles.length > 0 && (
            <div className="mb-12">
              <h2 className="font-display font-bold text-foreground text-xl mb-6">Articles</h2>
              <div className="space-y-3">
                {theme.articles.map((a: any) => (
                  <Link key={a.id} to={`/news/${a.slug}`} className="block studio-card p-4 hover:border-foreground/20 transition-all group">
                    <div className="flex items-start gap-4">
                      {a.hero_image_url && (
                        <img src={a.hero_image_url} alt={a.title} className="w-20 h-14 object-cover rounded flex-shrink-0" loading="lazy" />
                      )}
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                          {FORMAT_LABELS[a.format] || a.format}
                        </span>
                        <h3 className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">{a.title}</h3>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(a.publish_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="pb-12">
            <Link to="/themes" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
              <ArrowLeft className="w-4 h-4" /> All Themes
            </Link>
          </div>
        </div>
      </main>

      <Footer content={content} isEditing={isEditing} onUpdate={update} onContactClick={() => {}} canEdit={canEdit} user={user} onSignIn={signInWithGoogle} onSignOut={signOut} />
    </div>
  );
}
