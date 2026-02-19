import { CMSContent } from "@/types/cms";
import heroPodcast from "@/assets/hero-podcast.jpg";
import { Play, Headphones } from "lucide-react";

interface HeroProps {
  content: CMSContent;
  isEditing: boolean;
  onUpdate: (key: keyof CMSContent, value: any) => void;
  latestEpisodeAudio?: string;
  latestEpisodeTitle?: string;
}

const bgColorMap: Record<string, string> = {
  coral: "bg-coral/20 border-coral/40",
  teal:  "bg-teal/20 border-teal/40",
  amber: "bg-amber/20 border-amber/40",
  purple: "bg-primary/20 border-primary/40",
};

const BG_OPTIONS = ["coral", "teal", "amber", "purple"];

export default function Hero({ content, isEditing, onUpdate, latestEpisodeAudio, latestEpisodeTitle }: HeroProps) {
  return (
    <section
      id="podcast"
      className="min-h-screen flex items-center pt-16 circuit-bg relative overflow-hidden"
    >
      {/* Ambient glows */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-teal/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 py-20 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left: Text */}
        <div className="space-y-6">
          {/* Tags */}
          <div className="flex gap-2 flex-wrap">
            {["PODCAST", "DARK", "DEEP"].map(tag => (
              <span
                key={tag}
                className="text-xs font-semibold px-3 py-1 rounded-full border border-primary/40 text-primary bg-primary/10 tracking-wider"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1
            className={`font-display font-extrabold leading-none tracking-tight text-glow-purple fade-up fade-up-delay-1 ${
              isEditing ? "cursor-text" : ""
            }`}
            style={{ fontSize: "clamp(3rem, 8vw, 6rem)" }}
            data-cms-editable="heroTitle"
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={e => isEditing && onUpdate("heroTitle", e.currentTarget.textContent || "")}
          >
            {content.heroTitle}
          </h1>

          <p
            className="text-lg text-muted-foreground max-w-lg fade-up fade-up-delay-2"
            data-cms-editable="heroDescription"
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={e => isEditing && onUpdate("heroDescription", e.currentTarget.textContent || "")}
          >
            {content.heroDescription}
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3 fade-up fade-up-delay-3">
            <a
              href={content.heroCta1Link}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-foreground/30 text-foreground font-semibold hover:bg-foreground/10 transition-all"
              data-cms-editable={isEditing ? "heroCta1Text" : undefined}
            >
              <Headphones className="w-4 h-4" />
              <span
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={e => isEditing && onUpdate("heroCta1Text", e.currentTarget.textContent || "")}
              >
                {content.heroCta1Text}
              </span>
            </a>

            <a
              href={content.heroCta2Link}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/80 transition-all glow-purple"
            >
              <span
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={e => isEditing && onUpdate("heroCta2Text", e.currentTarget.textContent || "")}
              >
                {content.heroCta2Text}
              </span>
            </a>
          </div>

          {/* Inline audio player for latest episode */}
          {latestEpisodeAudio && (
            <div className="mt-6 p-4 rounded-xl bg-card/60 border border-border neon-border space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex gap-1 items-end h-5">
                  {[1,2,3,4,5].map(i => (
                    <span
                      key={i}
                      className="wave-bar"
                      style={{ height: `${8 + i * 3}px`, animationDelay: `${i * 0.12}s` }}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground font-medium truncate max-w-[240px]">
                  Latest: {latestEpisodeTitle}
                </span>
              </div>
              <audio controls src={latestEpisodeAudio} preload="none" />
            </div>
          )}

          {/* Platform pills */}
          <div className="flex gap-3 flex-wrap pt-2">
            {["The Podcast", "⎕ Navigation", "▶"].map((label, i) => (
              <span
                key={i}
                className="text-sm px-4 py-2 rounded-full bg-primary/80 text-primary-foreground font-medium flex items-center gap-1"
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Right: Hero image card */}
        <div className="relative flex justify-center lg:justify-end">
          {/* BG picker (edit mode) */}
          {isEditing && (
            <div className="absolute -top-8 left-0 flex gap-2 z-10">
              <span className="text-xs text-amber mr-1">Card BG:</span>
              {BG_OPTIONS.map(c => (
                <button
                  key={c}
                  onClick={() => onUpdate("heroCardBg", c)}
                  className={`w-6 h-6 rounded-full border-2 ${
                    content.heroCardBg === c ? "border-amber scale-125" : "border-border"
                  }`}
                  style={{
                    background:
                      c === "coral" ? "hsl(5 80% 60%)" :
                      c === "teal"  ? "hsl(174 72% 48%)" :
                      c === "amber" ? "hsl(43 96% 56%)" :
                      "hsl(265 80% 60%)",
                  }}
                  title={c}
                />
              ))}
            </div>
          )}

          <div
            className={`relative rounded-2xl overflow-hidden border-2 neon-border ${bgColorMap[content.heroCardBg] || bgColorMap.coral}`}
            style={{ width: 340, height: 400 }}
            data-cms-bg-editable="heroCardBg"
          >
            {/* Pill buttons overlay */}
            <div className="absolute top-3 left-3 right-3 flex gap-2 z-10">
              <div className="bg-card/80 backdrop-blur rounded-full px-3 py-1 text-xs text-foreground border border-border">
                Bat Ion
              </div>
              <div className="bg-card/80 backdrop-blur rounded-full px-3 py-1 text-xs text-foreground border border-border flex-1 flex justify-between">
                <span>Episode</span>
                <span>✕ ⎕</span>
              </div>
            </div>

            <img
              src={heroPodcast}
              alt="Podcast host"
              className="w-full h-full object-cover"
            />

            <div
              className="absolute inset-0 opacity-30"
              style={{
                background:
                  content.heroCardBg === "coral" ? "hsl(5 80% 60%)" :
                  content.heroCardBg === "teal"  ? "hsl(174 72% 48%)" :
                  content.heroCardBg === "amber" ? "hsl(43 96% 56%)" :
                  "hsl(265 80% 60%)",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
