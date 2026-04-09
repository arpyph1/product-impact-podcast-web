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
    if (req.method === "GET") {
      const { data, error } = await supabase
        .from("sponsors").select("*")
        .eq("active", true)
        .order("display_order");
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
      if (!body.slug || !body.name) {
        return new Response(JSON.stringify({ error: "slug and name are required" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const record: Record<string, any> = { slug: body.slug };
      const fields = ["name", "tagline", "description", "logo_url", "website_url", "cta_text", "tier", "active", "display_order", "themes"];
      for (const f of fields) {
        if (body[f] !== undefined) record[f] = body[f];
      }

      const { data, error } = await supabase
        .from("sponsors").upsert(record, { onConflict: "slug" }).select().single();
      if (error) throw error;

      return new Response(JSON.stringify({ data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  } catch (err) {
    console.error("Sponsors API error:", err);
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
