import { CMSContent } from "@/types/cms";
import logo from "@/assets/logo-new.png";
import { ArrowUpRight } from "lucide-react";

interface HeroProps {
  content: CMSContent;
  isEditing: boolean;
  onUpdate: (key: keyof CMSContent, value: any) => void;
  latestEpisodeAudio?: string;
  latestEpisodeTitle?: string;
  latestEpisodeLink?: string;
}

const PLATFORMS = [
  {
    label: "Spotify",
    urlKey: "spotifyUrl" as keyof CMSContent,
    color: "#1DB954",
    svg: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current shrink-0" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.371-.721.49-1.101.241-3.021-1.858-6.832-2.278-11.322-1.237-.43.101-.851-.17-.952-.6-.1-.43.17-.851.6-.952 4.91-1.12 9.122-.64 12.521 1.41.38.24.5.72.254 1.138zm1.44-3.3c-.301.42-.841.6-1.262.3-3.461-2.122-8.731-2.74-12.832-1.5-.511.16-1.051-.12-1.211-.63-.16-.511.12-1.051.63-1.211 4.671-1.42 10.47-.741 14.461 1.71.42.301.539.84.214 1.331zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.24-.161-1.42-.74-.18-.6.16-1.24.74-1.42 4.26-1.3 11.34-1.05 15.84 1.62.54.3.72 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
      </svg>
    ),
  },
  {
    label: "Apple Podcasts",
    urlKey: "appleUrl" as keyof CMSContent,
    color: "#B150E2",
    svg: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current shrink-0" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 4.5c2.017 0 3.898.57 5.5 1.559V9.5c-1.44-1.021-3.19-1.628-5.086-1.628C7.97 7.872 5 10.842 5 14.5c0 1.696.612 3.245 1.623 4.437L5.5 20.2A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2zm0 5.5c2.76 0 5 2.24 5 5 0 1.7-.846 3.2-2.138 4.107l.948 1.642A7.47 7.47 0 0 0 19.5 12c0-4.142-3.358-7.5-7.5-7.5-2.02 0-3.856.8-5.204 2.099l1.14 1.14A5.494 5.494 0 0 1 12 6.5zm0 2.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z"/>
      </svg>
    ),
  },
  {
    label: "YouTube",
    urlKey: "youtubeUrl" as keyof CMSContent,
    color: "#FF0000",
    svg: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current shrink-0" xmlns="http://www.w3.org/2000/svg">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
];

export default function Hero({ content, isEditing, onUpdate }: HeroProps) {
  return (
    <section id="podcast" className="relative min-h-screen bg-background flex flex-col pt-16">
      {/* Main hero content — centered, full-width */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">

        {/* Logo — 800×800 logical max, responsive */}
        <div className="relative mb-10">
          <img
            src={logo}
            alt={content.podcastName}
            className="w-[min(80vw,520px)] h-[min(80vw,520px)] object-contain mx-auto select-none"
            draggable={false}
          />
        </div>

        {/* Headline */}
        <h1
          className={`font-display font-extrabold leading-[0.9] tracking-tight text-foreground mb-6 ${isEditing ? "cursor-text" : ""}`}
          style={{ fontSize: "clamp(3.5rem, 10vw, 9rem)" }}
          contentEditable={isEditing}
          suppressContentEditableWarning
          onBlur={e => isEditing && onUpdate("heroTitle", e.currentTarget.textContent || "")}
        >
          {content.heroTitle}
        </h1>

        {/* Subline */}
        <p
          className="text-muted-foreground max-w-xl mx-auto text-lg leading-relaxed mb-10"
          contentEditable={isEditing}
          suppressContentEditableWarning
          onBlur={e => isEditing && onUpdate("heroDescription", e.currentTarget.textContent || "")}
        >
          {content.heroDescription}
        </p>

        {/* Platform buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {PLATFORMS.map(p => (
            <a
              key={p.label}
              href={isEditing ? undefined : (content[p.urlKey] as string) || "#"}
              target={!isEditing ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="group flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-border text-sm font-medium text-foreground hover:border-foreground transition-all duration-200"
            >
              <span className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ background: p.color }}>
                {p.svg}
              </span>
              {p.label}
              <ArrowUpRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </a>
          ))}

          <a
            href="#episodes"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:brightness-110 transition-all"
          >
            Listen Now
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* CMS editing hint */}
        {isEditing && (
          <div className="mt-8 p-4 rounded-lg bg-amber/10 border border-amber/30 max-w-sm text-left">
            <p className="text-xs text-amber font-semibold mb-2">Featured Video URL (YouTube):</p>
            <input
              className="w-full text-xs bg-black/40 border border-amber/50 text-foreground rounded px-2 py-1.5 focus:outline-none focus:border-amber"
              defaultValue={content.featuredVideoUrl}
              placeholder="https://youtube.com/watch?v=..."
              onBlur={e => onUpdate("featuredVideoUrl", e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Bottom rule */}
      <div className="section-divider" />
    </section>
  );
}
