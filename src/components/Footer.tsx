import { CMSContent } from "@/types/cms";
import { ArrowUpRight } from "lucide-react";
import logo from "@/assets/logo.png";

interface FooterProps {
  content: CMSContent;
  isEditing: boolean;
  onUpdate: (key: keyof CMSContent, value: any) => void;
  onContactClick: () => void;
}

export default function Footer({ content, isEditing, onUpdate, onContactClick }: FooterProps) {
  return (
    <footer className="bg-background">
      <div className="container mx-auto px-6">
        {/* Top row */}
        <div className="py-16 grid md:grid-cols-2 gap-10 items-start border-b border-border">
          <div className="flex items-start gap-4">
            <img src={logo} alt={content.podcastName} className="w-12 h-12 rounded object-contain" />
            <div>
              <p className="font-display font-bold text-xl text-foreground">{content.podcastName}</p>
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
                {["Podcast", "Episodes", "About", "Listen"].map(link => (
                  <li key={link}>
                    <a href={`#${link.toLowerCase()}`}
                      className="text-sm text-foreground hover:text-primary transition-colors agency-link">
                      {link}
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
