import { useEffect } from "react";
import { CMSContent } from "@/types/cms";

/**
 * Dynamically updates <head> meta tags from CMS content.
 * Runs on every content change so the CMS SEO fields take effect immediately.
 */
export default function HeadMeta({ content }: { content: CMSContent }) {
  useEffect(() => {
    // Helper to upsert a meta tag
    const setMeta = (attr: "name" | "property", key: string, value: string) => {
      if (!value) return;
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.content = value;
    };

    // Page title
    if (content.ogTitle) {
      document.title = content.ogTitle;
    }

    // Meta description
    setMeta("name", "description", content.metaDescription);

    // Google Search Console verification
    if (content.googleSearchConsoleId) {
      setMeta("name", "google-site-verification", content.googleSearchConsoleId);
    }

    // Open Graph
    setMeta("property", "og:title", content.ogTitle);
    setMeta("property", "og:description", content.ogDescription || content.metaDescription);
    if (content.ogImage) setMeta("property", "og:image", content.ogImage);

    // Twitter
    setMeta("name", "twitter:title", content.twitterTitle || content.ogTitle);
    setMeta("name", "twitter:description", content.twitterDescription || content.ogDescription || content.metaDescription);
    if (content.twitterImage || content.ogImage) {
      setMeta("name", "twitter:image", content.twitterImage || content.ogImage);
    }
  }, [content.metaDescription, content.googleSearchConsoleId, content.ogTitle, content.ogDescription, content.ogImage, content.twitterTitle, content.twitterDescription, content.twitterImage]);

  return null;
}
