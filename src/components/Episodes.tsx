import { useState } from "react";
import { CMSContent } from "@/types/cms";
import { PodcastEpisode } from "@/hooks/useRSSFeed";
import EpisodeCard from "./EpisodeCard";
import { Loader2, AlertCircle, Radio, ChevronDown } from "lucide-react";

interface EpisodesProps {
  content: CMSContent;
  isEditing: boolean;
  onUpdate: (key: keyof CMSContent, value: any) => void;
  episodes: PodcastEpisode[];
  loading: boolean;
  error: string | null;
  podcastTitle: string;
}

export default function Episodes({
  content, isEditing, onUpdate, episodes, loading, error, podcastTitle
}: EpisodesProps) {
  const [visibleCount, setVisibleCount] = useState(9);

  return (
    <section id="episodes" className="py-6 px-4 bg-background">
      <div className="container mx-auto">
        {/* Reference-style rounded container */}
        <div className="rounded-2xl bg-dark-surface border border-border/50 p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
              <span className="text-muted-foreground text-sm">×</span>
              <h2 className="font-display font-bold text-xl text-foreground">
                Latest Episodes
              </h2>
              {podcastTitle && (
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  — {podcastTitle}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {isEditing && (
                <input
                  className="text-xs bg-card border border-amber/50 text-foreground rounded px-2 py-1 w-56 focus:outline-none focus:border-amber"
                  defaultValue={content.rssFeedUrl}
                  onBlur={e => onUpdate("rssFeedUrl", e.target.value)}
                  placeholder="RSS Feed URL"
                />
              )}
              <div className="border border-border rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs text-muted-foreground">
                <Radio className="w-3 h-3" />
                <span>RSS Live</span>
              </div>
            </div>
          </div>

          {/* States */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-muted-foreground text-sm">Loading episodes from RSS…</p>
            </div>
          )}

          {error && !loading && (
            <div className="flex flex-col items-center justify-center py-14 gap-4 max-w-md mx-auto text-center">
              <AlertCircle className="w-8 h-8 text-coral" />
              <p className="text-muted-foreground text-sm">{error}</p>
            </div>
          )}

          {!loading && !error && episodes.length === 0 && (
            <div className="text-center py-14 text-muted-foreground">No episodes found in this feed.</div>
          )}

          {/* 4-column grid — matching reference */}
          {!loading && episodes.length > 0 && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {episodes.slice(0, visibleCount).map((ep, i) => (
                  <EpisodeCard key={ep.guid} episode={ep} index={i} />
                ))}
              </div>

              {visibleCount < episodes.length && (
                <div className="mt-10 text-center">
                  <button
                    onClick={() => setVisibleCount(c => c + 8)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border text-muted-foreground hover:border-primary hover:text-foreground transition-all"
                  >
                    <ChevronDown className="w-4 h-4" />
                    Load more episodes
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
