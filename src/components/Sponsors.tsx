import { CMSContent } from "@/types/cms";
import { ArrowUpRight, Plus } from "lucide-react";

interface SponsorsProps {
  content: CMSContent;
  isEditing: boolean;
  onUpdate: (key: keyof CMSContent, value: any) => void;
}

export interface Sponsor {
  id: string;
  name: string;
  tagline: string;
  url: string;
  logoUrl: string;
}

const DEFAULT_SPONSORS: Sponsor[] = [
  { id: "1", name: "Sponsor Name", tagline: "Your company tagline goes here", url: "#", logoUrl: "" },
  { id: "2", name: "Partner Co.", tagline: "Supporting great conversations", url: "#", logoUrl: "" },
  { id: "3", name: "Brand Inc.", tagline: "Powering the future of product", url: "#", logoUrl: "" },
];

export default function Sponsors({ content, isEditing, onUpdate }: SponsorsProps) {
  // In edit mode show defaults so user can fill them in; in display mode only show filled sponsors
  const allSponsors: Sponsor[] = content.sponsors?.length ? content.sponsors : (isEditing ? DEFAULT_SPONSORS : []);
  const sponsors = isEditing
    ? allSponsors
    : allSponsors.filter(s => s.name && s.name !== "Sponsor Name" && s.name !== "Partner Co." && s.name !== "Brand Inc." && s.name !== "New Sponsor" && (s.url !== "#" || s.logoUrl || s.tagline !== "Your company tagline goes here"));

  const updateSponsor = (id: string, field: keyof Sponsor, value: string) => {
    const updated = sponsors.map(s => s.id === id ? { ...s, [field]: value } : s);
    onUpdate("sponsors", updated);
  };

  const addSponsor = () => {
    const newSponsor: Sponsor = {
      id: Date.now().toString(),
      name: "New Sponsor",
      tagline: "Sponsor tagline",
      url: "#",
      logoUrl: "",
    };
    onUpdate("sponsors", [...sponsors, newSponsor]);
  };

  const removeSponsor = (id: string) => {
    onUpdate("sponsors", sponsors.filter(s => s.id !== id));
  };

  return (
    <section id="sponsors" className="bg-background">
      <div className="container mx-auto px-6">
        <div className="py-16 border-b border-border">

          {/* Header */}
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2
                className="font-display font-extrabold uppercase leading-none tracking-tight text-foreground"
                style={{ fontSize: content.h2FontSize || "clamp(1.5rem, 3.5vw, 2.8rem)", fontWeight: content.h2FontWeight || "800", letterSpacing: "-0.02em" }}
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={e => isEditing && onUpdate("sponsorsTitle", e.currentTarget.textContent || "")}
              >
                {content.sponsorsTitle || "Our Sponsors"}
              </h2>
            </div>
            {isEditing && (
              <button
                onClick={addSponsor}
                className="flex items-center gap-1.5 text-xs text-primary border border-primary/40 rounded px-3 py-1.5 hover:bg-primary/10 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Sponsor
              </button>
            )}
          </div>

          {/* Sponsor grid — columns adapt to number of sponsors */}
          {sponsors.length > 0 && (
          <div className={`grid gap-px bg-border ${sponsors.length === 1 ? "grid-cols-1 max-w-md" : sponsors.length === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-3"}`}>
            {sponsors.map(sponsor => (
              <div key={sponsor.id} className="bg-background group relative">
                {isEditing ? (
                  /* Edit mode */
                  <div className="p-6 space-y-3 border border-amber/30 bg-amber/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-amber font-semibold uppercase tracking-wider">Editing</span>
                      <button
                        onClick={() => removeSponsor(sponsor.id)}
                        className="text-xs text-coral hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">Name</label>
                      <input
                        className="w-full bg-muted border border-border rounded px-2 py-1.5 text-sm text-foreground focus:outline-none focus:border-primary"
                        defaultValue={sponsor.name}
                        onBlur={e => updateSponsor(sponsor.id, "name", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">Tagline</label>
                      <input
                        className="w-full bg-muted border border-border rounded px-2 py-1.5 text-sm text-foreground focus:outline-none focus:border-primary"
                        defaultValue={sponsor.tagline}
                        onBlur={e => updateSponsor(sponsor.id, "tagline", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">Website URL</label>
                      <input
                        className="w-full bg-muted border border-border rounded px-2 py-1.5 text-sm text-foreground focus:outline-none focus:border-primary"
                        defaultValue={sponsor.url}
                        onBlur={e => updateSponsor(sponsor.id, "url", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">Logo URL</label>
                      <input
                        className="w-full bg-muted border border-border rounded px-2 py-1.5 text-sm text-foreground focus:outline-none focus:border-primary"
                        defaultValue={sponsor.logoUrl}
                        placeholder="https://..."
                        onBlur={e => updateSponsor(sponsor.id, "logoUrl", e.target.value)}
                      />
                    </div>
                  </div>
                ) : (
                  /* Display mode */
                  <a
                    href={sponsor.url !== "#" ? sponsor.url : undefined}
                    target={sponsor.url !== "#" ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="flex flex-col justify-between p-8 h-full min-h-[180px] hover:bg-card transition-colors"
                  >
                    {/* Logo or placeholder */}
                    <div className="mb-6">
                      {sponsor.logoUrl ? (
                        <img
                          src={sponsor.logoUrl}
                          alt={sponsor.name}
                          className="h-10 object-contain opacity-70 group-hover:opacity-100 transition-opacity filter brightness-0 invert"
                        />
                      ) : (
                        <div className="h-10 flex items-center">
                          <span className="font-display font-extrabold text-xl text-foreground/40 group-hover:text-foreground/70 tracking-tight transition-colors uppercase">
                            {sponsor.name}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-end justify-between gap-4">
                      <p className="text-sm text-muted-foreground leading-snug max-w-[200px]">
                        {sponsor.tagline}
                      </p>
                      <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                    </div>
                  </a>
                )}
              </div>
            ))}
          </div>
          )}

          {/* Become a sponsor CTA */}
          <div className="mt-8 flex items-center justify-between py-6 px-8 rounded-xl border border-border bg-card">
            <div>
              <p className="font-display font-bold text-foreground text-lg">Interested in sponsoring?</p>
              <p className="text-muted-foreground text-sm mt-0.5">Reach thousands of engaged product leaders every week.</p>
            </div>
            <a
              href={`mailto:${content.contactEmail}?subject=${encodeURIComponent("Sponsorship Inquiry")}`}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:brightness-110 transition-all shrink-0"
            >
              Get in Touch <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
      <div className="section-divider" />
    </section>
  );
}
