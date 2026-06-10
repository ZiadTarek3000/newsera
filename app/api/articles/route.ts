import { NextResponse, type NextRequest } from "next/server";
import { getArticlesPage } from "@/lib/data/articles";

export const runtime = "nodejs";

// Public, read-only feed endpoint backing category filtering, search, and the
// "Load More" button. Always reflects the current data, so it must not cache.
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;

  const category = params.get("category") ?? undefined;
  const query = params.get("q") ?? undefined;
  const excludeId = params.get("exclude") ?? undefined;
  const offset = Number.parseInt(params.get("offset") ?? "0", 10);
  const limit = Number.parseInt(params.get("limit") ?? "6", 10);

  const page = await getArticlesPage({
    categorySlug: category,
    query,
    excludeId,
    offset: Number.isNaN(offset) ? 0 : offset,
    limit: Number.isNaN(limit) ? 6 : limit,
  });

  return NextResponse.json(page, {
    headers: {
      // Public article data changes slowly; let the CDN/browser serve repeat
      // "Load More" and filter requests from cache while revalidating.
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
