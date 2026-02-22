import { useState, useRef } from "react";
import { PodcastEpisode } from "@/hooks/useRSSFeed";
import { Play, Pause, Mic2 } from "lucide-react";
import EpisodeModal from "./EpisodeModal";

interface EpisodeCardProps {
  episode: PodcastEpisode;
  index: number;
  episodes: PodcastEpisode[];
}

export default function EpisodeCard({ episode, index, episodes }: EpisodeCardProps) {
  const [playing, setPlaying] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(index);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!episode.audioUrl) return;
    if (!showPlayer) {
      setShowPlayer(true);
      setTimeout(() => { audioRef.current?.play(); setPlaying(true); }, 50);
      return;
    }
    if (audioRef.current) {
      if (playing) { audioRef.current.pause(); setPlaying(false); }
      else { audioRef.current.play(); setPlaying(true); }
    }
  };

  const openModal = () => {
    setModalIndex(index);
    setModalOpen(true);
  };

  const currentModalEpisode = episodes[modalIndex] || episode;

  return (
    <>
      <article className="episode-card group flex flex-col gap-2 md:max-w-[75%] mx-auto">
        {/* Square image */}
        <div
          className="relative aspect-square rounded-sm overflow-hidden bg-card cursor-pointer"
          onClick={openModal}
        >
          {episode.imageUrl ? (
            <img
              src={episode.imageUrl}
              alt={episode.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <Mic2 className="w-8 h-8 opacity-20 text-foreground" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          {/* Play overlay */}
          {episode.audioUrl && (
            <button
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-lg">
                {playing
                  ? <Pause className="w-4 h-4 text-black" />
                  : <Play className="w-4 h-4 text-black ml-0.5" />
                }
              </div>
            </button>
          )}

          {/* Episode number */}
          <span className="absolute bottom-2 left-2 text-[10px] font-bold font-display text-white/60">
            {episode.episodeNumber && `EP ${episode.episodeNumber}`}
          </span>
        </div>

        {/* Title + date */}
        <div className="flex-1">
          <h3
            className="font-display font-bold text-xs leading-snug text-foreground line-clamp-2 cursor-pointer hover:text-primary transition-colors"
            onClick={openModal}
          >
            {episode.title}
          </h3>
          {episode.pubDate && (
            <p className="text-[10px] text-muted-foreground mt-1">{episode.pubDate}</p>
          )}
        </div>

        {/* Audio player */}
        {episode.audioUrl && (
          <div>
            {!showPlayer ? (
              <button
                onClick={togglePlay}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded border border-border text-[11px] font-medium text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-all"
              >
                <Play className="w-3 h-3 shrink-0" />
                Play
                {episode.duration && <span className="ml-auto opacity-60">{episode.duration}</span>}
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
                style={{ height: "28px" }}
              />
            )}
          </div>
        )}
      </article>

      <EpisodeModal
        episode={currentModalEpisode}
        open={modalOpen}
        onOpenChange={setModalOpen}
        hasPrev={modalIndex > 0}
        hasNext={modalIndex < episodes.length - 1}
        onPrev={() => setModalIndex(i => Math.max(0, i - 1))}
        onNext={() => setModalIndex(i => Math.min(episodes.length - 1, i + 1))}
      />
    </>
  );
}
