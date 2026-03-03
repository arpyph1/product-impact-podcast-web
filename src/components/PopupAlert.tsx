import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { CMSContent } from "@/types/cms";

const COOKIE_KEY = "popup_dismissed_at";
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export default function PopupAlert({ content }: { content: CMSContent }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!content.popupEnabled) return;
    const dismissed = localStorage.getItem(COOKIE_KEY);
    if (dismissed && Date.now() - Number(dismissed) < THIRTY_DAYS_MS) return;
    const timer = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(timer);
  }, [content.popupEnabled]);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(COOKIE_KEY, String(Date.now()));
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 w-[min(500px,calc(100vw-3rem))] animate-slide-up">
      <div className="relative bg-card border border-border rounded-2xl shadow-2xl p-8 flex flex-col gap-4">
        <button
          onClick={dismiss}
          className="absolute top-3 right-3 p-1.5 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="font-display text-xl font-bold text-foreground pr-8">
          {content.popupTitle}
        </h2>

        <p className="text-sm text-muted-foreground leading-relaxed">
          {content.popupBody?.slice(0, 100)}
        </p>

        {content.popupButtonText && (
          <a
            href={content.popupButtonUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            onClick={dismiss}
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity w-fit"
          >
            {content.popupButtonText}
          </a>
        )}
      </div>
    </div>
  );
}
