import type { MetadataRoute } from "next";
import { getAllArticleSlugs } from "@/lib/data/articles";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllArticleSlugs();

  return [
    { url: `${SITE}/`, changeFrequency: "hourly", priority: 1 },
    { url: `${SITE}/login`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE}/register`, changeFrequency: "monthly", priority: 0.3 },
    ...slugs.map((slug) => ({
      url: `${SITE}/article/${slug}`,
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
  ];
}
