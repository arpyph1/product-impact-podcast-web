import { useState } from "react";
import { CMSContent } from "@/types/cms";
import { User } from "lucide-react";

interface HostsProps {
  content: CMSContent;
  isEditing: boolean;
  onUpdate: (key: keyof CMSContent, value: any) => void;
}

const MAX_BIO = 250;

interface HostCardProps {
  name: string;
  bio: string;
  imageUrl: string;
  role: string;
  nameKey: keyof CMSContent;
  bioKey: keyof CMSContent;
  imageKey: keyof CMSContent;
  roleKey: keyof CMSContent;
  isEditing: boolean;
  onUpdate: (k: keyof CMSContent, v: any) => void;
}

function HostCard({ name, bio, imageUrl, role, nameKey, bioKey, imageKey, roleKey, isEditing, onUpdate }: HostCardProps) {
  const [bioVal, setBioVal] = useState(bio);

  return (
    <div className="flex flex-col gap-5">
      {/* Large photo — rounded, filter overlay */}
      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-card border border-border group shadow-xl">
        {imageUrl ? (
          <>
            <img
              src={imageUrl}
              alt={name}
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
      </div>
    </div>
  );
}

export default function Hosts({ content, isEditing, onUpdate }: HostsProps) {
  return (
    <section id="hosts" className="bg-background">
      <div className="container mx-auto px-6">
        <div className="py-14 border-b border-border">
          <div className="grid md:grid-cols-2 gap-10">
            <HostCard
              name={content.host1Name} bio={content.host1Bio}
              imageUrl={content.host1ImageUrl} role={content.host1Role}
              nameKey="host1Name" bioKey="host1Bio"
              imageKey="host1ImageUrl" roleKey="host1Role"
              isEditing={isEditing} onUpdate={onUpdate}
            />
            <HostCard
              name={content.host2Name} bio={content.host2Bio}
              imageUrl={content.host2ImageUrl} role={content.host2Role}
              nameKey="host2Name" bioKey="host2Bio"
              imageKey="host2ImageUrl" roleKey="host2Role"
              isEditing={isEditing} onUpdate={onUpdate}
            />
          </div>
        </div>
      </div>
      <div className="section-divider" />
    </section>
  );
}
