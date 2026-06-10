import Image from "next/image";
import Link from "next/link";
import { requireUser } from "@/lib/auth/dal";
import {
  getDashboardSuggestions,
  getUserBookmarks,
  getUserHistory,
  getUserPreferences,
} from "@/lib/data/dashboard";
import AppFooter from "../_components/app-footer";
import BookmarkButton from "../_components/bookmark-button";
import ThemeSync from "../_components/theme-sync";
import DashboardHeader from "./_components/dashboard-header";
import SavedArticles from "./_components/saved-articles";
import {
  CheckCircleIcon,
  HistoryIcon,
  RecommendIcon,
} from "../_components/icons";

export default async function DashboardPage() {
  const user = await requireUser();
  const firstName = user.name?.trim().split(/\s+/)[0] ?? "there";

  const [bookmarks, history, suggestions, prefs] = await Promise.all([
    getUserBookmarks(user.id),
    getUserHistory(user.id),
    getDashboardSuggestions(user.id),
    getUserPreferences(user.id),
  ]);

  return (
    <>
      <ThemeSync initialTheme={prefs.theme} />
      <DashboardHeader user={user} />

      <main className="mx-auto min-h-screen max-w-[1280px] px-4 pb-20 pt-28 sm:px-6 sm:pb-24 sm:pt-32 md:px-16">
        <section className="mb-10 sm:mb-12">
          <h1 className="mb-2 font-serif text-[32px] font-bold leading-[1.15] tracking-[-0.02em] text-on-surface sm:text-[40px] md:text-[64px] md:leading-[1.1]">
            Member Dashboard
          </h1>
          <p className="text-[16px] text-on-surface-variant sm:text-[18px]">
            Welcome back, {firstName}. Here is your curated reading digest.
          </p>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <SavedArticles articles={bookmarks} />

          <div className="lg:col-span-4">
            <div className="h-full rounded-xl border border-outline-variant/20 bg-surface-container-low p-8">
              <h2 className="mb-6 flex items-center gap-2 font-serif text-[24px] font-semibold">
                <HistoryIcon className="size-6 text-secondary" />
                Reading History
              </h2>
              {history.length > 0 ? (
                <div className="relative space-y-8">
                  <div className="absolute bottom-2 left-[11px] top-2 w-px bg-outline-variant/30" />
                  {history.map((entry) => (
                    <div
                      key={entry.articleId}
                      className="history-item group relative mb-6 pl-8"
                    >
                      <div className="absolute left-0 top-1 flex size-6 items-center justify-center bg-surface-container-low">
                        <CheckCircleIcon className="size-[18px] text-outline-variant transition-colors group-hover:text-secondary" />
                      </div>
                      <span className="mb-1 block text-[12px] font-semibold tracking-[0.1em] text-on-surface-variant opacity-70">
                        {entry.timestamp}
                      </span>
                      <Link href={`/article/${entry.slug}`}>
                        <h4 className="text-[16px] font-medium transition-colors group-hover:text-primary">
                          {entry.title}
                        </h4>
                      </Link>
                      <p className="mt-0.5 text-[12px] text-on-surface-variant">
                        {entry.detail}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[14px] text-on-surface-variant">
                  Articles you read will appear here.
                </p>
              )}
            </div>
          </div>
        </div>

        {suggestions.length > 0 && (
          <section className="mt-20">
            <h2 className="mb-6 flex items-center gap-2 font-serif text-[28px] font-semibold">
              <RecommendIcon className="size-6 text-secondary" />
              Suggested for You
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              {suggestions.map((article) => (
                <div
                  key={article.id}
                  className="group flex flex-col overflow-hidden rounded-lg border border-outline-variant/30 bg-surface-container-lowest transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <Link
                    href={`/article/${article.slug}`}
                    className="relative block aspect-video overflow-hidden"
                  >
                    <Image
                      src={article.image}
                      alt={article.alt}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </Link>
                  <div className="flex flex-grow flex-col p-5">
                    <span className="mb-2 block text-[12px] font-semibold uppercase tracking-wider text-secondary">
                      {article.category}
                    </span>
                    <Link href={`/article/${article.slug}`}>
                      <h3 className="mb-2 line-clamp-2 text-[16px] font-medium transition-colors group-hover:text-primary">
                        {article.title}
                      </h3>
                    </Link>
                    <p className="mb-4 line-clamp-2 flex-grow text-[13px] text-on-surface-variant">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between border-t border-outline-variant/20 pt-3">
                      <span className="text-[11px] text-on-surface-variant opacity-60">
                        {article.readTime}
                      </span>
                      <BookmarkButton
                        articleId={article.id}
                        article={article}
                        className="text-primary"
                        iconClassName="size-5"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      <AppFooter />
    </>
  );
}
