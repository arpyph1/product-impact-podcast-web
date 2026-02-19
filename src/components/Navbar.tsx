import { CMSContent } from "@/types/cms";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/logo.png";

interface NavbarProps {
  content: CMSContent;
  isEditing: boolean;
  onToggleEdit: () => void;
  onContactClick: () => void;
}

const navLinks = [
  { label: "Episodes", href: "#episodes" },
  { label: "About", href: "#about" },
  { label: "Listen", href: "#engage" },
];

export default function Navbar({ content, isEditing, onToggleEdit, onContactClick }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between h-14 px-6">
        {/* Logo mark */}
        <a href="#" className="flex items-center gap-2.5 group">
          <img src={logo} alt={content.podcastName} className="w-7 h-7 rounded object-cover" />
          <span className="font-display font-bold text-sm text-foreground tracking-tight hidden sm:block">
            {content.podcastName}
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors tracking-wide uppercase"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onToggleEdit}
            className={`text-xs font-medium px-3 py-1.5 rounded border transition-all ${
              isEditing
                ? "border-amber/70 text-amber"
                : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/40"
            }`}
          >
            {isEditing ? "✓ Done editing" : "Edit"}
          </button>
          <button
            onClick={onContactClick}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:brightness-110 transition-all"
          >
            Contact <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        {/* Mobile */}
        <button className="md:hidden p-2 text-muted-foreground" onClick={() => setMenuOpen(v => !v)}>
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-border bg-background px-6 py-5 flex flex-col gap-4">
          {navLinks.map(link => (
            <a key={link.label} href={link.href} onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground uppercase tracking-wide">
              {link.label}
            </a>
          ))}
          <button onClick={() => { onContactClick(); setMenuOpen(false); }}
            className="w-full px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
            Contact
          </button>
          <button onClick={onToggleEdit} className="text-xs text-muted-foreground underline">
            {isEditing ? "Exit Edit Mode" : "Edit Site"}
          </button>
        </div>
      )}
    </header>
  );
}
