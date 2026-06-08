import { NextResponse, type NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth/dal";
import { prisma } from "@/lib/db";
import { hasNews } from "@/lib/env";
import { fetchCategory, type CurrentsCategory } from "@/lib/api/currents";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

const SYNC_CATEGORIES: CurrentsCategory[] = [
  "general",
  "world",
  "business",
  "technology",
  "science",
  "health",
  "entertainment",
  "sports",
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function ingest() {
  let upserts = 0;
  const errors: string[] = [];

  for (const category of SYNC_CATEGORIES) {
    try {
      await sleep(300);
      const articles = await fetchCategory(category, 10);
      const cat = await prisma.category.upsert({
        where: { slug: category },
        update: {},
        create: {
          name: category.charAt(0).toUpperCase() + category.slice(1),
          slug: category,
        },
      });

      for (const a of articles) {
        try {
          await prisma.article.upsert({
            where: { externalId: a.externalId },
            update: {
              title: a.title,
              excerpt: a.excerpt,
              content: a.content,
              url: a.url,
              imageUrl: a.imageUrl,
              publishedAt: a.publishedAt,
              author: a.author,
              source: a.source,
              categoryId: cat.id,
            },
            create: {
              externalId: a.externalId,
              slug: a.slug,
              title: a.title,
              excerpt: a.excerpt,
              content: a.content,
              url: a.url,
              imageUrl: a.imageUrl,
              publishedAt: a.publishedAt,
              author: a.author,
              source: a.source,
              categoryId: cat.id,
            },
          });
          upserts++;
        } catch {
        }
      }
    } catch (error) {
      errors.push(`${category}: ${(error as Error).message}`);
    }
  }

  return { upserts, errors };
}

async function runSync() {
  if (!hasNews) {
    return NextResponse.json(
      { error: "CURRENTS_API_KEY is not configured." },
      { status: 400 },
    );
  }
  const { upserts, errors } = await ingest();
  return NextResponse.json({ ok: true, upserts, errors });
}

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "CRON_SECRET is not configured." },
      { status: 503 },
    );
  }
  if (req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return runSync();
}

export async function POST() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return runSync();
}
