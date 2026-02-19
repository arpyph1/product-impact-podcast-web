import { CMSContent } from "@/types/cms";
import { Mic2, Twitter, Instagram, Youtube, Rss } from "lucide-react";

interface FooterProps {
  content: CMSContent;
  isEditing: boolean;
  onUpdate: (key: keyof CMSContent, value: any) => void;
  onContactClick: () => void;
}

export default function Footer({ content, isEditing, onUpdate, onContactClick }: FooterProps) {
  return (
    <footer className="bg-darker-surface border-t border-border py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center">
                <Mic2 className="w-4 h-4 text-primary" />
              </div>
              <span className="font-display font-bold text-xl text-foreground">
                {content.podcastName}
              </span>
            </div>
            <p
              className="text-sm text-muted-foreground"
              data-cms-editable="footerTagline"
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={e => isEditing && onUpdate("footerTagline", e.currentTarget.textContent || "")}
            >
              {content.footerTagline}
            </p>
            <div className="flex gap-3">
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
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
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
              className="px-5 py-2 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/80 transition-all"
            >
              Get in Touch
            </button>
          </div>
        </div>

        <div className="section-divider mb-6" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} {content.podcastName}. All rights reserved.</p>
          <p>Powered by RSS · Built with ❤</p>
        </div>
      </div>
    </footer>
  );
}
