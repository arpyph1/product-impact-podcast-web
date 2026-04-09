import { useState, useEffect } from "react";
import { useCMS } from "@/hooks/useCMS";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeadMeta from "@/components/HeadMeta";
import ContactModal from "@/components/ContactModal";
import { ArrowUpRight, Loader2 } from "lucide-react";

interface Sponsor {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  logo_url: string | null;
  website_url: string | null;
  cta_text: string | null;
  tier: string | null;
}

export default function Partnerships() {
  const { content, update, isEditing, setIsEditing } = useCMS();
  const { user, canEdit, signInWithGoogle, signOut } = useAuth();
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sponsors-api`, {
      headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
    })
      .then(r => r.json())
      .then(result => { setSponsors(result.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <HeadMeta content={content} />
      <Navbar
        content={content} isEditing={isEditing}
        onToggleEdit={() => { if (!user) { signInWithGoogle(); return; } if (canEdit) setIsEditing(v => !v); }}
        onContactClick={() => setContactOpen(true)} onUpdate={update} canEdit={canEdit} user={user}
        onSignIn={signInWithGoogle} onSignOut={signOut}
      />

      <main className="min-h-screen bg-background pt-32">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="pb-8 border-b border-border mb-12">
            <h1 className="font-display font-black text-foreground uppercase tracking-tight"
              style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>
              Partnerships
            </h1>
            <p className="text-muted-foreground mt-2 text-lg max-w-2xl">
              Partner with Product Impact to reach thousands of engaged product leaders, AI strategists, and technology decision-makers every week.
            </p>
          </div>

          {/* What we offer */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {[
              { title: "Episode Sponsorship", desc: "Your brand featured in our podcast episodes, reaching dedicated listeners who trust our editorial voice." },
              { title: "Newsletter Placement", desc: "Reach our growing subscriber base through curated placements in the Product Impact Newsletter." },
              { title: "Theme Sponsorship", desc: "Own a topic area — your brand associated with one of our 8 canonical themes across all content." },
              { title: "Product Spotlight", desc: "In-depth coverage of your AI product with editorial analysis, user perspective, and audience exposure." },
            ].map((item, i) => (
              <div key={i} className="studio-card p-6">
                <h3 className="font-display font-bold text-foreground text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Current Partners */}
          <div className="mb-16">
            <h2 className="font-display font-bold text-foreground text-2xl mb-8">Current Partners</h2>
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              </div>
            ) : sponsors.length === 0 ? (
              <div className="studio-card p-8 text-center">
                <p className="text-muted-foreground mb-4">Partners will be displayed here once configured.</p>
                <p className="text-sm text-muted-foreground">Add sponsors via the CMS or API.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {sponsors.map(sponsor => (
                  <div key={sponsor.id} className="studio-card p-6 flex flex-col">
                    <div className="flex items-start gap-4 mb-3">
                      {sponsor.logo_url && (
                        <img src={sponsor.logo_url} alt={sponsor.name} className="w-12 h-12 object-contain rounded" />
                      )}
                      <div>
                        <h3 className="font-display font-bold text-foreground">{sponsor.name}</h3>
                        {sponsor.tagline && <p className="text-xs text-muted-foreground">{sponsor.tagline}</p>}
                      </div>
                    </div>
                    {sponsor.description && <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{sponsor.description}</p>}
                    {sponsor.website_url && (
                      <a href={sponsor.website_url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                        {sponsor.cta_text || "Visit website"} <ArrowUpRight className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="studio-card p-8 text-center mb-16">
            <h2 className="font-display font-bold text-foreground text-2xl mb-3">Interested in partnering?</h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Reach our audience of product leaders, AI strategists, and technology executives.
            </p>
            <button
              onClick={() => setContactOpen(true)}
              className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:brightness-110 transition-all"
            >
              Get In Touch
            </button>
          </div>
        </div>
      </main>

      <Footer content={content} isEditing={isEditing} onUpdate={update} onContactClick={() => setContactOpen(true)} canEdit={canEdit} user={user} onSignIn={signInWithGoogle} onSignOut={signOut} />
      {contactOpen && <ContactModal content={content} isEditing={isEditing} onUpdate={update} onClose={() => setContactOpen(false)} defaultInquiryType="Sponsorship" />}
    </div>
  );
}
