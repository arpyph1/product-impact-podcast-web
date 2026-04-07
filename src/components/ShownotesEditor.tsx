import { useState, useEffect } from "react";
import { useAllShownotes, saveShownotes, Shownotes } from "@/hooks/useShownotes";
import { FileText, Save, Plus, ChevronDown, ChevronUp, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ShownotesEditor() {
  const { list, loading, refresh } = useAllShownotes();
  const [selectedGuid, setSelectedGuid] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editHtml, setEditHtml] = useState("");
  const [editPublished, setEditPublished] = useState(true);
  const [newGuid, setNewGuid] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const { toast } = useToast();

  // Load full shownotes when selecting
  useEffect(() => {
    if (!selectedGuid) return;
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/shownotes?episode_guid=${encodeURIComponent(selectedGuid)}`;
    fetch(url, {
      headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
    })
      .then(r => r.json())
      .then(result => {
        if (result.data) {
          setEditTitle(result.data.title || "");
          setEditHtml(result.data.content_html || "");
          setEditPublished(result.data.published ?? true);
        }
      });
  }, [selectedGuid]);

  const handleSave = async () => {
    if (!selectedGuid) return;
    setSaving(true);
    try {
      await saveShownotes({
        episode_guid: selectedGuid,
        title: editTitle,
        content_html: editHtml,
        published: editPublished,
      });
      toast({ title: "Show notes saved" });
      refresh();
    } catch (err) {
      toast({ title: "Failed to save", variant: "destructive" });
    }
    setSaving(false);
  };

  const handleCreate = async () => {
    if (!newGuid.trim()) return;
    setSaving(true);
    try {
      await saveShownotes({
        episode_guid: newGuid.trim(),
        title: "",
        content_html: "",
        published: true,
      });
      toast({ title: "Show notes created" });
      setNewGuid("");
      setShowNew(false);
      refresh();
      setSelectedGuid(newGuid.trim());
    } catch (err) {
      toast({ title: "Failed to create", variant: "destructive" });
    }
    setSaving(false);
  };

  if (selectedGuid) {
    return (
      <div className="space-y-3">
        <button
          onClick={() => setSelectedGuid(null)}
          className="text-xs text-primary hover:text-primary/80"
        >
          ← Back to list
        </button>

        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Episode GUID</label>
          <p className="text-xs text-foreground bg-muted rounded px-2 py-1 break-all">{selectedGuid}</p>
        </div>

        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Title</label>
          <input
            className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-xs text-muted-foreground uppercase tracking-wider">Published</label>
          <button
            onClick={() => setEditPublished(!editPublished)}
            className={`w-10 h-5 rounded-full transition-colors ${editPublished ? "bg-primary" : "bg-muted"} relative`}
          >
            <span className={`block w-4 h-4 rounded-full bg-foreground absolute top-0.5 transition-transform ${editPublished ? "left-5" : "left-0.5"}`} />
          </button>
        </div>

        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">
            Content (HTML / Rich Text)
          </label>
          <textarea
            rows={12}
            className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary resize-y font-mono"
            value={editHtml}
            onChange={e => setEditHtml(e.target.value)}
            placeholder="Paste rich text HTML here — supports headings, links, images, embeds, etc."
          />
        </div>

        {/* Preview */}
        {editHtml && (
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Preview</label>
            <div
              className="bg-muted border border-border rounded-lg p-3 prose prose-invert prose-xs max-w-none text-foreground text-xs max-h-48 overflow-y-auto
                         [&_a]:text-primary [&_a]:underline [&_p]:mb-2 [&_h1]:text-sm [&_h2]:text-sm [&_h3]:text-xs"
              dangerouslySetInnerHTML={{ __html: editHtml }}
            />
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          {saving ? "Saving..." : "Save Show Notes"}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        Manage show notes for episodes. The primary method is via the API (for Claude Code / GitHub scripts), but you can also edit here.
      </p>

      {/* Create new */}
      {showNew ? (
        <div className="p-3 border border-border rounded-lg space-y-2">
          <label className="text-xs text-muted-foreground uppercase tracking-wider block">Episode GUID</label>
          <input
            className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
            value={newGuid}
            onChange={e => setNewGuid(e.target.value)}
            placeholder="Paste the episode GUID from the RSS feed"
          />
          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              disabled={saving || !newGuid.trim()}
              className="flex-1 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold disabled:opacity-50"
            >
              Create
            </button>
            <button
              onClick={() => { setShowNew(false); setNewGuid(""); }}
              className="flex-1 py-1.5 rounded-lg border border-border text-xs text-muted-foreground"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowNew(true)}
          className="w-full py-1.5 rounded border border-dashed border-border text-xs text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors flex items-center justify-center gap-1"
        >
          <Plus className="w-3 h-3" /> Add Show Notes
        </button>
      )}

      {/* List */}
      {loading ? (
        <p className="text-xs text-muted-foreground animate-pulse">Loading...</p>
      ) : list.length === 0 ? (
        <p className="text-xs text-muted-foreground italic">No show notes yet. Create one above or use the API.</p>
      ) : (
        <div className="space-y-1">
          {list.map((item: any) => (
            <button
              key={item.id}
              onClick={() => setSelectedGuid(item.episode_guid)}
              className="w-full text-left p-2.5 rounded-lg border border-border hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="text-xs text-foreground font-medium truncate flex-1">
                  {item.title || item.episode_guid}
                </span>
                {!item.published && (
                  <EyeOff className="w-3 h-3 text-muted-foreground" />
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* API docs hint */}
      <div className="border-t border-border pt-3">
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          <strong>API Endpoint:</strong> POST /functions/v1/shownotes<br />
          <strong>Auth:</strong> x-api-key header with SHOWNOTES_API_KEY<br />
          <strong>Body:</strong> {`{ episode_guid, title, content_html, links, video_urls, published }`}
        </p>
      </div>
    </div>
  );
}
