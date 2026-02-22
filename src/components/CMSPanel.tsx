import { useState } from "react";
import { CMSContent, NavItem } from "@/types/cms";
import { X, RotateCcw, Settings2, Info, Minimize2, Maximize2, PanelLeft, PanelRight } from "lucide-react";
import EditorManager from "./EditorManager";

interface CMSPanelProps {
  content: CMSContent;
  onUpdate: (key: keyof CMSContent, value: any) => void;
  onReset: () => void;
  onClose: () => void;
  isAdmin?: boolean;
}

type Tab = "general" | "hero" | "about" | "hosts" | "settings" | "typography" | "team" | "seo";

export default function CMSPanel({ content, onUpdate, onReset, onClose, isAdmin }: CMSPanelProps) {
  const [tab, setTab] = useState<Tab>("general");
  const [resetConfirm, setResetConfirm] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [side, setSide] = useState<"right" | "left">("right");

  const tabs: { key: Tab; label: string }[] = [
    { key: "general", label: "General" },
    { key: "hero", label: "Hero" },
    { key: "about", label: "About" },
    { key: "hosts", label: "Hosts" },
    { key: "seo", label: "SEO" },
    { key: "settings", label: "Settings" },
    { key: "typography", label: "Typography" },
    ...(isAdmin ? [{ key: "team" as Tab, label: "Team" }] : []),
  ];

  // Minimized state — small floating pill
  if (minimized) {
    return (
      <button
        onClick={() => setMinimized(false)}
        className={`fixed bottom-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-card border border-border shadow-2xl text-xs font-semibold text-foreground hover:border-primary transition-all ${
          side === "right" ? "right-6" : "left-6"
        }`}
      >
        <Settings2 className="w-4 h-4 text-primary" />
        CMS Editor
        <Maximize2 className="w-3.5 h-3.5 text-muted-foreground" />
      </button>
    );
  }

  const positionClasses = side === "right"
    ? "right-0 border-l"
    : "left-0 border-r";

  return (
    <div className={`fixed top-16 bottom-0 z-50 w-80 bg-card ${positionClasses} border-border shadow-2xl flex flex-col transition-all`}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-primary" />
          <span className="font-display font-bold text-sm text-foreground">CMS Editor</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSide(s => s === "right" ? "left" : "right")}
            className="p-1.5 text-muted-foreground hover:text-foreground rounded transition-colors"
            title={`Move to ${side === "right" ? "left" : "right"}`}
          >
            {side === "right" ? <PanelLeft className="w-4 h-4" /> : <PanelRight className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setMinimized(true)}
            className="p-1.5 text-muted-foreground hover:text-foreground rounded transition-colors"
            title="Minimize"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          <button onClick={onClose} className="p-1.5 text-muted-foreground hover:text-foreground rounded transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
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
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Left Nav Items</p>
              <NavItemsEditor
                items={content.navLeftItems || []}
                onChange={items => onUpdate("navLeftItems", items)}
              />
            </div>
            <div className="pt-2 border-t border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Right Nav Items</p>
              <NavItemsEditor
                items={content.navRightItems || []}
                onChange={items => onUpdate("navRightItems", items)}
              />
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
                <Field label="Instagram URL" value={content.instagramUrl} onChange={v => onUpdate("instagramUrl", v)} />
                <Field label="Substack URL" value={content.substackUrl} onChange={v => onUpdate("substackUrl", v)} />
                <Field label="TikTok URL" value={content.tiktokUrl} onChange={v => onUpdate("tiktokUrl", v)} />
              </div>
            </div>
          </>
        )}

        {tab === "hero" && (
          <>
            <Field label="Hero Title" value={content.heroTitle} onChange={v => onUpdate("heroTitle", v)} />
            <Field label="Hero Description (supports &lt;br/&gt;)" value={content.heroDescription} onChange={v => onUpdate("heroDescription", v)} multiline />
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

        {tab === "seo" && (
          <>
            <Field label="Meta Description" value={content.metaDescription} onChange={v => onUpdate("metaDescription", v)} multiline placeholder="Page description for search engines (≤160 chars)" />
            <Field label="Google Search Console ID" value={content.googleSearchConsoleId} onChange={v => onUpdate("googleSearchConsoleId", v)} placeholder="Verification string from GSC" />
            <div className="border-t border-border pt-4">
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-3">Open Graph</p>
              <div className="space-y-3">
                <Field label="OG Title" value={content.ogTitle} onChange={v => onUpdate("ogTitle", v)} />
                <Field label="OG Description" value={content.ogDescription} onChange={v => onUpdate("ogDescription", v)} multiline />
                <Field label="OG Image URL" value={content.ogImage} onChange={v => onUpdate("ogImage", v)} placeholder="https://..." />
              </div>
            </div>
            <div className="border-t border-border pt-4">
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-3">Twitter / X Card</p>
              <div className="space-y-3">
                <Field label="Twitter Title" value={content.twitterTitle} onChange={v => onUpdate("twitterTitle", v)} />
                <Field label="Twitter Description" value={content.twitterDescription} onChange={v => onUpdate("twitterDescription", v)} multiline />
                <Field label="Twitter Image URL" value={content.twitterImage} onChange={v => onUpdate("twitterImage", v)} placeholder="https://..." />
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

        {tab === "team" && isAdmin && (
          <EditorManager />
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


interface NavItemsEditorProps {
  items: NavItem[];
  onChange: (items: NavItem[]) => void;
}

function NavItemsEditor({ items, onChange }: NavItemsEditorProps) {
  const updateItem = (idx: number, field: "label" | "href", value: string) => {
    const next = [...items];
    next[idx] = { ...next[idx], [field]: value };
    onChange(next);
  };
  const addItem = () => onChange([...items, { label: "New", href: "#" }]);
  const removeItem = (idx: number) => onChange(items.filter((_, i) => i !== idx));

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="flex items-end gap-1.5">
          <div className="flex-1">
            <Field label={`Label ${i + 1}`} value={item.label} onChange={v => updateItem(i, "label", v)} />
          </div>
          <div className="flex-1">
            <Field label={`Href ${i + 1}`} value={item.href} onChange={v => updateItem(i, "href", v)} />
          </div>
          <button
            onClick={() => removeItem(i)}
            className="mb-0.5 px-2 py-2 text-xs text-destructive hover:bg-destructive/10 rounded transition-colors"
            title="Remove"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        onClick={addItem}
        className="w-full py-1.5 rounded border border-dashed border-border text-xs text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
      >
        + Add nav item
      </button>
    </div>
  );
}
