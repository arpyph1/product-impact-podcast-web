import { CMSContent, NavItem } from "@/types/cms";
import { Menu, X, ArrowUpRight, LogIn, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
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

export default function Navbar({ content, isEditing, onToggleEdit, onContactClick, onUpdate, canEdit, user, onSignIn, onSignOut }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const leftItems = content.navLeftItems || [];
  const rightItems = content.navRightItems || [];

  const renderLink = (item: NavItem, idx: number, side: "left" | "right") =>
    isEditing ? (
      <div key={`${side}-${idx}`} className="flex flex-col gap-0.5">
        <input
          className="text-xs font-medium uppercase tracking-wide bg-transparent border-b border-amber/50 text-foreground focus:outline-none w-24"
          defaultValue={item.label}
          onBlur={e => {
            const items = side === "left" ? [...leftItems] : [...rightItems];
            items[idx] = { ...items[idx], label: e.target.value };
            onUpdate(side === "left" ? "navLeftItems" : "navRightItems", items);
          }}
        />
      </div>
    ) : (
      <a
        key={`${side}-${idx}`}
        href={item.href}
        className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors tracking-wide uppercase"
      >
        {item.label}
      </a>
    );

  const logoSize = scrolled ? 76 : 113;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div
        className="container mx-auto px-6 flex items-center justify-between"
        style={{ height: scrolled ? "80px" : "112px", transition: "height 0.3s ease" }}
      >
        {/* Left nav links */}
        <nav className="hidden md:flex items-center gap-8 flex-1">
          {leftItems.map((item, i) => renderLink(item, i, "left"))}
        </nav>

        {/* Center logo */}
        <div className="flex items-center justify-center flex-shrink-0">
          <a href="#" className="flex items-center justify-center">
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
          </a>
        </div>

        {/* Right nav + actions */}
        <div className="hidden md:flex items-center justify-end gap-6 flex-1">
          {rightItems.map((item, i) => renderLink(item, i, "right"))}
          {canEdit && (
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
          )}
          {!user && onSignIn && (
            <button
              onClick={onSignIn}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-border text-xs text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-all"
            >
              <LogIn className="w-3 h-3" /> Sign In
            </button>
          )}
          {user && onSignOut && (
            <button
              onClick={onSignOut}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-border text-xs text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-all"
              title={user.email}
            >
              <LogOut className="w-3 h-3" /> Sign Out
            </button>
          )}
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
          {[...leftItems, ...rightItems].map((item, i) => (
            <a key={i} href={item.href} onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground uppercase tracking-wide">
              {item.label}
            </a>
          ))}
          <button onClick={() => { onContactClick(); setMenuOpen(false); }}
            className="w-full px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
            Contact
          </button>
          {canEdit && (
            <button onClick={onToggleEdit} className="text-xs text-muted-foreground underline">
              {isEditing ? "Exit Edit Mode" : "Edit Site"}
            </button>
          )}
          {!user && onSignIn && (
            <button onClick={() => { onSignIn(); setMenuOpen(false); }}
              className="w-full px-5 py-2.5 rounded-full border border-border text-sm font-semibold text-foreground">
              Sign In
            </button>
          )}
          {user && onSignOut && (
            <button onClick={() => { onSignOut(); setMenuOpen(false); }}
              className="text-xs text-muted-foreground underline">
              Sign Out
            </button>
          )}
        </div>
      )}
    </header>
  );
}
