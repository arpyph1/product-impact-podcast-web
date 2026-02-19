import { useState } from "react";
import { CMSContent } from "@/types/cms";
import { X, RotateCcw, Settings2, Info } from "lucide-react";

interface CMSPanelProps {
  content: CMSContent;
  onUpdate: (key: keyof CMSContent, value: any) => void;
  onReset: () => void;
  onClose: () => void;
}

type Tab = "general" | "hero" | "about" | "hosts" | "settings";

export default function CMSPanel({ content, onUpdate, onReset, onClose }: CMSPanelProps) {
  const [tab, setTab] = useState<Tab>("general");
  const [resetConfirm, setResetConfirm] = useState(false);

  const tabs: { key: Tab; label: string }[] = [
    { key: "general", label: "General" },
    { key: "hero", label: "Hero" },
    { key: "about", label: "About" },
    { key: "hosts", label: "Hosts" },
    { key: "settings", label: "Settings" },
  ];

  return (
    <div className="fixed top-16 right-0 bottom-0 z-50 w-80 bg-card border-l border-border shadow-2xl flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-primary" />
          <span className="font-display font-bold text-sm text-foreground">CMS Editor</span>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Hint */}
      <div className="mx-4 mt-3 mb-2 p-2.5 rounded-lg bg-amber/10 border border-amber/30 flex gap-2 items-start">
        <Info className="w-3.5 h-3.5 text-amber mt-0.5 shrink-0" />
        <p className="text-xs text-amber/90 leading-snug">
          Click text on the page to edit inline. Hover host cards to change their photo URL.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border px-1 overflow-x-auto">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-shrink-0 px-2 py-2 text-xs font-semibold transition-colors ${
              tab === t.key
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {tab === "general" && (
          <>
            <Field label="Podcast Name" value={content.podcastName} onChange={v => onUpdate("podcastName", v)} />
            <Field label="Podcast Tagline" value={content.podcastTagline} onChange={v => onUpdate("podcastTagline", v)} />
            <Field label="Footer Tagline" value={content.footerTagline} onChange={v => onUpdate("footerTagline", v)} />
            <Field label="Contact Email" value={content.contactEmail} onChange={v => onUpdate("contactEmail", v)} type="email" />
            <Field label="Contact Subject" value={content.contactSubject} onChange={v => onUpdate("contactSubject", v)} />
            <Field label="Engage Title" value={content.engageTitle} onChange={v => onUpdate("engageTitle", v)} />
            <Field label="Engage Description" value={content.engageDescription} onChange={v => onUpdate("engageDescription", v)} multiline />
            <Field label="Engage CTA" value={content.engageCta} onChange={v => onUpdate("engageCta", v)} />
            <div className="pt-2 border-t border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Platform URLs</p>
              <div className="space-y-3">
                <Field label="Spotify URL" value={content.spotifyUrl} onChange={v => onUpdate("spotifyUrl", v)} />
                <Field label="Apple Podcasts URL" value={content.appleUrl} onChange={v => onUpdate("appleUrl", v)} />
                <Field label="YouTube URL" value={content.youtubeUrl} onChange={v => onUpdate("youtubeUrl", v)} />
              </div>
            </div>
          </>
        )}

        {tab === "hero" && (
          <>
            <Field label="Hero Title" value={content.heroTitle} onChange={v => onUpdate("heroTitle", v)} />
            <Field label="Hero Description" value={content.heroDescription} onChange={v => onUpdate("heroDescription", v)} multiline />
            <Field label="CTA Button 1 Text" value={content.heroCta1Text} onChange={v => onUpdate("heroCta1Text", v)} />
            <Field label="CTA Button 1 Link" value={content.heroCta1Link} onChange={v => onUpdate("heroCta1Link", v)} />
            <Field label="CTA Button 2 Text" value={content.heroCta2Text} onChange={v => onUpdate("heroCta2Text", v)} />
            <Field label="CTA Button 2 Link" value={content.heroCta2Link} onChange={v => onUpdate("heroCta2Link", v)} />
            <Field
              label="Hero Image URL"
              value={content.heroImageUrl}
              onChange={v => onUpdate("heroImageUrl", v)}
              placeholder="https://..."
            />
            <ColorPicker
              label="Hero Card Background"
              value={content.heroCardBg}
              onChange={v => onUpdate("heroCardBg", v)}
            />
          </>
        )}

        {tab === "about" && (
          <>
            <Field label="About Title" value={content.aboutTitle} onChange={v => onUpdate("aboutTitle", v)} />
            <Field label="About Description" value={content.aboutDescription} onChange={v => onUpdate("aboutDescription", v)} multiline />
            <Field label="About CTA Text" value={content.aboutCta} onChange={v => onUpdate("aboutCta", v)} />
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Tags (comma separated)</label>
              <input
                className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
                value={content.tags.join(", ")}
                onChange={e => onUpdate("tags", e.target.value.split(",").map(t => t.trim()).filter(Boolean))}
              />
            </div>
          </>
        )}

        {tab === "hosts" && (
          <>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Host 1</p>
            <Field label="Name" value={content.host1Name} onChange={v => onUpdate("host1Name", v)} />
            <Field label="Role / Title" value={content.host1Role} onChange={v => onUpdate("host1Role", v)} />
            <Field label="Bio" value={content.host1Bio} onChange={v => onUpdate("host1Bio", v)} multiline />
            <Field label="Photo URL" value={content.host1ImageUrl} onChange={v => onUpdate("host1ImageUrl", v)} placeholder="https://..." />

            <div className="border-t border-border pt-4">
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-3">Host 2</p>
              <div className="space-y-3">
                <Field label="Name" value={content.host2Name} onChange={v => onUpdate("host2Name", v)} />
                <Field label="Role / Title" value={content.host2Role} onChange={v => onUpdate("host2Role", v)} />
                <Field label="Bio" value={content.host2Bio} onChange={v => onUpdate("host2Bio", v)} multiline />
                <Field label="Photo URL" value={content.host2ImageUrl} onChange={v => onUpdate("host2ImageUrl", v)} placeholder="https://..." />
              </div>
            </div>
          </>
        )}

        {tab === "settings" && (
          <>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">RSS Feed URL</label>
              <input
                className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
                value={content.rssFeedUrl}
                onChange={e => onUpdate("rssFeedUrl", e.target.value)}
                placeholder="https://feeds.example.com/podcast.rss"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Paste any podcast RSS feed URL. Episodes will load automatically.
              </p>
            </div>
          </>
        )}
      </div>

      {/* Footer actions */}
      <div className="p-4 border-t border-border space-y-2">
        {!resetConfirm ? (
          <button
            onClick={() => setResetConfirm(true)}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-border text-xs text-muted-foreground hover:border-destructive hover:text-destructive transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to defaults
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => { onReset(); setResetConfirm(false); }}
              className="flex-1 py-2 rounded-lg bg-destructive text-destructive-foreground text-xs font-semibold"
            >
              Confirm Reset
            </button>
            <button
              onClick={() => setResetConfirm(false)}
              className="flex-1 py-2 rounded-lg border border-border text-xs text-muted-foreground"
            >
              Cancel
            </button>
          </div>
        )}
        <p className="text-xs text-center text-muted-foreground">All changes save automatically</p>
      </div>
    </div>
  );
}

function Field({
  label, value, onChange, type = "text", multiline = false, placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  multiline?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">{label}</label>
      {multiline ? (
        <textarea
          rows={3}
          className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary resize-none"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}

const COLOR_OPTIONS = [
  { value: "coral",  label: "Coral",  bg: "hsl(5 80% 60%)" },
  { value: "teal",   label: "Teal",   bg: "hsl(174 72% 48%)" },
  { value: "amber",  label: "Amber",  bg: "hsl(43 96% 56%)" },
  { value: "purple", label: "Purple", bg: "hsl(265 80% 60%)" },
];

function ColorPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-2">{label}</label>
      <div className="flex gap-2">
        {COLOR_OPTIONS.map(c => (
          <button
            key={c.value}
            onClick={() => onChange(c.value)}
            title={c.label}
            className={`w-8 h-8 rounded-full border-2 transition-all ${
              value === c.value ? "border-foreground scale-110" : "border-border"
            }`}
            style={{ background: c.bg }}
          />
        ))}
      </div>
    </div>
  );
}
