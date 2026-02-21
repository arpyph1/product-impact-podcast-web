import { useState, useEffect } from "react";
import { CMSContent } from "@/types/cms";
import { ArrowUpRight, Loader2, AlertCircle, Mail } from "lucide-react";

interface SubstackPost {
  title: string;
  link: string;
  pubDate: string;
  description: string;
}

interface NewsletterProps {
  content: CMSContent;
  isEditing: boolean;
  onUpdate: (key: keyof CMSContent, value: any) => void;
}

const RSS2JSON = "https://api.rss2json.com/v1/api.json?rss_url=";
const ALLORIGINS = "https://api.allorigins.win/get?url=";

function parseSubstackXML(xml: string): SubstackPost[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "text/xml");
  const items = Array.from(doc.querySelectorAll("item"));
  return items.slice(0, 8).map(item => {
    const rawTitle = item.querySelector("title")?.textContent || "";
    const title = rawTitle.replace(/^<!\[CDATA\[|\]\]>$/g, "").trim();

    // <link> is a text node sibling in many RSS feeds
    let link = item.querySelector("link")?.textContent?.trim() || "";
    if (!link) {
      const linkEl = item.querySelector("link");
      let sib = linkEl?.nextSibling;
      while (sib) {
        if (sib.nodeType === Node.TEXT_NODE && sib.textContent?.trim()) {
          link = sib.textContent.trim(); break;
        }
        sib = sib.nextSibling;
      }
    }
    if (!link) link = item.querySelector("guid")?.textContent?.trim() || "";

    const pubDateRaw = item.querySelector("pubDate")?.textContent || "";
    const date = pubDateRaw
      ? new Date(pubDateRaw).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : "";

    const rawDesc = item.querySelector("description")?.textContent || "";
    const description = rawDesc.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").trim().slice(0, 200);

    return { title, link, pubDate: date, description };
  });
}

async function fetchSubstack(substackUrl: string): Promise<SubstackPost[]> {
  let rssUrl = substackUrl.trim().replace(/\/$/, "");
  if (!rssUrl.endsWith("/feed")) rssUrl = rssUrl + "/feed";

  // 1. rss2json
  try {
    const r = await fetch(`${RSS2JSON}${encodeURIComponent(rssUrl)}`, { signal: AbortSignal.timeout(10000) });
    const data = await r.json();
    if (data.status === "ok" && Array.isArray(data.items) && data.items.length > 0) {
      return data.items.slice(0, 8).map((item: any) => ({
        title: item.title || "",
        link: item.link || item.guid || "",
        pubDate: item.pubDate
          ? new Date(item.pubDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
          : "",
        description: (item.description || item.content || "")
          .replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim().slice(0, 200),
      }));
    }
  } catch (e) {
    console.warn("rss2json substack failed:", e);
  }

  // 2. allorigins raw XML
  const r2 = await fetch(`${ALLORIGINS}${encodeURIComponent(rssUrl)}`, { signal: AbortSignal.timeout(10000) });
  const data2 = await r2.json();
  if (!data2.contents) throw new Error("No content");
  const posts = parseSubstackXML(data2.contents);
  if (posts.length === 0) throw new Error("No posts found");
  return posts;
}

export default function Newsletter({ content, isEditing, onUpdate }: NewsletterProps) {
  const [posts, setPosts] = useState<SubstackPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const substackUrl = content.substackUrl || "";

  useEffect(() => {
    if (!substackUrl) { setPosts([]); return; }

    setLoading(true);
    setError(null);
    setPosts([]);

    fetchSubstack(substackUrl)
      .then(p => { setPosts(p); setLoading(false); })
      .catch(err => {
        console.error("Substack fetch error:", err);
        setError("Could not load posts. Check your Substack URL (e.g. https://yourname.substack.com).");
        setLoading(false);
      });
  }, [substackUrl]);

  return (
    <section id="newsletter" className="bg-background" aria-label="Newsletter and blog posts">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex items-end justify-between py-10 border-b border-border gap-4 flex-wrap">
          <div>
            <h3
              className="font-display font-extrabold uppercase leading-none tracking-tight text-foreground"
              style={{ fontSize: content.h2FontSize || "clamp(1.5rem, 3.5vw, 2.8rem)", fontWeight: content.h2FontWeight || "800", letterSpacing: "-0.02em" }}
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={e => isEditing && onUpdate("blogTitle", e.currentTarget.textContent || "")}
            >
              {content.blogTitle || "From the Blog"}
            </h3>
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
              ? "Enter your Substack URL above (e.g. https://yourname.substack.com) to load posts."
              : "No newsletter configured yet."}
          </div>
        )}

        {!loading && posts.length > 0 && (
          <div className="divide-y divide-border">
            {posts.map((post, i) => (
              <a
                key={i}
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start justify-between gap-6 py-6 hover:bg-card/40 transition-colors px-4 -mx-1 rounded md:max-w-[60%] md:mx-auto"
              >
                <div className="flex-1 min-w-0">
                  {post.pubDate && (
                    <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide block mb-1.5">
                      {post.pubDate}
                    </span>
                  )}
                  <h3
                    className="font-display font-bold text-foreground leading-snug tracking-tight group-hover:text-primary transition-colors mb-2"
                    style={{ fontSize: "clamp(1rem, 1.5vw, 1.25rem)" }}
                  >
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
