"use server";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/dal";

/**
 * Records an article view: bumps the view counter for everyone, and upserts a
 * reading-history entry for signed-in users.
 */
export async function recordView(articleId: string, progress = 0) {
  await prisma.article
    .update({ where: { id: articleId }, data: { views: { increment: 1 } } })
    .catch(() => {});

  const user = await getCurrentUser();
  if (!user) return;

  await prisma.readingHistory
    .upsert({
      where: { userId_articleId: { userId: user.id, articleId } },
      update: { viewedAt: new Date(), progress },
      create: { userId: user.id, articleId, progress },
    })
    .catch(() => {});
}
