import { useState, useRef } from "react";
import { PodcastEpisode } from "@/hooks/useRSSFeed";
import { Play, Pause, Mic2, ExternalLink } from "lucide-react";

interface EpisodeCardProps {
  episode: PodcastEpisode;
  index: number;
}

export default function EpisodeCard({ episode, index }: EpisodeCardProps) {
  const [playing, setPlaying] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!episode.audioUrl) return;
    if (!showPlayer) {
      setShowPlayer(true);
      // play on next tick after audio mounts
      setTimeout(() => {
        audioRef.current?.play();
        setPlaying(true);
      }, 50);
      return;
    }
    if (audioRef.current) {
      if (playing) {
        audioRef.current.pause();
        setPlaying(false);
      } else {
        audioRef.current.play();
        setPlaying(true);
      }
    }
  };

  const openEpisode = () => {
    if (episode.link) window.open(episode.link, "_blank", "noopener,noreferrer");
  };

  return (
    <article className="episode-card group flex flex-col gap-2">
      {/* Square image with play overlay */}
      <div
        className="relative aspect-square rounded-xl overflow-hidden bg-card border border-border cursor-pointer"
        onClick={openEpisode}
      >
        {episode.imageUrl ? (
          <img
            src={episode.imageUrl}
            alt={episode.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, hsl(var(--primary)/0.2), hsl(var(--accent)/0.2))" }}>
            <Mic2 className="w-10 h-10 opacity-30 text-foreground" />
          </div>
        )}

        {/* Dark gradient at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Play button — center on hover */}
        {episode.audioUrl && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-xl"
              style={{ background: "hsl(var(--primary))", boxShadow: "0 0 20px hsl(var(--primary)/0.6)" }}>
              {playing
                ? <Pause className="w-5 h-5 text-primary-foreground" />
                : <Play className="w-5 h-5 text-primary-foreground ml-0.5" />
              }
            </div>
          </button>
        )}

        {/* Episode badge */}
        <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/70 text-white border border-white/10 backdrop-blur-sm">
          EP {episode.episodeNumber}
        </span>

        {/* External link icon */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-6 h-6 rounded-full bg-black/70 flex items-center justify-center backdrop-blur-sm">
            <ExternalLink className="w-3 h-3 text-white" />
          </div>
        </div>
      </div>

      {/* Title + date below */}
      <div className="px-0.5 flex-1">
        <h3
          className="font-display font-bold text-xs leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2 cursor-pointer"
          onClick={openEpisode}
        >
          {episode.title}
        </h3>
        {episode.pubDate && (
          <p className="text-[10px] text-muted-foreground mt-0.5">{episode.pubDate}</p>
        )}
      </div>

      {/* Mini audio player */}
      {episode.audioUrl && (
        <div className="px-0.5">
          {!showPlayer ? (
            <button
              onClick={togglePlay}
              className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: "hsl(var(--primary)/0.1)",
                border: "1px solid hsl(var(--primary)/0.25)",
                color: "hsl(var(--primary))",
              }}
            >
              <Play className="w-3 h-3 shrink-0" />
              <span>Play episode</span>
              {episode.duration && (
                <span className="ml-auto text-muted-foreground text-[10px]">{episode.duration}</span>
              )}
            </button>
          ) : (
            <audio
              ref={audioRef}
              src={episode.audioUrl}
              controls
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onEnded={() => setPlaying(false)}
              preload="none"
              className="w-full"
              style={{ height: "32px" }}
            />
          )}
        </div>
      )}
    </article>
  );
}
