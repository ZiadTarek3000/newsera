import Image from "next/image";
import Link from "next/link";
import { requireUser } from "@/lib/auth/dal";
import {
  getDashboardSuggestions,
  getUserBookmarks,
  getUserHistory,
  getUserPreferences,
} from "@/lib/data/dashboard";
import ScrollProgress from "../_components/scroll-progress";
import AppFooter from "../_components/app-footer";
import BookmarkButton from "../_components/bookmark-button";
import ThemeSync from "../_components/theme-sync";
import DashboardHeader from "./_components/dashboard-header";
import PreferencesPanel from "./_components/preferences-panel";
import SavedArticles from "./_components/saved-articles";
import {
  CheckCircleIcon,
  HistoryIcon,
  RadioCheckedIcon,
  RecommendIcon,
  SettingsIcon,
} from "../_components/icons";

const MAIN_TOPICS = [
  { name: "Technology", slug: "technology" },
  { name: "Business", slug: "business" },
  { name: "Science", slug: "science" },
  { name: "Politics", slug: "politics" },
  { name: "Culture", slug: "culture" },
  { name: "Health", slug: "health" },
];

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
      <ScrollProgress />
      <ThemeSync initialTheme={prefs.theme} />
      <DashboardHeader user={user} />

      <main className="mx-auto min-h-screen max-w-[1280px] px-5 pb-24 pt-32 md:px-16">
        {/* Dashboard heading */}
        <section className="mb-12">
          <h1 className="mb-2 font-serif text-[40px] font-bold leading-[1.2] tracking-[-0.02em] text-on-surface md:text-[64px] md:leading-[1.1]">
            Member Dashboard
          </h1>
          <p className="text-[18px] text-on-surface-variant">
            Welcome back, {firstName}. Here is your curated reading digest.
          </p>
        </section>

        {/* Bento layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <SavedArticles articles={bookmarks} />

          {/* Reading History */}
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
                        {entry.status === "reading" ? (
                          <RadioCheckedIcon className="size-[18px] text-secondary" />
                        ) : (
                          <CheckCircleIcon className="size-[18px] text-outline-variant transition-colors group-hover:text-secondary" />
                        )}
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

        {/* Suggested for You */}
        {suggestions.length > 0 && (
          <section className="mt-20">
            <h2 className="mb-6 flex items-center gap-2 font-serif text-[28px] font-semibold">
              <RecommendIcon className="size-6 text-secondary" />
              Suggested for You
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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

        {/* Platform Preferences */}
        <section className="mt-20">
          <h2 className="mb-6 flex items-center gap-2 font-serif text-[28px] font-semibold">
            <SettingsIcon className="size-6 text-secondary" />
            Platform Preferences
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <PreferencesPanel
              topics={MAIN_TOPICS}
              favorites={prefs.favoriteCategories}
              dailyBriefing={prefs.dailyBriefing}
            />
          </div>
        </section>
      </main>

      <AppFooter />
    </>
  );
}
