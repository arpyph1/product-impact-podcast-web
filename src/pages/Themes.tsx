import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCMS } from "@/hooks/useCMS";
import { useRSSFeed, PodcastEpisode } from "@/hooks/useRSSFeed";
import EpisodeCard from "@/components/EpisodeCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeadMeta from "@/components/HeadMeta";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, Filter, X } from "lucide-react";

interface EpisodeTag {
  episode_guid: string;
  themes: string[];
  focus: string[];
}

export default function Themes() {
  const { content, update, isEditing, setIsEditing } = useCMS();
  const { episodes, loading: feedLoading, podcastTitle } = useRSSFeed(content.rssFeedUrl);
  const { user, canEdit, signInWithGoogle, signOut } = useAuth();

  const [tags, setTags] = useState<EpisodeTag[]>([]);
  const [tagsLoading, setTagsLoading] = useState(true);
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [selectedFocus, setSelectedFocus] = useState<string[]>([]);

  // Fetch all episode tags
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("episode_tags")
        .select("episode_guid, themes, focus");
      if (!error && data) setTags(data as EpisodeTag[]);
      setTagsLoading(false);
    })();
  }, []);

  // Extract unique themes and focus labels
  const allThemes = useMemo(() => {
    const set = new Set<string>();
    tags.forEach(t => t.themes?.forEach(th => set.add(th)));
    return Array.from(set).sort();
  }, [tags]);

  const allFocus = useMemo(() => {
    const set = new Set<string>();
    tags.forEach(t => t.focus?.forEach(f => set.add(f)));
    return Array.from(set).sort();
  }, [tags]);

  // Build a guid→tags map
  const tagMap = useMemo(() => {
    const m = new Map<string, EpisodeTag>();
    tags.forEach(t => m.set(t.episode_guid, t));
    return m;
  }, [tags]);

  // Filter episodes
  const filteredEpisodes = useMemo(() => {
    if (selectedThemes.length === 0 && selectedFocus.length === 0) return episodes;

    return episodes.filter(ep => {
      const t = tagMap.get(ep.guid);
      if (!t) return false;

      const themeMatch =
        selectedThemes.length === 0 ||
        selectedThemes.some(sel => t.themes?.includes(sel));
      const focusMatch =
        selectedFocus.length === 0 ||
        selectedFocus.some(sel => t.focus?.includes(sel));

      return themeMatch && focusMatch;
    });
  }, [episodes, tagMap, selectedThemes, selectedFocus]);

  const toggleTheme = (theme: string) =>
    setSelectedThemes(prev =>
      prev.includes(theme) ? prev.filter(t => t !== theme) : [...prev, theme],
    );

  const toggleFocus = (focus: string) =>
    setSelectedFocus(prev =>
      prev.includes(focus) ? prev.filter(f => f !== focus) : [...prev, focus],
    );

  const clearAll = () => {
    setSelectedThemes([]);
    setSelectedFocus([]);
  };

  const hasFilters = selectedThemes.length > 0 || selectedFocus.length > 0;
  const loading = feedLoading || tagsLoading;

  return (
    <div>
      <HeadMeta content={content} />
      <Navbar
        content={content}
        isEditing={isEditing}
        onToggleEdit={() => {
          if (!user) { signInWithGoogle(); return; }
          if (canEdit) setIsEditing(v => !v);
        }}
        onContactClick={() => {}}
        onUpdate={update}
        canEdit={canEdit}
        user={user}
        onSignIn={signInWithGoogle}
        onSignOut={signOut}
      />

      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="py-12 border-b border-border">
            <h1 className="font-display font-extrabold text-foreground uppercase tracking-tight"
              style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", letterSpacing: "-0.02em" }}
            >
              Browse by Theme
            </h1>
            <p className="text-muted-foreground mt-2 text-sm max-w-xl">
              Filter episodes by topic themes and focus areas to find exactly what you're looking for.
            </p>
          </div>

          {/* Filters */}
          <div className="py-8 space-y-8">
            {/* Themes row */}
            {allThemes.length > 0 && (
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 block">Themes</span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {allThemes.map(theme => {
                    const active = selectedThemes.includes(theme);
                    const count = tags.filter(t => t.themes?.includes(theme)).length;
                    return (
                      <button
                        key={theme}
                        onClick={() => toggleTheme(theme)}
                        className={`relative px-4 py-4 rounded-lg text-left font-display font-bold text-sm leading-tight transition-all border-2 ${
                          active
                            ? "bg-primary/15 text-primary border-primary shadow-[0_0_20px_hsl(var(--primary)/0.15)]"
                            : "bg-card text-foreground border-border hover:border-primary/40 hover:bg-card/80"
                        }`}
                      >
                        <span className="block">{theme}</span>
                        <span className={`text-[11px] font-normal mt-1 block ${active ? "text-primary/70" : "text-muted-foreground"}`}>
                          {count} episode{count !== 1 ? "s" : ""}
                        </span>
                        {active && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                            <span className="text-[10px] font-bold">✓</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Focus row */}
            {allFocus.length > 0 && (
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 block">Focus</span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {allFocus.map(focus => {
                    const active = selectedFocus.includes(focus);
                    const count = tags.filter(t => t.focus?.includes(focus)).length;
                    return (
                      <button
                        key={focus}
                        onClick={() => toggleFocus(focus)}
                        className={`relative px-4 py-4 rounded-lg text-left font-display font-bold text-sm leading-tight transition-all border-2 ${
                          active
                            ? "bg-accent/15 text-accent border-accent shadow-[0_0_20px_hsl(var(--accent)/0.15)]"
                            : "bg-card text-foreground border-border hover:border-accent/40 hover:bg-card/80"
                        }`}
                      >
                        <span className="block">{focus}</span>
                        <span className={`text-[11px] font-normal mt-1 block ${active ? "text-accent/70" : "text-muted-foreground"}`}>
                          {count} episode{count !== 1 ? "s" : ""}
                        </span>
                        {active && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-accent text-accent-foreground flex items-center justify-center">
                            <span className="text-[10px] font-bold">✓</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Active filters summary */}
            {hasFilters && (
              <div className="flex items-center gap-2 pt-2 border-t border-border">
                <span className="text-sm text-foreground font-medium">
                  {filteredEpisodes.length} episode{filteredEpisodes.length !== 1 ? "s" : ""}
                </span>
                <button
                  onClick={clearAll}
                  className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors ml-auto"
                >
                  <X className="w-3 h-3" />
                  Clear all filters
                </button>
              </div>
            )}
          </div>

          {/* Episodes grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
              <p className="text-muted-foreground text-sm">Loading episodes…</p>
            </div>
          ) : filteredEpisodes.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground text-sm">
              {hasFilters
                ? "No episodes match the selected filters."
                : "No episodes have been classified yet."}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border" style={{ fontSize: "0.75rem" }}>
              {filteredEpisodes.map((ep, i) => (
                <div key={ep.guid} className="bg-background p-3">
                  <EpisodeCard episode={ep} index={i} episodes={filteredEpisodes} />
                </div>
              ))}
            </div>
          )}

          <div className="py-8" />
        </div>
      </main>

      <Footer
        content={content}
        isEditing={isEditing}
        onUpdate={update}
        onContactClick={() => {}}
      />
    </div>
  );
}
