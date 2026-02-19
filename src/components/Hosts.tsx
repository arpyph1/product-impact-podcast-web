import { useState } from "react";
import { CMSContent } from "@/types/cms";
import { User, Linkedin } from "lucide-react";

interface HostsProps {
  content: CMSContent;
  isEditing: boolean;
  onUpdate: (key: keyof CMSContent, value: any) => void;
}

const MAX_BIO = 400;

interface HostCardProps {
  name: string;
  bio: string;
  imageUrl: string;
  role: string;
  linkedinUrl: string;
  nameKey: keyof CMSContent;
  bioKey: keyof CMSContent;
  imageKey: keyof CMSContent;
  roleKey: keyof CMSContent;
  linkedinKey: keyof CMSContent;
  isEditing: boolean;
  onUpdate: (k: keyof CMSContent, v: any) => void;
}

function HostCard({ name, bio, imageUrl, role, linkedinUrl, nameKey, bioKey, imageKey, roleKey, linkedinKey, isEditing, onUpdate }: HostCardProps) {
  const [bioVal, setBioVal] = useState(bio);

  return (
    <div className="flex flex-col gap-4">
      {/* Vertical photo — 9:16 like hero video cards */}
      <div className="relative w-full rounded-xl overflow-hidden bg-card border border-border group shadow-xl" style={{ aspectRatio: "9/16" }}>
        {imageUrl ? (
          <>
            <img
              src={imageUrl}
              alt={`${name} - ${role}`}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
            <div className="absolute inset-0 bg-black/45 group-hover:bg-black/15 transition-all duration-500" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User className="w-16 h-16 opacity-20 text-foreground" />
          </div>
        )}

        {isEditing && (
          <div className="absolute inset-0 flex items-end p-3 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity">
            <input
              className="w-full text-xs bg-transparent border-b border-amber/50 text-white focus:outline-none focus:border-amber"
              defaultValue={imageUrl}
              placeholder="Photo URL…"
              onBlur={e => onUpdate(imageKey, e.target.value)}
              onClick={e => e.stopPropagation()}
            />
          </div>
        )}
      </div>

      {/* Text below photo */}
      <div>
        <div className="flex items-baseline gap-3 mb-2 flex-wrap">
          <h3
            className="font-display font-extrabold leading-none tracking-tight text-foreground"
            style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)" }}
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={e => isEditing && onUpdate(nameKey, e.currentTarget.textContent || "")}
          >
            {name}
          </h3>
          <span
            className="text-xs font-semibold uppercase tracking-widest text-primary"
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={e => isEditing && onUpdate(roleKey, e.currentTarget.textContent || "")}
          >
            {role}
          </span>
        </div>

        {isEditing ? (
          <div className="space-y-0.5">
            <textarea
              className="w-full bg-transparent border border-border rounded text-foreground text-sm leading-relaxed resize-none focus:outline-none focus:border-primary p-1.5"
              rows={3}
              maxLength={MAX_BIO}
              value={bioVal}
              onChange={e => setBioVal(e.target.value.slice(0, MAX_BIO))}
              onBlur={() => onUpdate(bioKey, bioVal)}
            />
            <p className="text-[10px] text-muted-foreground text-right">{bioVal.length}/{MAX_BIO}</p>
          </div>
        ) : (
          <p className="text-muted-foreground leading-relaxed" style={{ fontSize: "1rem" }}>{bio}</p>
        )}

        {/* LinkedIn button */}
        {isEditing ? (
          <div className="mt-3">
            <label className="text-[10px] text-muted-foreground block mb-1">LinkedIn URL</label>
            <input
              className="w-full text-xs bg-card border border-border rounded px-2 py-1.5 text-foreground focus:outline-none focus:border-primary"
              defaultValue={linkedinUrl}
              placeholder="https://linkedin.com/in/..."
              onBlur={e => onUpdate(linkedinKey, e.target.value)}
            />
          </div>
        ) : linkedinUrl ? (
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full border border-border text-sm text-foreground hover:border-foreground transition-colors"
          >
            <Linkedin className="w-4 h-4" />
            LinkedIn
          </a>
        ) : null}
      </div>
    </div>
  );
}

export default function Hosts({ content, isEditing, onUpdate }: HostsProps) {
  const hosts = [
    {
      name: content.host1Name, bio: content.host1Bio,
      imageUrl: content.host1ImageUrl, role: content.host1Role,
      linkedinUrl: content.host1LinkedinUrl || "",
      nameKey: "host1Name" as keyof CMSContent, bioKey: "host1Bio" as keyof CMSContent,
      imageKey: "host1ImageUrl" as keyof CMSContent, roleKey: "host1Role" as keyof CMSContent,
      linkedinKey: "host1LinkedinUrl" as keyof CMSContent,
    },
    {
      name: content.host2Name, bio: content.host2Bio,
      imageUrl: content.host2ImageUrl, role: content.host2Role,
      linkedinUrl: content.host2LinkedinUrl || "",
      nameKey: "host2Name" as keyof CMSContent, bioKey: "host2Bio" as keyof CMSContent,
      imageKey: "host2ImageUrl" as keyof CMSContent, roleKey: "host2Role" as keyof CMSContent,
      linkedinKey: "host2LinkedinUrl" as keyof CMSContent,
    },
  ];

  return (
    <section id="hosts" className="bg-background" aria-label="Podcast hosts">
      <div className="container mx-auto px-6">
        <div className="py-14 border-b border-border">
          {/* Stepped vertical layout like hero video cards */}
          <div className="max-w-2xl mx-auto">
            <div className="grid md:grid-cols-2 gap-9 items-start">
              <div className="mt-0">
                <HostCard {...hosts[0]} isEditing={isEditing} onUpdate={onUpdate} />
              </div>
              <div className="mt-12">
                <HostCard {...hosts[1]} isEditing={isEditing} onUpdate={onUpdate} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="section-divider" />
    </section>
  );
}
