"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ArticleSummary } from "@/types";
import BookmarkButton from "./bookmark-button";
import { ArrowLeftIcon, ArrowRightIcon, TrendingUpIcon } from "./icons";

type TrendingCarouselProps = {
  articles: ArticleSummary[];
};

export default function TrendingCarousel({ articles }: TrendingCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (amount: number) => {
    containerRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section className="animate-fade-up overflow-hidden bg-surface-container-low py-32 delay-200">
      <div className="mx-auto max-w-[1440px] px-8">
        <div className="mb-10 flex items-center justify-between">
          <h2 className="flex items-center gap-3 font-serif text-[32px] font-semibold">
            <TrendingUpIcon className="size-7 text-primary" />
            Trending Now
          </h2>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Scroll left"
              onClick={() => scrollBy(-400)}
              className="flex size-10 items-center justify-center rounded-full border border-outline-variant shadow-sm transition-all hover:border-primary hover:bg-surface-variant hover:text-primary active:scale-90"
            >
              <ArrowLeftIcon className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Scroll right"
              onClick={() => scrollBy(400)}
              className="flex size-10 items-center justify-center rounded-full border border-outline-variant shadow-sm transition-all hover:border-primary hover:bg-surface-variant hover:text-primary active:scale-90"
            >
              <ArrowRightIcon className="size-4" />
            </button>
          </div>
        </div>

        <div
          ref={containerRef}
          className="hide-scrollbar flex snap-x snap-mandatory gap-8 overflow-x-auto pb-4"
        >
          {articles.map((article) => (
            <div
              key={article.id}
              className="group relative min-w-[320px] snap-start rounded-xl bg-surface-container-lowest p-4 shadow-sm transition-shadow hover:shadow-md md:min-w-[400px]"
            >
              <Link
                href={`/article/${article.slug}`}
                className="relative mb-4 block aspect-[16/9] overflow-hidden rounded-lg"
              >
                <Image
                  src={article.image}
                  alt={article.alt}
                  fill
                  sizes="400px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Link>
              <div className="mb-2 flex items-start justify-between">
                <span className="block text-[12px] font-semibold tracking-[0.1em] text-primary">
                  {article.category}
                </span>
                <BookmarkButton
                  articleId={article.id}
                  className="text-outline hover:text-primary"
                  iconClassName="size-5"
                />
              </div>
              <Link href={`/article/${article.slug}`}>
                <h3 className="mb-2 font-serif text-[20px] font-semibold transition-colors group-hover:text-primary">
                  {article.title}
                </h3>
              </Link>
              <div className="mt-auto flex items-center gap-2">
                <span className="text-[12px] font-medium text-on-surface">
                  {article.source}
                </span>
                <span className="text-[10px] text-outline">•</span>
                <span className="text-[10px] font-semibold tracking-[0.1em] text-outline">
                  {article.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
