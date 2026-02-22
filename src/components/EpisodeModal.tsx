import { useRef, useState } from "react";
import { PodcastEpisode } from "@/hooks/useRSSFeed";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Play, Pause, ExternalLink, Clock, Mic2, Calendar } from "lucide-react";

interface EpisodeModalProps {
  episode: PodcastEpisode | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EpisodeModal({ episode, open, onOpenChange }: EpisodeModalProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  if (!episode) return null;

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { audioRef.current?.pause(); setPlaying(false); } onOpenChange(v); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border p-0 gap-0">
        {/* Hero image */}
        <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
          {episode.imageUrl ? (
            <img
              src={episode.imageUrl}
              alt={episode.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <Mic2 className="w-16 h-16 text-muted-foreground opacity-30" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Episode title as H2 at top of body */}
          <DialogHeader className="space-y-3">
            <DialogTitle asChild>
              <h2 className="font-display font-extrabold text-2xl leading-tight text-foreground">
                {episode.title}
              </h2>
            </DialogTitle>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {episode.episodeNumber && (
                <span className="font-display font-bold text-primary uppercase tracking-wider">
                  EP {episode.episodeNumber}
                </span>
              )}
              {episode.pubDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {episode.pubDate}
                </span>
              )}
              {episode.duration && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {episode.duration}
                </span>
              )}
            </div>
          </DialogHeader>

          {/* Audio player — styled to be readable */}
          {episode.audioUrl && (
            <div className="rounded-md border border-border bg-secondary p-3 space-y-2">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
                >
                  {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{episode.title}</p>
                  {episode.duration && (
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {episode.duration}
                    </p>
                  )}
                </div>
              </div>
              <audio
                ref={audioRef}
                src={episode.audioUrl}
                controls
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onEnded={() => setPlaying(false)}
                preload="none"
                className="w-full [&::-webkit-media-controls-panel]:bg-secondary"
                style={{ height: "32px" }}
              />
            </div>
          )}

          {/* Description with clickable links */}
          {episode.description && (
            <div
              className="prose prose-invert prose-sm max-w-none text-secondary-foreground leading-relaxed
                         [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-primary/80
                         [&_p]:mb-3 [&_ul]:mb-3 [&_ol]:mb-3 [&_li]:mb-1"
              dangerouslySetInnerHTML={{ __html: episode.description }}
            />
          )}

          {/* External link */}
          {episode.link && (
            <a
              href={episode.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors border border-border rounded px-3 py-2"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View on podcast platform
            </a>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
