import { useState } from "react";
import { CMSContent } from "@/types/cms";
import { X, Send, Mic2 } from "lucide-react";

interface ContactModalProps {
  content: CMSContent;
  isEditing: boolean;
  onUpdate: (key: keyof CMSContent, value: any) => void;
  onClose: () => void;
}

export default function ContactModal({ content, isEditing, onUpdate, onClose }: ContactModalProps) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailto = `mailto:${content.contactEmail}?subject=${encodeURIComponent(content.contactSubject)}&body=${encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
    )}`;
    window.location.href = mailto;
    setSent(true);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md bg-card border border-border neon-border rounded-2xl p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center">
            <Mic2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-display font-bold text-xl text-foreground">Get in Touch</h2>
            <p className="text-xs text-muted-foreground">
              {isEditing ? (
                <input
                  className="bg-transparent border-b border-amber/50 text-muted-foreground focus:outline-none text-xs w-48"
                  defaultValue={content.contactEmail}
                  onBlur={e => onUpdate("contactEmail", e.target.value)}
                />
              ) : content.contactEmail}
            </p>
          </div>
        </div>

        {sent ? (
          <div className="text-center py-8 space-y-3">
            <div className="text-4xl">🎉</div>
            <p className="font-display font-bold text-xl text-foreground">Message sent!</p>
            <p className="text-sm text-muted-foreground">We'll get back to you soon.</p>
            <button onClick={onClose} className="mt-4 px-6 py-2 rounded-full bg-primary text-primary-foreground font-semibold">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Name</label>
              <input
                required
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Your name"
                className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Email</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="your@email.com"
                className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Message</label>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                placeholder="Tell us what's on your mind…"
                className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/80 transition-all glow-purple"
            >
              <Send className="w-4 h-4" />
              Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
