import "dotenv/config";
import { z } from "zod";
import { prisma } from "../lib/db";
import { slugify } from "../lib/utils";
import { classifyCategory } from "../lib/content/classify";

const CURRENTS_BASE = "https://api.currentsapi.services/v1";

// "general" is fetched last so specific categories claim their articles first.
const SYNC_CATEGORIES = [
  "world",
  "business",
  "technology",
  "science",
  "health",
  "entertainment",
  "sports",
  "general",
] as const;

type Category = (typeof SYNC_CATEGORIES)[number];

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

function sourceFromUrl(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "Currents";
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchCategory(category: Category, max = 10, attempt = 1): Promise<
  ReturnType<typeof normalizeNews>
> {
  const apiKey = process.env.CURRENTS_API_KEY;
  if (!apiKey) throw new Error("CURRENTS_API_KEY is not set");

  const params = new URLSearchParams({ category, language: "en", apiKey });
  const res = await fetch(`${CURRENTS_BASE}/search?${params}`, {
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
  return normalizeNews(json.news, max, category);
}

function normalizeNews(
  news: z.infer<typeof articleSchema>[],
  max: number,
  searchCategory: string,
) {
  return news
    .filter((a) => a.title && a.title !== "None")
    .slice(0, max)
    .map((a) => {
      const title = a.title ?? "Untitled";
      const base = slugify(title).slice(0, 60) || "article";
      const description = a.description ?? "";
      const image = !a.image || a.image === "None" ? null : a.image;
      return {
        externalId: a.id,
        slug: `${base}-${shortHash(a.id)}`,
        title,
        excerpt: description,
        content: description,
        url: a.url,
        imageUrl: image,
        publishedAt: parsePublished(a.published),
        author: a.author ?? null,
        source: a.author?.trim() || sourceFromUrl(a.url),
        categorySlug: classifyCategory(searchCategory, title, description),
      };
    });
}

async function run() {
  let upserts = 0;
  const errors: string[] = [];
  // The Currents feed returns the same story under multiple categories. Track
  // normalized titles across the whole run so each headline is stored once.
  const seenTitles = new Set<string>();
  // Cache category rows; articles are filed under their classified slug.
  const categoryIdCache = new Map<string, string>();

  async function categoryId(slug: string): Promise<string> {
    const cached = categoryIdCache.get(slug);
    if (cached) return cached;
    const cat = await prisma.category.upsert({
      where: { slug },
      update: {},
      create: {
        name: slug.charAt(0).toUpperCase() + slug.slice(1),
        slug,
      },
    });
    categoryIdCache.set(slug, cat.id);
    return cat.id;
  }

  for (const category of SYNC_CATEGORIES) {
    try {
      await sleep(300);
      const articles = await fetchCategory(category, 10);

      for (const a of articles) {
        const titleKey = slugify(a.title);
        if (titleKey && seenTitles.has(titleKey)) continue;
        if (titleKey) seenTitles.add(titleKey);
        try {
          const catId = await categoryId(a.categorySlug);
          const data = {
            title: a.title,
            excerpt: a.excerpt,
            content: a.content,
            url: a.url,
            imageUrl: a.imageUrl,
            publishedAt: a.publishedAt,
            author: a.author,
            source: a.source,
            categoryId: catId,
          };
          await prisma.article.upsert({
            where: { externalId: a.externalId },
            update: data,
            create: { externalId: a.externalId, slug: a.slug, ...data },
          });
          upserts++;
        } catch {
        }
      }
      console.log(`  ${category}: ${articles.length} fetched`);
    } catch (error) {
      errors.push(`${category}: ${(error as Error).message}`);
    }
  }

  console.log(`\nIngested ${upserts} articles.`);
  if (errors.length) console.error("Errors:\n  " + errors.join("\n  "));
}

run()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
