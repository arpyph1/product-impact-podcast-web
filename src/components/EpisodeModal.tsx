import { useRef, useState, useEffect, useCallback } from "react";
import { PodcastEpisode } from "@/hooks/useRSSFeed";
import { useShownotes } from "@/hooks/useShownotes";
import { Dialog, DialogPortal, DialogOverlay, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Play, Pause, ExternalLink, Clock, Mic2, Calendar, ChevronLeft, ChevronRight, X, FileText } from "lucide-react";

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
  const [showShownotes, setShowShownotes] = useState(false);

  const { shownotes, loading: shownotesLoading } = useShownotes(open && episode ? episode.guid : null);

  useEffect(() => {
    setPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setShowShownotes(false);
  }, [episode?.guid]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) audioRef.current.pause();
    else audioRef.current.play();
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current && isFinite(audioRef.current.duration)) setDuration(audioRef.current.duration);
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
      <DialogPortal>
        <DialogOverlay />

        {hasPrev && onPrev && (
          <button
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            className="fixed left-4 top-1/2 -translate-y-1/2 z-[60] w-11 h-11 rounded-full bg-card/90 border border-border backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-card transition-colors shadow-lg"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        {hasNext && onNext && (
          <button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="fixed right-4 top-1/2 -translate-y-1/2 z-[60] w-11 h-11 rounded-full bg-card/90 border border-border backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-card transition-colors shadow-lg"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        <button
          onClick={handleClose}
          className="fixed right-4 top-4 z-[60] w-10 h-10 rounded-full bg-card/90 border border-border backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-card transition-colors shadow-lg"
        >
          <X className="w-6 h-6" />
        </button>

        <DialogPrimitive.Content
          className="fixed left-[50%] top-[50%] z-50 w-full max-w-2xl max-h-[85vh] translate-x-[-50%] translate-y-[-50%] overflow-y-auto rounded-lg border border-border bg-card shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]"
        >
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

            {/* Audio player */}
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
                    <div className="w-full h-2 rounded-full bg-muted cursor-pointer" onClick={handleSeek}>
                      <div className="h-full rounded-full bg-primary transition-all duration-150" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="flex justify-between text-[11px] text-muted-foreground font-mono">
                      <span>{formatTime(currentTime)}</span>
                      <span>{duration > 0 ? formatTime(duration) : (episode.duration || "--:--")}</span>
                    </div>
                  </div>
                </div>
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

            {/* Shownotes toggle */}
            {shownotes && shownotes.content_html && (
              <button
                onClick={() => setShowShownotes(!showShownotes)}
                className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors font-semibold"
              >
                <FileText className="w-4 h-4" />
                {showShownotes ? "Hide Show Notes" : "View Show Notes"}
              </button>
            )}

            {/* Shownotes content */}
            {showShownotes && shownotes?.content_html && (
              <div className="border-t border-border pt-4">
                <div
                  className="prose prose-invert prose-sm max-w-none text-secondary-foreground leading-relaxed
                             [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-primary/80
                             [&_p]:mb-3 [&_ul]:mb-3 [&_ol]:mb-3 [&_li]:mb-1
                             [&_h1]:text-xl [&_h1]:font-bold [&_h1]:mb-3
                             [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mb-2
                             [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mb-2
                             [&_blockquote]:border-l-2 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic
                             [&_pre]:bg-muted [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:overflow-x-auto
                             [&_img]:rounded-lg [&_img]:max-w-full
                             [&_iframe]:w-full [&_iframe]:rounded-lg [&_iframe]:aspect-video"
                  dangerouslySetInnerHTML={{ __html: shownotes.content_html }}
                />

                {/* Links */}
                {shownotes.links && shownotes.links.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-border">
                    <h4 className="text-sm font-semibold text-foreground mb-2">Resources & Links</h4>
                    <ul className="space-y-1">
                      {shownotes.links.map((link: any, i: number) => (
                        <li key={i}>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:text-primary/80 underline underline-offset-2"
                          >
                            {link.label || link.url}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Videos */}
                {shownotes.video_urls && shownotes.video_urls.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {shownotes.video_urls.map((url: string, i: number) => (
                      <div key={i} className="aspect-video rounded-lg overflow-hidden">
                        <iframe
                          src={url}
                          className="w-full h-full"
                          allowFullScreen
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {shownotesLoading && (
              <p className="text-xs text-muted-foreground animate-pulse">Loading show notes...</p>
            )}

            {/* Description */}
            {episode.description && !showShownotes && (
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
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
