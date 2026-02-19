import { CMSContent } from "@/types/cms";
import { ArrowUpRight, Send } from "lucide-react";
import { useState } from "react";

interface EngageProps {
  content: CMSContent;
  isEditing: boolean;
  onUpdate: (key: keyof CMSContent, value: any) => void;
  onContactClick: () => void;
}

const PLATFORMS = [
  {
    name: "Spotify",
    urlKey: "spotifyUrl" as keyof CMSContent,
    color: "#1DB954",
    svg: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.371-.721.49-1.101.241-3.021-1.858-6.832-2.278-11.322-1.237-.43.101-.851-.17-.952-.6-.1-.43.17-.851.6-.952 4.91-1.12 9.122-.64 12.521 1.41.38.24.5.72.254 1.138zm1.44-3.3c-.301.42-.841.6-1.262.3-3.461-2.122-8.731-2.74-12.832-1.5-.511.16-1.051-.12-1.211-.63-.16-.511.12-1.051.63-1.211 4.671-1.42 10.47-.741 14.461 1.71.42.301.539.84.214 1.331zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.24-.161-1.42-.74-.18-.6.16-1.24.74-1.42 4.26-1.3 11.34-1.05 15.84 1.62.54.3.72 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
      </svg>
    ),
  },
  {
    name: "Apple Podcasts",
    urlKey: "appleUrl" as keyof CMSContent,
    color: "#B150E2",
    svg: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 4.5c2.017 0 3.898.57 5.5 1.559V9.5c-1.44-1.021-3.19-1.628-5.086-1.628C7.97 7.872 5 10.842 5 14.5c0 1.696.612 3.245 1.623 4.437L5.5 20.2A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2zm0 5.5c2.76 0 5 2.24 5 5 0 1.7-.846 3.2-2.138 4.107l.948 1.642A7.47 7.47 0 0 0 19.5 12c0-4.142-3.358-7.5-7.5-7.5-2.02 0-3.856.8-5.204 2.099l1.14 1.14A5.494 5.494 0 0 1 12 6.5zm0 2.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z"/>
      </svg>
    ),
  },
  {
    name: "YouTube",
    urlKey: "youtubeUrl" as keyof CMSContent,
    color: "#FF0000",
    svg: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
];

const ENQUIRY_TYPES = [
  { value: "questions", label: "Questions" },
  { value: "guest-suggestions", label: "Guest Suggestions" },
  { value: "partnerships", label: "Partnerships" },
  { value: "report-issues", label: "Report Issues" },
];

export default function Engage({ content, isEditing, onUpdate, onContactClick }: EngageProps) {
  const [form, setForm] = useState({ name: "", email: "", category: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
    if (!form.category) e.category = "Please select a category";
    if (!form.message.trim() || form.message.length < 10) e.message = "Message must be at least 10 characters";
    if (form.message.length > 2000) e.message = "Message must be under 2000 characters";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    const subject = encodeURIComponent(`[${ENQUIRY_TYPES.find(t => t.value === form.category)?.label}] ${form.name}`);
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\nCategory: ${form.category}\n\n${form.message}`);
    window.location.href = `mailto:${content.contactEmail}?subject=${subject}&body=${body}`;
    setSubmitted(true);
    setForm({ name: "", email: "", category: "", message: "" });
  };

  return (
    <section id="engage" className="bg-background">
      <div className="container mx-auto px-6">

        {/* Big CTA row */}
        <div className="py-16 border-b border-border">
          <div className="flex flex-col md:flex-row md:items-end gap-8 justify-between">
            <div>
              <p className="text-xs text-primary font-semibold uppercase tracking-widest mb-4">Listen &amp; Connect</p>
              <h2
                className="font-display font-extrabold leading-none tracking-tight text-foreground"
                style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)" }}
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={e => isEditing && onUpdate("engageTitle", e.currentTarget.textContent || "")}
              >
                {content.engageTitle}
              </h2>
            </div>
            <div className="flex flex-col gap-4 md:items-end">
              <p
                className="text-muted-foreground text-sm leading-relaxed max-w-xs md:text-right"
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={e => isEditing && onUpdate("engageDescription", e.currentTarget.textContent || "")}
              >
                {content.engageDescription}
              </p>
            </div>
          </div>
        </div>

        {/* Platform row */}
        <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
          {PLATFORMS.map(p => (
            <a
              key={p.name}
              href={isEditing ? undefined : (content[p.urlKey] as string) || "#"}
              target={!isEditing ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-3 px-6 py-8 hover:bg-card transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0"
                  style={{ background: p.color }}>
                  {p.svg}
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Listen on</p>
                  <p className="font-display font-bold text-sm text-foreground group-hover:text-primary transition-colors">{p.name}</p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
          ))}
        </div>

        {/* Enquiry form */}
        <div className="py-16 border-b border-border">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-xs text-primary font-semibold uppercase tracking-widest mb-4">Get in Touch</p>
              <h3 className="font-display font-extrabold leading-none tracking-tight text-foreground mb-4"
                style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>
                Send us a<br />message
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
                Whether you have a burning question, know someone perfect for the show, or want to explore a partnership — we'd love to hear from you.
              </p>
            </div>

            <div>
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Send className="w-5 h-5 text-primary" />
                  </div>
                  <p className="font-display font-bold text-foreground text-xl">Message sent!</p>
                  <p className="text-muted-foreground text-sm">We'll get back to you soon.</p>
                  <button onClick={() => setSubmitted(false)} className="text-xs text-primary underline mt-2">Send another</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  {/* Category dropdown */}
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">Category *</label>
                    <select
                      value={form.category}
                      onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                      className="w-full bg-card border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Select a category…</option>
                      {ENQUIRY_TYPES.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                    {errors.category && <p className="text-xs text-coral mt-1">{errors.category}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">Name *</label>
                      <input
                        type="text"
                        maxLength={100}
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="Your name"
                        className="w-full bg-card border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary"
                      />
                      {errors.name && <p className="text-xs text-coral mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">Email *</label>
                      <input
                        type="email"
                        maxLength={255}
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="you@example.com"
                        className="w-full bg-card border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary"
                      />
                      {errors.email && <p className="text-xs text-coral mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">Message *</label>
                    <textarea
                      rows={5}
                      maxLength={2000}
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      placeholder="Tell us more…"
                      className="w-full bg-card border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary resize-none"
                    />
                    <div className="flex justify-between mt-1">
                      {errors.message ? <p className="text-xs text-coral">{errors.message}</p> : <span />}
                      <p className="text-xs text-muted-foreground">{form.message.length}/2000</p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:brightness-110 transition-all"
                  >
                    Send Message
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

      </div>
      <div className="section-divider" />
    </section>
  );
}
