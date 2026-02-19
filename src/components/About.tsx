import { CMSContent } from "@/types/cms";
import { ArrowRight, User } from "lucide-react";

interface AboutProps {
  content: CMSContent;
  isEditing: boolean;
  onUpdate: (key: keyof CMSContent, value: any) => void;
  episodes: { title: string; imageUrl: string; pubDate: string; duration: string }[];
}

function HostCard({
  name, bio, imageUrl, role, nameKey, bioKey, roleKey, imageKey,
  isEditing, onUpdate, content,
}: {
  name: string; bio: string; imageUrl: string; role: string;
  nameKey: keyof CMSContent; bioKey: keyof CMSContent;
  roleKey: keyof CMSContent; imageKey: keyof CMSContent;
  isEditing: boolean; onUpdate: (k: keyof CMSContent, v: any) => void;
  content: CMSContent;
}) {
  return (
    <div className="flex flex-col gap-5">
      {/* Photo */}
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-dark-surface border border-border group">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User className="w-20 h-20 opacity-20 text-foreground" />
          </div>
        )}
        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Edit image URL overlay */}
        {isEditing && (
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4">
            <p className="text-xs text-white/70">Image URL:</p>
            <input
              className="w-full text-xs bg-black/80 border border-amber/50 text-white rounded px-2 py-1 focus:outline-none focus:border-amber"
              defaultValue={imageUrl}
              placeholder="https://..."
              onBlur={e => onUpdate(imageKey, e.target.value)}
            />
          </div>
        )}

        <div className="absolute bottom-3 left-3 right-3">
          <span className="text-xs font-semibold text-primary uppercase tracking-widest">{role}</span>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-2">
        <h3
          className="font-display font-extrabold text-2xl text-foreground"
          contentEditable={isEditing}
          suppressContentEditableWarning
          onBlur={e => isEditing && onUpdate(nameKey, e.currentTarget.textContent || "")}
        >
          {name}
        </h3>
        <p
          className="text-muted-foreground text-sm leading-relaxed"
          contentEditable={isEditing}
          suppressContentEditableWarning
          onBlur={e => isEditing && onUpdate(bioKey, e.currentTarget.textContent || "")}
        >
          {bio}
        </p>
      </div>
    </div>
  );
}

export default function About({ content, isEditing, onUpdate }: AboutProps) {
  return (
    <section id="about" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="section-divider mb-16" />

        {/* Section header */}
        <div className="mb-14 flex flex-col md:flex-row md:items-end gap-6 justify-between">
          <div className="space-y-3">
            <div className="flex gap-2 flex-wrap">
              {content.tags.map(tag => (
                <span
                  key={tag}
                  className="text-xs font-semibold px-3 py-1 rounded-full bg-amber text-black"
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
              className="font-display font-extrabold text-4xl lg:text-5xl text-foreground leading-tight"
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={e => isEditing && onUpdate("aboutTitle", e.currentTarget.textContent || "")}
            >
              {content.aboutTitle}
            </h2>

            <p
              className="text-muted-foreground leading-relaxed max-w-lg"
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={e => isEditing && onUpdate("aboutDescription", e.currentTarget.textContent || "")}
            >
              {content.aboutDescription}
            </p>
          </div>

          <a
            href="#episodes"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/80 transition-all glow-purple shrink-0"
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
        </div>

        {/* Hosts grid */}
        <div className="grid md:grid-cols-2 gap-10 max-w-3xl">
          <HostCard
            name={content.host1Name}
            bio={content.host1Bio}
            imageUrl={content.host1ImageUrl}
            role={content.host1Role}
            nameKey="host1Name" bioKey="host1Bio"
            roleKey="host1Role" imageKey="host1ImageUrl"
            isEditing={isEditing} onUpdate={onUpdate} content={content}
          />
          <HostCard
            name={content.host2Name}
            bio={content.host2Bio}
            imageUrl={content.host2ImageUrl}
            role={content.host2Role}
            nameKey="host2Name" bioKey="host2Bio"
            roleKey="host2Role" imageKey="host2ImageUrl"
            isEditing={isEditing} onUpdate={onUpdate} content={content}
          />
        </div>
      </div>
    </section>
  );
}
