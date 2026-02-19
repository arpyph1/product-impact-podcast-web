import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function parseDuration(iso: string): number {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return 9999;
  return (parseInt(m[1] || "0") * 3600) + (parseInt(m[2] || "0") * 60) + parseInt(m[3] || "0");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { channelId, count = 2 } = await req.json();
    if (!channelId) {
      return new Response(
        JSON.stringify({ error: "channelId is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const apiKey = Deno.env.get("YOUTUBE_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "YouTube API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use the uploads playlist (replace UC with UU) — more reliable than Search API
    const uploadsPlaylistId = channelId.replace(/^UC/, "UU");

    // Fetch latest 50 uploads via PlaylistItems API
    const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${encodeURIComponent(uploadsPlaylistId)}&maxResults=50&key=${apiKey}`;
    const playlistRes = await fetch(playlistUrl);
    const playlistData = await playlistRes.json();

    if (!playlistRes.ok) {
      console.error("YouTube PlaylistItems API error:", JSON.stringify(playlistData));
      return new Response(
        JSON.stringify({ error: "YouTube API error", details: playlistData.error?.message || "Unknown error" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const items = playlistData.items || [];
    if (items.length === 0) {
      return new Response(
        JSON.stringify({ error: "No videos found", shorts: [] }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get video IDs to check durations
    const videoIds = items.map((item: any) => item.snippet?.resourceId?.videoId).filter(Boolean);
    const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoIds.join(",")}&key=${apiKey}`;
    const detailsRes = await fetch(detailsUrl);
    const detailsData = await detailsRes.json();

    if (!detailsRes.ok) {
      console.error("YouTube Videos API error:", JSON.stringify(detailsData));
      return new Response(
        JSON.stringify({ error: "YouTube API error fetching video details" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Filter to shorts (≤60s), preserving upload order (newest first)
    const shorts: Array<{
      videoId: string;
      title: string;
      thumbnail: string;
      publishedAt: string;
    }> = [];

    // Build a map of video details keyed by ID
    const detailsMap = new Map<string, any>();
    for (const v of (detailsData.items || [])) {
      detailsMap.set(v.id, v);
    }

    // Iterate in playlist order (newest first)
    for (const item of items) {
      if (shorts.length >= count) break;
      const vid = item.snippet?.resourceId?.videoId;
      const detail = detailsMap.get(vid);
      if (!detail) continue;
      const duration = parseDuration(detail.contentDetails?.duration || "");
      if (duration <= 120) {
        shorts.push({
          videoId: vid,
          title: detail.snippet?.title || "",
          thumbnail: detail.snippet?.thumbnails?.high?.url || detail.snippet?.thumbnails?.medium?.url || "",
          publishedAt: detail.snippet?.publishedAt || "",
        });
      }
    }

    if (shorts.length === 0) {
      return new Response(
        JSON.stringify({ error: "No Shorts found (videos ≤2min) in the latest uploads", shorts: [] }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ shorts }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(
      JSON.stringify({ error: "Internal error", message: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
