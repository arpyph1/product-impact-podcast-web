import { CMSContent } from "@/types/cms";
import { ArrowUpRight, LogIn, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
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

const FOOTER_NAV = [
  {
    heading: "Content",
    links: [
      { label: "News", href: "/news" },
      { label: "Features", href: "/news/format/feature" },
      { label: "Case Studies", href: "/news/format/case-study" },
      { label: "Releases", href: "/news/format/release-note" },
      { label: "Interviews", href: "/news/format/interview" },
      { label: "Explainers", href: "/news/format/explainer" },
    ],
  },
  {
    heading: "Explore",
    links: [
      { label: "Themes", href: "/themes" },
      { label: "Podcast", href: "/podcast" },
      { label: "Episodes", href: "/episodes" },
      { label: "Products", href: "/products" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Partnerships", href: "/partnerships" },
      { label: "About", href: "/podcast" },
    ],
  },
];

const SOCIAL_LINKS = [
  { name: "Spotify", urlKey: "spotifyUrl" as keyof CMSContent },
  { name: "Apple Podcasts", urlKey: "appleUrl" as keyof CMSContent },
  { name: "YouTube", urlKey: "youtubeUrl" as keyof CMSContent },
  { name: "LinkedIn", urlKey: "linkedinUrl" as keyof CMSContent },
  { name: "Substack", urlKey: "substackUrl" as keyof CMSContent },
  { name: "X", urlKey: "twitterUrl" as keyof CMSContent },
  { name: "Instagram", urlKey: "instagramUrl" as keyof CMSContent },
  { name: "TikTok", urlKey: "tiktokUrl" as keyof CMSContent },
];

export default function Footer({ content, isEditing, onUpdate, onContactClick, canEdit, user, onSignIn, onSignOut, onToggleEdit }: FooterProps) {
  return (
    <footer className="bg-card border-t border-border" role="contentinfo">
      <div className="container mx-auto px-6">
        {/* Main footer grid */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand column */}
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt={content.podcastName} className="w-14 h-14 object-contain" />
              <span className="font-display font-bold text-xl text-foreground">{content.podcastName}</span>
            </div>
            <p
              className="text-sm text-muted-foreground max-w-xs mb-5"
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={e => isEditing && onUpdate("footerTagline", e.currentTarget.textContent || "")}
            >
              {content.footerTagline}
            </p>
            {/* Social pills */}
            <div className="flex flex-wrap gap-2">
              {SOCIAL_LINKS.filter(s => {
                const url = (content[s.urlKey] as string) || "";
                return url && url !== "#";
              }).map(s => (
                <a
                  key={s.name}
                  href={isEditing ? undefined : (content[s.urlKey] as string)}
                  target={!isEditing ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-full border border-border text-xs font-medium text-foreground/70 hover:text-foreground hover:border-foreground/30 transition-all"
                >
                  {s.name}
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {FOOTER_NAV.map(col => (
            <div key={col.heading}>
              <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">{col.heading}</p>
              <ul className="space-y-2.5">
                {col.links.map(link => (
                  <li key={link.href}>
                    <Link to={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact row */}
        <div className="py-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{content.contactEmail}</span>
            <button
              onClick={onContactClick}
              className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline transition-colors"
            >
              Get in Touch <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            {canEdit && onToggleEdit && (
              <button
                onClick={onToggleEdit}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                  isEditing
                    ? "border-primary/50 text-primary bg-primary/5"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                }`}
              >
                {isEditing ? "✓ Done" : "Edit"}
              </button>
            )}
            {!user && onSignIn && (
              <button
                onClick={onSignIn}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground transition-all"
              >
                <LogIn className="w-3 h-3" /> Sign In
              </button>
            )}
            {user && onSignOut && (
              <button
                onClick={onSignOut}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground transition-all"
                title={user.email}
              >
                <LogOut className="w-3 h-3" /> Sign Out
              </button>
            )}
          </div>
        </div>

        {/* Copyright */}
        <div className="py-4 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} {content.podcastName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
