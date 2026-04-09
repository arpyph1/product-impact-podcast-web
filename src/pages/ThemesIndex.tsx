// Themes grid index — /themes
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCMS } from "@/hooks/useCMS";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeadMeta from "@/components/HeadMeta";
import { Loader2 } from "lucide-react";

interface ThemeItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  article_count: number;
  theme_color: string | null;
  icon: string | null;
}

export default function ThemesIndex() {
  const { content, update, isEditing, setIsEditing } = useCMS();
  const { user, canEdit, signInWithGoogle, signOut } = useAuth();
  const [themes, setThemes] = useState<ThemeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/themes-api`, {
      headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
    })
      .then(r => r.json())
      .then(result => { setThemes(result.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

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
          <div className="pb-8 border-b border-border mb-8">
            <h1 className="font-display font-black text-foreground uppercase tracking-tight"
              style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>
              Themes
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Eight canonical themes that define how AI products are transforming work and industries.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              {themes.map(theme => (
                <Link key={theme.id} to={`/themes/${theme.slug}`}
                  className="studio-card p-6 hover:border-foreground/20 transition-all group flex flex-col">
                  <h2 className="font-display font-bold text-foreground text-lg mb-2 group-hover:text-primary transition-colors">
                    {theme.name}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-3">
                    {theme.description}
                  </p>
                  {theme.article_count > 0 && (
                    <span className="text-xs text-primary font-medium">
                      {theme.article_count} article{theme.article_count !== 1 ? "s" : ""}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}

          <div className="py-8" />
        </div>
      </main>

      <Footer content={content} isEditing={isEditing} onUpdate={update} onContactClick={() => {}} canEdit={canEdit} user={user} onSignIn={signInWithGoogle} onSignOut={signOut} />
    </div>
  );
}
