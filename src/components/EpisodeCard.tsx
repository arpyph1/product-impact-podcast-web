import { PodcastEpisode } from "@/hooks/useRSSFeed";
import { Mic2, ExternalLink } from "lucide-react";

interface EpisodeCardProps {
  episode: PodcastEpisode;
  index: number;
}

export default function EpisodeCard({ episode, index }: EpisodeCardProps) {
  const handleClick = () => {
    if (episode.link) {
      window.open(episode.link, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <article
      onClick={handleClick}
      className="group relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer bg-card border border-border"
    >
      {/* Full-bleed image */}
      {episode.imageUrl ? (
        <img
          src={episode.imageUrl}
          alt={episode.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-dark-surface">
          <Mic2 className="w-16 h-16 opacity-20 text-foreground" />
        </div>
      )}

      {/* Gradient overlay — always visible at bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

      {/* Episode number badge */}
      <span className="absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded-full bg-black/60 text-foreground border border-white/10 backdrop-blur-sm">
        EP {episode.episodeNumber}
      </span>

      {/* External link icon */}
      {episode.link && (
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center border border-white/20">
            <ExternalLink className="w-3.5 h-3.5 text-white" />
          </div>
        </div>
      )}

      {/* Title at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="font-display font-bold text-sm leading-snug text-white line-clamp-3 group-hover:text-primary transition-colors">
          {episode.title}
        </h3>
        {episode.pubDate && (
          <p className="text-xs text-white/50 mt-1">{episode.pubDate}</p>
        )}
      </div>
    </article>
  );
}
