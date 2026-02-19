import { PodcastEpisode } from "@/hooks/useRSSFeed";
import { Mic2 } from "lucide-react";

interface EpisodeCardProps {
  episode: PodcastEpisode;
  index: number;
}

export default function EpisodeCard({ episode }: EpisodeCardProps) {
  const handleClick = () => {
    if (episode.link) {
      window.open(episode.link, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <article
      onClick={handleClick}
      className="group cursor-pointer"
    >
      {/* Full-bleed image */}
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-card border border-border mb-3">
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

        {/* Subtle hover overlay */}
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />
      </div>

      {/* Title below image — like the reference design */}
      <div className="px-1">
        <p className="text-xs text-muted-foreground mb-1 uppercase tracking-widest font-semibold">
          EP {episode.episodeNumber}{episode.pubDate ? ` · ${episode.pubDate}` : ""}
        </p>
        <h3 className="font-display font-bold text-sm leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {episode.title}
        </h3>
      </div>
    </article>
  );
}
