import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCMS } from "@/hooks/useCMS";
import { useRSSFeed, PodcastEpisode } from "@/hooks/useRSSFeed";
import EpisodeCard from "@/components/EpisodeCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeadMeta from "@/components/HeadMeta";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, Filter, X, ChevronDown } from "lucide-react";

interface EpisodeTag {
  episode_guid: string;
  themes: string[];
  focus: string[];
}

function MultiSelectDropdown({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-border bg-card text-sm font-medium text-foreground"
      >
        <span>
          {label}
          {selected.length > 0 && (
            <span className="ml-2 text-xs text-muted-foreground">({selected.length})</span>
          )}
        </span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-border bg-card shadow-lg py-1">
          {options.map(opt => {
            const active = selected.includes(opt);
            return (
              <button
                key={opt}
                onClick={() => onToggle(opt)}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-foreground/5 text-foreground font-medium"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
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
              AI Product Strategy & Enterprise AI Adoption Podcast
            </h1>
          </div>

          {/* Filters */}
          <div className="py-6 space-y-4">

            {/* Mobile: dropdowns */}
            <div className="flex flex-col gap-3 md:hidden">
              {allThemes.length > 0 && (
                <MultiSelectDropdown
                  label="Themes"
                  options={allThemes}
                  selected={selectedThemes}
                  onToggle={toggleTheme}
                />
              )}
              {allFocus.length > 0 && (
                <MultiSelectDropdown
                  label="Focus"
                  options={allFocus}
                  selected={selectedFocus}
                  onToggle={toggleFocus}
                />
              )}
            </div>

            {/* Desktop: pill buttons */}
            <div className="hidden md:block space-y-4">
              {allThemes.length > 0 && (
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Themes</span>
                  <div className="flex flex-wrap gap-2">
                    {allThemes.map(theme => {
                      const active = selectedThemes.includes(theme);
                      return (
                        <button
                          key={theme}
                          onClick={() => toggleTheme(theme)}
                          className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 border ${
                            active
                              ? "border-foreground text-foreground bg-foreground/5"
                              : "border-border text-foreground hover:border-foreground"
                          }`}
                        >
                          {theme}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {allFocus.length > 0 && (
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">Focus</span>
                  <div className="flex flex-wrap gap-2">
                    {allFocus.map(focus => {
                      const active = selectedFocus.includes(focus);
                      return (
                        <button
                          key={focus}
                          onClick={() => toggleFocus(focus)}
                          className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 border ${
                            active
                              ? "border-foreground text-foreground bg-foreground/5"
                              : "border-border text-foreground hover:border-foreground"
                          }`}
                        >
                          {focus}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

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
