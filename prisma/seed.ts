import "dotenv/config";
import { prisma } from "../lib/db";
import { slugify } from "../lib/utils";
import {
  analysisFeature,
  businessBriefs,
  heroArticle,
  latestArticles,
  trendingArticles,
} from "../app/_data/home";
import {
  article as featureArticle,
  recommendedArticles,
  relatedArticles,
} from "../app/article/_data/article";
import { savedArticles, suggestedArticles } from "../app/dashboard/_data/dashboard";

type SeedArticle = {
  category: string;
  title: string;
  excerpt: string;
  source: string;
  image: string;
  content?: string;
  takeaways?: string[];
};

const HOUR = 3_600_000;

function main() {
  const items: SeedArticle[] = [];

  items.push({ ...heroArticle });
  trendingArticles.forEach((a) => items.push({ ...a }));
  latestArticles.forEach((a) => items.push({ ...a }));
  items.push({ ...analysisFeature });

  businessBriefs.forEach((b) =>
    items.push({
      category: "Business",
      title: b.title,
      excerpt: b.excerpt,
      source: b.source,
      image: "",
    }),
  );

  items.push({
    category: "Analysis",
    title: featureArticle.title,
    excerpt: featureArticle.lead.slice(0, 180),
    source: featureArticle.source,
    image: featureArticle.heroImage,
    content: `${featureArticle.lead}\n\n## ${featureArticle.sectionHeading}\n\n${featureArticle.sectionBody}`,
    takeaways: featureArticle.takeaways,
  });
  relatedArticles.forEach((a) =>
    items.push({
      category: a.category,
      title: a.title,
      excerpt: a.excerpt,
      source: "NEWSERA",
      image: a.image,
    }),
  );
  recommendedArticles.forEach((a) =>
    items.push({
      category: "Culture",
      title: a.title,
      excerpt: "",
      source: "NEWSERA",
      image: a.image,
    }),
  );
  savedArticles.forEach((a) =>
    items.push({
      category: a.category,
      title: a.title,
      excerpt: a.excerpt,
      source: "NEWSERA",
      image: a.image,
    }),
  );
  suggestedArticles.forEach((a) =>
    items.push({
      category: a.category,
      title: a.title,
      excerpt: a.excerpt,
      source: "NEWSERA",
      image: a.image,
    }),
  );

  return items;
}

async function run() {
  const items = main();

  // Dedupe by slug (skip empties / collisions).
  const bySlug = new Map<string, SeedArticle>();
  for (const it of items) {
    const slug = slugify(it.title);
    if (!slug || bySlug.has(slug)) continue;
    bySlug.set(slug, it);
  }

  // Categories.
  const catNames = new Set<string>([
    "Top Headlines",
    "Business",
    "Technology",
    "Science",
    "Health",
    "World",
    "Entertainment",
    "Politics",
    "Culture",
    "Economy",
    "Analysis",
    "General",
  ]);
  for (const it of bySlug.values()) catNames.add(it.category || "General");

  const categoryIdBySlug = new Map<string, string>();
  for (const name of catNames) {
    const slug = slugify(name);
    const cat = await prisma.category.upsert({
      where: { slug },
      update: { name },
      create: { name, slug },
    });
    categoryIdBySlug.set(slug, cat.id);
  }

  // Articles.
  const entries = [...bySlug.entries()];
  let i = 0;
  for (const [slug, it] of entries) {
    const categoryId =
      categoryIdBySlug.get(slugify(it.category || "General")) ??
      categoryIdBySlug.get("general")!;
    await prisma.article.upsert({
      where: { externalId: `seed:${slug}` },
      update: {},
      create: {
        externalId: `seed:${slug}`,
        slug,
        title: it.title,
        excerpt: it.excerpt || null,
        content: it.content ?? it.excerpt ?? null,
        imageUrl: it.image || null,
        publishedAt: new Date(Date.now() - i * 6 * HOUR),
        source: it.source || "NEWSERA",
        views: (entries.length - i) * 37,
        takeaways: it.takeaways ?? [],
        categoryId,
      },
    });
    i++;
  }

  // Featured (hero + analysis).
  const heroArt = await prisma.article.findUnique({
    where: { slug: slugify(heroArticle.title) },
  });
  const analysisArt = await prisma.article.findUnique({
    where: { slug: slugify(featureArticle.title) },
  });
  if (heroArt) {
    await prisma.featuredArticle.upsert({
      where: { articleId: heroArt.id },
      update: { section: "home", priority: 100 },
      create: { articleId: heroArt.id, section: "home", priority: 100 },
    });
  }
  if (analysisArt) {
    await prisma.featuredArticle.upsert({
      where: { articleId: analysisArt.id },
      update: { section: "analysis", priority: 100 },
      create: { articleId: analysisArt.id, section: "analysis", priority: 100 },
    });
  }

  console.log(
    `Seeded ${entries.length} articles across ${catNames.size} categories.`,
  );
}

run()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
