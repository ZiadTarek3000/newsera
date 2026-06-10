export type ArticleSummary = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  source: string;
  author?: string | null;
  category: string;
  date: string;
  dateTime?: string;
  readTime: string;
  image: string;
  alt: string;
};

export type ArticleDetail = ArticleSummary & {
  content: string;
  takeaways: string[];
  views: number;
  sourceUrl: string;
};

export type BriefDTO = {
  slug: string;
  title: string;
  source: string;
  date: string;
  excerpt: string;
};

export type ArticlesPage = {
  articles: ArticleSummary[];
  hasMore: boolean;
  total: number;
};

export type HomeFeed = {
  hero: ArticleSummary | null;
  trending: ArticleSummary[];
  analysis: ArticleSummary | null;
  businessBriefs: BriefDTO[];
};

export type HomePageData = HomeFeed & {
  categories: CategoryDTO[];
  initialArticles: ArticleSummary[];
  initialHasMore: boolean;
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
  timestamp: string;
  detail: string;
};

export type CurrentUser = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: "USER" | "ADMIN";
};
