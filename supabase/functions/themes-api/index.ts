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
      const slug = url.searchParams.get("slug");

      if (slug) {
        const { data: theme, error } = await supabase
          .from("themes").select("*").eq("slug", slug).single();

        if (error) throw error;

        // Get articles tagged with this theme
        const { data: articles } = await supabase
          .from("articles")
          .select("id, slug, title, subtitle, format, author_slugs, publish_date, read_time_minutes, hero_image_url, themes")
          .eq("published", true)
          .contains("themes", [slug])
          .order("publish_date", { ascending: false })
          .limit(20);

        // Get entities tagged with this theme
        const { data: entities } = await supabase
          .from("entities")
          .select("id, type, slug, name, description")
          .contains("themes", [slug])
          .order("name");

        return new Response(JSON.stringify({
          data: { ...theme, articles: articles || [], entities: entities || [] }
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // List all themes
      const { data, error } = await supabase
        .from("themes").select("*").order("name");
      if (error) throw error;

      // Get article counts per theme
      const { data: articles } = await supabase
        .from("articles")
        .select("themes")
        .eq("published", true);

      const counts: Record<string, number> = {};
      (articles || []).forEach((a: any) => {
        (a.themes || []).forEach((t: string) => {
          counts[t] = (counts[t] || 0) + 1;
        });
      });

      const enriched = (data || []).map(t => ({
        ...t,
        article_count: counts[t.slug] || 0,
      }));

      return new Response(JSON.stringify({ data: enriched }), {
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
      if (!body.slug) {
        return new Response(JSON.stringify({ error: "slug is required" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const record: Record<string, any> = { slug: body.slug, updated_at: new Date().toISOString() };
      const fields = ["name", "description", "long_form_intro", "meta_description", "target_search_queries", "schema_jsonld", "hero_image_url", "theme_color", "icon"];
      for (const f of fields) {
        if (body[f] !== undefined) record[f] = body[f];
      }

      const { data, error } = await supabase
        .from("themes").upsert(record, { onConflict: "slug" }).select().single();
      if (error) throw error;

      return new Response(JSON.stringify({ data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  } catch (err) {
    console.error("Themes API error:", err);
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
