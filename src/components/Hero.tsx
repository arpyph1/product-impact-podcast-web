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
  // Already an embed URL
  if (url.includes("youtube.com/embed/")) return url;
  // youtu.be short link
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  // youtube.com/watch?v=
  const watchMatch = url.match(/[?&]v=([^?&]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  // Treat as raw embed if it's a URL at all
  if (url.startsWith("http")) return url;
  return null;
}

export default function Hero({ content, isEditing, onUpdate, latestEpisodeAudio, latestEpisodeTitle }: HeroProps) {
  const embedUrl = getYouTubeEmbedUrl(content.featuredVideoUrl);

  return (
    <section
      id="podcast"
      className="min-h-screen flex items-center pt-16 circuit-bg relative overflow-hidden"
    >
      {/* Ambient glows */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-teal/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 py-20 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left: Text */}
        <div className="space-y-6">
          <div className="flex gap-2 flex-wrap">
            {["PODCAST", "DARK", "DEEP"].map(tag => (
              <span
                key={tag}
                className="text-xs font-semibold px-3 py-1 rounded-full border border-primary/40 text-primary bg-primary/10 tracking-wider"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1
            className={`font-display font-extrabold leading-none tracking-tight text-glow-purple fade-up fade-up-delay-1 ${
              isEditing ? "cursor-text" : ""
            }`}
            style={{ fontSize: "clamp(3rem, 8vw, 6rem)" }}
            data-cms-editable="heroTitle"
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={e => isEditing && onUpdate("heroTitle", e.currentTarget.textContent || "")}
          >
            {content.heroTitle}
          </h1>

          <p
            className="text-lg text-muted-foreground max-w-lg fade-up fade-up-delay-2"
            data-cms-editable="heroDescription"
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={e => isEditing && onUpdate("heroDescription", e.currentTarget.textContent || "")}
          >
            {content.heroDescription}
          </p>

          <div className="flex flex-wrap gap-3 fade-up fade-up-delay-3">
            <a
              href={content.heroCta1Link}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-foreground/30 text-foreground font-semibold hover:bg-foreground/10 transition-all"
            >
              <Headphones className="w-4 h-4" />
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
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/80 transition-all glow-purple"
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

          {/* Latest episode audio fallback (when no video set) */}
          {latestEpisodeAudio && !content.featuredVideoUrl && (
            <div className="mt-4 p-4 rounded-xl bg-card/60 border border-border neon-border space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-muted-foreground font-medium truncate max-w-[260px]">
                  Latest: {latestEpisodeTitle}
                </span>
              </div>
              <audio controls src={latestEpisodeAudio} preload="none" className="w-full" />
            </div>
          )}

          {/* Video URL edit in CMS mode */}
          {isEditing && (
            <div className="p-3 rounded-lg bg-amber/10 border border-amber/30 space-y-1">
              <p className="text-xs text-amber font-semibold">Featured Video URL (YouTube or embed):</p>
              <input
                className="w-full text-xs bg-black/40 border border-amber/50 text-foreground rounded px-2 py-1.5 focus:outline-none focus:border-amber"
                defaultValue={content.featuredVideoUrl}
                placeholder="https://youtube.com/watch?v=..."
                onBlur={e => onUpdate("featuredVideoUrl", e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Right: 16:9 video player or fallback image */}
        <div className="relative flex justify-center lg:justify-end">
          {embedUrl ? (
            <div className="w-full max-w-lg">
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
                <p className="mt-3 text-xs text-muted-foreground text-center">
                  Featured: {latestEpisodeTitle}
                </p>
              )}
            </div>
          ) : (
            <div
              className="relative rounded-2xl overflow-hidden border-2 neon-border bg-dark-surface"
              style={{ width: 340, height: 400 }}
            >
              <img
                src={content.heroImageUrl || heroPodcast}
                alt="Podcast"
                className="w-full h-full object-cover"
                onError={e => { (e.target as HTMLImageElement).src = heroPodcast; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              {isEditing && (
                <div className="absolute bottom-3 left-3 right-3">
                  <input
                    className="w-full text-xs bg-black/60 border border-amber/50 text-white rounded px-2 py-1 focus:outline-none focus:border-amber"
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
    </section>
  );
}
