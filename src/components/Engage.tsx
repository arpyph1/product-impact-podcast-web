import { CMSContent } from "@/types/cms";
import { Users, Star, MessageCircle, Rss } from "lucide-react";

interface EngageProps {
  content: CMSContent;
  isEditing: boolean;
  onUpdate: (key: keyof CMSContent, value: any) => void;
  onContactClick: () => void;
}

const platforms = [
  { name: "Spotify", icon: "🎵", color: "hsl(141 73% 42%)" },
  { name: "Apple Podcasts", icon: "🎙", color: "hsl(265 80% 60%)" },
  { name: "YouTube", icon: "▶", color: "hsl(0 72% 50%)" },
  { name: "RSS", icon: "📡", color: "hsl(43 96% 56%)" },
];

const stats = [
  { label: "Episodes", value: "120+", icon: <Rss className="w-5 h-5" /> },
  { label: "Listeners", value: "50K+", icon: <Users className="w-5 h-5" /> },
  { label: "Reviews", value: "4.9★", icon: <Star className="w-5 h-5" /> },
  { label: "Community", value: "8K+", icon: <MessageCircle className="w-5 h-5" /> },
];

export default function Engage({ content, isEditing, onUpdate, onContactClick }: EngageProps) {
  return (
    <section id="engage" className="py-24 bg-dark-surface relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative">
        <div className="section-divider mb-16" />

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {stats.map(s => (
            <div key={s.label} className="text-center p-6 rounded-xl bg-card border border-border neon-border">
              <div className="flex justify-center mb-2 text-primary">{s.icon}</div>
              <div className="font-display font-bold text-3xl text-foreground">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* CTA Block */}
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2
            className="font-display font-extrabold text-4xl lg:text-5xl text-foreground"
            data-cms-editable="engageTitle"
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={e => isEditing && onUpdate("engageTitle", e.currentTarget.textContent || "")}
          >
            {content.engageTitle}
          </h2>

          <p
            className="text-muted-foreground leading-relaxed max-w-lg mx-auto"
            data-cms-editable="engageDescription"
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={e => isEditing && onUpdate("engageDescription", e.currentTarget.textContent || "")}
          >
            {content.engageDescription}
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <button
              className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-lg hover:bg-primary/80 transition-all glow-purple"
              onClick={onContactClick}
            >
              <span
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={e => isEditing && onUpdate("engageCta", e.currentTarget.textContent || "")}
              >
                {content.engageCta}
              </span>
            </button>

            <button
              onClick={onContactClick}
              className="px-8 py-3 rounded-full border border-primary/50 text-primary font-semibold text-lg hover:bg-primary/10 transition-all"
            >
              Contact Us
            </button>
          </div>
        </div>

        {/* Platform links */}
        <div className="mt-16 flex flex-wrap justify-center gap-4">
          {platforms.map(p => (
            <div
              key={p.name}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-card border border-border hover:border-primary/50 cursor-pointer transition-all"
            >
              <span className="text-lg">{p.icon}</span>
              <span className="text-sm font-medium text-muted-foreground">{p.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
