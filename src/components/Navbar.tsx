import { CMSContent } from "@/types/cms";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useState, useEffect } from "react";
import logo from "@/assets/logo-new.png";

interface NavbarProps {
  content: CMSContent;
  isEditing: boolean;
  onToggleEdit: () => void;
  onContactClick: () => void;
  onUpdate: (key: keyof CMSContent, value: any) => void;
}

export default function Navbar({ content, isEditing, onToggleEdit, onContactClick, onUpdate }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const leftLinks = [
    { label: content.navLink1Label, href: content.navLink1Href, labelKey: "navLink1Label" as keyof CMSContent, hrefKey: "navLink1Href" as keyof CMSContent },
    { label: content.navLink2Label, href: content.navLink2Href, labelKey: "navLink2Label" as keyof CMSContent, hrefKey: "navLink2Href" as keyof CMSContent },
  ];

  const rightLinks = [
    { label: content.navLink3Label, href: content.navLink3Href, labelKey: "navLink3Label" as keyof CMSContent, hrefKey: "navLink3Href" as keyof CMSContent },
  ];

  const renderLink = (link: typeof leftLinks[0]) =>
    isEditing ? (
      <div key={link.labelKey} className="flex flex-col gap-0.5">
        <input
          className="text-xs font-medium uppercase tracking-wide bg-transparent border-b border-amber/50 text-foreground focus:outline-none w-24"
          defaultValue={link.label}
          onBlur={e => onUpdate(link.labelKey, e.target.value)}
        />
      </div>
    ) : (
      <a
        key={link.labelKey}
        href={link.href}
        className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors tracking-wide uppercase"
      >
        {link.label}
      </a>
    );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-6 flex items-center justify-between" style={{ height: scrolled ? "52px" : "68px", transition: "height 0.3s ease" }}>

        {/* Left nav links */}
        <nav className="hidden md:flex items-center gap-8 flex-1">
          {leftLinks.map(renderLink)}
        </nav>

        {/* Center logo — shrinks on scroll */}
        <div className="flex items-center justify-center flex-shrink-0">
          <a href="#" className="flex items-center justify-center">
            <img
              src={logo}
              alt={content.podcastName}
              style={{
                width: scrolled ? "40px" : "56px",
                height: scrolled ? "40px" : "56px",
                transition: "width 0.3s ease, height 0.3s ease",
              }}
              className="object-contain"
            />
          </a>
        </div>

        {/* Right nav + actions */}
        <div className="hidden md:flex items-center justify-end gap-6 flex-1">
          {rightLinks.map(renderLink)}
          <button
            onClick={onToggleEdit}
            className={`text-xs font-medium px-3 py-1.5 rounded border transition-all ${
              isEditing
                ? "border-amber/70 text-amber"
                : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/40"
            }`}
          >
            {isEditing ? "✓ Done" : "Edit"}
          </button>
          <button
            onClick={onContactClick}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:brightness-110 transition-all"
          >
            Contact <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        {/* Mobile hamburger */}
        <div className="md:hidden flex justify-end">
          <button className="p-2 text-muted-foreground" onClick={() => setMenuOpen(v => !v)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-border bg-background px-6 py-5 flex flex-col gap-4">
          {[...leftLinks, ...rightLinks].map(link => (
            <a key={link.labelKey} href={link.href} onClick={() => setMenuOpen(false)}
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
