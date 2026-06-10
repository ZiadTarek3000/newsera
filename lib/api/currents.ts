import "server-only";
import { z } from "zod";
import { env } from "@/lib/env";
import { slugify } from "@/lib/utils";
import { classifyCategory } from "@/lib/content/classify";

const CURRENTS_BASE = "https://api.currentsapi.services/v1";

// "general" is fetched LAST so specific categories claim their articles first
// (title de-duplication keeps the first occurrence). Whatever lands in
// "general" is then re-classified by keyword where possible.
export const CURRENTS_CATEGORIES = [
  "world",
  "business",
  "technology",
  "science",
  "health",
  "entertainment",
  "sports",
  "general",
] as const;

export type CurrentsCategory = (typeof CURRENTS_CATEGORIES)[number];

const articleSchema = z.object({
  id: z.string(),
  title: z.string().nullish(),
  description: z.string().nullish(),
  url: z.string(),
  author: z.string().nullish(),
  image: z.string().nullish(),
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

function shortHash(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(h).toString(36).slice(0, 6);
}

function parsePublished(value: string): Date {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

function cleanImage(image: string | null | undefined): string | null {
  if (!image || image === "None") return null;
  return image;
}

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
    categorySlug: classifyCategory(categorySlug, title, description),
  };
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

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
    cache: "no-store",
  });
  const json = responseSchema.parse(await res.json());
  if (!res.ok || json.status !== "ok") {
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
