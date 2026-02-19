import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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

// Client-side fallback proxies
const RSS2JSON = "https://api.rss2json.com/v1/api.json?rss_url=";

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

    let link = "";
    const linkEl = item.querySelector("link");
    if (linkEl) {
      link = linkEl.textContent?.trim() || "";
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

function parseRss2JsonItems(feed: any, items: any[]): { episodes: PodcastEpisode[]; title: string; image: string } {
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

async function fetchFeed(feedUrl: string): Promise<{ episodes: PodcastEpisode[]; title: string; image: string }> {
  // 1. Try server-side proxy (edge function) — no CORS, returns ALL episodes
  try {
    const { data, error } = await supabase.functions.invoke("rss-proxy", {
      body: { feedUrl },
    });
    if (!error && data?.xml) {
      const result = parseRSSXML(data.xml);
      if (result.episodes.length > 0) return result;
    }
  } catch (e) {
    console.warn("rss-proxy edge function failed:", e);
  }

  // 2. Fallback to rss2json (limited to ~10 items on free tier)
  try {
    const r2 = await fetch(`${RSS2JSON}${encodeURIComponent(feedUrl)}`, { signal: AbortSignal.timeout(10000) });
    const data2 = await r2.json();
    if (data2.status === "ok" && Array.isArray(data2.items) && data2.items.length > 0) {
      return parseRss2JsonItems(data2.feed, data2.items);
    }
  } catch (e) {
    console.warn("rss2json failed:", e);
  }

  throw new Error("All feed sources failed");
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

    fetchFeed(feedUrl)
      .then(result => {
        if (cancelled) return;
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
