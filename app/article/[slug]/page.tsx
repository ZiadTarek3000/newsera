import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import AppFooter from "../../_components/app-footer";
import BookmarkButton from "../../_components/bookmark-button";
import Reveal from "../../_components/reveal";
import ScrollProgress from "../../_components/scroll-progress";
import ArticleHeader from "../_components/article-header";
import RecordView from "../_components/record-view";
import {
  ClockIcon,
  ExternalLinkIcon,
  GlobeIcon,
  SparklesIcon,
} from "../../_components/icons";
import {
  getArticleBySlug,
  getRecommended,
  getRelated,
} from "@/lib/data/articles";

export const revalidate = 300;

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Article not found" };
  const canonical = `/article/${slug}`;
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      url: canonical,
      images: article.image ? [{ url: article.image }] : undefined,
    },
  };
}

/** Splits stored content into heading/paragraph blocks. */
function renderBlocks(content: string) {
  const blocks = content
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);
  let dropCapUsed = false;

  return blocks.map((block, i) => {
    if (block.startsWith("## ")) {
      return (
        <Reveal key={i}>
          <h2 className="mb-6 pt-8 font-serif text-[32px] font-semibold">
            {block.slice(3)}
          </h2>
        </Reveal>
      );
    }
    const dropCap = !dropCapUsed;
    dropCapUsed = true;
    return (
      <Reveal key={i}>
        <p
          className={`text-[18px] leading-relaxed text-on-surface-variant ${
            dropCap
              ? "first-letter:float-left first-letter:mr-4 first-letter:mt-2 first-letter:font-serif first-letter:text-7xl first-letter:font-bold first-letter:text-primary"
              : ""
          }`}
        >
          {block}
        </p>
      </Reveal>
    );
  });
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const [related, recommended] = await Promise.all([
    getRelated({ id: article.id, category: article.category }),
    getRecommended(article.id),
  ]);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image: article.image ? [article.image] : undefined,
    datePublished: article.dateTime,
    author: [{ "@type": "Organization", name: article.source }],
    publisher: { "@type": "Organization", name: "Newsera" },
    mainEntityOfPage: `${siteUrl}/article/${slug}`,
  };

  return (
    <div className="selection:bg-primary-container selection:text-on-primary-container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ScrollProgress />
      <ArticleHeader />
      <RecordView articleId={article.id} />

      <main className="pt-20">
        {/* Hero */}
        <header className="relative h-[70vh] min-h-[500px] w-full overflow-hidden">
          <Image
            src={article.image}
            alt={article.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-on-surface/60 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
            <div className="mx-auto max-w-[1280px]">
              <div className="mb-6 flex items-center gap-4">
                <span className="inline-block rounded-sm bg-primary px-3 py-1 text-[12px] font-semibold tracking-[0.1em] text-white">
                  {article.category}
                </span>
                <BookmarkButton
                  articleId={article.id}
                  className="text-white/90 hover:text-white"
                  iconClassName="size-5"
                />
              </div>
              <h1 className="mb-8 max-w-4xl font-serif text-[40px] font-bold leading-tight text-white md:text-[64px] md:tracking-[-0.02em]">
                {article.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-[12px] font-semibold tracking-[0.1em] text-white/90">
                <div className="flex items-center gap-2">
                  <GlobeIcon className="size-5" />
                  <span>Source: {article.source}</span>
                </div>
                <span className="size-1 rounded-full bg-white/40" />
                <time dateTime={article.dateTime}>{article.date}</time>
                <span className="size-1 rounded-full bg-white/40" />
                <div className="flex items-center gap-1">
                  <ClockIcon className="size-4" />
                  <span>{article.readTime}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Article content */}
        <article className="mx-auto max-w-3xl px-6 py-24">
          {article.takeaways.length > 0 && (
            <Reveal>
              <div className="mb-16 flex items-start gap-6 rounded-xl border border-primary/20 bg-primary/5 p-8 shadow-sm">
                <div className="flex-shrink-0 rounded-lg bg-primary p-3 text-on-primary">
                  <SparklesIcon />
                </div>
                <div>
                  <h3 className="mb-4 font-serif text-xl font-semibold text-primary">
                    AI Key Takeaways
                  </h3>
                  <ul className="list-disc space-y-3 pl-5 text-[16px] text-on-surface-variant">
                    {article.takeaways.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          )}

          <div className="relative space-y-12 text-on-surface">
            {renderBlocks(article.content)}

            {/* Preview fade + CTA */}
            {article.sourceUrl && (
              <div className="relative mt-12">
                <div className="pointer-events-none absolute bottom-full left-0 h-32 w-full bg-gradient-to-t from-background to-transparent" />
                <Reveal>
                  <div className="border-t border-outline-variant/30 pt-8 text-center">
                    <p className="mb-6 text-[16px] text-on-surface-variant">
                      This is an article preview. Read the full story on the
                      original publisher&apos;s website.
                    </p>
                    <a
                      href={article.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-[12px] font-semibold tracking-[0.1em] text-on-primary shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-on-primary-fixed-variant hover:shadow-xl active:translate-y-0 active:scale-[0.99]"
                    >
                      Read Full Article at {article.source}
                      <ExternalLinkIcon className="size-[18px]" />
                    </a>
                  </div>
                </Reveal>
              </div>
            )}
          </div>
        </article>

        {/* Further Analysis */}
        {related.length > 0 && (
          <section className="bg-surface-container py-24">
            <div className="mx-auto max-w-[1280px] px-8">
              <div className="mb-12 flex items-end justify-between">
                <h2 className="font-serif text-[32px] font-semibold">
                  Further Analysis
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {related.map((card) => (
                  <Reveal key={card.id}>
                    <Link
                      href={`/article/${card.slug}`}
                      className="group block overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={card.image}
                          alt={card.alt}
                          fill
                          sizes="(min-width: 768px) 33vw, 100vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/10 transition-colors duration-500 group-hover:bg-transparent" />
                      </div>
                      <div className="border-t border-outline-variant/20 p-8">
                        <span className="mb-4 block text-[12px] font-semibold tracking-[0.1em] text-primary">
                          {card.category}
                        </span>
                        <h3 className="font-serif text-xl font-semibold leading-tight transition-colors group-hover:text-primary">
                          {card.title}
                        </h3>
                        <p className="mt-4 line-clamp-2 text-[16px] text-on-surface-variant">
                          {card.excerpt}
                        </p>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Recommended for You */}
        {recommended.length > 0 && (
          <section className="overflow-hidden bg-background py-24">
            <div className="mx-auto max-w-[1280px] px-8">
              <h2 className="mb-12 font-serif text-[32px] font-semibold">
                Recommended for You
              </h2>
              <div className="hide-scrollbar flex snap-x gap-8 overflow-x-auto pb-8">
                {recommended.map((item) => (
                  <Reveal
                    key={item.id}
                    className="min-w-[300px] snap-start md:min-w-[350px]"
                  >
                    <Link href={`/article/${item.slug}`} className="group block">
                      <div className="relative mb-6 h-48 overflow-hidden rounded-xl">
                        <Image
                          src={item.image}
                          alt={item.alt}
                          fill
                          sizes="350px"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <h4 className="font-serif text-[20px] font-semibold leading-tight transition-colors group-hover:text-primary">
                        {item.title}
                      </h4>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <AppFooter />
    </div>
  );
}
