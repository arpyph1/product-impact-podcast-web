import { CMSContent, NavItem } from "@/types/cms";
import { Menu, X, ArrowUpRight, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo-new.png";
import type { User } from "@supabase/supabase-js";

interface NavbarProps {
  content: CMSContent;
  isEditing: boolean;
  onToggleEdit: () => void;
  onContactClick: () => void;
  onUpdate: (key: keyof CMSContent, value: any) => void;
  canEdit?: boolean;
  user?: User | null;
  onSignIn?: () => void;
  onSignOut?: () => void;
}

const THEMES_DROPDOWN = [
  { label: "AI Product Strategy", slug: "ai-product-strategy" },
  { label: "Agents & Agentic Systems", slug: "agents-agentic-systems" },
  { label: "UX for AI", slug: "ux-for-ai" },
  { label: "Adoption & Organizational Change", slug: "adoption-organizational-change" },
  { label: "Evaluation & Benchmarking", slug: "evaluation-benchmarking" },
  { label: "Go-to-Market & Distribution", slug: "go-to-market-distribution" },
  { label: "Data, Semantics & Knowledge", slug: "data-semantics-knowledge-foundations" },
  { label: "AI Ethics & Governance", slug: "ai-ethics-governance" },
];

const NEWS_DROPDOWN = [
  { label: "Features", format: "feature" },
  { label: "News Analysis", format: "news-analysis" },
  { label: "Case Studies", format: "case-study" },
  { label: "Releases", format: "release-note" },
  { label: "Interviews", format: "interview" },
];

const NAV_ITEMS = [
  { label: "News", href: "/news", dropdown: "news" },
  { label: "Themes", href: "/themes", dropdown: "themes" },
  { label: "Podcast", href: "/podcast", dropdown: null },
  { label: "Episodes", href: "/episodes", dropdown: null },
  { label: "Partnerships", href: "/partnerships", dropdown: null },
];

export default function Navbar({ content, isEditing, onToggleEdit, onContactClick, onUpdate, canEdit, user, onSignIn, onSignOut }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownTimeout = useRef<number | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openDropdown = (id: string) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setActiveDropdown(id);
  };
  const closeDropdown = () => {
    dropdownTimeout.current = window.setTimeout(() => setActiveDropdown(null), 150);
  };

  const logoSize = scrolled ? 76 : 113;

  // Split nav: News + Themes left, Podcast + Episodes + Partnerships right
  const leftItems = NAV_ITEMS.slice(0, 2);
  const rightItems = NAV_ITEMS.slice(2);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div
        className="container mx-auto px-6 flex items-center justify-between"
        style={{ height: scrolled ? "80px" : "112px", transition: "height 0.3s ease" }}
      >
        {/* Left nav */}
        <nav className="hidden md:flex items-center gap-6 flex-1">
          {leftItems.map(item => (
            <div key={item.label} className="relative"
              onMouseEnter={() => item.dropdown && openDropdown(item.dropdown)}
              onMouseLeave={closeDropdown}>
              <Link to={item.href}
                className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors tracking-wide uppercase inline-flex items-center gap-1">
                {item.label}
                {item.dropdown && <ChevronDown className="w-3 h-3" />}
              </Link>

              {/* News dropdown */}
              {item.dropdown === "news" && activeDropdown === "news" && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg py-2 z-50"
                  onMouseEnter={() => openDropdown("news")} onMouseLeave={closeDropdown}>
                  {NEWS_DROPDOWN.map(nd => (
                    <Link key={nd.format} to={`/news/format/${nd.format}`}
                      className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                      onClick={() => setActiveDropdown(null)}>
                      {nd.label}
                    </Link>
                  ))}
                </div>
              )}

              {/* Themes dropdown */}
              {item.dropdown === "themes" && activeDropdown === "themes" && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-background border border-border rounded-lg shadow-lg py-2 z-50"
                  onMouseEnter={() => openDropdown("themes")} onMouseLeave={closeDropdown}>
                  <div className="grid grid-cols-2 gap-0.5 p-2">
                    {THEMES_DROPDOWN.map(td => (
                      <Link key={td.slug} to={`/themes/${td.slug}`}
                        className="block px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded transition-colors"
                        onClick={() => setActiveDropdown(null)}>
                        {td.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Center logo */}
        <div className="flex items-center justify-center flex-shrink-0">
          <Link to="/" className="flex items-center justify-center">
            <img
              src={logo}
              alt={content.podcastName}
              style={{
                width: `${logoSize}px`,
                height: `${logoSize}px`,
                transition: "width 0.3s ease, height 0.3s ease",
              }}
              className="object-contain"
            />
          </Link>
        </div>

        {/* Right nav + contact */}
        <div className="hidden md:flex items-center justify-end gap-6 flex-1">
          {rightItems.map(item => (
            <Link key={item.label} to={item.href}
              className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors tracking-wide uppercase">
              {item.label}
            </Link>
          ))}
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

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-background px-6 py-5 flex flex-col gap-4">
          {NAV_ITEMS.map(item => (
            <Link key={item.label} to={item.href} onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground uppercase tracking-wide">
              {item.label}
            </Link>
          ))}
          <button onClick={() => { onContactClick(); setMenuOpen(false); }}
            className="w-full px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
            Contact
          </button>
        </div>
      )}
    </header>
  );
}
