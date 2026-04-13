import { CMSContent, NavItem } from "@/types/cms";
import { Menu, X, ArrowUpRight, ChevronDown, Newspaper, BookOpen, Mic2, Users, Handshake, Layers, Zap, FileText, MessageSquare, FlaskConical, Star } from "lucide-react";
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
  { label: "AI Product Strategy", slug: "ai-product-strategy", icon: Zap },
  { label: "Agents & Agentic Systems", slug: "agents-agentic-systems", icon: Layers },
  { label: "UX for AI", slug: "ux-for-ai", icon: Star },
  { label: "Adoption & Org Change", slug: "adoption-organizational-change", icon: Users },
  { label: "Evaluation & Benchmarking", slug: "evaluation-benchmarking", icon: FlaskConical },
  { label: "Go-to-Market & Distribution", slug: "go-to-market-distribution", icon: Handshake },
  { label: "Data, Semantics & Knowledge", slug: "data-semantics-knowledge-foundations", icon: BookOpen },
  { label: "AI Ethics & Governance", slug: "ai-ethics-governance", icon: MessageSquare },
];

const NEWS_DROPDOWN = [
  { label: "All News", format: "", desc: "Everything published", icon: Newspaper },
  { label: "Features", format: "feature", desc: "In-depth reporting", icon: FileText },
  { label: "News Analysis", format: "news-analysis", desc: "What it means", icon: BookOpen },
  { label: "Case Studies", format: "case-study", desc: "Real-world impact", icon: FlaskConical },
  { label: "Releases", format: "release-note", desc: "Product launches", icon: Zap },
  { label: "Interviews", format: "interview", desc: "Conversations with leaders", icon: Mic2 },
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

  const logoSize = scrolled ? 56 : 72;

  const leftItems = NAV_ITEMS.slice(0, 2);
  const rightItems = NAV_ITEMS.slice(2);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${
      scrolled ? "border-border bg-card/95 backdrop-blur-md shadow-sm" : "border-transparent bg-card/80 backdrop-blur-sm"
    }`}>
      <div
        className="container mx-auto px-6 flex items-center justify-between"
        style={{ height: scrolled ? "64px" : "80px", transition: "height 0.3s ease" }}
      >
        {/* Left nav */}
        <nav className="hidden md:flex items-center gap-6 flex-1">
          {leftItems.map(item => (
            <div key={item.label} className="relative"
              onMouseEnter={() => item.dropdown && openDropdown(item.dropdown)}
              onMouseLeave={closeDropdown}>
              <Link to={item.href}
                className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors inline-flex items-center gap-1">
                {item.label}
                {item.dropdown && <ChevronDown className="w-3 h-3" />}
              </Link>

              {/* News mega menu */}
              {item.dropdown === "news" && activeDropdown === "news" && (
                <div className="absolute top-full left-0 mt-3 w-[520px] bg-card border border-border rounded-xl shadow-xl p-5 z-50"
                  onMouseEnter={() => openDropdown("news")} onMouseLeave={closeDropdown}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Browse by format</span>
                    <Link to="/news" className="text-xs text-primary hover:underline" onClick={() => setActiveDropdown(null)}>
                      View all →
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {NEWS_DROPDOWN.map(nd => {
                      const Icon = nd.icon;
                      return (
                        <Link key={nd.format} to={nd.format ? `/news/format/${nd.format}` : "/news"}
                          className="flex items-start gap-3 px-3 py-3 rounded-lg text-foreground hover:bg-muted transition-colors group"
                          onClick={() => setActiveDropdown(null)}>
                          <Icon className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="text-sm font-medium group-hover:text-primary transition-colors block">{nd.label}</span>
                            <span className="text-xs text-muted-foreground">{nd.desc}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Themes mega menu */}
              {item.dropdown === "themes" && activeDropdown === "themes" && (
                <div className="absolute top-full left-0 mt-3 w-[560px] bg-card border border-border rounded-xl shadow-xl p-5 z-50"
                  onMouseEnter={() => openDropdown("themes")} onMouseLeave={closeDropdown}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Explore themes</span>
                    <Link to="/themes" className="text-xs text-primary hover:underline" onClick={() => setActiveDropdown(null)}>
                      View all →
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {THEMES_DROPDOWN.map(td => {
                      const Icon = td.icon;
                      return (
                        <Link key={td.slug} to={`/themes/${td.slug}`}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-foreground hover:bg-muted transition-colors group"
                          onClick={() => setActiveDropdown(null)}>
                          <Icon className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="text-sm font-medium group-hover:text-primary transition-colors">{td.label}</span>
                        </Link>
                      );
                    })}
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
              className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
              {item.label}
            </Link>
          ))}
          <button
            onClick={onContactClick}
            className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:brightness-110 transition-all shadow-sm"
          >
            Contact <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        {/* Mobile hamburger */}
        <div className="md:hidden flex justify-end">
          <button className="p-2 text-foreground/70" onClick={() => setMenuOpen(v => !v)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-card px-6 py-5 flex flex-col gap-4 shadow-lg">
          {NAV_ITEMS.map(item => (
            <Link key={item.label} to={item.href} onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors">
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
