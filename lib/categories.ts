/**
 * Canonical headline categories for the whole application. This is the single
 * source of truth for the top-navigation bar on every page, the category
 * section pages (`/category/[slug]`), and the keyword classifier used when
 * ingesting API articles. Slugs match the Currents sync categories so the
 * primary (API) data populates them directly.
 */
export type NavCategory = { label: string; slug: string; description: string };

export const NAV_CATEGORIES: NavCategory[] = [
  {
    label: "World",
    slug: "world",
    description:
      "Global affairs, diplomacy, and the stories shaping nations across every continent.",
  },
  {
    label: "Business",
    slug: "business",
    description:
      "Markets, economies, and the companies and decisions driving the global financial landscape.",
  },
  {
    label: "Technology",
    slug: "technology",
    description:
      "Breakthroughs, products, and the people redefining how the world builds and connects.",
  },
  {
    label: "Science",
    slug: "science",
    description:
      "Discovery and research from the frontiers of space, biology, climate, and beyond.",
  },
  {
    label: "Health",
    slug: "health",
    description:
      "Medicine, wellbeing, and the science of living longer, healthier lives.",
  },
  {
    label: "Sports",
    slug: "sports",
    description:
      "Results, rivalries, and the defining moments from competition around the world.",
  },
];

/** The home link, shown first in the nav and representing "all headlines". */
export const HOME_NAV: Pick<NavCategory, "label" | "slug"> = {
  label: "Top Headlines",
  slug: "",
};

const BY_SLUG = new Map(NAV_CATEGORIES.map((c) => [c.slug, c]));

export function isNavCategory(slug: string): boolean {
  return BY_SLUG.has(slug);
}

export function categoryLabel(slug: string): string | undefined {
  return BY_SLUG.get(slug)?.label;
}

export function categoryDescription(slug: string): string {
  return (
    BY_SLUG.get(slug)?.description ??
    "The latest reporting and analysis on this topic, updated throughout the day."
  );
}
