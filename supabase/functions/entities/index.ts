import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-api-key, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

async function checkAuth(req: Request, supabase: any): Promise<boolean> {
  const apiKey = req.headers.get("x-api-key");
  const expectedApiKey = Deno.env.get("SHOWNOTES_API_KEY");
  if (apiKey && expectedApiKey && apiKey === expectedApiKey) return true;

  const authHeader = req.headers.get("authorization");
  if (authHeader) {
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user } } = await userClient.auth.getUser();
    if (user) {
      const { data: roleData } = await supabase
        .from("user_roles").select("role").eq("user_id", user.id)
        .in("role", ["admin", "editor"]).limit(1).single();
      if (roleData) return true;
    }
  }
  return false;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  try {
    const url = new URL(req.url);

    if (req.method === "GET") {
      const type = url.searchParams.get("type");
      const slug = url.searchParams.get("slug");

      if (type && slug) {
        const { data, error } = await supabase
          .from("entities").select("*")
          .eq("type", type).eq("slug", slug).single();

        if (error && error.code === "PGRST116") {
          return new Response(JSON.stringify({ data: null }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (error) throw error;

        // Get related articles
        const { data: articleRefs } = await supabase
          .from("article_entities")
          .select("relevance, articles(id, slug, title, subtitle, format, publish_date, read_time_minutes, hero_image_url, themes)")
          .eq("entity_id", data.id);

        // Get related episodes
        const { data: episodeRefs } = await supabase
          .from("episode_entities")
          .select("relevance, context, timestamp_text, speaker, episode_guid")
          .eq("entity_id", data.id);

        return new Response(JSON.stringify({
          data: { ...data, articles: articleRefs || [], episodes: episodeRefs || [] }
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // List by type
      let query = supabase.from("entities").select("id, type, slug, name, description, themes, canonical_url");
      if (type) query = query.eq("type", type);
      query = query.order("name");

      const { data, error } = await query;
      if (error) throw error;

      return new Response(JSON.stringify({ data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (req.method === "POST" || req.method === "PUT") {
      if (!(await checkAuth(req, supabase))) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const body = await req.json();
      if (!body.type || !body.slug) {
        return new Response(JSON.stringify({ error: "type and slug are required" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const record: Record<string, any> = {
        type: body.type, slug: body.slug, updated_at: new Date().toISOString(),
      };
      const fields = ["name", "aliases", "description", "long_form", "external_links", "metadata", "themes", "lenses", "canonical_url", "schema_jsonld"];
      for (const f of fields) {
        if (body[f] !== undefined) record[f] = body[f];
      }

      // Use raw upsert with the unique constraint on (type, slug)
      // First try to find existing
      const { data: existing } = await supabase
        .from("entities").select("id").eq("type", body.type).eq("slug", body.slug).single();

      let data, error;
      if (existing) {
        ({ data, error } = await supabase
          .from("entities").update(record).eq("id", existing.id).select().single());
      } else {
        ({ data, error } = await supabase
          .from("entities").insert(record).select().single());
      }

      if (error) throw error;

      return new Response(JSON.stringify({ data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (req.method === "DELETE") {
      if (!(await checkAuth(req, supabase))) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const type = url.searchParams.get("type");
      const slug = url.searchParams.get("slug");
      if (!type || !slug) {
        return new Response(JSON.stringify({ error: "type and slug query params required" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { error } = await supabase.from("entities").delete().eq("type", type).eq("slug", slug);
      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  } catch (err) {
    console.error("Entities function error:", err);
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
