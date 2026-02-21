import { CMSContent } from "@/types/cms";
import { useState } from "react";

interface SubscribeProps {
  content: CMSContent;
  isEditing: boolean;
  onUpdate: (key: keyof CMSContent, value: any) => void;
}

export default function Subscribe({ content, isEditing, onUpdate }: SubscribeProps) {
  const subscribeUrl = content.subscribeUrl || "https://designofai.substack.com";
  const label = content.subscribeLabel || "Never miss our AI Strategy Resources";
  const [email, setEmail] = useState("");

  const substackBase = subscribeUrl.replace(/\/$/, "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // Open Substack subscribe with prefilled email
    window.open(`${substackBase}/subscribe?email=${encodeURIComponent(email)}`, "_blank");
    setEmail("");
  };

  return (
    <section id="subscribe" className="bg-background" aria-label="Subscribe">
      <div className="container mx-auto px-6">
        <div className="py-16 border-b border-border">
          <div className="max-w-md mx-auto text-center">
            {/* Terracotta label */}
            <span
              className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-6"
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

            {/* Email input + Subscribe button — matching Substack sidebar style */}
            <form onSubmit={handleSubmit} className="flex items-stretch gap-0">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Type your email…"
                required
                className="flex-1 px-4 py-3 bg-card border border-border rounded-l-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-primary text-primary-foreground text-sm font-semibold rounded-r-md hover:brightness-110 transition-all shrink-0"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="section-divider" />
    </section>
  );
}
