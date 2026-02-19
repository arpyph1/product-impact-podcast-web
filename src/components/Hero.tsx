import { CMSContent } from "@/types/cms";
import logo from "@/assets/logo.png";
import { Headphones, Play } from "lucide-react";

interface HeroProps {
  content: CMSContent;
  isEditing: boolean;
  onUpdate: (key: keyof CMSContent, value: any) => void;
  latestEpisodeAudio?: string;
  latestEpisodeTitle?: string;
  latestEpisodeLink?: string;
}

function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  if (url.includes("youtube.com/embed/")) return url;
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  const watchMatch = url.match(/[?&]v=([^?&]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  return null;
}

const PLATFORMS = [
  {
    label: "Spotify",
    urlKey: "spotifyUrl" as keyof CMSContent,
    color: "hsl(141 73% 42%)",
    svg: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.371-.721.49-1.101.241-3.021-1.858-6.832-2.278-11.322-1.237-.43.101-.851-.17-.952-.6-.1-.43.17-.851.6-.952 4.91-1.12 9.122-.64 12.521 1.41.38.24.5.72.254 1.138zm1.44-3.3c-.301.42-.841.6-1.262.3-3.461-2.122-8.731-2.74-12.832-1.5-.511.16-1.051-.12-1.211-.63-.16-.511.12-1.051.63-1.211 4.671-1.42 10.47-.741 14.461 1.71.42.301.539.84.214 1.331zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.24-.161-1.42-.74-.18-.6.16-1.24.74-1.42 4.26-1.3 11.34-1.05 15.84 1.62.54.3.72 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
      </svg>
    ),
  },
  {
    label: "Apple Podcasts",
    urlKey: "appleUrl" as keyof CMSContent,
    color: "hsl(265 80% 60%)",
    svg: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 4.5c2.017 0 3.898.57 5.5 1.559V9.5c-1.44-1.021-3.19-1.628-5.086-1.628C7.97 7.872 5 10.842 5 14.5c0 1.696.612 3.245 1.623 4.437L5.5 20.2A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2zm0 5.5c2.76 0 5 2.24 5 5 0 1.7-.846 3.2-2.138 4.107l.948 1.642A7.47 7.47 0 0 0 19.5 12c0-4.142-3.358-7.5-7.5-7.5-2.02 0-3.856.8-5.204 2.099l1.14 1.14A5.494 5.494 0 0 1 12 6.5zm0 2.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z"/>
      </svg>
    ),
  },
  {
    label: "YouTube",
    urlKey: "youtubeUrl" as keyof CMSContent,
    color: "hsl(0 72% 50%)",
    svg: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
];

export default function Hero({ content, isEditing, onUpdate, latestEpisodeAudio, latestEpisodeTitle, latestEpisodeLink }: HeroProps) {
  // Try CMS URL first, then check if latest episode link is YouTube
  const rawVideoUrl = content.featuredVideoUrl || latestEpisodeLink || "";
  const embedUrl = getYouTubeEmbedUrl(rawVideoUrl);

  return (
    <section id="podcast" className="pt-20 pb-4 px-4 hero-gradient relative overflow-hidden min-h-screen flex items-center">
      {/* Ambient glows */}
      <div className="absolute top-16 left-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -translate-x-1/2" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/8 rounded-full blur-[120px] pointer-events-none translate-x-1/3" />
      {/* Dot grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage: "radial-gradient(hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="container mx-auto relative z-10">
        <div className="studio-card p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-10 items-center">

            {/* LEFT: Logo + Title + Platforms */}
            <div className="flex flex-col items-start gap-6">
              {/* Logo */}
              <div className="relative">
                <div className="absolute inset-0 bg-primary/30 rounded-full blur-2xl scale-110" />
                <img
                  src={logo}
                  alt={content.podcastName}
                  className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-2xl object-cover shadow-2xl"
                />
              </div>

              {/* Podcast title */}
              <div>
                <h1
                  className={`font-display font-extrabold leading-none tracking-tight text-glow-orange gradient-text ${isEditing ? "cursor-text" : ""}`}
                  style={{ fontSize: "clamp(2.8rem, 7vw, 5.5rem)" }}
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={e => isEditing && onUpdate("heroTitle", e.currentTarget.textContent || "")}
                >
                  {content.heroTitle}
                </h1>
                <p
                  className="mt-3 text-muted-foreground max-w-md leading-relaxed text-base"
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={e => isEditing && onUpdate("heroDescription", e.currentTarget.textContent || "")}
                >
                  {content.heroDescription}
                </p>
              </div>

              {/* Platform buttons */}
              <div className="flex flex-wrap gap-3">
                {PLATFORMS.map(p => (
                  <a
                    key={p.label}
                    href={isEditing ? undefined : (content[p.urlKey] as string) || "#"}
                    target={!isEditing ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm text-white transition-all hover:scale-105 hover:brightness-110 shadow-lg"
                    style={{ background: p.color }}
                  >
                    {p.svg}
                    {p.label}
                  </a>
                ))}
              </div>

              {/* CMS editing hints */}
              {isEditing && (
                <div className="p-3 rounded-lg bg-amber/10 border border-amber/30 space-y-2 w-full">
                  <p className="text-xs text-amber font-semibold">Featured Video URL (YouTube):</p>
                  <input
                    className="w-full text-xs bg-black/40 border border-amber/50 text-foreground rounded px-2 py-1.5 focus:outline-none focus:border-amber"
                    defaultValue={content.featuredVideoUrl}
                    placeholder="https://youtube.com/watch?v=... (leave blank to auto-detect from RSS)"
                    onBlur={e => onUpdate("featuredVideoUrl", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Leave blank — if the latest episode links to YouTube, it will embed automatically.</p>
                </div>
              )}
            </div>

            {/* RIGHT: 16:9 video embed or fallback audio card */}
            <div className="flex flex-col gap-4">
              {embedUrl ? (
                <div className="w-full rounded-2xl overflow-hidden border border-border neon-border shadow-2xl" style={{ paddingBottom: "56.25%", position: "relative" }}>
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={embedUrl}
                    title="Featured Episode"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                /* Fallback: styled episode card */
                <div className="rounded-2xl overflow-hidden border border-border neon-border bg-card p-6 flex flex-col gap-5">
                  {/* Waveform visual */}
                  <div className="flex items-end justify-center gap-1 h-16">
                    {[...Array(18)].map((_, i) => (
                      <div
                        key={i}
                        className="wave-bar"
                        style={{
                          height: `${20 + Math.sin(i * 0.8) * 18 + Math.random() * 16}px`,
                          animationDelay: `${i * 0.07}s`,
                          opacity: 0.7 + Math.random() * 0.3,
                        }}
                      />
                    ))}
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-1">Latest Episode</p>
                    <p className="font-display font-bold text-foreground text-base leading-snug line-clamp-2">
                      {latestEpisodeTitle || "Loading latest episode…"}
                    </p>
                  </div>

                  {latestEpisodeAudio && (
                    <audio
                      src={latestEpisodeAudio}
                      controls
                      preload="none"
                      className="w-full"
                    />
                  )}

                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">
                      💡 Paste a YouTube URL in <strong>Edit Site → Hero</strong> to show the video player here
                    </p>
                  </div>
                </div>
              )}

              {embedUrl && latestEpisodeTitle && (
                <p className="text-xs text-muted-foreground text-center truncate">▶ {latestEpisodeTitle}</p>
              )}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
