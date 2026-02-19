import { useState, useEffect } from "react";
import { CMSContent } from "@/types/cms";
import { ArrowUpRight, Loader2, AlertCircle, Mail } from "lucide-react";

interface SubstackPost {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  imageUrl: string;
}

interface NewsletterProps {
  content: CMSContent;
  isEditing: boolean;
  onUpdate: (key: keyof CMSContent, value: any) => void;
}

function parseSubstackFeed(xml: string): SubstackPost[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "text/xml");
  const items = Array.from(doc.querySelectorAll("item"));
  return items.slice(0, 6).map(item => {
    const title = item.querySelector("title")?.textContent?.replace(/^<!\[CDATA\[|\]\]>$/g, "").trim() || "";
    // <link> in RSS is often a text node sibling — try multiple approaches
    const linkEl = item.querySelector("link");
    const link =
      linkEl?.textContent?.trim() ||
      item.querySelector("guid")?.textContent?.trim() ||
      "";
    const pubDateRaw = item.querySelector("pubDate")?.textContent || "";
    const date = pubDateRaw
      ? new Date(pubDateRaw).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : "";
    // Strip HTML from description
    const rawDesc = item.querySelector("description")?.textContent || "";
    const description = rawDesc.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").trim().slice(0, 200);

    // Try to get image from enclosure or media:content
    const enclosure = item.querySelector("enclosure");
    const mediaContent = item.querySelector("media\\:content, content");
    const imageUrl =
      enclosure?.getAttribute("url") ||
      mediaContent?.getAttribute("url") ||
      "";

    return { title, link, pubDate: date, description, imageUrl };
  });
}

export default function Newsletter({ content, isEditing, onUpdate }: NewsletterProps) {
  const [posts, setPosts] = useState<SubstackPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const substackUrl = content.substackUrl || "";

  useEffect(() => {
    if (!substackUrl) {
      setPosts([]);
      return;
    }

    // Derive RSS feed URL from substack publication URL
    let rssUrl = substackUrl.trim().replace(/\/$/, "");
    if (!rssUrl.endsWith("/feed")) rssUrl = rssUrl + "/feed";

    setLoading(true);
    setError(null);
    setPosts([]);

    const proxy = `https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`;
    fetch(proxy, { signal: AbortSignal.timeout(10000) })
      .then(r => r.json())
      .then(data => {
        if (!data.contents) throw new Error("No content returned");
        const parsed = parseSubstackFeed(data.contents);
        if (parsed.length === 0) throw new Error("No posts found — check the URL");
        setPosts(parsed);
        setLoading(false);
      })
      .catch(err => {
        console.error("Substack fetch error:", err);
        setError("Could not load newsletter posts. Check your Substack URL (e.g. https://yourname.substack.com).");
        setLoading(false);
      });
  }, [substackUrl]);

  return (
    <section id="newsletter" className="bg-background">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex items-end justify-between py-10 border-b border-border gap-4 flex-wrap">
          <div>
            <p className="text-xs text-primary font-semibold uppercase tracking-widest mb-3">Newsletter</p>
            <h2
              className="font-display font-black uppercase leading-none tracking-tight text-foreground"
              style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.8rem)", letterSpacing: "-0.02em" }}
            >
              From the Blog
            </h2>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {isEditing && (
              <input
                key={substackUrl}
                className="text-xs bg-card border border-amber/50 text-foreground rounded px-2 py-1.5 w-72 focus:outline-none focus:border-amber"
                defaultValue={substackUrl}
                onBlur={e => onUpdate("substackUrl", e.target.value.trim())}
                placeholder="https://yourname.substack.com"
              />
            )}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Mail className="w-3 h-3 text-primary" />
              <span>Substack</span>
            </div>
          </div>
        </div>

        {/* States */}
        {loading && (
          <div className="flex items-center justify-center py-16 gap-3">
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
            <p className="text-muted-foreground text-sm">Loading posts…</p>
          </div>
        )}

        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-center max-w-md mx-auto">
            <AlertCircle className="w-5 h-5 text-destructive" />
            <p className="text-muted-foreground text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && !substackUrl && (
          <div className="py-16 text-center text-muted-foreground text-sm">
            {isEditing
              ? "Enter your Substack URL in the field above (e.g. https://yourname.substack.com) to load posts."
              : "No newsletter configured yet."}
          </div>
        )}

        {/* Posts list — full title, clickable */}
        {!loading && posts.length > 0 && (
          <div className="divide-y divide-border">
            {posts.map((post, i) => (
              <a
                key={i}
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start justify-between gap-6 py-6 hover:bg-card/40 transition-colors px-1 -mx-1 rounded"
              >
                <div className="flex-1 min-w-0">
                  {post.pubDate && (
                    <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide block mb-1.5">
                      {post.pubDate}
                    </span>
                  )}
                  {/* Full title — no truncation */}
                  <h3 className="font-display font-bold text-foreground leading-snug tracking-tight group-hover:text-primary transition-colors mb-2"
                    style={{ fontSize: "clamp(1rem, 1.5vw, 1.25rem)" }}>
                    {post.title}
                  </h3>
                  {post.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed">{post.description}</p>
                  )}
                </div>
                <div className="shrink-0 pt-1">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full border border-border group-hover:border-foreground group-hover:bg-foreground transition-all">
                    <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-background transition-colors" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Subscribe CTA */}
        {substackUrl && !loading && !error && posts.length > 0 && (
          <div className="py-8 border-t border-border text-center">
            <a
              href={substackUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:brightness-110 transition-all"
            >
              Subscribe on Substack
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>
      <div className="section-divider" />
    </section>
  );
}
