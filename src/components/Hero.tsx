import { useState } from "react";
import { CMSContent } from "@/types/cms";
import { ArrowUpRight, Play } from "lucide-react";

interface HeroProps {
  content: CMSContent;
  isEditing: boolean;
  onUpdate: (key: keyof CMSContent, value: any) => void;
  latestEpisodeAudio?: string;
  latestEpisodeTitle?: string;
  latestEpisodeLink?: string;
}

const PLATFORMS = [
  {
    label: "Spotify",
    urlKey: "spotifyUrl" as keyof CMSContent,
    color: "#1DB954",
    svg: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current shrink-0" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.371-.721.49-1.101.241-3.021-1.858-6.832-2.278-11.322-1.237-.43.101-.851-.17-.952-.6-.1-.43.17-.851.6-.952 4.91-1.12 9.122-.64 12.521 1.41.38.24.5.72.254 1.138zm1.44-3.3c-.301.42-.841.6-1.262.3-3.461-2.122-8.731-2.74-12.832-1.5-.511.16-1.051-.12-1.211-.63-.16-.511.12-1.051.63-1.211 4.671-1.42 10.47-.741 14.461 1.71.42.301.539.84.214 1.331zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.24-.161-1.42-.74-.18-.6.16-1.24.74-1.42 4.26-1.3 11.34-1.05 15.84 1.62.54.3.72 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
      </svg>
    ),
  },
  {
    label: "Apple Podcasts",
    urlKey: "appleUrl" as keyof CMSContent,
    color: "#B150E2",
    svg: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current shrink-0" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 4.5c2.017 0 3.898.57 5.5 1.559V9.5c-1.44-1.021-3.19-1.628-5.086-1.628C7.97 7.872 5 10.842 5 14.5c0 1.696.612 3.245 1.623 4.437L5.5 20.2A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2zm0 5.5c2.76 0 5 2.24 5 5 0 1.7-.846 3.2-2.138 4.107l.948 1.642A7.47 7.47 0 0 0 19.5 12c0-4.142-3.358-7.5-7.5-7.5-2.02 0-3.856.8-5.204 2.099l1.14 1.14A5.494 5.494 0 0 1 12 6.5zm0 2.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z"/>
      </svg>
    ),
  },
  {
    label: "YouTube",
    urlKey: "youtubeUrl" as keyof CMSContent,
    color: "#FF0000",
    svg: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current shrink-0" xmlns="http://www.w3.org/2000/svg">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
];

function getYouTubeEmbedId(url: string): string | null {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

function getYouTubeThumbnail(url: string): string {
  const id = getYouTubeEmbedId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "";
}

// Flat (no rotation) video card with dark filter overlay
function VideoCard({
  url, label, urlKey, labelKey, isEditing, onUpdate,
}: {
  url: string; label: string; urlKey: keyof CMSContent; labelKey: keyof CMSContent;
  isEditing: boolean; onUpdate: (key: keyof CMSContent, value: any) => void;
}) {
  const [playing, setPlaying] = useState(false);
  const videoId = getYouTubeEmbedId(url);
  const thumb = getYouTubeThumbnail(url);

  return (
    <div className="relative flex flex-col gap-2">
      <div className="relative aspect-video rounded-xl overflow-hidden bg-card border border-border group shadow-xl">
        {playing && videoId ? (
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={label}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            {thumb ? (
              <img src={thumb} alt={label} className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 bg-muted flex items-center justify-center">
                <span className="text-xs text-muted-foreground">No video URL</span>
              </div>
            )}
            {/* Dark filter — lifts on hover */}
            <div className="absolute inset-0 bg-black/55 group-hover:bg-black/20 transition-all duration-500" />

            {videoId && (
              <button
                onClick={() => setPlaying(true)}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-11 h-11 rounded-full bg-white/90 flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 text-black ml-0.5" />
                </div>
              </button>
            )}
          </>
        )}
      </div>

      {/* Label */}
      <p
        className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider text-center"
        contentEditable={isEditing}
        suppressContentEditableWarning
        onBlur={e => isEditing && onUpdate(labelKey, e.currentTarget.textContent || "")}
      >
        {label}
      </p>

      {isEditing && (
        <input
          className="text-xs bg-black/40 border border-amber/50 text-foreground rounded px-2 py-1.5 focus:outline-none focus:border-amber w-full"
          defaultValue={url}
          placeholder="https://youtube.com/watch?v=..."
          onBlur={e => { onUpdate(urlKey, e.target.value); setPlaying(false); }}
        />
      )}
    </div>
  );
}

export default function Hero({ content, isEditing, onUpdate }: HeroProps) {
  const cards = [
    { url: content.heroVideo1Url, label: content.heroVideo1Label, urlKey: "heroVideo1Url" as keyof CMSContent, labelKey: "heroVideo1Label" as keyof CMSContent },
    { url: content.heroVideo2Url, label: content.heroVideo2Label, urlKey: "heroVideo2Url" as keyof CMSContent, labelKey: "heroVideo2Label" as keyof CMSContent },
    { url: content.heroVideo3Url, label: content.heroVideo3Label, urlKey: "heroVideo3Url" as keyof CMSContent, labelKey: "heroVideo3Label" as keyof CMSContent },
  ];

  return (
    <section id="podcast" className="relative bg-background pt-20">
      {/* Small top gap between nav and hero content */}
      <div className="pt-8" />

      {/* Headline + description + platform buttons */}
      <div className="container mx-auto px-6 pb-8 text-center">
        <h1
          className={`font-display font-black uppercase leading-[0.92] tracking-tight text-foreground mb-5 ${isEditing ? "cursor-text" : ""}`}
          style={{ fontSize: "clamp(2.4rem, 6vw, 5.5rem)", letterSpacing: "-0.03em" }}
          contentEditable={isEditing}
          suppressContentEditableWarning
          onBlur={e => isEditing && onUpdate("heroTitle", e.currentTarget.textContent || "")}
        >
          {content.heroTitle}
        </h1>

        {/* Subline — same font style as About body text */}
        <p
          className="text-muted-foreground max-w-xl mx-auto leading-relaxed mb-8"
          style={{ fontSize: "1.125rem", fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 400 }}
          contentEditable={isEditing}
          suppressContentEditableWarning
          onBlur={e => isEditing && onUpdate("heroDescription", e.currentTarget.textContent || "")}
        >
          {content.heroDescription}
        </p>

        {/* Platform buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {PLATFORMS.map(p => (
            <a
              key={p.label}
              href={isEditing ? undefined : (content[p.urlKey] as string) || "#"}
              target={!isEditing ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="group flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-border text-sm font-medium text-foreground hover:border-foreground transition-all duration-200"
            >
              <span className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ background: p.color }}>
                {p.svg}
              </span>
              {p.label}
              <ArrowUpRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </a>
          ))}
        </div>
      </div>

      {/* 
        Three video cards in a "brick" layout:
        Left and Right cards sit at the top, Centre card drops down.
        On mobile: stacked single column.
      */}
      <div className="container mx-auto px-6 pb-20">
        <div className="hidden md:grid md:grid-cols-3 gap-6 items-start">
          {/* Card 1 — top-left */}
          <div className="mt-0">
            <VideoCard {...cards[0]} isEditing={isEditing} onUpdate={onUpdate} />
          </div>
          {/* Card 2 — centre, shifted down */}
          <div className="mt-12">
            <VideoCard {...cards[1]} isEditing={isEditing} onUpdate={onUpdate} />
          </div>
          {/* Card 3 — top-right */}
          <div className="mt-0">
            <VideoCard {...cards[2]} isEditing={isEditing} onUpdate={onUpdate} />
          </div>
        </div>

        {/* Mobile: single column */}
        <div className="flex flex-col gap-6 md:hidden">
          {cards.map((card, i) => (
            <VideoCard key={i} {...card} isEditing={isEditing} onUpdate={onUpdate} />
          ))}
        </div>
      </div>

      <div className="section-divider" />
    </section>
  );
}
