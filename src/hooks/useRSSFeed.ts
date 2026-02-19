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

const RSS2JSON = "https://api.rss2json.com/v1/api.json?rss_url=";

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

    fetch(`${RSS2JSON}${encodeURIComponent(feedUrl)}`)
      .then(r => r.json())
      .then(data => {
        if (cancelled) return;

        if (data.status !== "ok") {
          throw new Error(data.message || "Feed error");
        }

        setPodcastTitle(data.feed?.title || "");
        setPodcastImage(data.feed?.image || "");

        const items: PodcastEpisode[] = (data.items || []).map((item: any, idx: number) => {
          // Format date
          let formattedDate = item.pubDate || "";
          try {
            if (formattedDate) {
              formattedDate = new Date(formattedDate).toLocaleDateString("en-US", {
                year: "numeric", month: "short", day: "numeric",
              });
            }
          } catch {}

          // Audio URL from enclosure
          const audioUrl = item.enclosure?.link || item.enclosure?.url || "";

          // Episode image: thumbnail > feed image
          const imageUrl = item.thumbnail || data.feed?.image || "";

          // Duration from itunes:duration (rss2json puts it in item.itunes?.duration or not at all)
          const duration = item.itunes_duration || "";

          // Episode number
          const epNumber = item.itunes_episode || String((data.items?.length || 0) - idx);

          return {
            title: item.title || `Episode ${epNumber}`,
            description: item.description || "",
            pubDate: formattedDate,
            audioUrl,
            imageUrl,
            duration,
            episodeNumber: String(epNumber),
            link: item.link || "",
            guid: item.guid || String(idx),
          };
        });

        setEpisodes(items);
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
