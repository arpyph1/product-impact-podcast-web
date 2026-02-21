import { useState, useRef, useEffect } from "react";
import { CMSContent } from "@/types/cms";
import { Play, Loader2, AlertCircle } from "lucide-react";
import { PodcastEpisode } from "@/hooks/useRSSFeed";
import { useLatestShorts, ShortResult } from "@/hooks/useLatestShort";

interface HeroProps {
  content: CMSContent;
  isEditing: boolean;
  onUpdate: (key: keyof CMSContent, value: any) => void;
  latestEpisodeAudio?: string;
  latestEpisodeTitle?: string;
  latestEpisodeLink?: string;
  episodes?: PodcastEpisode[];
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

function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

// Resolve video data for a card based on mode
function resolveCard(
  mode: string,
  customUrl: string,
  shorts: ShortResult[],
  mostWatched: ShortResult | null,
): { videoId: string | null; thumbnail: string | null; title: string } {
  if (mode === "latest_short") {
    const s = shorts[0];
    return s ? { videoId: s.videoId, thumbnail: s.thumbnail, title: s.title } : { videoId: null, thumbnail: null, title: "" };
  }
  if (mode === "second_short") {
    const s = shorts[1];
    return s ? { videoId: s.videoId, thumbnail: s.thumbnail, title: s.title } : { videoId: null, thumbnail: null, title: "" };
  }
  if (mode === "most_watched") {
    return mostWatched
      ? { videoId: mostWatched.videoId, thumbnail: mostWatched.thumbnail, title: mostWatched.title }
      : { videoId: null, thumbnail: null, title: "" };
  }
  if (mode === "custom") {
    const id = getYouTubeEmbedId(customUrl);
    return { videoId: id, thumbnail: id ? getYouTubeThumbnail(id) : null, title: "" };
  }
  return { videoId: null, thumbnail: null, title: "" };
}

// Vertical video card (portrait 9:16)
function VideoCard({
  videoId,
  thumbnail,
  title,
  label,
  modeKey,
  urlKey,
  mode,
  customUrl,
  isEditing,
  onUpdate,
  shortsLoading,
  shortsError,
}: {
  videoId: string | null;
  thumbnail: string | null;
  title: string;
  label: string;
  modeKey: keyof CMSContent;
  urlKey: keyof CMSContent;
  mode: string;
  customUrl: string;
  isEditing: boolean;
  onUpdate: (key: keyof CMSContent, value: any) => void;
  shortsLoading: boolean;
  shortsError: string | null;
}) {
  const [playing, setPlaying] = useState(false);
  const isShortMode = mode === "latest_short" || mode === "second_short" || mode === "most_watched";

  return (
    <div className="relative flex flex-col gap-2">
      <div className="relative rounded-xl overflow-hidden bg-card border border-border group shadow-xl" style={{ aspectRatio: "9/16" }}>
        {/* Loading state for short modes */}
        {isShortMode && shortsLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="text-xs font-medium">Finding Shorts…</span>
            </div>
          </div>
        ) : isShortMode && !videoId && shortsError ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-muted-foreground px-4 text-center">
              <AlertCircle className="w-6 h-6 text-destructive" />
              <span className="text-xs">{shortsError}</span>
            </div>
          </div>
        ) : playing && videoId ? (
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={label}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            {thumbnail ? (
              <img src={thumbnail} alt={title || label} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
            ) : (
              <div className="absolute inset-0 bg-muted flex items-center justify-center">
                <span className="text-xs text-muted-foreground text-center px-3">
                  {mode === "latest_short" ? "Latest Short" : mode === "second_short" ? "2nd Latest Short" : mode === "most_watched" ? "Most Watched" : "No video URL"}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/20 transition-all duration-500" />

            {videoId && (
              <button
                onClick={() => setPlaying(true)}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 text-black ml-0.5" />
                </div>
              </button>
            )}

            {/* Title overlay for shorts */}
            {title && (
              <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                <span className="text-xs font-medium text-white/90 line-clamp-2">{title}</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* CMS controls */}
      {isEditing && (
        <div className="flex flex-col gap-1.5 mt-1">
          <select
            value={mode}
            onChange={e => { onUpdate(modeKey, e.target.value); setPlaying(false); }}
            className="text-xs bg-card border border-amber/50 text-foreground rounded px-2 py-1.5 focus:outline-none focus:border-amber"
          >
            <option value="latest_short">Most recent YouTube Short</option>
            <option value="second_short">2nd most recent YouTube Short</option>
            <option value="most_watched">Most watched YouTube Short</option>
            <option value="custom">Custom YouTube URL</option>
          </select>
          {mode === "custom" && (
            <input
              className="text-xs bg-card border border-amber/50 text-foreground rounded px-2 py-1.5 focus:outline-none focus:border-amber"
              defaultValue={customUrl}
              placeholder="https://youtube.com/watch?v=..."
              onBlur={e => { onUpdate(urlKey, e.target.value); setPlaying(false); }}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default function Hero({ content, isEditing, onUpdate, episodes = [] }: HeroProps) {
  const { shorts, mostWatched, loading: shortsLoading, error: shortsError } = useLatestShorts(content.youtubeChannelId || undefined);

  const cards = [
    {
      mode: content.heroVideo1Mode,
      customUrl: content.heroVideo1Url,
      label: content.heroVideo1Label,
      modeKey: "heroVideo1Mode" as keyof CMSContent,
      urlKey: "heroVideo1Url" as keyof CMSContent,
    },
    {
      mode: content.heroVideo2Mode,
      customUrl: content.heroVideo2Url,
      label: content.heroVideo2Label,
      modeKey: "heroVideo2Mode" as keyof CMSContent,
      urlKey: "heroVideo2Url" as keyof CMSContent,
    },
    {
      mode: content.heroVideo3Mode,
      customUrl: content.heroVideo3Url,
      label: content.heroVideo3Label,
      modeKey: "heroVideo3Mode" as keyof CMSContent,
      urlKey: "heroVideo3Url" as keyof CMSContent,
    },
  ];

  return (
    <section id="podcast" className="relative bg-background pt-20" aria-label="Podcast hero">
      <div style={{ paddingTop: "120px" }} />

      {/* Headline + platform buttons */}
      <div className="container mx-auto px-6 pb-8 text-center">
        <h1
          className={`font-display font-black uppercase leading-[0.92] tracking-tight text-foreground mb-5 mx-auto ${isEditing ? "cursor-text" : ""}`}
          style={{ fontSize: content.h1FontSize || "clamp(2.4rem, 6vw, 5.5rem)", fontWeight: content.h1FontWeight || "900", letterSpacing: "-0.03em", maxWidth: "65%" }}
          contentEditable={isEditing}
          suppressContentEditableWarning
          onBlur={e => isEditing && onUpdate("heroTitle", e.currentTarget.textContent || "")}
        >
          {content.heroTitle}
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {PLATFORMS.map(p => (
            <a
              key={p.label}
              href={isEditing ? undefined : (content[p.urlKey] as string) || "#"}
              target={!isEditing ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="group flex items-center gap-3 px-7 py-4 rounded-full border border-border text-base font-medium text-foreground hover:border-foreground transition-all duration-200"
            >
              <span className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-white" style={{ background: p.color }}>
                {p.svg}
              </span>
              {p.label}
            </a>
          ))}
        </div>
      </div>

      {/* Three vertical video cards — staircase layout */}
      <div className="container mx-auto px-6 pb-12">
        <div className="max-w-3xl mx-auto">
          {/* Desktop: 3-column staircase */}
          <div className="hidden md:grid md:grid-cols-3 gap-7 items-start">
            {cards.map((card, i) => {
              const resolved = resolveCard(card.mode, card.customUrl, shorts, mostWatched);
              return (
                <div key={i} style={{ marginTop: `${i * 2.5}rem` }}>
                  <VideoCard
                    videoId={resolved.videoId}
                    thumbnail={resolved.thumbnail}
                    title={resolved.title}
                    label={card.label}
                    modeKey={card.modeKey}
                    urlKey={card.urlKey}
                    mode={card.mode}
                    customUrl={card.customUrl}
                    isEditing={isEditing}
                    onUpdate={onUpdate}
                    shortsLoading={shortsLoading}
                    shortsError={shortsError}
                  />
                </div>
              );
            })}
          </div>

          {/* Mobile: horizontal swipeable carousel */}
          <div className="md:hidden">
            <div
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 -mx-6 px-6"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
            >
              {cards.map((card, i) => {
                const resolved = resolveCard(card.mode, card.customUrl, shorts, mostWatched);
                return (
                  <div key={i} className="snap-center shrink-0" style={{ width: "55vw", maxWidth: "220px" }}>
                    <VideoCard
                      videoId={resolved.videoId}
                      thumbnail={resolved.thumbnail}
                      title={resolved.title}
                      label={card.label}
                      modeKey={card.modeKey}
                      urlKey={card.urlKey}
                      mode={card.mode}
                      customUrl={card.customUrl}
                      isEditing={isEditing}
                      onUpdate={onUpdate}
                      shortsLoading={shortsLoading}
                      shortsError={shortsError}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Hero description — h2 for SEO */}
      <div className="container mx-auto px-6 pb-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="text-muted-foreground leading-relaxed"
            style={{ fontSize: "1.5rem", lineHeight: "1.6", fontWeight: "200" }}
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={e => {
              if (isEditing) {
                // Preserve <br> tags from the HTML
                const html = e.currentTarget.innerHTML || "";
                onUpdate("heroDescription", html);
              }
            }}
            dangerouslySetInnerHTML={{ __html: content.heroDescription || content.aboutDescription }}
          />
        </div>
      </div>

      <div className="section-divider" />
    </section>
  );
}
