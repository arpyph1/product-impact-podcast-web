import { CMSContent } from "@/types/cms";
import heroPodcast from "@/assets/hero-podcast.jpg";
import { Headphones } from "lucide-react";

interface HeroProps {
  content: CMSContent;
  isEditing: boolean;
  onUpdate: (key: keyof CMSContent, value: any) => void;
  latestEpisodeAudio?: string;
  latestEpisodeTitle?: string;
}

function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  if (url.includes("youtube.com/embed/")) return url;
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  const watchMatch = url.match(/[?&]v=([^?&]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  if (url.startsWith("http")) return url;
  return null;
}

const bgColorMap: Record<string, string> = {
  coral:  "bg-coral/20 border-coral/40",
  teal:   "bg-teal/20 border-teal/40",
  amber:  "bg-amber/20 border-amber/40",
  purple: "bg-primary/20 border-primary/40",
};

export default function Hero({ content, isEditing, onUpdate, latestEpisodeAudio, latestEpisodeTitle }: HeroProps) {
  const embedUrl = getYouTubeEmbedUrl(content.featuredVideoUrl);

  return (
    <section id="podcast" className="pt-20 pb-6 px-4 circuit-bg relative overflow-hidden min-h-screen flex items-center">
      {/* Ambient glows */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-teal/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto">
        {/* Reference-style rounded card container */}
        <div className="rounded-2xl bg-dark-surface border border-border/50 p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-10 items-center">

            {/* Left: Text */}
            <div className="space-y-6">
              <h1
                className={`font-display font-extrabold leading-none tracking-tight text-glow-purple ${isEditing ? "cursor-text" : ""}`}
                style={{ fontSize: "clamp(3.5rem, 9vw, 7rem)" }}
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={e => isEditing && onUpdate("heroTitle", e.currentTarget.textContent || "")}
              >
                {content.heroTitle}
              </h1>

              <p
                className="text-muted-foreground max-w-md leading-relaxed"
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={e => isEditing && onUpdate("heroDescription", e.currentTarget.textContent || "")}
              >
                {content.heroDescription}
              </p>

              {/* CTA Row */}
              <div className="flex flex-wrap gap-3">
                <a
                  href={content.heroCta1Link}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-foreground/30 text-foreground font-semibold text-sm hover:bg-foreground/10 transition-all"
                >
                  <span
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    onBlur={e => isEditing && onUpdate("heroCta1Text", e.currentTarget.textContent || "")}
                  >
                    {content.heroCta1Text}
                  </span>
                </a>
                <a
                  href={content.heroCta2Link}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/80 transition-all glow-purple"
                >
                  <span
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    onBlur={e => isEditing && onUpdate("heroCta2Text", e.currentTarget.textContent || "")}
                  >
                    {content.heroCta2Text}
                  </span>
                </a>
              </div>

              {/* Platform pill row */}
              <div className="flex flex-wrap gap-2 pt-1">
                <a href={content.spotifyUrl || "#"} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary/80 text-primary-foreground text-xs font-semibold hover:bg-primary transition-all">
                  <Headphones className="w-3.5 h-3.5" /> Spotify
                </a>
                <a href={content.appleUrl || "#"} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary/80 text-primary-foreground text-xs font-semibold hover:bg-primary transition-all">
                  <Headphones className="w-3.5 h-3.5" /> Apple Podcasts
                </a>
                <a href="#episodes"
                  className="px-3 py-2 rounded-full bg-primary/80 text-primary-foreground text-xs font-semibold hover:bg-primary transition-all">
                  ▶
                </a>
              </div>

              {/* CMS editing hints */}
              {isEditing && (
                <div className="p-3 rounded-lg bg-amber/10 border border-amber/30 space-y-2">
                  <p className="text-xs text-amber font-semibold">Featured Video URL (YouTube):</p>
                  <input
                    className="w-full text-xs bg-black/40 border border-amber/50 text-foreground rounded px-2 py-1.5 focus:outline-none focus:border-amber"
                    defaultValue={content.featuredVideoUrl}
                    placeholder="https://youtube.com/watch?v=..."
                    onBlur={e => onUpdate("featuredVideoUrl", e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* Right: Video embed or portrait card */}
            <div className="flex justify-center lg:justify-end">
              {embedUrl ? (
                <div className="w-full max-w-md">
                  <div className="relative w-full rounded-2xl overflow-hidden border border-border neon-border shadow-2xl" style={{ paddingBottom: "56.25%" }}>
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src={embedUrl}
                      title="Featured Episode"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  {latestEpisodeTitle && (
                    <p className="mt-2 text-xs text-muted-foreground text-center truncate">▶ {latestEpisodeTitle}</p>
                  )}
                </div>
              ) : (
                /* Portrait card — matches reference layout */
                <div className="relative group">
                  {/* Pills at top — like reference */}
                  <div className="absolute -top-3 left-3 right-3 flex gap-2 z-10">
                    <span className="bg-card/90 backdrop-blur rounded-full px-3 py-1 text-xs text-foreground border border-border">
                      {content.podcastName}
                    </span>
                    <span className="bg-card/90 backdrop-blur rounded-full px-3 py-1 text-xs text-foreground border border-border flex-1 flex justify-between">
                      <span>Episode</span>
                      <span className="opacity-50">✕ ⎕</span>
                    </span>
                  </div>

                  <div
                    className={`relative rounded-2xl overflow-hidden border-2 neon-border ${bgColorMap[content.heroCardBg] || bgColorMap.coral}`}
                    style={{ width: 320, height: 380 }}
                  >
                    <img
                      src={content.heroImageUrl || heroPodcast}
                      alt="Podcast host"
                      className="w-full h-full object-cover"
                      onError={e => { (e.target as HTMLImageElement).src = heroPodcast; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>

                  {isEditing && (
                    <div className="mt-2">
                      <input
                        className="w-full text-xs bg-card border border-amber/50 text-foreground rounded px-2 py-1 focus:outline-none focus:border-amber"
                        defaultValue={content.heroImageUrl}
                        placeholder="Hero image URL..."
                        onBlur={e => onUpdate("heroImageUrl", e.target.value)}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
