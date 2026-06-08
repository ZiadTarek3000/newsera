import Image from "next/image";
import Link from "next/link";
import type { ArticleSummary } from "@/types";
import BookmarkButton from "./bookmark-button";

type ArticleCardProps = {
  article: ArticleSummary;
};

/** Vertical article card used in the "Latest Updates" grid. */
export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="article-card-hover group flex h-full flex-col overflow-hidden rounded-xl bg-surface-container-lowest p-2">
      <div className="relative mb-6 aspect-[3/2] overflow-hidden rounded-lg bg-surface-container">
        <Link href={`/article/${article.slug}`} className="block size-full">
          <Image
            src={article.image}
            alt={article.alt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </Link>
        <BookmarkButton
          articleId={article.id}
          className="absolute right-4 top-4 z-10 text-white drop-shadow-md"
        />
      </div>
      <div className="flex flex-grow flex-col px-2">
        <span className="mb-3 block text-[12px] font-semibold tracking-[0.2em] text-primary">
          {article.category}
        </span>
        <Link href={`/article/${article.slug}`}>
          <h4 className="mb-4 font-serif text-[24px] font-semibold leading-tight transition-colors group-hover:text-primary">
            {article.title}
          </h4>
        </Link>
        <p className="mb-6 line-clamp-3 text-[16px] text-on-surface-variant">
          {article.excerpt}
        </p>
        <div className="mt-auto flex items-center gap-2 border-t border-outline-variant/30 pt-4">
          <span className="text-[12px] font-medium text-on-surface">
            {article.source}
          </span>
          <span className="text-[10px] text-outline">•</span>
          <span className="text-[10px] font-semibold tracking-[0.1em] text-outline">
            {article.date}
          </span>
        </div>
      </div>
    </article>
  );
}
