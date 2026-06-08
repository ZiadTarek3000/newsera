import "server-only";
import { z } from "zod";
import { env } from "@/lib/env";
import { slugify } from "@/lib/utils";

const CURRENTS_BASE = "https://api.currentsapi.services/v1";

// Categories supported by Currents API /search.
export const CURRENTS_CATEGORIES = [
  "general",
  "world",
  "business",
  "technology",
  "science",
  "health",
  "entertainment",
  "sports",
] as const;

export type CurrentsCategory = (typeof CURRENTS_CATEGORIES)[number];

const articleSchema = z.object({
  id: z.string(),
  title: z.string().nullish(),
  description: z.string().nullish(),
  url: z.string(),
  author: z.string().nullish(),
  image: z.string().nullish(), // a real URL, or the literal "None"
  category: z.array(z.string()).nullish(),
  published: z.string(),
});

const responseSchema = z.object({
  status: z.string(),
  news: z.array(articleSchema).default([]),
  message: z.string().optional(),
});

export type NormalizedArticle = {
  externalId: string;
  source: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  url: string;
  imageUrl: string | null;
  publishedAt: Date;
  author: string | null;
  categorySlug: string;
};

/** Stable short hash so distinct articles with similar titles get unique slugs. */
function shortHash(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(h).toString(36).slice(0, 6);
}

/** Currents publishes dates like "2026-06-08 07:47:41 +0000". */
function parsePublished(value: string): Date {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

/** Currents uses the string "None" when an article has no image. */
function cleanImage(image: string | null | undefined): string | null {
  if (!image || image === "None") return null;
  return image;
}

/** Derives a readable source name from the article URL host. */
function sourceFromUrl(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "Currents";
  }
}

function normalize(
  a: z.infer<typeof articleSchema>,
  categorySlug: string,
): NormalizedArticle {
  const title = a.title ?? "Untitled";
  const base = slugify(title).slice(0, 60) || "article";
  const description = a.description ?? "";
  return {
    externalId: a.id,
    source: a.author?.trim() || sourceFromUrl(a.url),
    title,
    slug: `${base}-${shortHash(a.id)}`,
    excerpt: description,
    content: description,
    url: a.url,
    imageUrl: cleanImage(a.image),
    publishedAt: parsePublished(a.published),
    author: a.author ?? null,
    categorySlug,
  };
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Fetch + normalize the latest articles for a single Currents category. */
export async function fetchCategory(
  category: CurrentsCategory,
  max = 10,
  attempt = 1,
): Promise<NormalizedArticle[]> {
  if (!env.CURRENTS_API_KEY) return [];

  const params = new URLSearchParams({
    category,
    language: "en",
    apiKey: env.CURRENTS_API_KEY,
  });

  const res = await fetch(`${CURRENTS_BASE}/search?${params.toString()}`, {
    // Always fetch fresh during a sync run.
    cache: "no-store",
  });
  const json = responseSchema.parse(await res.json());
  if (!res.ok || json.status !== "ok") {
    // Currents intermittently 400s/429s under bursts — retry once after a pause.
    if (attempt < 2) {
      await sleep(1500);
      return fetchCategory(category, max, attempt + 1);
    }
    throw new Error(
      `Currents ${category} request failed: ${res.status} ${json.message ?? ""}`.trim(),
    );
  }

  return json.news
    .filter((a) => a.title && a.title !== "None")
    .slice(0, max)
    .map((a) => normalize(a, category));
}
