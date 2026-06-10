/**
 * One-off / maintenance script: re-file articles currently sitting in the broad
 * "general" bucket into a specific canonical category using the keyword
 * classifier. Non-destructive — it only updates `categoryId`, never deleting or
 * altering the underlying API article data. Safe to re-run.
 *
 *   npx tsx scripts/reclassify.ts
 */
import "dotenv/config";
import { prisma } from "../lib/db";
import { classifyCategory } from "../lib/content/classify";

async function categoryIdFor(
  slug: string,
  cache: Map<string, string>,
): Promise<string> {
  const cached = cache.get(slug);
  if (cached) return cached;
  const cat = await prisma.category.upsert({
    where: { slug },
    update: {},
    create: { name: slug.charAt(0).toUpperCase() + slug.slice(1), slug },
  });
  cache.set(slug, cat.id);
  return cat.id;
}

async function run() {
  const general = await prisma.category.findUnique({
    where: { slug: "general" },
  });
  if (!general) {
    console.log("No 'general' category found — nothing to reclassify.");
    return;
  }

  const articles = await prisma.article.findMany({
    where: { categoryId: general.id },
    select: { id: true, title: true, excerpt: true, content: true },
  });

  const cache = new Map<string, string>([["general", general.id]]);
  const moved: Record<string, number> = {};
  let count = 0;

  for (const a of articles) {
    const target = classifyCategory(
      "general",
      a.title,
      a.excerpt ?? a.content ?? "",
    );
    if (target === "general") continue;
    const catId = await categoryIdFor(target, cache);
    await prisma.article.update({
      where: { id: a.id },
      data: { categoryId: catId },
    });
    moved[target] = (moved[target] ?? 0) + 1;
    count++;
  }

  console.log(
    `Reclassified ${count}/${articles.length} general articles:`,
    JSON.stringify(moved),
  );
}

run()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
