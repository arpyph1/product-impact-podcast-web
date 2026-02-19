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

function parseSubstackFeed(xml: string): SubstackPost[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "text/xml");
  const items = Array.from(doc.querySelectorAll("item"));
  return items.slice(0, 6).map(item => {
    const title = item.querySelector("title")?.textContent || "";
    const link = item.querySelector("link")?.textContent || "";
    const pubDate = item.querySelector("pubDate")?.textContent || "";
    const description = item.querySelector("description")?.textContent?.replace(/<[^>]*>/g, "").slice(0, 180) || "";
    const date = pubDate ? new Date(pubDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";
    return { title, link, pubDate: date, description };
  });
}

export default function Newsletter({ content, isEditing, onUpdate }: NewsletterProps) {
  const [posts, setPosts] = useState<SubstackPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const substackUrl = (content as any).substackUrl as string | undefined;

  useEffect(() => {
    if (!substackUrl) return;
    // derive RSS feed URL from substack publication URL
    let rssUrl = substackUrl.trim().replace(/\/$/, "");
    if (!rssUrl.includes("/feed")) rssUrl = rssUrl + "/feed";

    setLoading(true);
    setError(null);

    const proxy = `https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`;
    fetch(proxy)
      .then(r => r.json())
      .then(data => {
        const parsed = parseSubstackFeed(data.contents);
        if (parsed.length === 0) throw new Error("No posts found");
        setPosts(parsed);
      })
      .catch(() => setError("Could not load newsletter posts. Check your Substack URL."))
      .finally(() => setLoading(false));
  }, [substackUrl]);

  return (
    <section id="newsletter" className="bg-background">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex items-end justify-between py-10 border-b border-border gap-4">
          <div>
            <p className="text-xs text-primary font-semibold uppercase tracking-widest mb-3">Newsletter</p>
            <h2
              className="font-display font-black uppercase leading-none tracking-tight text-foreground"
              style={{ fontSize: "clamp(2rem, 5vw, 4rem)", letterSpacing: "-0.02em" }}
            >
              From the Blog
            </h2>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {isEditing && (
              <input
                className="text-xs bg-card border border-amber/50 text-foreground rounded px-2 py-1.5 w-64 focus:outline-none focus:border-amber"
                defaultValue={substackUrl || ""}
                onBlur={e => onUpdate("substackUrl" as keyof CMSContent, e.target.value)}
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
            <AlertCircle className="w-5 h-5 text-coral" />
            <p className="text-muted-foreground text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && !substackUrl && (
          <div className="py-12 text-center text-muted-foreground text-sm">
            {isEditing ? "Enter your Substack URL above to load posts." : "No newsletter configured yet."}
          </div>
        )}

        {/* Posts list */}
        {!loading && posts.length > 0 && (
          <div className="divide-y divide-border">
            {posts.map((post, i) => (
              <a
                key={i}
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start justify-between gap-6 py-6 hover:bg-card/40 transition-colors px-1"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    {post.pubDate && (
                      <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide shrink-0">
                        {post.pubDate}
                      </span>
                    )}
                  </div>
                  <h3 className="font-display font-black uppercase text-foreground text-base leading-tight tracking-tight group-hover:text-primary transition-colors mb-1.5"
                    style={{ letterSpacing: "-0.01em" }}>
                    {post.title}
                  </h3>
                  {post.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{post.description}</p>
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
        {substackUrl && !loading && !error && (
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
