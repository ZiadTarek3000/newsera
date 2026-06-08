import { prisma } from "@/lib/db";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const revalidate = 900;

function escapeXml(value: string) {
  return value.replace(
    /[<>&'"]/g,
    (c) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        "'": "&apos;",
        '"': "&quot;",
      })[c] ?? c,
  );
}

export async function GET() {
  let articles: Array<{
    title: string;
    slug: string;
    excerpt: string | null;
    publishedAt: Date | null;
  }> = [];
  try {
    articles = await prisma.article.findMany({
      orderBy: { publishedAt: "desc" },
      take: 20,
      select: { title: true, slug: true, excerpt: true, publishedAt: true },
    });
  } catch {
    // degrade to an empty feed if the DB is unavailable
  }

  const items = articles
    .map((a) => {
      const link = `${SITE}/article/${a.slug}`;
      return `    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${link}</link>
      <guid>${link}</guid>
      <description>${escapeXml(a.excerpt ?? "")}</description>${
        a.publishedAt
          ? `\n      <pubDate>${a.publishedAt.toUTCString()}</pubDate>`
          : ""
      }
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Newsera</title>
    <link>${SITE}</link>
    <description>The latest headlines from Newsera.</description>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
