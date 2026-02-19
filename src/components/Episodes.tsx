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
    <section id="episodes" className="py-4 px-4 bg-background">
      <div className="container mx-auto">
        <div className="studio-card p-6 lg:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
              <h2 className="font-display font-bold text-xl text-foreground">
                Latest Episodes
              </h2>
              {podcastTitle && (
                <span className="text-sm text-muted-foreground hidden sm:inline opacity-60">
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
                <Radio className="w-3 h-3 text-primary" />
                <span>Live RSS</span>
              </div>
            </div>
          </div>

          {/* States */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-muted-foreground text-sm">Loading episodes from RSS…</p>
            </div>
          )}

          {error && !loading && (
            <div className="flex flex-col items-center justify-center py-12 gap-4 max-w-md mx-auto text-center">
              <AlertCircle className="w-8 h-8 text-coral" />
              <p className="text-muted-foreground text-sm">{error}</p>
            </div>
          )}

          {!loading && !error && episodes.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">No episodes found in this feed.</div>
          )}

          {/* 3-column grid on md, 4 on lg — tight spacing */}
          {!loading && episodes.length > 0 && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {episodes.slice(0, visibleCount).map((ep, i) => (
                  <EpisodeCard key={ep.guid} episode={ep} index={i} />
                ))}
              </div>

              {visibleCount < episodes.length && (
                <div className="mt-8 text-center">
                  <button
                    onClick={() => setVisibleCount(c => c + 9)}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-border text-muted-foreground hover:border-primary hover:text-primary transition-all text-sm"
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
