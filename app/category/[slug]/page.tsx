import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SiteHeader from "../../_components/site-header";
import SiteFooter from "../../_components/site-footer";
import LatestFeed from "../../_components/latest-feed";
import { categoryDescription } from "@/lib/categories";
import {
  getArticlesPage,
  getCategoryBySlug,
} from "@/lib/data/articles";

export const revalidate = 300;

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Category not found" };
  return {
    title: category.name,
    description: categoryDescription(slug),
    alternates: { canonical: `/category/${slug}` },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  const [category, initialPage] = await Promise.all([
    getCategoryBySlug(slug),
    getArticlesPage({ categorySlug: slug, limit: 6 }),
  ]);

  if (!category) notFound();

  return (
    <div className="selection:bg-primary-fixed selection:text-on-primary-fixed">
      <SiteHeader />

      <main className="pt-20">
        <section className="border-b border-outline-variant/40 bg-surface-container-lowest">
          <div className="animate-fade-up mx-auto max-w-[1440px] px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-primary">
              Category
            </p>
            <h1 className="font-serif text-[30px] font-bold leading-[1.1] tracking-[-0.02em] text-on-surface sm:text-[40px] md:text-[56px]">
              {category.name}
            </h1>
            <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-on-surface-variant sm:text-[18px]">
              {categoryDescription(slug)}
            </p>
          </div>
        </section>

        <LatestFeed
          initialArticles={initialPage.articles}
          initialHasMore={initialPage.hasMore}
          lockedCategory={slug}
          heading={`Latest in ${category.name}`}
        />
      </main>

      <SiteFooter />
    </div>
  );
}
