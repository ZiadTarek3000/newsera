import "server-only";
import { prisma } from "@/lib/db";
import { relativeTime } from "@/lib/utils";
import { articleToSummary, summarySelect } from "@/lib/data/articles";
import type { ArticleSummary, HistoryEntryDTO } from "@/types";

export type UserPreferencesDTO = {
  favoriteCategories: string[];
  dailyBriefing: boolean;
  theme: string;
};

export async function getUserBookmarks(
  userId: string,
): Promise<ArticleSummary[]> {
  try {
    const rows = await prisma.bookmark.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { article: { select: summarySelect } },
    });
    return rows.map((r) => articleToSummary(r.article));
  } catch (error) {
    console.error("getUserBookmarks failed:", error);
    return [];
  }
}

export async function getUserHistory(
  userId: string,
  take = 6,
): Promise<HistoryEntryDTO[]> {
  try {
    const rows = await prisma.readingHistory.findMany({
      where: { userId },
      orderBy: { viewedAt: "desc" },
      take,
      select: {
        articleId: true,
        viewedAt: true,
        article: {
          select: {
            slug: true,
            title: true,
            category: { select: { name: true } },
          },
        },
      },
    });
    return rows.map((r) => ({
      articleId: r.articleId,
      slug: r.article.slug,
      title: r.article.title,
      timestamp: relativeTime(r.viewedAt),
      detail: r.article.category?.name ?? "News",
    }));
  } catch (error) {
    console.error("getUserHistory failed:", error);
    return [];
  }
}

export async function getDashboardSuggestions(
  userId: string,
  take = 3,
): Promise<ArticleSummary[]> {
  try {
    const [prefs, bookmarks] = await Promise.all([
      prisma.userPreferences.findUnique({ where: { userId } }),
      prisma.bookmark.findMany({ where: { userId }, select: { articleId: true } }),
    ]);
    const excludeIds = bookmarks.map((b) => b.articleId);
    const favs = prefs?.favoriteCategories ?? [];

    const rows = await prisma.article.findMany({
      where: {
        id: { notIn: excludeIds },
        ...(favs.length ? { category: { slug: { in: favs } } } : {}),
      },
      orderBy: [{ views: "desc" }, { publishedAt: "desc" }],
      select: summarySelect,
      take,
    });
    return rows.map((a) => articleToSummary(a));
  } catch (error) {
    console.error("getDashboardSuggestions failed:", error);
    return [];
  }
}

export async function getUserPreferences(
  userId: string,
): Promise<UserPreferencesDTO> {
  try {
    const p = await prisma.userPreferences.findUnique({ where: { userId } });
    return {
      favoriteCategories: p?.favoriteCategories ?? [],
      dailyBriefing: p?.dailyBriefing ?? true,
      theme: p?.theme ?? "system",
    };
  } catch (error) {
    console.error("getUserPreferences failed:", error);
    return { favoriteCategories: [], dailyBriefing: true, theme: "system" };
  }
}
