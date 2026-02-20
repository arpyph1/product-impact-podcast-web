import { CMSContent } from "@/types/cms";
import { ArrowUpRight } from "lucide-react";
import logo from "@/assets/logo-new.png";

interface FooterProps {
  content: CMSContent;
  isEditing: boolean;
  onUpdate: (key: keyof CMSContent, value: any) => void;
  onContactClick: () => void;
}

const PODCAST_PLATFORMS = [
  {
    name: "Spotify",
    urlKey: "spotifyUrl" as keyof CMSContent,
    color: "#1DB954",
    svg: (
      <svg viewBox="0 0 24 24" className="w-10 h-10 fill-current" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.371-.721.49-1.101.241-3.021-1.858-6.832-2.278-11.322-1.237-.43.101-.851-.17-.952-.6-.1-.43.17-.851.6-.952 4.91-1.12 9.122-.64 12.521 1.41.38.24.5.72.254 1.138zm1.44-3.3c-.301.42-.841.6-1.262.3-3.461-2.122-8.731-2.74-12.832-1.5-.511.16-1.051-.12-1.211-.63-.16-.511.12-1.051.63-1.211 4.671-1.42 10.47-.741 14.461 1.71.42.301.539.84.214 1.331zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.24-.161-1.42-.74-.18-.6.16-1.24.74-1.42 4.26-1.3 11.34-1.05 15.84 1.62.54.3.72 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
      </svg>
    ),
  },
  {
    name: "Apple Podcasts",
    urlKey: "appleUrl" as keyof CMSContent,
    color: "#B150E2",
    svg: (
      <svg viewBox="0 0 24 24" className="w-10 h-10 fill-current" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 4.5c2.017 0 3.898.57 5.5 1.559V9.5c-1.44-1.021-3.19-1.628-5.086-1.628C7.97 7.872 5 10.842 5 14.5c0 1.696.612 3.245 1.623 4.437L5.5 20.2A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2zm0 5.5c2.76 0 5 2.24 5 5 0 1.7-.846 3.2-2.138 4.107l.948 1.642A7.47 7.47 0 0 0 19.5 12c0-4.142-3.358-7.5-7.5-7.5-2.02 0-3.856.8-5.204 2.099l1.14 1.14A5.494 5.494 0 0 1 12 6.5zm0 2.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z"/>
      </svg>
    ),
  },
  {
    name: "YouTube",
    urlKey: "youtubeUrl" as keyof CMSContent,
    color: "#FF0000",
    svg: (
      <svg viewBox="0 0 24 24" className="w-10 h-10 fill-current" xmlns="http://www.w3.org/2000/svg">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
];

const SOCIAL_LINKS = [
  {
    name: "Substack",
    urlKey: "substackUrl" as keyof CMSContent,
    svg: (
      <svg viewBox="0 0 24 24" className="w-10 h-10 fill-current" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    urlKey: "linkedinUrl" as keyof CMSContent,
    svg: (
      <svg viewBox="0 0 24 24" className="w-10 h-10 fill-current" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    name: "X (Twitter)",
    urlKey: "twitterUrl" as keyof CMSContent,
    svg: (
      <svg viewBox="0 0 24 24" className="w-10 h-10 fill-current" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
];

export default function Footer({ content, isEditing, onUpdate, onContactClick }: FooterProps) {
  return (
    <footer className="bg-background" role="contentinfo">
      <div className="container mx-auto px-6">
        {/* Platform & social links */}
        <div className="py-10 border-b border-border flex flex-col gap-5">
          {/* Row 1: Podcast platforms — pill buttons matching hero style */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {PODCAST_PLATFORMS.map(p => (
              <a
                key={p.name}
                href={isEditing ? undefined : (content[p.urlKey] as string) || "#"}
                target={!isEditing ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-6 py-3 rounded-full border border-border text-base font-medium text-foreground hover:border-foreground transition-all duration-200"
              >
                <span className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-white" style={{ background: p.color }}>
                  <span className="[&>svg]:w-5 [&>svg]:h-5">{p.svg}</span>
                </span>
                {p.name}
              </a>
            ))}
          </div>

          {/* Row 2: Social links — same pill style */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {SOCIAL_LINKS.map(s => (
              <a
                key={s.name}
                href={isEditing ? undefined : (content[s.urlKey as keyof CMSContent] as string) || "#"}
                target={!isEditing ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-6 py-3 rounded-full border border-border text-base font-medium text-foreground hover:border-foreground transition-all duration-200"
              >
                {s.svg}
                {s.name}
              </a>
            ))}
          </div>
        </div>

        {/* Main footer row */}
        <div className="py-16 grid md:grid-cols-2 gap-10 items-start border-b border-border">
          <div className="flex items-center gap-4">
            {/* Transparent logo — same as nav */}
            <img src={logo} alt={content.podcastName} className="w-32 h-32 object-contain" style={{ mixBlendMode: "normal" }} />
            <div>
              <p className="font-display font-bold text-4xl text-foreground">{content.podcastName}</p>
              <p
                className="text-sm text-muted-foreground mt-1 max-w-xs"
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={e => isEditing && onUpdate("footerTagline", e.currentTarget.textContent || "")}
              >
                {content.footerTagline}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mb-4">Navigate</p>
              <ul className="space-y-2.5">
                {[...(content.navLeftItems || []), ...(content.navRightItems || [])].map((item, i) => (
                  <li key={i}>
                    <a href={item.href}
                      className="text-sm text-foreground hover:text-primary transition-colors agency-link">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mb-4">Contact</p>
              <p className="text-sm text-muted-foreground mb-4">{content.contactEmail}</p>
              <button
                onClick={onContactClick}
                className="flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-primary transition-colors agency-link"
              >
                Get in Touch <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} {content.podcastName}. All rights reserved.</p>
          <p>Powered by RSS</p>
        </div>
      </div>
    </footer>
  );
}
