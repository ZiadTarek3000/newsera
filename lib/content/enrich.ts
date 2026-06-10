/**
 * Aggregator content enrichment.
 *
 * The Currents API returns only a short description per article. Newsera is an
 * aggregator, so we never invent facts — instead, when the source text is thin,
 * we wrap the original excerpt in clearly editorial framing (context for the
 * section, why it matters, what to watch) and always point readers to the
 * original publisher for specifics. This makes article pages and previews feel
 * complete without misrepresenting the source.
 */

export type EnrichInput = {
  title: string;
  excerpt: string;
  source: string;
  category: string;
  date: string;
};

/** Below this word count we treat the stored body as "thin" and enrich it. */
export const THIN_CONTENT_WORDS = 90;

export function wordCount(text: string | null | undefined): number {
  return (text ?? "").trim().split(/\s+/).filter(Boolean).length;
}

function trimSentence(text: string): string {
  const t = text.trim();
  if (!t) return "";
  return /[.!?]$/.test(t) ? t : `${t}.`;
}

// Section-aware framing. Keyed by lowercased category name; falls back to a
// neutral template so every article still reads as a complete brief.
const FRAMING: Record<
  string,
  { lens: string; matters: string; watch: string }
> = {
  technology: {
    lens: "the fast-moving world of technology, where today's experiments quietly become tomorrow's infrastructure",
    matters:
      "Technology stories rarely stay contained to the lab or the boardroom. Shifts in tooling, platforms, and policy ripple outward to the products people use, the way teams work, and the expectations set for what software can do next.",
    watch:
      "Watch for how competitors, regulators, and the wider developer community respond — the second-order reactions often matter more than the announcement itself.",
  },
  business: {
    lens: "the global economy, where capital, policy, and corporate strategy constantly reshape one another",
    matters:
      "Business developments are signals about confidence and direction. A single decision on rates, hiring, or investment can recalibrate how markets price risk and how companies plan for the quarters ahead.",
    watch:
      "Watch the follow-through: guidance, market reaction, and whether peers move in the same direction will reveal whether this is a one-off or the start of a trend.",
  },
  world: {
    lens: "international affairs, where diplomacy, conflict, and cooperation determine the conditions nations operate under",
    matters:
      "World events seldom remain local. Decisions made in one capital influence trade, security, and alliances far beyond their borders, shaping the backdrop against which every other story unfolds.",
    watch:
      "Watch the official responses and on-the-ground reporting in the days ahead, which typically clarify intent and consequence more than the initial headline.",
  },
  science: {
    lens: "scientific discovery, where incremental research occasionally compounds into a genuine leap in understanding",
    matters:
      "Science coverage matters because today's findings set the agenda for tomorrow's medicine, climate response, and technology. Even early results can redirect funding, debate, and research priorities.",
    watch:
      "Watch for replication, peer review, and how the broader scientific community receives the work before treating any single result as settled.",
  },
  health: {
    lens: "health and medicine, where research and policy translate directly into how people live and are cared for",
    matters:
      "Health stories carry immediate, personal stakes. Guidance, treatments, and findings in this space inform decisions made by patients, clinicians, and public-health systems alike.",
    watch:
      "Watch for guidance from established health bodies and additional studies, which provide the context needed to weigh any single claim responsibly.",
  },
  sports: {
    lens: "competitive sport, where preparation, rivalry, and a single decisive moment define seasons and careers",
    matters:
      "Beyond the scoreline, results reshape standings, reputations, and the narratives that carry teams and athletes into their next contest.",
    watch:
      "Watch the fixtures and analysis that follow to see whether this proves a turning point or a footnote in the wider campaign.",
  },
};

const DEFAULT_FRAMING = {
  lens: "a fast-moving news cycle where context is as valuable as the headline itself",
  matters:
    "Stories like this one matter because they rarely stand alone — they connect to larger trends that shape decisions, expectations, and the conversations happening around them.",
  watch:
    "Watch how the situation develops and how trusted outlets add detail in the hours and days ahead.",
};

function framingFor(category: string) {
  return FRAMING[category.trim().toLowerCase()] ?? DEFAULT_FRAMING;
}

/** A standfirst/dek for cards and previews when the API excerpt is missing. */
export function buildDek(title: string, category: string): string {
  const f = framingFor(category);
  return trimSentence(
    `A closer look at ${title.replace(/[.!?]+$/, "")} and what it means for ${f.lens.split(",")[0]}`,
  );
}

/** 3 concise, honest takeaways derived from the framing when none are stored. */
export function generateTakeaways(input: EnrichInput): string[] {
  const label = input.category || "this story";
  return [
    trimSentence(
      `${input.source} reports on a developing ${label.toLowerCase()} story worth following`,
    ),
    trimSentence(
      "The full reporting, figures, and quotes live with the original publisher",
    ),
    trimSentence(
      "Newsera summarizes and contextualizes; follow the source link for complete detail",
    ),
  ];
}

/**
 * Build a multi-paragraph, sectioned body around the original excerpt. Returns
 * a string using `\n\n` paragraph breaks and `## ` section headings, matching
 * the renderer used on the article page.
 */
export function enrichContent(input: EnrichInput): string {
  const f = framingFor(input.category);
  const lead = input.excerpt.trim()
    ? trimSentence(input.excerpt)
    : trimSentence(
        `${input.source} is reporting on ${input.title.replace(/[.!?]+$/, "")}`,
      );

  const intro =
    input.excerpt.trim() && wordCount(input.excerpt) < 40
      ? `${lead} ${trimSentence(
          `First reported by ${input.source}${input.date ? ` on ${input.date}` : ""}, the story sits within ${f.lens}`,
        )}`
      : lead;

  const blocks = [
    intro,
    "## Why it matters",
    f.matters,
    "## What to watch next",
    f.watch,
  ];

  return blocks.join("\n\n");
}
