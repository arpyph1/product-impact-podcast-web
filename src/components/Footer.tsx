import { CMSContent } from "@/types/cms";
import { Twitter, Instagram, Youtube, Rss } from "lucide-react";
import logo from "@/assets/logo.png";

interface FooterProps {
  content: CMSContent;
  isEditing: boolean;
  onUpdate: (key: keyof CMSContent, value: any) => void;
  onContactClick: () => void;
}

export default function Footer({ content, isEditing, onUpdate, onContactClick }: FooterProps) {
  return (
    <footer className="bg-darker-surface border-t border-border py-10">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt={content.podcastName}
                className="w-9 h-9 rounded-lg object-cover"
              />
              <span className="font-display font-bold text-base text-foreground leading-tight">
                {content.podcastName}
              </span>
            </div>
            <p
              className="text-sm text-muted-foreground"
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={e => isEditing && onUpdate("footerTagline", e.currentTarget.textContent || "")}
            >
              {content.footerTagline}
            </p>
            <div className="flex gap-2">
              {[Twitter, Instagram, Youtube, Rss].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all">
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-4">Navigation</p>
            <ul className="space-y-2">
              {["Podcast", "Episodes", "About", "Engage"].map(link => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-4">Contact</p>
            <p className="text-sm text-muted-foreground mb-4">{content.contactEmail}</p>
            <button
              onClick={onContactClick}
              className="px-5 py-2 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:brightness-110 transition-all"
            >
              Get in Touch
            </button>
          </div>
        </div>

        <div className="section-divider mb-5" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <img src={logo} alt="" className="w-5 h-5 rounded opacity-60" />
            <p>© {new Date().getFullYear()} {content.podcastName}. All rights reserved.</p>
          </div>
          <p>Powered by RSS · Built with ❤</p>
        </div>
      </div>
    </footer>
  );
}
