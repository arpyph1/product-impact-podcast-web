import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/**
 * Parse ISO 8601 duration (PT#M#S) to seconds.
 */
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

    // Step 1: Fetch latest 50 videos from channel
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${encodeURIComponent(channelId)}&type=video&order=date&maxResults=50&key=${apiKey}`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (!searchRes.ok) {
      console.error("YouTube search API error:", JSON.stringify(searchData));
      return new Response(
        JSON.stringify({ error: "YouTube API error", details: searchData.error?.message || "Unknown error" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const items = searchData.items || [];
    if (items.length === 0) {
      return new Response(
        JSON.stringify({ error: "No videos found for this channel", shorts: [] }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Step 2: Get video details (duration) in batch to identify Shorts (≤60s)
    const videoIds = items.map((item: any) => item.id?.videoId).filter(Boolean);
    const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoIds.join(",")}&key=${apiKey}`;
    const detailsRes = await fetch(detailsUrl);
    const detailsData = await detailsRes.json();

    if (!detailsRes.ok) {
      console.error("YouTube videos API error:", JSON.stringify(detailsData));
      return new Response(
        JSON.stringify({ error: "YouTube API error fetching video details" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const shorts: Array<{
      videoId: string;
      title: string;
      thumbnail: string;
      publishedAt: string;
    }> = [];

    for (const video of (detailsData.items || [])) {
      if (shorts.length >= count) break;
      const duration = parseDuration(video.contentDetails?.duration || "");
      // Shorts are ≤ 60 seconds
      if (duration <= 60) {
        shorts.push({
          videoId: video.id,
          title: video.snippet?.title || "",
          thumbnail: video.snippet?.thumbnails?.high?.url || video.snippet?.thumbnails?.medium?.url || "",
          publishedAt: video.snippet?.publishedAt || "",
        });
      }
    }

    if (shorts.length === 0) {
      return new Response(
        JSON.stringify({ error: "No Shorts found (videos ≤60s) in the latest uploads", shorts: [] }),
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
