import "server-only";
import type { Article, Category } from "@prisma/client";
import { prisma } from "@/lib/db";
import { estimateReadTime, formatDate, relativeTime } from "@/lib/utils";
import type {
  ArticleDetail,
  ArticleSummary,
  BriefDTO,
  HomeFeed,
} from "@/types";

const FALLBACK_IMAGE = "/article-placeholder.svg";

type ArticleWithCategory = Article & { category: Category | null };

export function articleToSummary(
  a: ArticleWithCategory,
  opts: { relative?: boolean } = {},
): ArticleSummary {
  return {
    id: a.id,
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt ?? "",
    source: a.source,
    author: a.author,
    category: a.category?.name ?? "News",
    date: a.publishedAt
      ? opts.relative
        ? relativeTime(a.publishedAt)
        : formatDate(a.publishedAt)
      : "",
    dateTime: a.publishedAt?.toISOString(),
    readTime: estimateReadTime(a.content ?? a.excerpt),
    image: a.imageUrl ?? FALLBACK_IMAGE,
    alt: a.title,
  };
}

const EMPTY_FEED: HomeFeed = {
  hero: null,
  trending: [],
  latest: [],
  analysis: null,
  businessBriefs: [],
};

/** Everything the home page needs, in one resilient call. */
export async function getHomeFeed(): Promise<HomeFeed> {
  try {
    const [featuredHome, featuredAnalysis, recent, trending, briefs] =
      await Promise.all([
        prisma.featuredArticle.findFirst({
          where: { section: "home" },
          orderBy: { priority: "desc" },
          include: { article: { include: { category: true } } },
        }),
        prisma.featuredArticle.findFirst({
          where: { section: "analysis" },
          orderBy: { priority: "desc" },
          include: { article: { include: { category: true } } },
        }),
        prisma.article.findMany({
          orderBy: { publishedAt: "desc" },
          include: { category: true },
          take: 13,
        }),
        prisma.article.findMany({
          orderBy: [{ views: "desc" }, { publishedAt: "desc" }],
          include: { category: true },
          take: 8,
        }),
        prisma.article.findMany({
          where: {
            category: { slug: { in: ["business", "economy", "world"] } },
          },
          orderBy: { publishedAt: "desc" },
          include: { category: true },
          take: 3,
        }),
      ]);

    const hero = featuredHome?.article ?? recent[0] ?? null;
    const heroId = hero?.id;

    const latest = recent
      .filter((a) => a.id !== heroId)
      .slice(0, 6)
      .map((a) => articleToSummary(a));

    const trendingList = trending
      .filter((a) => a.id !== heroId)
      .slice(0, 4)
      .map((a) => articleToSummary(a, { relative: true }));

    const analysis =
      featuredAnalysis?.article ??
      recent.find((a) => a.id !== heroId && a.category?.slug === "technology") ??
      null;

    const businessBriefs: BriefDTO[] = briefs.map((a) => ({
      slug: a.slug,
      title: a.title,
      source: a.source,
      date: a.publishedAt ? formatDate(a.publishedAt) : "",
      excerpt: a.excerpt ?? "",
    }));

    return {
      hero: hero ? articleToSummary(hero as ArticleWithCategory) : null,
      trending: trendingList,
      latest,
      analysis: analysis ? articleToSummary(analysis as ArticleWithCategory) : null,
      businessBriefs,
    };
  } catch (error) {
    console.error("getHomeFeed failed:", error);
    return EMPTY_FEED;
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
    return {
      ...articleToSummary(a),
      content: a.content ?? "",
      takeaways: a.takeaways,
      views: a.views,
      sourceUrl: a.url ?? "",
    };
  } catch (error) {
    console.error("getArticleBySlug failed:", error);
    return null;
  }
}

/** Same-category, most-recent articles excluding the current one. */
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
      include: { category: true },
      take,
    });
    return rows.map((a) => articleToSummary(a));
  } catch (error) {
    console.error("getRelated failed:", error);
    return [];
  }
}

/** Lightweight recommendations: trending then recent, excluding the current. */
export async function getRecommended(
  excludeId: string,
  take = 3,
): Promise<ArticleSummary[]> {
  try {
    const rows = await prisma.article.findMany({
      where: { id: { not: excludeId } },
      orderBy: [{ views: "desc" }, { publishedAt: "desc" }],
      include: { category: true },
      take,
    });
    return rows.map((a) => articleToSummary(a));
  } catch (error) {
    console.error("getRecommended failed:", error);
    return [];
  }
}

/** Slugs for static generation of article pages. */
export async function getAllArticleSlugs(): Promise<string[]> {
  try {
    const rows = await prisma.article.findMany({ select: { slug: true } });
    return rows.map((r) => r.slug);
  } catch {
    return [];
  }
}
