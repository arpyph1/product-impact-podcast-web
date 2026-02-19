import { useState } from "react";
import { CMSContent } from "@/types/cms";
import { Mic2, Menu, X } from "lucide-react";

interface NavbarProps {
  content: CMSContent;
  isEditing: boolean;
  onToggleEdit: () => void;
  onContactClick: () => void;
}

const navLinks = [
  { label: "Podcast", href: "#podcast" },
  { label: "Episodes", href: "#episodes" },
  { label: "About", href: "#about" },
  { label: "Engage", href: "#engage" },
];

export default function Navbar({ content, isEditing, onToggleEdit, onContactClick }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 backdrop-blur-md bg-darker-surface/80">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center glow-purple group-hover:glow-purple transition-all">
            <Mic2 className="w-4 h-4 text-primary" />
          </div>
          <span className="font-display font-bold text-lg leading-tight text-foreground">
            {content.podcastName}
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onToggleEdit}
            className={`text-xs font-medium px-3 py-1.5 rounded-md border transition-all ${
              isEditing
                ? "border-amber/70 text-amber bg-amber/10"
                : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
            }`}
          >
            {isEditing ? "✓ Exit Edit" : "✏ Edit Site"}
          </button>
          <button
            onClick={onContactClick}
            className="px-5 py-2 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/80 transition-all glow-purple"
          >
            Contact
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-muted-foreground"
          onClick={() => setMenuOpen(v => !v)}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-darker-surface/95 px-4 py-4 flex flex-col gap-4">
          {navLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => { onContactClick(); setMenuOpen(false); }}
            className="px-5 py-2 rounded-full bg-primary text-primary-foreground font-semibold text-sm"
          >
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
