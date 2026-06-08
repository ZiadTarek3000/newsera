"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/dal";

async function ensurePreferences(userId: string) {
  return prisma.userPreferences.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });
}

export async function setTopicInterest(categorySlug: string, enabled: boolean) {
  const user = await getCurrentUser();
  if (!user) return;

  const prefs = await ensurePreferences(user.id);
  const set = new Set(prefs.favoriteCategories);
  if (enabled) set.add(categorySlug);
  else set.delete(categorySlug);

  await prisma.userPreferences.update({
    where: { userId: user.id },
    data: { favoriteCategories: [...set] },
  });
  revalidatePath("/dashboard");
}

export async function setDailyBriefing(enabled: boolean) {
  const user = await getCurrentUser();
  if (!user) return;
  await prisma.userPreferences.upsert({
    where: { userId: user.id },
    update: { dailyBriefing: enabled },
    create: { userId: user.id, dailyBriefing: enabled },
  });
  revalidatePath("/dashboard");
}

export async function setThemePreference(theme: string) {
  const user = await getCurrentUser();
  if (!user) return;
  await prisma.userPreferences.upsert({
    where: { userId: user.id },
    update: { theme },
    create: { userId: user.id, theme },
  });
}
