import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-api-key, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  try {
    const url = new URL(req.url);

    // GET — fetch shownotes (single by episode_guid or list all)
    if (req.method === "GET") {
      const guid = url.searchParams.get("episode_guid");

      if (guid) {
        const { data, error } = await supabase
          .from("episode_shownotes")
          .select("*")
          .eq("episode_guid", guid)
          .single();

        if (error && error.code === "PGRST116") {
          return new Response(JSON.stringify({ data: null }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (error) throw error;

        return new Response(JSON.stringify({ data }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // List all shownotes
      const { data, error } = await supabase
        .from("episode_shownotes")
        .select("id, episode_guid, title, published, updated_at")
        .order("updated_at", { ascending: false });

      if (error) throw error;

      return new Response(JSON.stringify({ data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // POST/PUT — upsert shownotes (API key or authenticated admin/editor)
    if (req.method === "POST" || req.method === "PUT") {
      // Auth: check x-api-key header first (for external scripts), then JWT
      const apiKey = req.headers.get("x-api-key");
      const expectedApiKey = Deno.env.get("SHOWNOTES_API_KEY");

      let authorized = false;

      if (apiKey && expectedApiKey && apiKey === expectedApiKey) {
        authorized = true;
      } else {
        // Fall back to JWT auth
        const authHeader = req.headers.get("authorization");
        if (authHeader) {
          const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
          const userClient = createClient(supabaseUrl, anonKey, {
            global: { headers: { Authorization: authHeader } },
          });
          const { data: { user } } = await userClient.auth.getUser();
          if (user) {
            const { data: roleData } = await supabase
              .from("user_roles")
              .select("role")
              .eq("user_id", user.id)
              .in("role", ["admin", "editor"])
              .limit(1)
              .single();
            if (roleData) authorized = true;
          }
        }
      }

      if (!authorized) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const body = await req.json();
      const { episode_guid, title, content_html, links, video_urls, published } = body;

      if (!episode_guid) {
        return new Response(JSON.stringify({ error: "episode_guid is required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const record: Record<string, any> = {
        episode_guid,
        updated_at: new Date().toISOString(),
      };
      if (title !== undefined) record.title = title;
      if (content_html !== undefined) record.content_html = content_html;
      if (links !== undefined) record.links = links;
      if (video_urls !== undefined) record.video_urls = video_urls;
      if (published !== undefined) record.published = published;
      // New fields
      if (body.slug !== undefined) record.slug = body.slug;
      if (body.meta_description !== undefined) record.meta_description = body.meta_description;
      if (body.schema_jsonld !== undefined) record.schema_jsonld = body.schema_jsonld;
      if (body.published_at !== undefined) record.published_at = body.published_at;
      if (body.episode_number !== undefined) record.episode_number = body.episode_number;
      if (body.season_number !== undefined) record.season_number = body.season_number;
      if (body.duration !== undefined) record.duration = body.duration;
      if (body.themes !== undefined) record.themes = body.themes;
      if (body.lenses !== undefined) record.lenses = body.lenses;
      if (body.hosts !== undefined) record.hosts = body.hosts;
      if (body.guests !== undefined) record.guests = body.guests;
      if (body.transcript_markdown !== undefined) record.transcript_markdown = body.transcript_markdown;

      const { data, error } = await supabase
        .from("episode_shownotes")
        .upsert(record, { onConflict: "episode_guid" })
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({ data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // DELETE
    if (req.method === "DELETE") {
      const apiKey = req.headers.get("x-api-key");
      const expectedApiKey = Deno.env.get("SHOWNOTES_API_KEY");
      let authorized = false;

      if (apiKey && expectedApiKey && apiKey === expectedApiKey) {
        authorized = true;
      } else {
        const authHeader = req.headers.get("authorization");
        if (authHeader) {
          const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
          const userClient = createClient(supabaseUrl, anonKey, {
            global: { headers: { Authorization: authHeader } },
          });
          const { data: { user } } = await userClient.auth.getUser();
          if (user) {
            const { data: roleData } = await supabase
              .from("user_roles")
              .select("role")
              .eq("user_id", user.id)
              .in("role", ["admin", "editor"])
              .limit(1)
              .single();
            if (roleData) authorized = true;
          }
        }
      }

      if (!authorized) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const body = await req.json();
      if (!body.episode_guid) {
        return new Response(JSON.stringify({ error: "episode_guid is required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { error } = await supabase
        .from("episode_shownotes")
        .delete()
        .eq("episode_guid", body.episode_guid);

      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  } catch (err) {
    console.error("Shownotes function error:", err);
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
