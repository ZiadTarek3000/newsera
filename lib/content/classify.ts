/**
 * Lightweight keyword classifier used during ingestion.
 *
 * The Currents API returns each article under the category we searched, but its
 * broad "general" bucket mixes topics together. When an article comes in under
 * "general", we infer a more specific canonical category from its title and
 * description so the section pages stay accurate. Articles from a specific
 * search category keep that category (the API is authoritative there).
 */

export const CANONICAL_CATEGORIES = [
  "world",
  "business",
  "technology",
  "science",
  "health",
  "sports",
  "entertainment",
] as const;

export type CanonicalCategory = (typeof CANONICAL_CATEGORIES)[number];

const KEYWORDS: Record<CanonicalCategory, string[]> = {
  technology: [
    "ai", "artificial intelligence", "software", "tech", "app", "iphone",
    "android", "google", "microsoft", "apple", "meta", "openai", "chip",
    "semiconductor", "cyber", "hacker", "startup", "robot", "gadget", "crypto",
    "bitcoin", "internet", "data breach", "algorithm", "cloud", "gpu",
  ],
  business: [
    "market", "stocks", "shares", "economy", "economic", "trade", "tariff",
    "inflation", "interest rate", "bank", "finance", "ceo", "earnings",
    "revenue", "profit", "investor", "merger", "acquisition", "ipo", "nasdaq",
    "dow", "currency", "layoffs", "wall street",
  ],
  science: [
    "research", "study", "scientist", "space", "nasa", "rocket", "satellite",
    "climate", "physics", "biology", "chemistry", "discovery", "quantum",
    "fossil", "genome", "species", "astronomy", "experiment", "telescope",
  ],
  health: [
    "health", "covid", "virus", "vaccine", "disease", "medical", "medicine",
    "hospital", "mental health", "drug", "cancer", "doctor", "patients",
    "outbreak", "wellness", "nutrition", "fda", "therapy",
  ],
  sports: [
    "game", "match", "league", "championship", "player", "coach", "team",
    "tournament", "cup", "score", "nba", "nfl", "mlb", "fifa", "olympic",
    "soccer", "football", "basketball", "cricket", "tennis", "golf", "f1",
  ],
  entertainment: [
    "film", "movie", "music", "celebrity", "album", "actor", "actress", "tv",
    "series", "hollywood", "festival", "box office", "concert", "netflix",
    "singer", "premiere", "awards", "streaming show",
  ],
  world: [
    "election", "government", "president", "minister", "war", "diplomatic",
    "border", "nation", "summit", "united nations", "treaty", "protest",
    "sanctions", "parliament", "refugee", "military", "embassy", "geopolitical",
  ],
};

/** Categories the API reports accurately enough to trust as-is. */
const TRUSTED = new Set<string>(CANONICAL_CATEGORIES);

export function classifyCategory(
  searchSlug: string,
  title: string,
  text: string,
): string {
  // A specific search category from the API is authoritative.
  if (searchSlug !== "general" && TRUSTED.has(searchSlug)) return searchSlug;

  const haystack = `${title} ${text}`.toLowerCase();
  let best: CanonicalCategory | null = null;
  let bestScore = 0;

  for (const category of CANONICAL_CATEGORIES) {
    let score = 0;
    for (const kw of KEYWORDS[category]) {
      if (haystack.includes(kw)) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = category;
    }
  }

  // Require at least one clear signal before overriding the general bucket.
  return best && bestScore > 0 ? best : "general";
}
