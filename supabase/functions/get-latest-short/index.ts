import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

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

    // Fetch latest 20 videos from channel to have enough candidates
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${encodeURIComponent(channelId)}&type=video&order=date&maxResults=20&key=${apiKey}`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (!searchRes.ok) {
      return new Response(
        JSON.stringify({ error: "YouTube API error", details: searchData }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const items = searchData.items || [];
    const shorts: Array<{
      videoId: string;
      title: string;
      thumbnail: string;
      publishedAt: string;
    }> = [];

    // Check each video to see if it's a Short
    for (const item of items) {
      if (shorts.length >= count) break;
      const videoId = item.id?.videoId;
      if (!videoId) continue;

      try {
        const checkRes = await fetch(`https://www.youtube.com/shorts/${videoId}`, {
          redirect: "manual",
        });

        if (checkRes.status === 200) {
          shorts.push({
            videoId,
            title: item.snippet?.title || "",
            thumbnail: item.snippet?.thumbnails?.high?.url || "",
            publishedAt: item.snippet?.publishedAt || "",
          });
        }
      } catch {
        // Network error checking this video, skip
      }
    }

    if (shorts.length === 0) {
      return new Response(
        JSON.stringify({ error: "No Shorts found in the last 20 uploads", shorts: [] }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ shorts }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Internal error", message: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
