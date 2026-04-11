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
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .in("role", ["admin", "editor"])
        .limit(1)
        .single();
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
      const format = url.searchParams.get("format");
      const theme = url.searchParams.get("theme");
      const page = parseInt(url.searchParams.get("page") || "1");
      const limit = parseInt(url.searchParams.get("limit") || "12");
      const offset = (page - 1) * limit;

      if (slug) {
        const { data, error } = await supabase
          .from("articles")
          .select("*")
          .eq("slug", slug)
          .eq("published", true)
          .single();

        if (error && error.code === "PGRST116") {
          return new Response(JSON.stringify({ data: null }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (error) throw error;

        // Fetch related entities
        const { data: entities } = await supabase
          .from("article_entities")
          .select("entity_id, relevance, entities(id, type, slug, name, description)")
          .eq("article_id", data.id);

        // Fetch FAQs
        const { data: faqs } = await supabase
          .from("article_faqs")
          .select("*")
          .eq("article_id", data.id)
          .order("position");

        return new Response(JSON.stringify({ data: { ...data, entities: entities || [], faqs: faqs || [] } }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // List articles with filters
      let query = supabase
        .from("articles")
        .select("id, slug, title, subtitle, format, author_slugs, byline_role, publish_date, read_time_minutes, meta_description, hero_image_url, hero_image_alt, themes, lenses, topics, canonical_url", { count: "exact" })
        .eq("published", true)
        .order("publish_date", { ascending: false })
        .range(offset, offset + limit - 1);

      if (format) query = query.eq("format", format);
      if (theme) query = query.contains("themes", [theme]);

      const { data, error, count } = await query;
      if (error) throw error;

      return new Response(JSON.stringify({ data, count, page, limit }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (req.method === "POST" || req.method === "PUT") {
      if (!(await checkAuth(req, supabase))) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const body = await req.json();
      if (!body.slug) {
        return new Response(JSON.stringify({ error: "slug is required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const record: Record<string, any> = { slug: body.slug, updated_at: new Date().toISOString() };
      const fields = [
        "title", "subtitle", "format", "author_slugs", "byline_role", "dateline",
        "publish_date", "read_time_minutes", "word_count", "meta_description",
        "hero_image_url", "hero_image_alt", "hero_image_credit",
        "content_markdown", "content_html", "themes", "lenses", "topics",
        "primary_podcast_episode_guid", "schema_jsonld", "canonical_url", "published",
        "cms_locked_themes", "cms_locked_meta", "cms_locked_schema", "cms_locked_hero",
        "overview_bullets", "is_lead_story",
      ];
      for (const f of fields) {
        if (body[f] !== undefined) record[f] = body[f];
      }

      // Check CMS locks on existing record
      const { data: existing } = await supabase
        .from("articles")
        .select("id, cms_locked_themes, cms_locked_meta, cms_locked_schema, cms_locked_hero")
        .eq("slug", body.slug)
        .single();

      if (existing) {
        if (existing.cms_locked_themes && body.themes !== undefined) delete record.themes;
        if (existing.cms_locked_themes && body.lenses !== undefined) delete record.lenses;
        if (existing.cms_locked_themes && body.topics !== undefined) delete record.topics;
        if (existing.cms_locked_meta && body.meta_description !== undefined) delete record.meta_description;
        if (existing.cms_locked_schema && body.schema_jsonld !== undefined) delete record.schema_jsonld;
        if (existing.cms_locked_hero) {
          delete record.hero_image_url;
          delete record.hero_image_alt;
          delete record.hero_image_credit;
        }
      }

      const { data, error } = await supabase
        .from("articles")
        .upsert(record, { onConflict: "slug" })
        .select()
        .single();

      if (error) throw error;

      // Handle entity references if provided
      if (body.entity_refs && Array.isArray(body.entity_refs)) {
        // Delete existing refs
        await supabase.from("article_entities").delete().eq("article_id", data.id);
        // Insert new refs
        if (body.entity_refs.length > 0) {
          const refs = body.entity_refs.map((ref: any) => ({
            article_id: data.id,
            entity_id: ref.entity_id,
            relevance: ref.relevance || "mention",
          }));
          await supabase.from("article_entities").insert(refs);
        }
      }

      // Handle FAQs if provided
      if (body.faqs && Array.isArray(body.faqs)) {
        await supabase.from("article_faqs").delete().eq("article_id", data.id);
        if (body.faqs.length > 0) {
          const faqs = body.faqs.map((faq: any, i: number) => ({
            article_id: data.id,
            question: faq.question,
            answer: faq.answer,
            position: i,
          }));
          await supabase.from("article_faqs").insert(faqs);
        }
      }

      return new Response(JSON.stringify({ data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (req.method === "DELETE") {
      if (!(await checkAuth(req, supabase))) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const slug = url.searchParams.get("slug");
      if (!slug) {
        return new Response(JSON.stringify({ error: "slug query param is required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { error } = await supabase.from("articles").delete().eq("slug", slug);
      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  } catch (err) {
    console.error("Articles function error:", err);
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
