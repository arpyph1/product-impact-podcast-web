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
    const { feedUrl } = await req.json();
    if (!feedUrl) {
      return new Response(
        JSON.stringify({ error: "feedUrl is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch the RSS feed directly server-side (no CORS issues, no item limits)
    const res = await fetch(feedUrl, { signal: AbortSignal.timeout(15000) });
    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: `Feed returned ${res.status}` }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const xml = await res.text();

    return new Response(
      JSON.stringify({ xml }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("RSS proxy error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to fetch RSS feed", message: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
