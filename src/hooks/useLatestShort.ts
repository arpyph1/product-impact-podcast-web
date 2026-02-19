import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ShortResult {
  videoId: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
}

export function useLatestShorts(channelId: string | undefined) {
  const [shorts, setShorts] = useState<ShortResult[]>([]);
  const [mostWatched, setMostWatched] = useState<ShortResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!channelId) {
      setShorts([]);
      setMostWatched(null);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    supabase.functions
      .invoke("get-latest-short", { body: { channelId, count: 2 } })
      .then(({ data: res, error: fnErr }) => {
        if (cancelled) return;
        if (fnErr) {
          setError(fnErr.message);
          setShorts([]);
          setMostWatched(null);
        } else if (res?.error) {
          setError(res.error);
          setShorts(res.shorts || []);
          setMostWatched(res.mostWatched || null);
        } else {
          setShorts(res.shorts || []);
          setMostWatched(res.mostWatched || null);
        }
      })
      .catch((e) => {
        if (!cancelled) setError(String(e));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [channelId]);

  return { shorts, mostWatched, loading, error };
}
