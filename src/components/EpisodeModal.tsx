import { useRef, useState, useEffect, useCallback } from "react";
import { PodcastEpisode } from "@/hooks/useRSSFeed";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Play, Pause, ExternalLink, Clock, Mic2, Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";

interface EpisodeModalProps {
  episode: PodcastEpisode | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export default function EpisodeModal({ episode, open, onOpenChange, onPrev, onNext, hasPrev, hasNext }: EpisodeModalProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Reset audio state when episode changes
  useEffect(() => {
    setPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [episode?.guid]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current && isFinite(audioRef.current.duration)) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audioRef.current.currentTime = pct * duration;
  };

  const formatTime = (s: number) => {
    if (!isFinite(s) || s < 0) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const handleClose = () => {
    audioRef.current?.pause();
    setPlaying(false);
    onOpenChange(false);
  };

  // Keyboard nav
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "ArrowLeft" && hasPrev && onPrev) { e.preventDefault(); onPrev(); }
    if (e.key === "ArrowRight" && hasNext && onNext) { e.preventDefault(); onNext(); }
  }, [hasPrev, hasNext, onPrev, onNext]);

  useEffect(() => {
    if (open) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [open, handleKeyDown]);

  if (!episode) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border p-0 gap-0 [&>button]:hidden">
        {/* Custom close button — larger */}
        <button
          onClick={handleClose}
          className="absolute right-3 top-3 z-50 w-8 h-8 rounded-full bg-background/80 backdrop-blur flex items-center justify-center text-foreground hover:bg-background transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left/Right navigation arrows */}
        {hasPrev && onPrev && (
          <button
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full bg-background/80 backdrop-blur flex items-center justify-center text-foreground hover:bg-background transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        {hasNext && onNext && (
          <button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full bg-background/80 backdrop-blur flex items-center justify-center text-foreground hover:bg-background transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Hero image */}
        <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
          {episode.imageUrl ? (
            <img src={episode.imageUrl} alt={episode.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <Mic2 className="w-16 h-16 text-muted-foreground opacity-30" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        </div>

        {/* Body content */}
        <div className="p-6 space-y-5">
          {/* Episode title as H2 at top */}
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

          {/* Custom audio player — readable, styled to match site */}
          {episode.audioUrl && (
            <div className="rounded-lg border border-border bg-secondary p-4 space-y-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="shrink-0 w-11 h-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
                >
                  {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>
                <div className="flex-1 min-w-0 space-y-2">
                  {/* Progress bar */}
                  <div
                    className="w-full h-2 rounded-full bg-muted cursor-pointer group"
                    onClick={handleSeek}
                  >
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-150"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  {/* Time display */}
                  <div className="flex justify-between text-[11px] text-muted-foreground font-mono">
                    <span>{formatTime(currentTime)}</span>
                    <span>{duration > 0 ? formatTime(duration) : (episode.duration || "--:--")}</span>
                  </div>
                </div>
              </div>
              {/* Hidden native audio element for actual playback */}
              <audio
                ref={audioRef}
                src={episode.audioUrl}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onEnded={() => setPlaying(false)}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                preload="metadata"
                className="hidden"
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
