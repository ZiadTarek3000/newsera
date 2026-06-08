"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/dal";

export async function getMyBookmarkIds(): Promise<string[]> {
  const user = await getCurrentUser();
  if (!user) return [];
  const rows = await prisma.bookmark.findMany({
    where: { userId: user.id },
    select: { articleId: true },
  });
  return rows.map((r) => r.articleId);
}

type ToggleResult = { bookmarked: boolean } | { error: "unauthorized" };

export async function toggleBookmark(articleId: string): Promise<ToggleResult> {
  const user = await getCurrentUser();
  if (!user) return { error: "unauthorized" };

  const existing = await prisma.bookmark.findUnique({
    where: { userId_articleId: { userId: user.id, articleId } },
  });

  if (existing) {
    await prisma.bookmark.delete({ where: { id: existing.id } });
    revalidatePath("/dashboard");
    return { bookmarked: false };
  }

  await prisma.bookmark.create({ data: { userId: user.id, articleId } });
  revalidatePath("/dashboard");
  return { bookmarked: true };
}
