import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCMS } from "@/hooks/useCMS";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeadMeta from "@/components/HeadMeta";
import { Loader2, ChevronRight, ArrowLeft, ExternalLink } from "lucide-react";

const TYPE_LABELS: Record<string, string> = {
  concept: "Concept",
  person: "Person",
  organization: "Organization",
  product: "Product",
  framework: "Framework",
  source: "Source",
};

const TYPE_PLURAL: Record<string, string> = {
  concept: "Concepts",
  person: "People",
  organization: "Organizations",
  product: "Products",
  framework: "Frameworks",
  source: "Sources",
};

const TYPE_ROUTES: Record<string, string> = {
  concept: "concepts",
  person: "people",
  organization: "organizations",
  product: "products",
  framework: "frameworks",
  source: "sources",
};

export default function EntityPage({ entityType }: { entityType: string }) {
  const { slug } = useParams<{ slug: string }>();
  const { content, update, isEditing, setIsEditing } = useCMS();
  const { user, canEdit, signInWithGoogle, signOut } = useAuth();
  const [entity, setEntity] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/entities?type=${entityType}&slug=${encodeURIComponent(slug)}`;
    fetch(url, { headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY } })
      .then(r => r.json())
      .then(result => { setEntity(result.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug, entityType]);

  // Inject JSON-LD
  useEffect(() => {
    if (!entity) return;
    const jsonLd = entity.schema_jsonld || {
      "@context": "https://schema.org",
      "@type": entityType === "concept" ? "DefinedTerm" : entityType === "person" ? "Person" : entityType === "organization" ? "Organization" : "Thing",
      name: entity.name,
      description: entity.description,
      url: `https://productimpactpod.com/${TYPE_ROUTES[entityType]}/${entity.slug}`,
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, [entity, entityType]);

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>;
  }

  if (!entity) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">{TYPE_LABELS[entityType] || "Entity"} not found.</p>
        <Link to="/" className="text-primary hover:underline">← Home</Link>
      </div>
    );
  }

  const externalLinks = Array.isArray(entity.external_links) ? entity.external_links : [];

  return (
    <div>
      <HeadMeta content={{ ...content, metaDescription: entity.description || content.metaDescription, ogTitle: entity.name }} />
      <Navbar
        content={content} isEditing={isEditing}
        onToggleEdit={() => { if (!user) { signInWithGoogle(); return; } if (canEdit) setIsEditing(v => !v); }}
        onContactClick={() => {}} onUpdate={update} canEdit={canEdit} user={user}
        onSignIn={signInWithGoogle} onSignOut={signOut}
      />

      <main className="min-h-screen bg-background pt-32">
        <div className="container mx-auto px-6 max-w-3xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span>{TYPE_PLURAL[entityType]}</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground">{entity.name}</span>
          </nav>

          <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">
            {TYPE_LABELS[entityType]}
          </span>

          <h1 className="font-display font-black text-foreground leading-tight mb-4"
            style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}>
            {entity.name}
          </h1>

          {entity.aliases && entity.aliases.length > 0 && (
            <p className="text-sm text-muted-foreground mb-4">
              Also known as: {entity.aliases.join(", ")}
            </p>
          )}

          {entity.description && (
            <p className="text-lg text-secondary-foreground leading-relaxed mb-8 pb-8 border-b border-border">
              {entity.description}
            </p>
          )}

          {entity.long_form && (
            <div
              className="prose prose-invert prose-lg max-w-none mb-12
                prose-headings:font-display prose-headings:font-bold prose-headings:text-foreground
                prose-p:text-secondary-foreground prose-a:text-primary"
              dangerouslySetInnerHTML={{ __html: entity.long_form }}
            />
          )}

          {/* External links */}
          {externalLinks.length > 0 && (
            <div className="mb-12">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">External Links</h3>
              <div className="flex flex-wrap gap-2">
                {externalLinks.map((link: any, i: number) => (
                  <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-all">
                    {link.label || link.url} <ExternalLink className="w-3 h-3" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Related articles */}
          {entity.articles && entity.articles.length > 0 && (
            <div className="border-t border-border pt-8 mb-12">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Mentioned In</h3>
              <div className="space-y-3">
                {entity.articles.map((ref: any) => {
                  const a = ref.articles;
                  if (!a) return null;
                  return (
                    <Link key={a.id} to={`/news/${a.slug}`} className="block studio-card p-4 hover:border-foreground/20 transition-all">
                      <h4 className="font-medium text-foreground text-sm">{a.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <span>{a.format}</span>
                        {a.publish_date && <span>{new Date(a.publish_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          <div className="pb-12">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
              <ArrowLeft className="w-4 h-4" /> Home
            </Link>
          </div>
        </div>
      </main>

      <Footer content={content} isEditing={isEditing} onUpdate={update} onContactClick={() => {}} canEdit={canEdit} user={user} onSignIn={signInWithGoogle} onSignOut={signOut} />
    </div>
  );
}
