import { CMSContent } from "@/types/cms";
import { ArrowRight, User } from "lucide-react";

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

function HostCard({
  name, bio, imageUrl, role, nameKey, bioKey, imageKey,
  isEditing, onUpdate,
}: {
  name: string; bio: string; imageUrl: string; role: string;
  nameKey: keyof CMSContent; bioKey: keyof CMSContent; imageKey: keyof CMSContent;
  isEditing: boolean; onUpdate: (k: keyof CMSContent, v: any) => void;
}) {
  return (
    <div className="space-y-2">
      <div className={`aspect-square rounded-xl overflow-hidden relative bg-dark-surface border border-border group`}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover mix-blend-luminosity opacity-90"
            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User className="w-12 h-12 opacity-20 text-foreground" />
          </div>
        )}

        {/* Edit image overlay */}
        {isEditing && (
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3">
            <p className="text-xs text-white/70">Photo URL:</p>
            <input
              className="w-full text-xs bg-black/80 border border-amber/50 text-white rounded px-2 py-1 focus:outline-none focus:border-amber"
              defaultValue={imageUrl}
              placeholder="https://..."
              onBlur={e => onUpdate(imageKey, e.target.value)}
            />
          </div>
        )}
      </div>

      <p
        className="font-display font-bold text-sm text-foreground line-clamp-1"
        contentEditable={isEditing}
        suppressContentEditableWarning
        onBlur={e => isEditing && onUpdate(nameKey, e.currentTarget.textContent || "")}
      >
        {name}
      </p>
      <p className="text-xs text-muted-foreground">{role}</p>
    </div>
  );
}

export default function About({ content, isEditing, onUpdate }: AboutProps) {
  return (
    <section id="about" className="py-6 px-4 bg-background">
      <div className="container mx-auto">
        {/* Reference: split panel — left=hosts, right=info */}
        <div className="rounded-2xl border border-border/50 overflow-hidden grid lg:grid-cols-2">

          {/* LEFT: Host cards */}
          <div className="bg-dark-surface p-8 border-b lg:border-b-0 lg:border-r border-border/50">
            <div className="grid grid-cols-2 gap-4">
              <HostCard
                name={content.host1Name} bio={content.host1Bio}
                imageUrl={content.host1ImageUrl} role={content.host1Role}
                nameKey="host1Name" bioKey="host1Bio" imageKey="host1ImageUrl"
                isEditing={isEditing} onUpdate={onUpdate}
              />
              <HostCard
                name={content.host2Name} bio={content.host2Bio}
                imageUrl={content.host2ImageUrl} role={content.host2Role}
                nameKey="host2Name" bioKey="host2Bio" imageKey="host2ImageUrl"
                isEditing={isEditing} onUpdate={onUpdate}
              />
            </div>

            {/* Editing hint */}
            {isEditing && (
              <p className="mt-4 text-xs text-amber/70 flex items-center gap-1">
                🖱 Hover host cards to update photo URLs
              </p>
            )}
          </div>

          {/* RIGHT: About info */}
          <div className="bg-background p-8 flex flex-col justify-center space-y-5">
            {/* Tags */}
            <div className="flex gap-2 flex-wrap">
              {content.tags.map((tag, idx) => (
                <span
                  key={tag}
                  className="text-xs font-bold px-3 py-1 rounded-full bg-amber text-black"
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={e => {
                    if (!isEditing) return;
                    const newTags = [...content.tags];
                    newTags[idx] = e.currentTarget.textContent || tag;
                    onUpdate("tags", newTags);
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <h2
              className="font-display font-extrabold text-3xl lg:text-4xl text-foreground leading-tight"
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={e => isEditing && onUpdate("aboutTitle", e.currentTarget.textContent || "")}
            >
              {content.aboutTitle}
            </h2>

            <p
              className="text-muted-foreground leading-relaxed text-sm"
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={e => isEditing && onUpdate("aboutDescription", e.currentTarget.textContent || "")}
            >
              {content.aboutDescription}
            </p>

            <a
              href="#episodes"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/80 transition-all glow-purple w-fit"
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
            <div className="p-4 rounded-xl bg-card border border-border neon-border">
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-3">Newsletter</p>
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
