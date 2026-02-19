import { useState } from "react";
import { CMSContent } from "@/types/cms";
import { User, ArrowUpRight } from "lucide-react";

interface AboutProps {
  content: CMSContent;
  isEditing: boolean;
  onUpdate: (key: keyof CMSContent, value: any) => void;
  episodes: { title: string; imageUrl: string; pubDate: string; duration: string }[];
}

const MAX_BIO = 250;

// Angled, rounded, filtered host image — like video cards in hero
function HostCard({
  name, bio, imageUrl, role,
  nameKey, bioKey, imageKey, roleKey,
  isEditing, onUpdate, index,
}: {
  name: string; bio: string; imageUrl: string; role: string;
  nameKey: keyof CMSContent; bioKey: keyof CMSContent;
  imageKey: keyof CMSContent; roleKey: keyof CMSContent;
  isEditing: boolean; onUpdate: (k: keyof CMSContent, v: any) => void;
  index: number;
}) {
  const [bioVal, setBioVal] = useState(bio);
  // Alternate rotation direction per host
  const rotation = index % 2 === 0 ? -2 : 2;

  return (
    <div className="border-t border-border pt-8">
      <div className="grid md:grid-cols-2 gap-10 items-start">
        {/* Photo — angled with filter overlay like hero video cards */}
        <div
          className="relative aspect-[4/5] max-w-xs group"
          style={{ transform: `rotate(${rotation}deg)`, transformOrigin: "center center" }}
        >
          <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
            {imageUrl ? (
              <>
                <img
                  src={imageUrl}
                  alt={name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
                {/* Same dark filter overlay as video cards */}
                <div className="absolute inset-0 bg-black/45 group-hover:bg-black/10 transition-all duration-500" />
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-card rounded-2xl border border-border">
                <User className="w-16 h-16 opacity-10 text-foreground" />
                {isEditing && (
                  <p className="text-xs text-muted-foreground px-4 text-center">Paste a photo URL below</p>
                )}
              </div>
            )}
            {/* Number badge */}
            <span className="absolute top-4 left-4 font-display font-extrabold text-5xl leading-none text-white/10 select-none">
              0{index + 1}
            </span>
          </div>

          {isEditing && (
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/80 rounded-b-2xl">
              <input
                className="w-full text-xs bg-transparent border-b border-amber/50 text-white focus:outline-none focus:border-amber pb-0.5"
                defaultValue={imageUrl}
                placeholder="Photo URL…"
                onBlur={e => onUpdate(imageKey, e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Text */}
        <div className="flex flex-col gap-4">
          <span
            className="text-xs font-semibold uppercase tracking-widest text-primary"
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={e => isEditing && onUpdate(roleKey, e.currentTarget.textContent || "")}
          >
            {role}
          </span>

          <h3
            className="font-display font-extrabold leading-none tracking-tight text-foreground"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={e => isEditing && onUpdate(nameKey, e.currentTarget.textContent || "")}
          >
            {name}
          </h3>

          {/* Bio — 250 char max, 50% larger body text */}
          <div className="space-y-1">
            {isEditing ? (
              <>
                <textarea
                  className="w-full bg-transparent border border-border rounded text-foreground text-lg leading-relaxed resize-none focus:outline-none focus:border-primary p-2"
                  rows={4}
                  maxLength={MAX_BIO}
                  value={bioVal}
                  onChange={e => setBioVal(e.target.value.slice(0, MAX_BIO))}
                  onBlur={() => onUpdate(bioKey, bioVal)}
                />
                <p className="text-xs text-muted-foreground text-right">{bioVal.length}/{MAX_BIO}</p>
              </>
            ) : (
              <p className="text-foreground/70 leading-relaxed max-w-sm" style={{ fontSize: "1.125rem" }}>
                {bio}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function About({ content, isEditing, onUpdate }: AboutProps) {
  return (
    <section id="about" className="bg-background">
      <div className="container mx-auto px-6">

        {/* Editorial "About Us" row — label left, big text right */}
        <div className="grid md:grid-cols-[200px_1fr] gap-12 py-16 border-b border-border items-start">
          <div className="pt-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground border border-border rounded-full px-3 py-1 inline-block">
              [About Us]
            </p>
          </div>
          <div>
            <h2
              className="font-display font-extrabold leading-[1.0] tracking-tight text-foreground mb-6"
              style={{ fontSize: "clamp(1.5rem, 3.5vw, 3rem)" }}
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={e => isEditing && onUpdate("aboutTitle", e.currentTarget.textContent || "")}
            >
              {content.aboutTitle}
            </h2>
            {/* Body text 50% larger than base (base ~1rem → 1.5rem) */}
            <p
              className="text-muted-foreground leading-relaxed max-w-2xl mb-8"
              style={{ fontSize: "1.5rem", lineHeight: "1.6" }}
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={e => isEditing && onUpdate("aboutDescription", e.currentTarget.textContent || "")}
            >
              {content.aboutDescription}
            </p>
            <div className="flex flex-wrap gap-2">
              {content.tags.map((tag, idx) => (
                <span
                  key={tag}
                  className="text-xs font-semibold px-3 py-1 rounded-full border border-border text-muted-foreground"
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
          </div>
        </div>

        {/* Hosts */}
        <div className="py-12">
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-widest mb-8">Your Hosts</p>
          <div className="flex flex-col gap-16">
            <HostCard
              name={content.host1Name} bio={content.host1Bio}
              imageUrl={content.host1ImageUrl} role={content.host1Role}
              nameKey="host1Name" bioKey="host1Bio"
              imageKey="host1ImageUrl" roleKey="host1Role"
              isEditing={isEditing} onUpdate={onUpdate} index={0}
            />
            <HostCard
              name={content.host2Name} bio={content.host2Bio}
              imageUrl={content.host2ImageUrl} role={content.host2Role}
              nameKey="host2Name" bioKey="host2Bio"
              imageKey="host2ImageUrl" roleKey="host2Role"
              isEditing={isEditing} onUpdate={onUpdate} index={1}
            />
          </div>

          {/* CTA */}
          <div className="mt-12 pt-8 border-t border-border">
            <a
              href="#episodes"
              className="inline-flex items-center gap-2 text-foreground font-semibold text-base hover:text-primary transition-colors agency-link"
            >
              <span
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={e => isEditing && onUpdate("aboutCta", e.currentTarget.textContent || "")}
              >
                {content.aboutCta}
              </span>
              <ArrowUpRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
      <div className="section-divider" />
    </section>
  );
}
