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

const INITIAL_COUNT = 8;
const LOAD_MORE_COUNT = 8;

export default function Episodes({
  content, isEditing, onUpdate, episodes, loading, error, podcastTitle
}: EpisodesProps) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  return (
    <section id="episodes" className="bg-background">
      <div className="container mx-auto px-6">

        {/* Section header row */}
        <div className="flex items-end justify-between py-10 border-b border-border gap-4">
          <div>
            <h2 className="font-display font-extrabold uppercase leading-none tracking-tight text-foreground"
              style={{ fontSize: content.h2FontSize || "clamp(1.5rem, 3.5vw, 2.8rem)", fontWeight: content.h2FontWeight || "800", letterSpacing: "-0.02em" }}
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={e => isEditing && onUpdate("episodesTitle", e.currentTarget.textContent || "")}
            >
              {content.episodesTitle || "Latest Episodes"}
            </h2>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {isEditing && (
              <input
                className="text-xs bg-card border border-amber/50 text-foreground rounded px-2 py-1.5 w-56 focus:outline-none focus:border-amber"
                defaultValue={content.rssFeedUrl}
                onBlur={e => onUpdate("rssFeedUrl", e.target.value)}
                placeholder="RSS Feed URL"
              />
            )}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Radio className="w-3 h-3 text-primary" />
              <span>Live RSS</span>
            </div>
          </div>
        </div>

        {/* States */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
            <p className="text-muted-foreground text-sm">Loading episodes…</p>
          </div>
        )}

        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-4 max-w-md mx-auto text-center">
            <AlertCircle className="w-6 h-6 text-coral" />
            <p className="text-muted-foreground text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && episodes.length === 0 && (
          <div className="text-center py-16 text-muted-foreground text-sm">No episodes found.</div>
        )}

        {/* Grid — 2 cols mobile, 4 cols desktop */}
        {!loading && episodes.length > 0 && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border" style={{ fontSize: "0.75rem" }}>
              {episodes.slice(0, visibleCount).map((ep, i) => (
                <div key={ep.guid} className="bg-background p-3">
                  <EpisodeCard episode={ep} index={i} />
                </div>
              ))}
            </div>

            {visibleCount < episodes.length && (
              <div className="py-8 text-center border-t border-border">
                <button
                  onClick={() => setVisibleCount(c => c + LOAD_MORE_COUNT)}
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronDown className="w-4 h-4" />
                  Load more episodes
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <div className="section-divider" />
    </section>
  );
}
