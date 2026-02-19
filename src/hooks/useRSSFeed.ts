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

// Use rss2json — most reliable in production (no CORS issues)
const RSS2JSON = "https://api.rss2json.com/v1/api.json?rss_url=";
// Fallback: allorigins raw XML
const PROXY_FALLBACK = "https://api.allorigins.win/get?url=";

function parseRSSXML(xml: string): { episodes: PodcastEpisode[]; title: string; image: string } {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "text/xml");

  const channelTitle = doc.querySelector("channel > title")?.textContent || "";

  const channelImage =
    doc.querySelector("channel > image > url")?.textContent ||
    doc.getElementsByTagNameNS("http://www.itunes.com/dtds/podcast-1.0.dtd", "image")[0]?.getAttribute("href") ||
    doc.querySelector("channel > itunes\\:image")?.getAttribute("href") ||
    "";

  const items = Array.from(doc.querySelectorAll("item"));
  const episodes: PodcastEpisode[] = items.map((item, idx) => {
    const title = item.querySelector("title")?.textContent?.trim() || `Episode ${idx + 1}`;

    // <link> in RSS is a text node sibling — walk nextSibling
    let link = "";
    const linkEl = item.querySelector("link");
    if (linkEl) {
      // Try text content first
      link = linkEl.textContent?.trim() || "";
      // If empty, check next sibling text node
      if (!link) {
        let sib = linkEl.nextSibling;
        while (sib) {
          if (sib.nodeType === Node.TEXT_NODE && sib.textContent?.trim()) {
            link = sib.textContent.trim();
            break;
          }
          sib = sib.nextSibling;
        }
      }
    }
    if (!link) link = item.querySelector("guid")?.textContent?.trim() || "";

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

    const enclosure = item.querySelector("enclosure");
    const audioUrl = enclosure?.getAttribute("url") || "";

    const itunesNsImage =
      item.getElementsByTagNameNS("http://www.itunes.com/dtds/podcast-1.0.dtd", "image")[0]?.getAttribute("href") || "";
    const itunesAttrImage = item.querySelector("itunes\\:image")?.getAttribute("href") || "";
    const mediaContent = item.querySelector("media\\:content")?.getAttribute("url") || "";
    const mediaThumbnail = item.querySelector("media\\:thumbnail")?.getAttribute("url") || "";
    const imageUrl = itunesNsImage || itunesAttrImage || mediaContent || mediaThumbnail || channelImage;

    const durationEl =
      item.getElementsByTagNameNS("http://www.itunes.com/dtds/podcast-1.0.dtd", "duration")[0] ||
      item.querySelector("itunes\\:duration");
    const duration = durationEl?.textContent || "";

    const epNumEl =
      item.getElementsByTagNameNS("http://www.itunes.com/dtds/podcast-1.0.dtd", "episode")[0] ||
      item.querySelector("itunes\\:episode");
    const episodeNumber = epNumEl?.textContent || String(items.length - idx);

    return { title, description: "", pubDate, audioUrl, imageUrl, duration, episodeNumber, link, guid };
  });

  return { episodes, title: channelTitle, image: channelImage };
}

async function fetchWithFallback(feedUrl: string): Promise<string> {
  // 1. Try rss2json — returns clean JSON, no CORS issues in production
  try {
    const r = await fetch(`${RSS2JSON}${encodeURIComponent(feedUrl)}`, { signal: AbortSignal.timeout(10000) });
    const data = await r.json();
    if (data.status === "ok" && Array.isArray(data.items) && data.items.length > 0) {
      // Convert rss2json JSON to episodes directly
      return JSON.stringify({ __rss2json: true, feed: data.feed, items: data.items });
    }
  } catch (e) {
    console.warn("rss2json failed:", e);
  }

  // 2. Try allorigins raw XML
  try {
    const r2 = await fetch(`${PROXY_FALLBACK}${encodeURIComponent(feedUrl)}`, { signal: AbortSignal.timeout(10000) });
    const data2 = await r2.json();
    if (data2.contents && data2.contents.length > 100) return data2.contents;
  } catch (e) {
    console.warn("allorigins failed:", e);
  }

  throw new Error("All proxies failed");
}

function parseRss2Json(jsonStr: string): { episodes: PodcastEpisode[]; title: string; image: string } {
  const { feed, items } = JSON.parse(jsonStr);
  const channelImage = feed?.image || "";
  const channelTitle = feed?.title || "";

  const episodes: PodcastEpisode[] = items.map((item: any, idx: number) => {
    const audioUrl =
      item.enclosure?.link ||
      (Array.isArray(item.enclosures) && item.enclosures[0]?.link) ||
      "";
    const imageUrl = item.thumbnail || item.enclosure?.thumbnail || channelImage;
    const pubDate = item.pubDate
      ? new Date(item.pubDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
      : "";

    return {
      title: item.title || `Episode ${idx + 1}`,
      description: "",
      pubDate,
      audioUrl,
      imageUrl,
      duration: item.itunes_duration || "",
      episodeNumber: item.itunes_episode || String(items.length - idx),
      link: item.link || item.guid || "",
      guid: item.guid || String(idx),
    };
  });

  return { episodes, title: channelTitle, image: channelImage };
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
      .then(raw => {
        if (cancelled) return;
        let result: { episodes: PodcastEpisode[]; title: string; image: string };
        try {
          const parsed = JSON.parse(raw);
          if (parsed.__rss2json) {
            result = parseRss2Json(raw);
          } else {
            throw new Error("not rss2json");
          }
        } catch {
          result = parseRSSXML(raw);
        }
        if (result.episodes.length === 0) throw new Error("No episodes found in feed");
        setPodcastTitle(result.title);
        setPodcastImage(result.image);
        setEpisodes(result.episodes);
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
