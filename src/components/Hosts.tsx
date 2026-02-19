import { useState } from "react";
import { CMSContent } from "@/types/cms";
import { User } from "lucide-react";

interface HostsProps {
  content: CMSContent;
  isEditing: boolean;
  onUpdate: (key: keyof CMSContent, value: any) => void;
}

const MAX_BIO = 250;

interface HostRowProps {
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

function HostRow({ name, bio, imageUrl, role, nameKey, bioKey, imageKey, roleKey, isEditing, onUpdate }: HostRowProps) {
  const [bioVal, setBioVal] = useState(bio);

  return (
    <div className="flex items-start gap-6 py-6 border-b border-border last:border-0">
      {/* Square photo — no angle, rounded corners, filter overlay */}
      <div className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-card border border-border group shadow-lg">
        {imageUrl ? (
          <>
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
              onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-all duration-500" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User className="w-8 h-8 opacity-20 text-foreground" />
          </div>
        )}

        {isEditing && (
          <div className="absolute inset-0 flex items-end p-1.5 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity">
            <input
              className="w-full text-[9px] bg-transparent border-b border-amber/50 text-white focus:outline-none focus:border-amber"
              defaultValue={imageUrl}
              placeholder="Photo URL…"
              onBlur={e => onUpdate(imageKey, e.target.value)}
              onClick={e => e.stopPropagation()}
            />
          </div>
        )}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-3 mb-1 flex-wrap">
          <h3
            className="font-display font-extrabold leading-none tracking-tight text-foreground"
            style={{ fontSize: "clamp(1.1rem, 2vw, 1.4rem)" }}
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
          <p className="text-muted-foreground leading-relaxed text-sm">{bio}</p>
        )}
      </div>
    </div>
  );
}

export default function Hosts({ content, isEditing, onUpdate }: HostsProps) {
  return (
    <section id="hosts" className="bg-background">
      <div className="container mx-auto px-6">
        <div className="py-10 border-b border-border">
          <p className="text-xs text-primary font-semibold uppercase tracking-widest mb-6">Your Hosts</p>
          <div className="flex flex-col">
            <HostRow
              name={content.host1Name} bio={content.host1Bio}
              imageUrl={content.host1ImageUrl} role={content.host1Role}
              nameKey="host1Name" bioKey="host1Bio"
              imageKey="host1ImageUrl" roleKey="host1Role"
              isEditing={isEditing} onUpdate={onUpdate}
            />
            <HostRow
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
