import { CMSContent } from "@/types/cms";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";

interface SubscribeProps {
  content: CMSContent;
  isEditing: boolean;
  onUpdate: (key: keyof CMSContent, value: any) => void;
}

export default function Subscribe({ content, isEditing, onUpdate }: SubscribeProps) {
  const subscribeUrl = content.subscribeUrl || "https://designofai.substack.com";
  const label = content.subscribeLabel || "Never miss our AI Strategy Resources";

  // Substack's official iframe embed
  const substackBase = subscribeUrl.replace(/\/$/, "");
  const embedSrc = `${substackBase}/embed`;

  return (
    <section id="subscribe" className="bg-background" aria-label="Subscribe">
      <div className="container mx-auto px-6">
        <div className="py-20 border-b border-border">
          <div className="max-w-xl mx-auto text-center">
            {/* Terracotta label */}
            <span
              className="inline-block text-xs font-semibold uppercase tracking-widest mb-6"
              style={{ color: "hsl(14, 60%, 55%)" }}
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={e => isEditing && onUpdate("subscribeLabel", e.currentTarget.textContent || "")}
            >
              {label}
            </span>

            {isEditing && (
              <div className="mb-4">
                <input
                  className="text-xs bg-card border border-amber/50 text-foreground rounded px-2 py-1.5 w-full focus:outline-none focus:border-amber"
                  defaultValue={subscribeUrl}
                  onBlur={e => onUpdate("subscribeUrl", e.target.value.trim())}
                  placeholder="https://yourname.substack.com"
                />
              </div>
            )}

            {/* Substack official embed iframe */}
            <iframe
              src={embedSrc}
              width="100%"
              height="150"
              style={{ border: "none", background: "transparent" }}
              frameBorder="0"
              scrolling="no"
              title="Subscribe to newsletter"
            />
          </div>
        </div>
      </div>
      <div className="section-divider" />
    </section>
  );
}
