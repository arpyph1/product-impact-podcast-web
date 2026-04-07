import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Shownotes {
  id: string;
  episode_guid: string;
  title: string;
  content_html: string;
  links: any[];
  video_urls: any[];
  published: boolean;
  updated_at: string;
}

// Fetch shownotes for a single episode
export function useShownotes(episodeGuid: string | null) {
  const [shownotes, setShownotes] = useState<Shownotes | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!episodeGuid) {
      setShownotes(null);
      return;
    }

    setLoading(true);
    supabase.functions
      .invoke("shownotes", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        body: undefined,
      })
      // The invoke method doesn't support query params well, so we use fetch directly
      .then(() => {})
      .catch(() => {});

    // Use direct fetch for GET with query params
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/shownotes?episode_guid=${encodeURIComponent(episodeGuid)}`;
    fetch(url, {
      headers: {
        apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      },
    })
      .then(r => r.json())
      .then(result => {
        setShownotes(result.data || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [episodeGuid]);

  return { shownotes, loading };
}

// Fetch all shownotes (for CMS listing)
export function useAllShownotes() {
  const [list, setList] = useState<Shownotes[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = () => {
    setLoading(true);
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/shownotes`;
    fetch(url, {
      headers: {
        apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      },
    })
      .then(r => r.json())
      .then(result => {
        setList(result.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { refresh(); }, []);

  return { list, loading, refresh };
}

// Save shownotes from CMS (uses auth token)
export async function saveShownotes(data: {
  episode_guid: string;
  title?: string;
  content_html?: string;
  links?: any[];
  video_urls?: any[];
  published?: boolean;
}) {
  const { data: result, error } = await supabase.functions.invoke("shownotes", {
    method: "POST",
    body: data,
  });
  if (error) throw error;
  return result;
}
