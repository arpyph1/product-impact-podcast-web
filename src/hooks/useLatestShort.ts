import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface LatestShortResult {
  videoId: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
}

export function useLatestShort(channelId: string | undefined) {
  const [data, setData] = useState<LatestShortResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!channelId) {
      setData(null);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    supabase.functions
      .invoke("get-latest-short", { body: { channelId } })
      .then(({ data: res, error: fnErr }) => {
        if (cancelled) return;
        if (fnErr) {
          setError(fnErr.message);
          setData(null);
        } else if (res?.error) {
          setError(res.error);
          setData(null);
        } else {
          setData(res as LatestShortResult);
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

  return { data, loading, error };
}
