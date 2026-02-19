import { CMSContent } from "@/types/cms";
import { ArrowRight } from "lucide-react";

interface AboutProps {
  content: CMSContent;
  isEditing: boolean;
  onUpdate: (key: keyof CMSContent, value: any) => void;
  episodes: { title: string; imageUrl: string; pubDate: string; duration: string }[];
}

const bgColorMap: Record<string, string> = {
  coral:  "bg-coral/30",
  teal:   "bg-teal/30",
  amber:  "bg-amber/30",
  purple: "bg-primary/30",
};

const BG_OPTIONS = ["coral", "teal", "amber", "purple"];

export default function About({ content, isEditing, onUpdate, episodes }: AboutProps) {
  const hosts = episodes.slice(0, 4);

  return (
    <section id="about" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="section-divider mb-16" />

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Host cards */}
          <div>
            <div className="grid grid-cols-2 gap-4">
              {(hosts.length > 0 ? hosts : [null, null]).slice(0, 2).map((ep, i) => (
                <div key={i} className="space-y-2">
                  <div
                    className={`aspect-square rounded-xl overflow-hidden relative ${
                      bgColorMap[content.aboutCardBg] || bgColorMap.teal
                    }`}
                    data-cms-bg-editable="aboutCardBg"
                  >
                    {isEditing && i === 0 && (
                      <div className="absolute top-2 left-2 flex gap-1 z-10">
                        {BG_OPTIONS.map(c => (
                          <button
                            key={c}
                            onClick={() => onUpdate("aboutCardBg", c)}
                            className={`w-4 h-4 rounded-full border ${content.aboutCardBg === c ? "border-amber scale-125" : "border-white/40"}`}
                            style={{
                              background:
                                c === "coral" ? "hsl(5 80% 60%)" :
                                c === "teal"  ? "hsl(174 72% 48%)" :
                                c === "amber" ? "hsl(43 96% 56%)" :
                                "hsl(265 80% 60%)",
                            }}
                          />
                        ))}
                      </div>
                    )}
                    {ep?.imageUrl ? (
                      <img src={ep.imageUrl} alt={ep.title} className="w-full h-full object-cover mix-blend-luminosity opacity-90" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl opacity-30">🎙</div>
                    )}
                  </div>
                  <p className="font-display font-bold text-sm text-foreground line-clamp-2">
                    {ep?.title || "Podcast Host"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {ep?.pubDate || ""} {ep?.duration ? `· ${ep.duration}` : ""}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: About text */}
          <div className="space-y-6">
            {/* Tags */}
            <div className="flex gap-2 flex-wrap">
              {content.tags.map(tag => (
                <span
                  key={tag}
                  className="text-xs font-semibold px-3 py-1 rounded-full bg-amber text-accent-foreground"
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={e => {
                    if (!isEditing) return;
                    const newTags = content.tags.map((t, i) =>
                      content.tags.indexOf(tag) === i ? (e.currentTarget.textContent || t) : t
                    );
                    onUpdate("tags", newTags);
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <h2
              className="font-display font-extrabold text-4xl leading-tight text-foreground"
              data-cms-editable="aboutTitle"
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={e => isEditing && onUpdate("aboutTitle", e.currentTarget.textContent || "")}
            >
              {content.aboutTitle}
            </h2>

            <p
              className="text-muted-foreground leading-relaxed"
              data-cms-editable="aboutDescription"
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={e => isEditing && onUpdate("aboutDescription", e.currentTarget.textContent || "")}
            >
              {content.aboutDescription}
            </p>

            <a
              href="#episodes"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/80 transition-all glow-purple"
            >
              <span
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={e => isEditing && onUpdate("aboutCta", e.currentTarget.textContent || "")}
              >
                {content.aboutCta}
              </span>
              <ArrowRight className="w-4 h-4" />
            </a>

            {/* Newsletter box */}
            <div className="mt-6 p-5 rounded-xl bg-card border border-border neon-border">
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-3">
                Newsletter
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
                />
                <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/80 transition-all">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
