import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function normalize(raw: string): string {
  return raw
    .replace(/<[^>]*>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/[^\w\s'-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

interface RuleEntry { phrase: string; w: number; mode: "word" | "phrase"; }
interface BucketRules { include: RuleEntry[]; exclude?: RuleEntry[]; }
interface Settings {
  title_multiplier: number; desc_multiplier: number;
  theme_threshold: number; focus_threshold: number;
  max_themes: number; max_focus: number;
  focus_dominance_ratio: number;
  fallback_theme?: string; fallback_focus?: string;
  global_stopwords?: string[];
  priority_order?: { themes?: string[]; focus?: string[] };
}
interface RulesConfig {
  themes: Record<string, BucketRules | RuleEntry[]>;
  focus: Record<string, BucketRules | RuleEntry[]>;
  settings: Settings;
}

function getRules(bucket: BucketRules | RuleEntry[]) {
  if (Array.isArray(bucket)) return { include: bucket, exclude: [] as RuleEntry[] };
  return { include: bucket.include || [], exclude: bucket.exclude || [] };
}

function scoreText(text: string, rules: RuleEntry[]): number {
  let score = 0;
  for (const rule of rules) {
    if (rule.mode === "phrase") {
      if (text.includes(rule.phrase.toLowerCase())) score += rule.w;
    } else {
      const escaped = rule.phrase.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      if (new RegExp(`\\b${escaped}\\b`).test(text)) score += rule.w;
    }
  }
  return score;
}

function removeStopwords(text: string, stopwords: string[]): string {
  if (!stopwords.length) return text;
  const re = new RegExp(`\\b(${stopwords.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\b`, "gi");
  return text.replace(re, " ").replace(/\s+/g, " ").trim();
}

function classify(titleNorm: string, descNorm: string, fullNorm: string, config: RulesConfig) {
  const s = config.settings;
  const sw = s.global_stopwords || [];
  const titleClean = removeStopwords(titleNorm, sw);
  const descClean = removeStopwords(descNorm, sw);
  const fullClean = removeStopwords(fullNorm, sw);

  function scoreBucket(bucketMap: Record<string, BucketRules | RuleEntry[]>) {
    const scores: Record<string, number> = {};
    const titleMatches: Record<string, number> = {};
    for (const [label, bucket] of Object.entries(bucketMap)) {
      const { include, exclude } = getRules(bucket);
      scores[label] = scoreText(titleClean, include) * s.title_multiplier + scoreText(descClean, include) * s.desc_multiplier + scoreText(fullClean, include) + scoreText(fullClean, exclude);
      titleMatches[label] = scoreText(titleClean, include);
    }
    return { scores, titleMatches };
  }

  const { scores: themeScores, titleMatches: themeTM } = scoreBucket(config.themes);
  const { scores: focusScores, titleMatches: focusTM } = scoreBucket(config.focus);

  function pickTop(scores: Record<string, number>, tm: Record<string, number>, threshold: number, max: number, priority: string[], dom?: number) {
    let c = Object.entries(scores).filter(([, v]) => v >= threshold)
      .sort((a, b) => b[1] !== a[1] ? b[1] - a[1] : (tm[b[0]] || 0) !== (tm[a[0]] || 0) ? (tm[b[0]] || 0) - (tm[a[0]] || 0) : ((priority.indexOf(a[0]) === -1 ? 999 : priority.indexOf(a[0])) - (priority.indexOf(b[0]) === -1 ? 999 : priority.indexOf(b[0]))));
    if (dom && c.length > 1) { const top = c[0][1]; c = c.filter((x, i) => i === 0 || top / x[1] <= dom); }
    return c.slice(0, max).map(([k]) => k);
  }

  const tp = s.priority_order?.themes || [];
  const fp = s.priority_order?.focus || [];
  let themes = pickTop(themeScores, themeTM, s.theme_threshold, s.max_themes, tp);
  let focus = pickTop(focusScores, focusTM, s.focus_threshold, s.max_focus, fp, s.focus_dominance_ratio);
  if (!themes.length && s.fallback_theme) themes = [s.fallback_theme];
  if (!focus.length && s.fallback_focus) focus = [s.fallback_focus];
  return { themes, focus, themeScores, focusScores };
}

function parseEpisodes(xml: string) {
  const eps: { guid: string; title: string; description: string }[] = [];
  const items = xml.split("<item>").slice(1);
  for (const item of items) {
    const guidMatch = item.match(/<guid[^>]*>(.*?)<\/guid>/s);
    const titleMatch = item.match(/<title>(.*?)<\/title>/s);
    const descMatch = item.match(/<description>(.*?)<\/description>/s);
    if (guidMatch && titleMatch) {
      eps.push({
        guid: guidMatch[1].trim(),
        title: titleMatch[1].replace(/<!\[CDATA\[|\]\]>/g, "").trim(),
        description: (descMatch?.[1] || "").replace(/<!\[CDATA\[|\]\]>/g, "").trim(),
      });
    }
  }
  return eps;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Accept feed_url from body or fall back to CMS content
    let feed_url: string | undefined;
    try {
      const body = await req.json();
      feed_url = body.feed_url;
    } catch { /* no body — auto mode */ }

    if (!feed_url) {
      const { data: cms } = await supabase.from("cms_content").select("data").limit(1).single();
      feed_url = (cms?.data as any)?.rssFeedUrl;
    }

    if (!feed_url) return new Response(JSON.stringify({ error: "No feed_url found" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    // Fetch RSS
    const rssRes = await fetch(feed_url, { signal: AbortSignal.timeout(15000) });
    const xml = await rssRes.text();
    const episodes = parseEpisodes(xml);

    // Get already-classified guids to skip them
    const { data: existing } = await supabase.from("episode_tags").select("episode_guid");
    const existingGuids = new Set((existing || []).map((r: any) => r.episode_guid));
    const newEpisodes = episodes.filter(ep => !existingGuids.has(ep.guid));

    if (newEpisodes.length === 0) {
      return new Response(JSON.stringify({ classified: 0, message: "All episodes already classified" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Get rules
    const { data: rulesRow } = await supabase.from("tagging_rules").select("config").limit(1).single();
    if (!rulesRow) return new Response(JSON.stringify({ error: "No tagging rules" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const config = rulesRow.config as RulesConfig;

    // Classify and upsert only new episodes
    const results: any[] = [];
    for (const ep of newEpisodes) {
      const titleNorm = normalize(ep.title);
      const descNorm = normalize(ep.description);
      const fullNorm = `${titleNorm} ${descNorm}`;
      const { themes, focus, themeScores, focusScores } = classify(titleNorm, descNorm, fullNorm, config);

      const row = {
        episode_guid: ep.guid,
        title: ep.title,
        title_norm: titleNorm,
        description_norm: descNorm,
        full_norm: fullNorm,
        themes, focus,
        theme_scores: themeScores,
        focus_scores: focusScores,
        feed_url: feed_url,
        classified_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("episode_tags").upsert(row, { onConflict: "episode_guid" });
      results.push({ guid: ep.guid, title: ep.title, themes, focus, error: error?.message });
    }

    return new Response(JSON.stringify({ classified: results.length, skipped: existingGuids.size, results }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
