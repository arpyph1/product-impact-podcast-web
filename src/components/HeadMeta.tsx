import { useEffect } from "react";
import { CMSContent } from "@/types/cms";

const SITE_URL = "https://product-impact-podcast-web.lovable.app";

/**
 * Dynamically updates <head> meta tags and JSON-LD from CMS content.
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

    // Helper to upsert a <link> tag
    const setLink = (rel: string, href: string) => {
      if (!href) return;
      let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!el) {
        el = document.createElement("link");
        el.rel = rel;
        document.head.appendChild(el);
      }
      el.href = href;
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

    // Favicon
    if (content.faviconUrl) {
      let el = document.querySelector('link[rel="icon"]') as HTMLLinkElement | null;
      if (!el) {
        el = document.createElement("link");
        el.rel = "icon";
        document.head.appendChild(el);
      }
      el.href = content.faviconUrl;
      el.type = content.faviconUrl.endsWith(".svg") ? "image/svg+xml" : "image/png";
    }

    // Canonical URL
    setLink("canonical", SITE_URL + "/");

    // Open Graph — core
    setMeta("property", "og:type", "website");
    setMeta("property", "og:url", SITE_URL + "/");
    setMeta("property", "og:site_name", content.podcastName || "Product Impact Podcast");
    setMeta("property", "og:title", content.ogTitle);
    setMeta("property", "og:description", content.ogDescription || content.metaDescription);
    if (content.ogImage) setMeta("property", "og:image", content.ogImage);

    // Twitter
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", content.twitterTitle || content.ogTitle);
    setMeta("name", "twitter:description", content.twitterDescription || content.ogDescription || content.metaDescription);
    if (content.twitterImage || content.ogImage) {
      setMeta("name", "twitter:image", content.twitterImage || content.ogImage);
    }

    // JSON-LD — update PodcastSeries structured data
    const ldId = "ld-json-podcast";
    let ldEl = document.getElementById(ldId) as HTMLScriptElement | null;
    if (!ldEl) {
      ldEl = document.createElement("script");
      ldEl.id = ldId;
      ldEl.type = "application/ld+json";
      document.head.appendChild(ldEl);
    }
    ldEl.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "PodcastSeries",
      "name": content.podcastName || "Product Impact Podcast",
      "description": content.metaDescription || content.aboutDescription,
      "url": SITE_URL + "/",
      "webFeed": content.rssFeedUrl,
      "author": [
        {
          "@type": "Person",
          "name": content.host1Name,
          "url": content.host1LinkedinUrl || undefined,
        },
        {
          "@type": "Person",
          "name": content.host2Name,
          "url": content.host2LinkedinUrl || undefined,
        },
      ].filter(a => a.name),
      "publisher": {
        "@type": "Organization",
        "name": content.podcastName || "Product Impact Podcast",
      },
    });
  }, [
    content.metaDescription, content.googleSearchConsoleId, content.ogTitle,
    content.ogDescription, content.ogImage, content.twitterTitle,
    content.twitterDescription, content.twitterImage, content.podcastName,
    content.aboutDescription, content.rssFeedUrl, content.host1Name,
    content.host2Name, content.host1LinkedinUrl, content.host2LinkedinUrl,
    content.faviconUrl,
  ]);

  return null;
}
