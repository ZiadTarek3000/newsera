import Image from "next/image";
import Link from "next/link";
import ArticleCard from "./_components/article-card";
import BookmarkButton from "./_components/bookmark-button";
import NewsletterForm from "./_components/newsletter-form";
import ScrollProgress from "./_components/scroll-progress";
import SiteFooter from "./_components/site-footer";
import SiteHeader from "./_components/site-header";
import TrendingCarousel from "./_components/trending-carousel";
import { ArrowRightIcon, ChevronDownIcon, MailIcon } from "./_components/icons";
import { getHomeFeed } from "@/lib/data/articles";

export const revalidate = 300;

export default async function Home() {
  const { hero, trending, latest, analysis, businessBriefs } =
    await getHomeFeed();

  return (
    <div className="selection:bg-primary-fixed selection:text-on-primary-fixed">
      <ScrollProgress />
      <SiteHeader />

      <main className="pt-20">
        <section className="relative flex min-h-[80vh] w-full items-center overflow-hidden bg-surface-container-lowest">
          {hero ? (
            <div className="animate-fade-up mx-auto grid w-full max-w-[1440px] grid-cols-1 items-center gap-12 px-8 py-16 lg:grid-cols-12">
              <div className="z-10 space-y-6 lg:col-span-7">
                <span className="inline-block rounded-full bg-primary px-3 py-1 text-[12px] font-semibold tracking-[0.1em] text-on-primary shadow-sm">
                  {hero.category}
                </span>
                <Link href={`/article/${hero.slug}`} className="block">
                  <h1 className="max-w-2xl font-serif text-[40px] font-bold leading-[1.1] tracking-[-0.02em] text-on-surface transition-colors hover:text-primary md:text-[64px]">
                    {hero.title}
                  </h1>
                </Link>
                <p className="max-w-xl text-[18px] leading-relaxed text-on-surface-variant">
                  {hero.excerpt}
                </p>
                <div className="flex max-w-xl items-center justify-between gap-4 pt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-medium text-on-surface">
                      {hero.source}
                    </span>
                    <span className="text-outline">•</span>
                    <span className="text-[10px] font-semibold tracking-[0.1em] text-outline">
                      {hero.date}
                    </span>
                  </div>
                  <BookmarkButton
                    articleId={hero.id}
                    className="text-outline hover:text-primary"
                  />
                </div>
              </div>

              <div className="group relative lg:col-span-5">
                <Link
                  href={`/article/${hero.slug}`}
                  className="relative block aspect-[4/5] overflow-hidden rounded-xl shadow-2xl"
                >
                  <Image
                    src={hero.image}
                    alt={hero.alt}
                    fill
                    priority
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </Link>
                <div className="absolute -bottom-6 -left-6 hidden max-w-[200px] rounded-lg border border-outline-variant/30 bg-surface-bright p-6 shadow-xl md:block">
                  <p className="mb-2 text-[10px] font-semibold tracking-[0.1em] text-primary">
                    Source
                  </p>
                  <p className="font-serif text-[20px] font-semibold text-on-surface">
                    {hero.source}
                  </p>
                  <p className="text-[12px] text-on-surface-variant">
                    {hero.category}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-[1440px] px-8 py-32 text-center">
              <h1 className="font-serif text-[40px] font-bold text-on-surface">
                No stories yet
              </h1>
              <p className="mt-4 text-[18px] text-on-surface-variant">
                Content will appear here once the news feed has been synced.
              </p>
            </div>
          )}
        </section>

        {trending.length > 0 && <TrendingCarousel articles={trending} />}

        <section className="animate-fade-up mx-auto max-w-[1440px] px-8 py-32 delay-300">
          <div className="mb-12 border-b border-outline-variant pb-6">
            <h2 className="font-serif text-[32px] font-semibold">
              Latest Updates
            </h2>
          </div>
          {latest.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-x-12 gap-y-20 md:grid-cols-2 lg:grid-cols-3">
                {latest.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
              <div className="mt-20 flex justify-center">
                <button
                  type="button"
                  className="group rounded-lg border border-outline-variant px-12 py-4 text-[12px] font-semibold tracking-[0.1em] shadow-sm transition-all hover:border-primary hover:bg-surface-container-low hover:text-primary active:scale-[0.99]"
                >
                  Load More Updates
                  <ChevronDownIcon className="ml-2 inline-block size-5 align-middle transition-transform group-hover:translate-y-1" />
                </button>
              </div>
            </>
          ) : (
            <p className="text-[16px] text-on-surface-variant">
              No articles to show yet.
            </p>
          )}
        </section>

        {(businessBriefs.length > 0 || analysis) && (
          <section className="animate-fade-up bg-surface-container-highest py-24 delay-400">
            <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-20 px-8 lg:grid-cols-2">
              <div>
                <div className="mb-8 flex items-center justify-between">
                  <h2 className="font-serif text-[40px] font-bold italic">
                    Business &amp; Economy
                  </h2>
                </div>
                <div className="space-y-12">
                  {businessBriefs.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/article/${item.slug}`}
                      className="group block cursor-pointer"
                    >
                      <h4 className="mb-3 font-serif text-[24px] font-semibold underline decoration-outline-variant/30 decoration-1 underline-offset-8 transition-colors group-hover:text-primary">
                        {item.title}
                      </h4>
                      <div className="mb-2 flex items-center gap-2">
                        <span className="text-[12px] font-medium text-on-surface">
                          {item.source}
                        </span>
                        <span className="text-[10px] text-outline">•</span>
                        <span className="text-[10px] font-semibold tracking-[0.1em] text-outline">
                          {item.date}
                        </span>
                      </div>
                      <p className="text-[16px] text-on-surface-variant">
                        {item.excerpt}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>

              {analysis && (
                <div className="flex transform flex-col rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-12 shadow-md transition-transform duration-500 hover:-translate-y-1">
                  <div className="mb-6 flex items-start justify-between">
                    <span className="block text-[12px] font-semibold uppercase tracking-[0.2em] text-primary">
                      {analysis.category}
                    </span>
                    <BookmarkButton
                      articleId={analysis.id}
                      className="text-outline hover:text-primary"
                    />
                  </div>
                  <Link
                    href={`/article/${analysis.slug}`}
                    className="group relative mb-8 block aspect-video overflow-hidden rounded-lg"
                  >
                    <Image
                      src={analysis.image}
                      alt={analysis.alt}
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </Link>
                  <Link href={`/article/${analysis.slug}`}>
                    <h3 className="mb-4 font-serif text-[32px] font-bold transition-colors hover:text-primary">
                      {analysis.title}
                    </h3>
                  </Link>
                  <div className="mb-4 flex items-center gap-2">
                    <span className="text-[12px] font-medium text-on-surface">
                      {analysis.source}
                    </span>
                    <span className="text-[10px] text-outline">•</span>
                    <span className="text-[10px] font-semibold tracking-[0.1em] text-outline">
                      {analysis.date}
                    </span>
                  </div>
                  <p className="mb-8 text-[18px] text-on-surface-variant">
                    {analysis.excerpt}
                  </p>
                  <Link
                    href={`/article/${analysis.slug}`}
                    className="mt-auto flex items-center gap-2 text-[12px] font-semibold tracking-[0.1em] text-primary transition-all hover:gap-4 hover:text-primary-container"
                  >
                    Read Full Story
                    <ArrowRightIcon className="size-4" />
                  </Link>
                </div>
              )}
            </div>
          </section>
        )}

        <section className="animate-fade-up bg-surface py-32 text-on-surface">
          <div className="mx-auto max-w-[720px] px-8 text-center">
            <MailIcon className="mx-auto mb-6 block size-12 text-primary" />
            <h2 className="mb-6 font-serif text-[48px] font-bold">
              NEWSERA Daily Digest
            </h2>
            <p className="mb-10 text-[18px] text-on-surface-variant">
              Get the top headlines and trending stories across your favorite
              categories delivered directly to your inbox every morning.
            </p>
            <NewsletterForm />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
