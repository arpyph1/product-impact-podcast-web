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

// Two proxy options — try primary, fallback to secondary
const PROXY_PRIMARY = "https://api.allorigins.win/get?url=";
const PROXY_FALLBACK = "https://corsproxy.io/?";

function parseRSSXML(xml: string): { episodes: PodcastEpisode[]; title: string; image: string } {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "text/xml");

  const channelTitle = doc.querySelector("channel > title")?.textContent || "";

  // Channel image — try several locations
  const channelImage =
    doc.querySelector("channel > image > url")?.textContent ||
    doc.querySelector("channel > itunes\\:image")?.getAttribute("href") ||
    doc.getElementsByTagNameNS("http://www.itunes.com/dtds/podcast-1.0.dtd", "image")[0]?.getAttribute("href") ||
    "";

  const items = Array.from(doc.querySelectorAll("item"));
  const episodes: PodcastEpisode[] = items.map((item, idx) => {
    const title = item.querySelector("title")?.textContent?.trim() || `Episode ${idx + 1}`;
    const linkEl = item.querySelector("link");
    // <link> is sometimes a text node after the element
    const link =
      linkEl?.textContent?.trim() ||
      item.querySelector("guid")?.textContent?.trim() ||
      "";

    const guid = item.querySelector("guid")?.textContent || String(idx);

    const pubDateRaw = item.querySelector("pubDate")?.textContent || "";
    let pubDate = "";
    try {
      if (pubDateRaw) {
        pubDate = new Date(pubDateRaw).toLocaleDateString("en-US", {
          year: "numeric", month: "short", day: "numeric",
        });
      }
    } catch { /* ignore */ }

    // Audio from enclosure
    const enclosure = item.querySelector("enclosure");
    const audioUrl = enclosure?.getAttribute("url") || "";

    // Image — namespace-aware first, then fallback
    const itunesNsImage =
      item.getElementsByTagNameNS("http://www.itunes.com/dtds/podcast-1.0.dtd", "image")[0]?.getAttribute("href") ||
      "";
    const itunesAttrImage =
      item.querySelector("itunes\\:image")?.getAttribute("href") || "";
    const mediaContent =
      item.querySelector("media\\:content")?.getAttribute("url") || "";
    const mediaThumbnail =
      item.querySelector("media\\:thumbnail")?.getAttribute("url") || "";

    const imageUrl = itunesNsImage || itunesAttrImage || mediaContent || mediaThumbnail || channelImage;

    // Duration
    const durationEl =
      item.getElementsByTagNameNS("http://www.itunes.com/dtds/podcast-1.0.dtd", "duration")[0] ||
      item.querySelector("itunes\\:duration");
    const duration = durationEl?.textContent || "";

    // Episode number
    const epNumEl =
      item.getElementsByTagNameNS("http://www.itunes.com/dtds/podcast-1.0.dtd", "episode")[0] ||
      item.querySelector("itunes\\:episode");
    const episodeNumber = epNumEl?.textContent || String(items.length - idx);

    return { title, description: "", pubDate, audioUrl, imageUrl, duration, episodeNumber, link, guid };
  });

  return { episodes, title: channelTitle, image: channelImage };
}

async function fetchWithFallback(feedUrl: string): Promise<string> {
  // Try primary proxy
  try {
    const r = await fetch(`${PROXY_PRIMARY}${encodeURIComponent(feedUrl)}`, { signal: AbortSignal.timeout(8000) });
    const data = await r.json();
    if (data.contents && data.contents.length > 100) return data.contents;
    throw new Error("Empty response from primary proxy");
  } catch (e) {
    console.warn("Primary RSS proxy failed, trying fallback:", e);
  }

  // Try fallback proxy
  const r2 = await fetch(`${PROXY_FALLBACK}${encodeURIComponent(feedUrl)}`, { signal: AbortSignal.timeout(8000) });
  if (!r2.ok) throw new Error(`Fallback proxy HTTP ${r2.status}`);
  return r2.text();
}

export function useRSSFeed(feedUrl: string) {
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [podcastTitle, setPodcastTitle] = useState("");
  const [podcastImage, setPodcastImage] = useState("");

  useEffect(() => {
    if (!feedUrl) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    setEpisodes([]);

    fetchWithFallback(feedUrl)
      .then(xml => {
        if (cancelled) return;
        const { episodes, title, image } = parseRSSXML(xml);
        if (episodes.length === 0) throw new Error("No episodes found in feed");
        setPodcastTitle(title);
        setPodcastImage(image);
        setEpisodes(episodes);
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
