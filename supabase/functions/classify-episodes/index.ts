import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/** Normalize text: lowercase, strip HTML, collapse whitespace */
function normalize(raw: string): string {
  return raw
    .replace(/<[^>]*>/g, " ")          // strip HTML
    .replace(/&[a-z]+;/gi, " ")        // strip entities
    .replace(/[^\w\s'-]/g, " ")        // keep words, hyphens, apostrophes
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

interface RuleEntry {
  phrase: string;
  w: number;
  mode: "word" | "phrase";
}

interface RulesConfig {
  themes: Record<string, RuleEntry[]>;
  focus: Record<string, RuleEntry[]>;
  settings: {
    title_multiplier: number;
    desc_multiplier: number;
    theme_threshold: number;
    focus_threshold: number;
    max_themes: number;
    max_focus: number;
    focus_dominance_ratio: number;
  };
}

interface EpisodeInput {
  guid: string;
  title: string;
  description: string;
  feed_url?: string;
}

function scoreText(
  text: string,
  rules: RuleEntry[],
): number {
  let score = 0;
  for (const rule of rules) {
    if (rule.mode === "phrase") {
      const idx = text.indexOf(rule.phrase.toLowerCase());
      if (idx !== -1) score += rule.w;
    } else {
      // word mode — match whole word
      const re = new RegExp(`\\b${rule.phrase.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`);
      if (re.test(text)) score += rule.w;
    }
  }
  return score;
}

function classify(
  titleNorm: string,
  descNorm: string,
  fullNorm: string,
  config: RulesConfig,
) {
  const s = config.settings;

  function scoreBucket(bucketRules: Record<string, RuleEntry[]>) {
    const scores: Record<string, number> = {};
    for (const [label, rules] of Object.entries(bucketRules)) {
      const titleScore = scoreText(titleNorm, rules) * s.title_multiplier;
      const descScore = scoreText(descNorm, rules) * s.desc_multiplier;
      const fullScore = scoreText(fullNorm, rules);
      scores[label] = titleScore + descScore + fullScore;
    }
    return scores;
  }

  const themeScores = scoreBucket(config.themes);
  const focusScores = scoreBucket(config.focus);

  // Pick top themes above threshold
  const themes = Object.entries(themeScores)
    .filter(([, v]) => v >= s.theme_threshold)
    .sort((a, b) => b[1] - a[1])
    .slice(0, s.max_themes)
    .map(([k]) => k);

  // Pick top focus above threshold, with dominance check
  const sortedFocus = Object.entries(focusScores)
    .filter(([, v]) => v >= s.focus_threshold)
    .sort((a, b) => b[1] - a[1]);

  const focus: string[] = [];
  for (let i = 0; i < sortedFocus.length && focus.length < s.max_focus; i++) {
    if (i === 0) {
      focus.push(sortedFocus[i][0]);
    } else {
      // Only include if within dominance ratio of top
      if (sortedFocus[0][1] / sortedFocus[i][1] <= s.focus_dominance_ratio) {
        focus.push(sortedFocus[i][0]);
      }
    }
  }

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

    // Fetch rule config
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

      const { themes, focus, themeScores, focusScores } = classify(
        titleNorm,
        descNorm,
        fullNorm,
        config,
      );

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

      // Upsert by episode_guid
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
