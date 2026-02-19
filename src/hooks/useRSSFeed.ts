import { useState, useEffect } from "react";

export interface PodcastEpisode {
  title: string;
  description: string;
  pubDate: string;
  audioUrl: string;
  imageUrl: string;
  duration: string;
  episodeNumber: string;
  link: string;
  guid: string;
}

const CORS_PROXY = "https://corsproxy.io/?url=";

function parseXML(xmlText: string): PodcastEpisode[] {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, "text/xml");

    // Get channel-level image as fallback
    const channelImage =
      doc.querySelector("channel > image > url")?.textContent ||
      doc.querySelector("channel > itunes\\:image, channel > *|image")?.getAttribute("href") ||
      "";

    const items = Array.from(doc.querySelectorAll("item"));

    return items.map((item, idx) => {
      const get = (tag: string) =>
        item.querySelector(tag)?.textContent?.trim() || "";

      // Audio URL
      let audioUrl = item.querySelector("enclosure")?.getAttribute("url") || "";
      if (!audioUrl) {
        audioUrl = get("link");
      }

      // Episode image - try multiple sources
      const itunesImage =
        item.querySelector("itunes\\:image")?.getAttribute("href") ||
        item.querySelector("*|image[href]")?.getAttribute("href") ||
        item.querySelector("image")?.getAttribute("href") || "";

      const mediaContent =
        item.querySelector("media\\:content[type^='image'], *|content[type^='image']")?.getAttribute("url") ||
        item.querySelector("media\\:thumbnail, *|thumbnail")?.getAttribute("url") || "";

      const imageUrl = itunesImage || mediaContent || channelImage;

      // Duration
      const rawDuration =
        item.querySelector("itunes\\:duration, *|duration")?.textContent?.trim() || "";
      const duration = rawDuration || "–";

      // Episode number
      const epNumber =
        item.querySelector("itunes\\:episode, *|episode")?.textContent?.trim() ||
        String(items.length - idx);

      // Pub date
      const pubDate = get("pubDate") || get("dc\\:date") || "";
      let formattedDate = pubDate;
      try {
        if (pubDate) {
          formattedDate = new Date(pubDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
        }
      } catch {}

      return {
        title: get("title") || `Episode ${epNumber}`,
        description: get("description") || get("itunes\\:summary") || "",
        pubDate: formattedDate,
        audioUrl,
        imageUrl,
        duration,
        episodeNumber: epNumber,
        link: get("link"),
        guid: get("guid") || String(idx),
      };
    });
  } catch (err) {
    console.error("RSS parse error:", err);
    return [];
  }
}

export function useRSSFeed(feedUrl: string) {
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [podcastTitle, setPodcastTitle] = useState("");
  const [podcastImage, setPodcastImage] = useState("");

  useEffect(() => {
    if (!feedUrl) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    const url = `${CORS_PROXY}${encodeURIComponent(feedUrl)}`;

    fetch(url)
      .then(r => r.text())
      .then(xmlText => {
        if (cancelled) return;
        const parsed = parseXML(xmlText);

        // Parse channel metadata
        const parser = new DOMParser();
        const doc = parser.parseFromString(xmlText, "text/xml");
        const title = doc.querySelector("channel > title")?.textContent?.trim() || "";
        const img =
          doc.querySelector("channel > itunes\\:image")?.getAttribute("href") ||
          doc.querySelector("channel > image > url")?.textContent?.trim() ||
          doc.querySelector("channel > *|image")?.getAttribute("href") || "";

        setPodcastTitle(title);
        setPodcastImage(img);
        setEpisodes(parsed);
        setLoading(false);
      })
      .catch(err => {
        if (cancelled) return;
        console.error("RSS fetch error:", err);
        setError("Could not load episodes. Check the RSS URL or try again.");
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [feedUrl]);

  return { episodes, loading, error, podcastTitle, podcastImage };
}
