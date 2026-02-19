import { useState, useRef } from "react";
import { PodcastEpisode } from "@/hooks/useRSSFeed";
import { Play, Pause, Clock, Calendar, Mic2 } from "lucide-react";

interface EpisodeCardProps {
  episode: PodcastEpisode;
  index: number;
}

const CARD_ACCENT_COLORS = [
  { bg: "hsl(43 96% 56%)", label: "amber" },
  { bg: "hsl(220 13% 25%)", label: "dark" },
  { bg: "hsl(174 72% 40%)", label: "teal" },
  { bg: "hsl(220 13% 22%)", label: "dark2" },
];

export default function EpisodeCard({ episode, index }: EpisodeCardProps) {
  const [playing, setPlaying] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const accentColor = CARD_ACCENT_COLORS[index % CARD_ACCENT_COLORS.length].bg;

  const togglePlay = () => {
    if (!episode.audioUrl) return;
    setShowPlayer(true);
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

  const stripHtml = (html: string) =>
    html.replace(/<[^>]*>/g, "").slice(0, 120) + "…";

  return (
    <article className="episode-card rounded-xl overflow-hidden bg-card border border-border group cursor-pointer">
      {/* Thumbnail */}
      <div
        className="relative aspect-[4/3] overflow-hidden"
        style={{ background: accentColor }}
      >
        {episode.imageUrl ? (
          <img
            src={episode.imageUrl}
            alt={episode.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Mic2 className="w-12 h-12 opacity-40 text-foreground" />
          </div>
        )}

        {/* Play button overlay */}
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40"
        >
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center glow-purple">
            {playing ? <Pause className="w-5 h-5 text-primary-foreground" /> : <Play className="w-5 h-5 text-primary-foreground ml-0.5" />}
          </div>
        </button>

        {/* Episode number badge */}
        <span className="absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded-full bg-black/60 text-foreground">
          EP {episode.episodeNumber}
        </span>
      </div>

      {/* Info */}
      <div className="p-4 space-y-2">
        <h3 className="font-display font-bold text-sm leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors">
          {episode.title}
        </h3>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {episode.pubDate && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {episode.pubDate}
            </span>
          )}
          {episode.duration && episode.duration !== "–" && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {episode.duration}
            </span>
          )}
        </div>

        {/* Inline audio player */}
        {showPlayer && episode.audioUrl && (
          <div className="pt-2">
            <audio
              ref={audioRef}
              src={episode.audioUrl}
              controls
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onEnded={() => setPlaying(false)}
              preload="none"
            />
          </div>
        )}

        {!showPlayer && episode.audioUrl && (
          <button
            onClick={togglePlay}
            className="mt-2 w-full flex items-center justify-center gap-2 text-xs font-semibold py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all"
          >
            <Play className="w-3 h-3" /> Listen
          </button>
        )}
      </div>
    </article>
  );
}
