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

// Use allorigins proxy to bypass CORS and get full episode list
const PROXY = "https://api.allorigins.win/get?url=";

function parseRSSXML(xml: string, feedUrl: string): { episodes: PodcastEpisode[]; title: string; image: string } {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "text/xml");

  const channelTitle = doc.querySelector("channel > title")?.textContent || "";
  const channelImage =
    doc.querySelector("channel > image > url")?.textContent ||
    doc.querySelector("channel > itunes\\:image")?.getAttribute("href") ||
    "";

  const items = Array.from(doc.querySelectorAll("item"));
  const episodes: PodcastEpisode[] = items.map((item, idx) => {
    const title = item.querySelector("title")?.textContent || `Episode ${idx + 1}`;
    const link = item.querySelector("link")?.textContent || "";
    const guid = item.querySelector("guid")?.textContent || String(idx);
    const pubDateRaw = item.querySelector("pubDate")?.textContent || "";
    let pubDate = "";
    try {
      if (pubDateRaw) {
        pubDate = new Date(pubDateRaw).toLocaleDateString("en-US", {
          year: "numeric", month: "short", day: "numeric",
        });
      }
    } catch {}

    // Audio from enclosure
    const enclosure = item.querySelector("enclosure");
    const audioUrl = enclosure?.getAttribute("url") || "";

    // Image: item-level itunes:image first, then channel image
    const itunesImage =
      item.querySelector("itunes\\:image")?.getAttribute("href") ||
      item.querySelector("[nodeName='itunes:image']")?.getAttribute("href") ||
      "";

    // Try namespace-aware approach
    const itunesNsImage = item.getElementsByTagNameNS(
      "http://www.itunes.com/dtds/podcast-1.0.dtd", "image"
    )[0]?.getAttribute("href") || "";

    const imageUrl = itunesNsImage || itunesImage || channelImage;

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
    setEpisodes([]);

    const url = `${PROXY}${encodeURIComponent(feedUrl)}`;

    fetch(url)
      .then(r => r.json())
      .then(data => {
        if (cancelled) return;
        if (!data.contents) throw new Error("No content received");
        const { episodes, title, image } = parseRSSXML(data.contents, feedUrl);
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
