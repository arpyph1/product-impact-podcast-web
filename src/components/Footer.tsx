import { CMSContent } from "@/types/cms";
import { ArrowUpRight, LogIn, LogOut } from "lucide-react";
import logo from "@/assets/logo-new.png";
import type { User } from "@supabase/supabase-js";

interface FooterProps {
  content: CMSContent;
  isEditing: boolean;
  onUpdate: (key: keyof CMSContent, value: any) => void;
  onContactClick: () => void;
  canEdit?: boolean;
  user?: User | null;
  onSignIn?: () => void;
  onSignOut?: () => void;
  onToggleEdit?: () => void;
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
    name: "Instagram",
    urlKey: "instagramUrl" as keyof CMSContent,
    svg: (
      <svg viewBox="0 0 24 24" className="w-10 h-10 fill-current" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
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
  {
    name: "TikTok",
    urlKey: "tiktokUrl" as keyof CMSContent,
    svg: (
      <svg viewBox="0 0 24 24" className="w-10 h-10 fill-current" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
      </svg>
    ),
  },
];

export default function Footer({ content, isEditing, onUpdate, onContactClick, canEdit, user, onSignIn, onSignOut, onToggleEdit }: FooterProps) {
  return (
    <footer className="bg-background" role="contentinfo">
      <div className="container mx-auto px-6">
        {/* Platform & social links */}
        <div className="py-10 border-b border-border flex flex-col gap-5">
          {/* Row 1: Podcast platforms — pill buttons matching hero style */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {PODCAST_PLATFORMS.filter(p => {
              const url = (content[p.urlKey] as string) || "";
              return url && url !== "#";
            }).map(p => (
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
            {SOCIAL_LINKS.filter(s => {
              const url = (content[s.urlKey as keyof CMSContent] as string) || "";
              return url && url !== "#";
            }).map(s => (
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
