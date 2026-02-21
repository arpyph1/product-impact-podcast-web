import { CMSContent } from "@/types/cms";
import { ArrowUpRight } from "lucide-react";
import { useState, useRef } from "react";

interface SubscribeProps {
  content: CMSContent;
  isEditing: boolean;
  onUpdate: (key: keyof CMSContent, value: any) => void;
}

export default function Subscribe({ content, isEditing, onUpdate }: SubscribeProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const subscribeUrl = content.subscribeUrl || "https://designofai.substack.com";
  const label = content.subscribeLabel || "Never miss our AI Strategy Resources";

  // Build the Substack subscribe URL
  const substackBase = subscribeUrl.replace(/\/$/, "");
  const actionUrl = `${substackBase}/api/v1/free?nojs=true`;

  const handleSubmit = (e: React.FormEvent) => {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.preventDefault();
      return;
    }
    // Let the form submit naturally to Substack
    setSubmitted(true);
  };

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

            {submitted ? (
              <div className="py-8">
                <p className="font-display font-bold text-foreground text-xl mb-2">You're subscribed!</p>
                <p className="text-muted-foreground text-sm">Check your inbox to confirm.</p>
                <button onClick={() => { setSubmitted(false); setEmail(""); }} className="text-xs text-primary underline mt-4">Subscribe another email</button>
              </div>
            ) : (
              <form
                ref={formRef}
                action={actionUrl}
                method="POST"
                target="_blank"
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row items-center gap-3"
              >
                <input
                  type="email"
                  name="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 w-full bg-card border border-border rounded-full px-5 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary"
                />
                <input type="hidden" name="first_url" value={substackBase} />
                <button
                  type="submit"
                  className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:brightness-110 transition-all shrink-0"
                >
                  Subscribe
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <div className="section-divider" />
    </section>
  );
}
