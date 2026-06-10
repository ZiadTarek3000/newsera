import "server-only";
import { prisma } from "@/lib/db";
import { estimateReadTime, formatDate, relativeTime, slugify } from "@/lib/utils";
import {
  buildDek,
  enrichContent,
  generateTakeaways,
  THIN_CONTENT_WORDS,
  wordCount,
} from "@/lib/content/enrich";
import type {
  ArticleDetail,
  ArticleSummary,
  ArticlesPage,
  BriefDTO,
  CategoryDTO,
  HomePageData,
} from "@/types";

const FALLBACK_IMAGE = "/article-placeholder.svg";

// Cap on how many rows we pull before de-duplicating + paginating in memory.
// Title-level de-duplication can't be expressed as a SQL OFFSET, so we read a
// bounded window, collapse duplicates, then slice the requested page from it.
const FEED_WINDOW = 300;

// Column projection for list/summary views. Deliberately excludes `content`
// (the largest text column) and every other field the card UI never reads, so
// feed queries stay light even when they scan a wide window. `articleToSummary`
// derives read time from `excerpt` — identical to the old `content`-based value
// because synced articles store `content === excerpt`.
export const summarySelect = {
  id: true,
  slug: true,
  title: true,
  excerpt: true,
  source: true,
  author: true,
  imageUrl: true,
  publishedAt: true,
  category: { select: { name: true, slug: true } },
} as const;

// A row shaped by `summarySelect`. Everything `articleToSummary`,
// `dedupeByTitle`, and hero/analysis selection need — and nothing heavier.
export type ArticleSummaryRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  source: string;
  author: string | null;
  imageUrl: string | null;
  publishedAt: Date | null;
  category: { name: string; slug: string } | null;
};

/**
 * Collapse articles that are effectively the same story. The Currents feed
 * returns identical headlines under multiple categories, which become distinct
 * rows (different externalId/slug) but should never appear twice in the UI.
 * Keeps the first occurrence, so callers control precedence via ordering.
 */
export function dedupeByTitle<T extends { title: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const item of items) {
    const key = slugify(item.title);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

export function articleToSummary(
  a: ArticleSummaryRow,
  opts: { relative?: boolean } = {},
): ArticleSummary {
  const categoryName = a.category?.name ?? "News";
  return {
    id: a.id,
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt?.trim() ? a.excerpt : buildDek(a.title, categoryName),
    source: a.source,
    author: a.author,
    category: categoryName,
    date: a.publishedAt
      ? opts.relative
        ? relativeTime(a.publishedAt)
        : formatDate(a.publishedAt)
      : "",
    dateTime: a.publishedAt?.toISOString(),
    readTime: estimateReadTime(a.excerpt),
    image: a.imageUrl ?? FALLBACK_IMAGE,
    alt: a.title,
  };
}

const EMPTY_HOME: HomePageData = {
  hero: null,
  trending: [],
  analysis: null,
  businessBriefs: [],
  categories: [],
  initialArticles: [],
  initialHasMore: false,
};

// Number of recent rows pulled. Supplies the hero plus the initial "Latest
// Updates" page (6 cards) in a single query — enough headroom for title-level
// de-duplication and hero exclusion without a second round-trip.
const RECENT_TAKE = 20;
const INITIAL_FEED_SIZE = 6;

/**
 * Everything the home page renders, resolved in a single batch of parallel
 * queries. The initial Latest-feed page is derived in-memory from the `recent`
 * rows we already fetch, so the page no longer issues a separate (300-row)
 * pagination query on first render.
 */
export async function getHomePageData(): Promise<HomePageData> {
  try {
    const [featuredHome, featuredAnalysis, recent, trending, briefs, categories] =
      await Promise.all([
        prisma.featuredArticle.findFirst({
          where: { section: "home" },
          orderBy: { priority: "desc" },
          include: { article: { select: summarySelect } },
        }),
        prisma.featuredArticle.findFirst({
          where: { section: "analysis" },
          orderBy: { priority: "desc" },
          include: { article: { select: summarySelect } },
        }),
        prisma.article.findMany({
          orderBy: { publishedAt: "desc" },
          select: summarySelect,
          take: RECENT_TAKE,
        }),
        prisma.article.findMany({
          orderBy: [{ views: "desc" }, { publishedAt: "desc" }],
          select: summarySelect,
          take: 8,
        }),
        prisma.article.findMany({
          where: {
            category: { slug: { in: ["business", "economy", "world"] } },
          },
          orderBy: { publishedAt: "desc" },
          select: summarySelect,
          take: 8,
        }),
        getCategories(),
      ]);

    const hero = featuredHome?.article ?? recent[0] ?? null;
    const heroId = hero?.id;
    const heroKey = hero ? slugify(hero.title) : null;

    // Exclude the hero (by id and by title) and collapse repeated headlines so
    // no story shows up in more than one place on the page.
    const notHero = (a: ArticleSummaryRow) =>
      a.id !== heroId && slugify(a.title) !== heroKey;

    const trendingList = dedupeByTitle(trending.filter(notHero))
      .slice(0, 4)
      .map((a) => articleToSummary(a, { relative: true }));

    const analysis =
      featuredAnalysis?.article ??
      recent.find((a) => notHero(a) && a.category?.slug === "technology") ??
      null;
    const analysisKey = analysis ? slugify(analysis.title) : null;

    const businessBriefs: BriefDTO[] = dedupeByTitle(
      briefs.filter((a) => notHero(a) && slugify(a.title) !== analysisKey),
    )
      .slice(0, 3)
      .map((a) => ({
      slug: a.slug,
      title: a.title,
      source: a.source,
      date: a.publishedAt ? formatDate(a.publishedAt) : "",
      excerpt: a.excerpt ?? "",
    }));

    // Initial Latest-feed page, derived from the recent rows. The client's
    // "Load More" / filtering continues through /api/articles (offset-based),
    // which orders + de-dupes the same way, so pages line up seamlessly.
    const latestRows = dedupeByTitle(recent.filter(notHero));
    const initialArticles = latestRows
      .slice(0, INITIAL_FEED_SIZE)
      .map((a) => articleToSummary(a));

    return {
      hero: hero ? articleToSummary(hero) : null,
      trending: trendingList,
      analysis: analysis ? articleToSummary(analysis) : null,
      businessBriefs,
      categories,
      initialArticles,
      initialHasMore: latestRows.length > INITIAL_FEED_SIZE,
    };
  } catch (error) {
    console.error("getHomePageData failed:", error);
    return EMPTY_HOME;
  }
}

/**
 * Categories that actually have at least one article, so every filter tab in
 * the UI maps to real, non-empty content.
 */
export async function getCategories(): Promise<CategoryDTO[]> {
  try {
    const rows = await prisma.category.findMany({
      where: { articles: { some: {} } },
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true },
    });
    return rows;
  } catch (error) {
    console.error("getCategories failed:", error);
    return [];
  }
}

export async function getCategoryBySlug(
  slug: string,
): Promise<CategoryDTO | null> {
  try {
    return await prisma.category.findUnique({
      where: { slug },
      select: { id: true, name: true, slug: true },
    });
  } catch (error) {
    console.error("getCategoryBySlug failed:", error);
    return null;
  }
}

/**
 * A de-duplicated, paginated slice of the article feed, optionally filtered by
 * category slug and/or a free-text query. Backs the "Latest Updates" filter
 * tabs, the search box, and the "Load More" button.
 */
export async function getArticlesPage(opts: {
  categorySlug?: string;
  query?: string;
  offset?: number;
  limit?: number;
  excludeId?: string;
}): Promise<ArticlesPage> {
  const offset = Math.max(0, opts.offset ?? 0);
  const limit = Math.min(24, Math.max(1, opts.limit ?? 6));
  const query = opts.query?.trim();
  const categorySlug =
    opts.categorySlug && opts.categorySlug !== "all"
      ? opts.categorySlug
      : undefined;

  try {
    const rows = await prisma.article.findMany({
      where: {
        ...(opts.excludeId ? { id: { not: opts.excludeId } } : {}),
        ...(categorySlug ? { category: { slug: categorySlug } } : {}),
        ...(query
          ? {
              OR: [
                { title: { contains: query, mode: "insensitive" } },
                { excerpt: { contains: query, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { publishedAt: "desc" },
      select: summarySelect,
      take: FEED_WINDOW,
    });

    const deduped = dedupeByTitle(rows);
    const page = deduped.slice(offset, offset + limit);

    return {
      articles: page.map((a) => articleToSummary(a)),
      hasMore: deduped.length > offset + limit,
      total: deduped.length,
    };
  } catch (error) {
    console.error("getArticlesPage failed:", error);
    return { articles: [], hasMore: false, total: 0 };
  }
}

export async function getArticleBySlug(
  slug: string,
): Promise<ArticleDetail | null> {
  try {
    const a = await prisma.article.findUnique({
      where: { slug },
      include: { category: true },
    });
    if (!a) return null;

    const summary = articleToSummary(a);
    const enrichInput = {
      title: a.title,
      excerpt: a.excerpt ?? "",
      source: a.source,
      category: summary.category,
      date: summary.date,
    };
    // Keep substantial stored bodies (e.g. seeded long-reads); enrich thin ones.
    const content =
      wordCount(a.content) >= THIN_CONTENT_WORDS
        ? (a.content as string)
        : enrichContent(enrichInput);
    const takeaways =
      a.takeaways.length > 0 ? a.takeaways : generateTakeaways(enrichInput);

    return {
      ...summary,
      readTime: estimateReadTime(content),
      content,
      takeaways,
      views: a.views,
      sourceUrl: a.url ?? "",
    };
  } catch (error) {
    console.error("getArticleBySlug failed:", error);
    return null;
  }
}

export async function getRelated(
  article: Pick<ArticleSummary, "id" | "category">,
  take = 3,
): Promise<ArticleSummary[]> {
  try {
    const rows = await prisma.article.findMany({
      where: {
        id: { not: article.id },
        category: { name: article.category },
      },
      orderBy: { publishedAt: "desc" },
      select: summarySelect,
      take,
    });
    return rows.map((a) => articleToSummary(a));
  } catch (error) {
    console.error("getRelated failed:", error);
    return [];
  }
}

export async function getRecommended(
  excludeId: string,
  take = 3,
): Promise<ArticleSummary[]> {
  try {
    const rows = await prisma.article.findMany({
      where: { id: { not: excludeId } },
      orderBy: [{ views: "desc" }, { publishedAt: "desc" }],
      select: summarySelect,
      take,
    });
    return rows.map((a) => articleToSummary(a));
  } catch (error) {
    console.error("getRecommended failed:", error);
    return [];
  }
}

export async function getAllArticleSlugs(): Promise<string[]> {
  try {
    const rows = await prisma.article.findMany({ select: { slug: true } });
    return rows.map((r) => r.slug);
  } catch {
    return [];
  }
}
