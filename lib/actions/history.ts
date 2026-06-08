"use server";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/dal";

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
