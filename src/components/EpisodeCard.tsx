import { useState, useRef } from "react";
import { PodcastEpisode } from "@/hooks/useRSSFeed";
import { Play, Pause, Mic2 } from "lucide-react";

interface EpisodeCardProps {
  episode: PodcastEpisode;
  index: number;
}

export default function EpisodeCard({ episode }: EpisodeCardProps) {
  const [playing, setPlaying] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const openEpisode = () => {
    if (episode.link) window.open(episode.link, "_blank", "noopener,noreferrer");
  };

  return (
    <article className="group flex flex-col gap-3">
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
          <div className="absolute inset-0 flex items-center justify-center bg-dark-surface">
            <Mic2 className="w-12 h-12 opacity-20 text-foreground" />
          </div>
        )}

        {/* Dark gradient at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Play button — center on hover */}
        {episode.audioUrl && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <div className="w-12 h-12 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
              {playing
                ? <Pause className="w-5 h-5 text-primary-foreground" />
                : <Play className="w-5 h-5 text-primary-foreground ml-0.5" />
              }
            </div>
          </button>
        )}

        {/* Episode badge */}
        <span className="absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full bg-black/60 text-white border border-white/10 backdrop-blur-sm">
          EP {episode.episodeNumber}
        </span>
      </div>

      {/* Title below */}
      <div className="px-0.5">
        <h3
          className="font-display font-bold text-sm leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2 cursor-pointer"
          onClick={openEpisode}
        >
          {episode.title}
        </h3>
        {episode.pubDate && (
          <p className="text-xs text-muted-foreground mt-0.5">{episode.pubDate}</p>
        )}
      </div>

      {/* Mini audio player — always visible if audio exists */}
      {episode.audioUrl && (
        <div className="px-0.5">
          {!showPlayer ? (
            <button
              onClick={togglePlay}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-semibold hover:bg-primary/20 transition-all"
            >
              <Play className="w-3 h-3 shrink-0" />
              <span>Play episode</span>
            </button>
          ) : (
            <audio
              ref={audioRef}
              src={episode.audioUrl}
              controls
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onEnded={() => { setPlaying(false); }}
              preload="none"
              className="w-full h-8"
              style={{ height: "32px" }}
            />
          )}
        </div>
      )}

      {showPlayer && <audio ref={audioRef} src={episode.audioUrl} preload="none" style={{ display: "none" }} />}
    </article>
  );
}
