"use client";

import { useMemo, useState } from "react";
import {
  keepPreviousData,
  useInfiniteQuery,
} from "@tanstack/react-query";
import type { ArticlesPage, ArticleSummary, CategoryDTO } from "@/types";
import { cn } from "@/lib/utils";
import ArticleCard from "./article-card";
import { ChevronDownIcon, SearchIcon } from "./icons";

const PAGE_SIZE = 6;

type LatestFeedProps = {
  initialArticles: ArticleSummary[];
  initialHasMore: boolean;
  /** Tabs to show. Omit (or pass `lockedCategory`) to hide the tab bar. */
  categories?: CategoryDTO[];
  /** Article already featured elsewhere (e.g. the hero), kept out of the feed. */
  excludeId?: string;
  /** Lock the feed to one category (category section pages) — hides the tabs. */
  lockedCategory?: string;
  /** Heading shown above the feed. */
  heading?: string;
};

type Tab = { label: string; slug: string };

async function fetchPage(
  category: string,
  query: string,
  offset: number,
  excludeId: string | undefined,
  signal: AbortSignal,
): Promise<ArticlesPage> {
  const params = new URLSearchParams({
    offset: String(offset),
    limit: String(PAGE_SIZE),
  });
  // A search is global: it ignores the active category filter.
  if (query) {
    params.set("q", query);
  } else if (category && category !== "all") {
    params.set("category", category);
  }
  if (excludeId) params.set("exclude", excludeId);

  const res = await fetch(`/api/articles?${params.toString()}`, { signal });
  if (!res.ok) throw new Error(`Feed request failed: ${res.status}`);
  return (await res.json()) as ArticlesPage;
}

// The server already de-duplicates its scan window and returns non-overlapping
// slices keyed by offset, so the next offset is simply how many rows we've
// pulled so far. (The id-level merge below stays as a belt-and-braces guard.)
function totalLoaded(pages: ArticlesPage[]): number {
  return pages.reduce((sum, page) => sum + page.articles.length, 0);
}

export default function LatestFeed({
  initialArticles,
  initialHasMore,
  categories,
  excludeId,
  lockedCategory,
  heading = "Latest Updates",
}: LatestFeedProps) {
  const showTabs = !lockedCategory && !!categories?.length;
  const baseCategory = lockedCategory ?? "all";

  const [category, setCategory] = useState(baseCategory);
  const [query, setQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  // Stamp the server-seeded page as fresh-at-mount so React Query doesn't fire a
  // redundant background refetch on first paint. Computed once (lazy init).
  const [mountedAt] = useState(() => Date.now());

  const tabs: Tab[] = [
    { label: "All", slug: "all" },
    ...(categories ?? []).map((c) => ({ label: c.name, slug: c.slug })),
  ];

  // The default view (base category, no search) is the page React-rendered on
  // the server, so we seed its cache entry and mark it fresh — no fetch on
  // mount. Every other tab/search fetches once, then is served from cache on
  // return. `keepPreviousData` keeps the current list on screen while the next
  // one loads, so switching tabs never flashes a skeleton.
  const isDefaultView = category === baseCategory && !query;

  const {
    data,
    isError,
    isFetching,
    isPlaceholderData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["feed", category, query, excludeId ?? null],
    queryFn: ({ pageParam, signal }) =>
      fetchPage(category, query, pageParam, excludeId, signal),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? totalLoaded(allPages) : undefined,
    placeholderData: keepPreviousData,
    initialData: isDefaultView
      ? {
          pages: [
            {
              articles: initialArticles,
              hasMore: initialHasMore,
              total: initialArticles.length,
            },
          ],
          pageParams: [0],
        }
      : undefined,
    initialDataUpdatedAt: isDefaultView ? mountedAt : undefined,
  });

  // Merge pages, guarding against any id overlap so an article never repeats.
  const articles = useMemo(() => {
    const seen = new Set<string>();
    const out: ArticleSummary[] = [];
    for (const page of data?.pages ?? []) {
      for (const article of page.articles) {
        if (seen.has(article.id)) continue;
        seen.add(article.id);
        out.push(article);
      }
    }
    return out;
  }, [data]);

  // Only show the skeleton when there is genuinely nothing to display yet.
  const showSkeleton = isFetching && !data;

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    setQuery(searchInput.trim());
  }

  function clearSearch() {
    setSearchInput("");
    setQuery("");
  }

  const activeTabLabel = tabs.find((t) => t.slug === category)?.label ?? "All";

  return (
    <section
      id="latest"
      className="animate-fade-up mx-auto max-w-[1440px] scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div className="mb-8 border-b border-outline-variant pb-6 sm:mb-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-serif text-[26px] font-semibold sm:text-[32px]">
            {query ? "Search Results" : heading}
          </h2>

          <form
            onSubmit={submitSearch}
            className="flex items-center gap-2 rounded-full border border-outline-variant bg-surface-container-low px-4 py-2"
          >
            <SearchIcon className="size-4 text-on-surface-variant" />
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search news…"
              aria-label="Search news"
              className="w-32 bg-transparent text-[14px] text-on-surface outline-none placeholder:text-on-surface-variant/60 sm:w-48"
            />
          </form>
        </div>

        {query ? (
          <div className="mt-4 flex items-center gap-3 text-[14px] text-on-surface-variant">
            <span>
              Showing results for{" "}
              <span className="font-semibold text-on-surface">
                &ldquo;{query}&rdquo;
              </span>
            </span>
            <button
              type="button"
              onClick={clearSearch}
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              Clear
            </button>
          </div>
        ) : (
          showTabs && (
            <nav
              aria-label="Filter articles by category"
              className="hide-scrollbar mt-6 flex gap-2 overflow-x-auto"
            >
              {tabs.map((tab) => {
                const active = tab.slug === category;
                return (
                  <button
                    key={tab.slug}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setCategory(tab.slug)}
                    className={cn(
                      "whitespace-nowrap rounded-full border px-4 py-2 text-[12px] font-semibold tracking-[0.08em] transition-all active:scale-[0.97]",
                      active
                        ? "border-primary bg-primary text-on-primary shadow-sm"
                        : "border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary",
                    )}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          )
        )}
      </div>

      {showSkeleton ? (
        <FeedSkeleton />
      ) : isError ? (
        <p className="py-12 text-center text-[16px] text-on-surface-variant">
          Something went wrong loading articles. Please try again.
        </p>
      ) : articles.length > 0 ? (
        <>
          <div
            aria-busy={isFetching}
            className={cn(
              "grid grid-cols-1 gap-x-6 gap-y-12 transition-opacity duration-200 sm:gap-x-8 sm:gap-y-16 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-12 lg:gap-y-20",
              isPlaceholderData && "opacity-60",
            )}
          >
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
          {hasNextPage && (
            <div className="mt-12 flex justify-center sm:mt-16 lg:mt-20">
              <button
                type="button"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="group rounded-lg border border-outline-variant px-8 py-4 text-[12px] font-semibold tracking-[0.1em] shadow-sm transition-all hover:border-primary hover:bg-surface-container-low hover:text-primary active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:px-12"
              >
                {isFetchingNextPage ? "Loading…" : "Load More Updates"}
                {!isFetchingNextPage && (
                  <ChevronDownIcon className="ml-2 inline-block size-5 align-middle transition-transform group-hover:translate-y-1" />
                )}
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="py-12 text-center text-[16px] text-on-surface-variant">
          {query
            ? `No articles match “${query}”.`
            : `No articles in ${activeTabLabel} yet.`}
        </p>
      )}
    </section>
  );
}

function FeedSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:gap-x-8 sm:gap-y-16 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-12 lg:gap-y-20">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-4">
          <div className="aspect-[3/2] animate-pulse rounded-lg bg-surface-container" />
          <div className="h-4 w-24 animate-pulse rounded bg-surface-container" />
          <div className="h-6 w-full animate-pulse rounded bg-surface-container" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-surface-container" />
        </div>
      ))}
    </div>
  );
}
