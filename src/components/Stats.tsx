import { CMSContent } from "@/types/cms";
import { Plus, X } from "lucide-react";

interface StatsProps {
  content: CMSContent;
  isEditing: boolean;
  onUpdate: (key: keyof CMSContent, value: any) => void;
}

const DEFAULT_STATS = [
  { value: "Top 2%", label: "Most Shared Podcasts" },
  { value: "#1", label: "AI Strategy Podcast" },
  { value: "10,000+", label: "Followers" },
];

export default function Stats({ content, isEditing, onUpdate }: StatsProps) {
  const stats = (content.acclaimStats && content.acclaimStats.length > 0) ? content.acclaimStats : DEFAULT_STATS;

  const updateStat = (idx: number, field: "value" | "label", val: string) => {
    const next = [...stats];
    next[idx] = { ...next[idx], [field]: val };
    onUpdate("acclaimStats", next);
  };

  const addStat = () => onUpdate("acclaimStats", [...stats, { value: "0", label: "New Stat" }]);
  const removeStat = (idx: number) => onUpdate("acclaimStats", stats.filter((_, i) => i !== idx));

  return (
    <section className="bg-background" aria-label="Podcast statistics">
      <div className="container mx-auto px-6">
        <div className="py-20 border-b border-border">
          {isEditing ? (
            <div className="space-y-4 max-w-2xl mx-auto">
              {stats.map((stat, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    className="flex-1 bg-card border border-amber/50 text-foreground rounded px-3 py-2 text-sm focus:outline-none focus:border-amber font-bold"
                    value={stat.value}
                    onChange={e => updateStat(i, "value", e.target.value)}
                    placeholder="Value (e.g. Top 2%)"
                  />
                  <input
                    className="flex-1 bg-card border border-amber/50 text-foreground rounded px-3 py-2 text-sm focus:outline-none focus:border-amber"
                    value={stat.label}
                    onChange={e => updateStat(i, "label", e.target.value)}
                    placeholder="Label"
                  />
                  <button onClick={() => removeStat(i)} className="p-1.5 text-destructive hover:bg-destructive/10 rounded">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <button onClick={addStat} className="flex items-center gap-1.5 text-xs text-amber hover:text-amber/80 mx-auto">
                <Plus className="w-3.5 h-3.5" /> Add stat
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              {stats.map((stat, i) => (
                <div key={i} className="flex flex-col items-center gap-3">
                  <span
                    className="font-display font-black text-primary leading-none"
                    style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}
                  >
                    {stat.value}
                  </span>
                  <span className="text-muted-foreground text-sm font-medium uppercase tracking-widest">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="section-divider" />
    </section>
  );
}
