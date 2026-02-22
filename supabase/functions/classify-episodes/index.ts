import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
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

interface RuleEntry {
  phrase: string;
  w: number;
  mode: "word" | "phrase";
}

interface BucketRules {
  include: RuleEntry[];
  exclude?: RuleEntry[];
}

interface Settings {
  title_multiplier: number;
  desc_multiplier: number;
  theme_threshold: number;
  focus_threshold: number;
  max_themes: number;
  max_focus: number;
  focus_dominance_ratio: number;
  fallback_theme?: string;
  fallback_focus?: string;
  global_stopwords?: string[];
  priority_order?: {
    themes?: string[];
    focus?: string[];
  };
}

interface RulesConfig {
  themes: Record<string, BucketRules | RuleEntry[]>;
  focus: Record<string, BucketRules | RuleEntry[]>;
  settings: Settings;
}

interface EpisodeInput {
  guid: string;
  title: string;
  description: string;
  feed_url?: string;
}

function getRules(bucket: BucketRules | RuleEntry[]): { include: RuleEntry[]; exclude: RuleEntry[] } {
  if (Array.isArray(bucket)) {
    return { include: bucket, exclude: [] };
  }
  return { include: bucket.include || [], exclude: bucket.exclude || [] };
}

function scoreText(text: string, rules: RuleEntry[]): number {
  let score = 0;
  for (const rule of rules) {
    if (rule.mode === "phrase") {
      if (text.includes(rule.phrase.toLowerCase())) score += rule.w;
    } else {
      const escaped = rule.phrase.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const re = new RegExp(`\\b${escaped}\\b`);
      if (re.test(text)) score += rule.w;
    }
  }
  return score;
}

function removeStopwords(text: string, stopwords: string[]): string {
  if (!stopwords.length) return text;
  const re = new RegExp(`\\b(${stopwords.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\b`, "gi");
  return text.replace(re, " ").replace(/\s+/g, " ").trim();
}

function classify(
  titleNorm: string,
  descNorm: string,
  fullNorm: string,
  config: RulesConfig,
) {
  const s = config.settings;
  const stopwords = s.global_stopwords || [];

  const titleClean = removeStopwords(titleNorm, stopwords);
  const descClean = removeStopwords(descNorm, stopwords);
  const fullClean = removeStopwords(fullNorm, stopwords);

  function scoreBucket(bucketMap: Record<string, BucketRules | RuleEntry[]>) {
    const scores: Record<string, number> = {};
    const titleMatches: Record<string, number> = {};
    for (const [label, bucket] of Object.entries(bucketMap)) {
      const { include, exclude } = getRules(bucket);
      const titleScore = scoreText(titleClean, include) * s.title_multiplier;
      const descScore = scoreText(descClean, include) * s.desc_multiplier;
      const fullScore = scoreText(fullClean, include);
      const excludeScore = scoreText(fullClean, exclude);
      scores[label] = titleScore + descScore + fullScore + excludeScore;
      titleMatches[label] = scoreText(titleClean, include);
    }
    return { scores, titleMatches };
  }

  const { scores: themeScores, titleMatches: themeTitleMatches } = scoreBucket(config.themes);
  const { scores: focusScores, titleMatches: focusTitleMatches } = scoreBucket(config.focus);

  const themePriority = s.priority_order?.themes || [];
  const focusPriority = s.priority_order?.focus || [];

  function pickTop(
    scores: Record<string, number>,
    titleMatches: Record<string, number>,
    threshold: number,
    max: number,
    priority: string[],
    dominanceRatio?: number,
  ): string[] {
    let candidates = Object.entries(scores)
      .filter(([, v]) => v >= threshold)
      .sort((a, b) => {
        // score desc
        if (b[1] !== a[1]) return b[1] - a[1];
        // title match desc
        const ta = titleMatches[a[0]] || 0;
        const tb = titleMatches[b[0]] || 0;
        if (tb !== ta) return tb - ta;
        // priority order
        const pa = priority.indexOf(a[0]);
        const pb = priority.indexOf(b[0]);
        return (pa === -1 ? 999 : pa) - (pb === -1 ? 999 : pb);
      });

    if (dominanceRatio && candidates.length > 1) {
      const topScore = candidates[0][1];
      candidates = candidates.filter(
        (c, i) => i === 0 || topScore / c[1] <= dominanceRatio,
      );
    }

    return candidates.slice(0, max).map(([k]) => k);
  }

  let themes = pickTop(themeScores, themeTitleMatches, s.theme_threshold, s.max_themes, themePriority);
  let focus = pickTop(focusScores, focusTitleMatches, s.focus_threshold, s.max_focus, focusPriority, s.focus_dominance_ratio);

  // Fallbacks
  if (themes.length === 0 && s.fallback_theme) themes = [s.fallback_theme];
  if (focus.length === 0 && s.fallback_focus) focus = [s.fallback_focus];

  return { themes, focus, themeScores, focusScores };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const body = await req.json();
    const episodes: EpisodeInput[] = body.episodes || [];
    const feedUrl: string = body.feed_url || "";

    if (!episodes.length) {
      return new Response(JSON.stringify({ error: "No episodes provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: rulesRow, error: rulesErr } = await supabase
      .from("tagging_rules")
      .select("config")
      .limit(1)
      .single();

    if (rulesErr || !rulesRow) {
      return new Response(JSON.stringify({ error: "No tagging rules configured", detail: rulesErr?.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const config = rulesRow.config as RulesConfig;
    const results: any[] = [];

    for (const ep of episodes) {
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
        themes,
        focus,
        theme_scores: themeScores,
        focus_scores: focusScores,
        feed_url: ep.feed_url || feedUrl,
        classified_at: new Date().toISOString(),
      };

      const { error: upsertErr } = await supabase
        .from("episode_tags")
        .upsert(row, { onConflict: "episode_guid" });

      if (upsertErr) {
        results.push({ guid: ep.guid, error: upsertErr.message });
      } else {
        results.push({ guid: ep.guid, themes, focus, theme_scores: themeScores, focus_scores: focusScores });
      }
    }

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
