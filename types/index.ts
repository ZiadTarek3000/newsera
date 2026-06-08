// Shared domain DTOs used across the data layer, server components, and UI.
// These are the client-safe shapes (no DB internals / sensitive fields).

export type ArticleSummary = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  source: string;
  author?: string | null;
  category: string;
  /** Display string — absolute date or relative ("2 hrs ago"). */
  date: string;
  /** ISO timestamp for <time> / metadata. */
  dateTime?: string;
  readTime: string;
  image: string;
  alt: string;
};

export type ArticleDetail = ArticleSummary & {
  content: string;
  /** Optional AI/editorial highlights shown in the takeaways callout. */
  takeaways: string[];
  views: number;
  /** Link to the original article at the publisher. */
  sourceUrl: string;
};

/** Compact text-only item used in the home "Business & Economy" column. */
export type BriefDTO = {
  slug: string;
  title: string;
  source: string;
  date: string;
  excerpt: string;
};

export type HomeFeed = {
  hero: ArticleSummary | null;
  trending: ArticleSummary[];
  latest: ArticleSummary[];
  analysis: ArticleSummary | null;
  businessBriefs: BriefDTO[];
};

export type CategoryDTO = {
  id: string;
  name: string;
  slug: string;
};

export type HistoryEntryDTO = {
  articleId: string;
  slug: string;
  title: string;
  /** e.g. "Today • 10:45 AM". */
  timestamp: string;
  detail: string;
  status: "reading" | "finished";
};

export type CurrentUser = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: "USER" | "ADMIN";
};
