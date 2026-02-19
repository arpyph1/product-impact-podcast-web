import { CMSContent } from "@/types/cms";

interface EngageProps {
  content: CMSContent;
  isEditing: boolean;
  onUpdate: (key: keyof CMSContent, value: any) => void;
  onContactClick: () => void;
}

const PLATFORMS = [
  {
    name: "Spotify",
    urlKey: "spotifyUrl" as keyof CMSContent,
    color: "141 73% 42%",
    svg: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.371-.721.49-1.101.241-3.021-1.858-6.832-2.278-11.322-1.237-.43.101-.851-.17-.952-.6-.1-.43.17-.851.6-.952 4.91-1.12 9.122-.64 12.521 1.41.38.24.5.72.254 1.138zm1.44-3.3c-.301.42-.841.6-1.262.3-3.461-2.122-8.731-2.74-12.832-1.5-.511.16-1.051-.12-1.211-.63-.16-.511.12-1.051.63-1.211 4.671-1.42 10.47-.741 14.461 1.71.42.301.539.84.214 1.331zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.24-.161-1.42-.74-.18-.6.16-1.24.74-1.42 4.26-1.3 11.34-1.05 15.84 1.62.54.3.72 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
      </svg>
    ),
  },
  {
    name: "Apple Podcasts",
    urlKey: "appleUrl" as keyof CMSContent,
    color: "265 80% 60%",
    svg: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 4.5c2.017 0 3.898.57 5.5 1.559V9.5c-1.44-1.021-3.19-1.628-5.086-1.628C7.97 7.872 5 10.842 5 14.5c0 1.696.612 3.245 1.623 4.437L5.5 20.2A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2zm0 5.5c2.76 0 5 2.24 5 5 0 1.7-.846 3.2-2.138 4.107l.948 1.642A7.47 7.47 0 0 0 19.5 12c0-4.142-3.358-7.5-7.5-7.5-2.02 0-3.856.8-5.204 2.099l1.14 1.14A5.494 5.494 0 0 1 12 6.5zm0 2.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z"/>
      </svg>
    ),
  },
  {
    name: "YouTube",
    urlKey: "youtubeUrl" as keyof CMSContent,
    color: "0 72% 50%",
    svg: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
];

export default function Engage({ content, isEditing, onUpdate, onContactClick }: EngageProps) {
  return (
    <section id="engage" className="py-4 px-4 pb-8 bg-background">
      <div className="container mx-auto">
        <div className="studio-card p-6 lg:p-10 relative overflow-hidden">
          {/* Background gradient accent */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-accent/6 pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center space-y-3 mb-8">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-primary/50" />
                <span className="text-xs text-primary font-semibold uppercase tracking-widest">Listen &amp; Connect</span>
                <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-primary/50" />
              </div>
              <h2
                className="font-display font-extrabold text-4xl lg:text-5xl text-foreground leading-none"
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={e => isEditing && onUpdate("engageTitle", e.currentTarget.textContent || "")}
              >
                {content.engageTitle}
              </h2>
              <p
                className="text-muted-foreground leading-relaxed max-w-lg mx-auto text-sm"
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={e => isEditing && onUpdate("engageDescription", e.currentTarget.textContent || "")}
              >
                {content.engageDescription}
              </p>
            </div>

            {/* Platform cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {PLATFORMS.map(p => (
                <a
                  key={p.name}
                  href={isEditing ? undefined : (content[p.urlKey] as string) || "#"}
                  target={!isEditing ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-3 p-6 rounded-2xl bg-card border border-border hover:border-primary/60 transition-all cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: `radial-gradient(ellipse at center, hsl(${p.color} / 0.08) 0%, transparent 70%)` }}
                  />
                  <div
                    className="relative w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg"
                    style={{ background: `hsl(${p.color})` }}
                  >
                    {p.svg}
                  </div>
                  <div className="relative text-center">
                    <p className="text-xs text-muted-foreground font-medium">Listen on</p>
                    <p className="font-display font-extrabold text-foreground text-base group-hover:text-primary transition-colors">
                      {p.name}
                    </p>
                  </div>
                  {isEditing && (
                    <input
                      className="relative w-full text-xs bg-muted border border-amber/50 text-foreground rounded px-2 py-1 focus:outline-none focus:border-amber"
                      defaultValue={content[p.urlKey] as string}
                      placeholder={`${p.name} URL`}
                      onBlur={e => onUpdate(p.urlKey, e.target.value)}
                      onClick={e => e.preventDefault()}
                    />
                  )}
                </a>
              ))}
            </div>

            {/* CTA */}
            <div className="text-center">
              <button
                className="px-10 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-base hover:brightness-110 transition-all glow-orange"
                onClick={onContactClick}
              >
                <span
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={e => isEditing && onUpdate("engageCta", e.currentTarget.textContent || "")}
                >
                  {content.engageCta}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
