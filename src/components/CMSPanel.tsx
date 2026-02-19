import { useState } from "react";
import { CMSContent } from "@/types/cms";
import { X, RotateCcw, Settings2, Info } from "lucide-react";

interface CMSPanelProps {
  content: CMSContent;
  onUpdate: (key: keyof CMSContent, value: any) => void;
  onReset: () => void;
  onClose: () => void;
}

type Tab = "general" | "hero" | "about" | "hosts" | "settings" | "typography";

export default function CMSPanel({ content, onUpdate, onReset, onClose }: CMSPanelProps) {
  const [tab, setTab] = useState<Tab>("general");
  const [resetConfirm, setResetConfirm] = useState(false);

  const tabs: { key: Tab; label: string }[] = [
    { key: "general", label: "General" },
    { key: "hero", label: "Hero" },
    { key: "about", label: "About" },
    { key: "hosts", label: "Hosts" },
    { key: "settings", label: "Settings" },
    { key: "typography", label: "Typography" },
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
            <Field label="Footer Tagline" value={content.footerTagline} onChange={v => onUpdate("footerTagline", v)} />
            <Field label="Contact Email" value={content.contactEmail} onChange={v => onUpdate("contactEmail", v)} type="email" />
            <Field label="Contact Subject" value={content.contactSubject} onChange={v => onUpdate("contactSubject", v)} />
            <Field label="Engage Title" value={content.engageTitle} onChange={v => onUpdate("engageTitle", v)} />
            <Field label="Engage Description" value={content.engageDescription} onChange={v => onUpdate("engageDescription", v)} multiline />
            <div className="pt-2 border-t border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Navigation Links</p>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Nav 1 Label" value={content.navLink1Label} onChange={v => onUpdate("navLink1Label", v)} />
                  <Field label="Nav 1 Href" value={content.navLink1Href} onChange={v => onUpdate("navLink1Href", v)} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Nav 2 Label" value={content.navLink2Label} onChange={v => onUpdate("navLink2Label", v)} />
                  <Field label="Nav 2 Href" value={content.navLink2Href} onChange={v => onUpdate("navLink2Href", v)} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Nav 3 Label" value={content.navLink3Label} onChange={v => onUpdate("navLink3Label", v)} />
                  <Field label="Nav 3 Href" value={content.navLink3Href} onChange={v => onUpdate("navLink3Href", v)} />
                </div>
              </div>
            </div>
            <div className="pt-2 border-t border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Platform URLs</p>
              <div className="space-y-3">
                <Field label="Spotify URL" value={content.spotifyUrl} onChange={v => onUpdate("spotifyUrl", v)} />
                <Field label="Apple Podcasts URL" value={content.appleUrl} onChange={v => onUpdate("appleUrl", v)} />
                <Field label="YouTube URL" value={content.youtubeUrl} onChange={v => onUpdate("youtubeUrl", v)} />
                <Field label="YouTube Channel ID" value={content.youtubeChannelId} onChange={v => onUpdate("youtubeChannelId", v)} placeholder="e.g. UCxxxxxxxxxx" />
                <Field label="LinkedIn URL" value={content.linkedinUrl} onChange={v => onUpdate("linkedinUrl", v)} />
                <Field label="Twitter/X URL" value={content.twitterUrl} onChange={v => onUpdate("twitterUrl", v)} />
                <Field label="Substack URL" value={content.substackUrl} onChange={v => onUpdate("substackUrl", v)} />
              </div>
            </div>
          </>
        )}

        {tab === "hero" && (
          <>
            <Field label="Hero Title" value={content.heroTitle} onChange={v => onUpdate("heroTitle", v)} />
          </>
        )}

        {tab === "about" && (
          <>
            <Field label="About Description" value={content.aboutDescription} onChange={v => onUpdate("aboutDescription", v)} multiline />
            <div className="pt-2 border-t border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Section Titles</p>
              <div className="space-y-3">
                <Field label="Episodes Title" value={content.episodesTitle} onChange={v => onUpdate("episodesTitle", v)} />
                <Field label="Sponsors Title" value={content.sponsorsTitle} onChange={v => onUpdate("sponsorsTitle", v)} />
                <Field label="Blog Title" value={content.blogTitle} onChange={v => onUpdate("blogTitle", v)} />
              </div>
            </div>
          </>
        )}

        {tab === "typography" && (
          <>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">H1 (Hero Title)</p>
            <Field label="Font Size (CSS)" value={content.h1FontSize} onChange={v => onUpdate("h1FontSize", v)} placeholder="clamp(2.4rem, 6vw, 5.5rem)" />
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Font Weight</label>
              <select
                className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
                value={content.h1FontWeight}
                onChange={e => onUpdate("h1FontWeight", e.target.value)}
              >
                <option value="400">400 — Regular</option>
                <option value="500">500 — Medium</option>
                <option value="600">600 — Semibold</option>
                <option value="700">700 — Bold</option>
                <option value="800">800 — Extrabold</option>
                <option value="900">900 — Black</option>
              </select>
            </div>

            <div className="border-t border-border pt-4">
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-3">H2 (Section Titles)</p>
              <div className="space-y-3">
                <Field label="Font Size (CSS)" value={content.h2FontSize} onChange={v => onUpdate("h2FontSize", v)} placeholder="clamp(1.5rem, 3.5vw, 2.8rem)" />
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Font Weight</label>
                  <select
                    className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
                    value={content.h2FontWeight}
                    onChange={e => onUpdate("h2FontWeight", e.target.value)}
                  >
                    <option value="400">400 — Regular</option>
                    <option value="500">500 — Medium</option>
                    <option value="600">600 — Semibold</option>
                    <option value="700">700 — Bold</option>
                    <option value="800">800 — Extrabold</option>
                    <option value="900">900 — Black</option>
                  </select>
                </div>
              </div>
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

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  multiline?: boolean;
  placeholder?: string;
}

function Field({ label, value, onChange, type = "text", multiline = false, placeholder }: FieldProps) {
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

