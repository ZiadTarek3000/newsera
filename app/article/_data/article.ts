/**
 * Placeholder content for the article (long-read) page. A real implementation
 * would load this per-slug from a CMS / news source.
 */

export const article = {
  badge: "Long Read / Analysis",
  title:
    "The Architecture of Silence: Why Minimalism is Reclaiming the Modern Workspace",
  source: "Architectural Digest",
  date: "Nov 14, 2024",
  dateTime: "2024-11-14",
  readTime: "12 Min Read",
  heroImage:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBeQERVjxgA-l3EkPpO3ZS-0lbFMZx-5pxgcS8EXT2QJkBTBT0E7ikc2ZyscdUQJic-7nyxdpwbPIkqN6BHMrfDY9KnU9nl9xICjLmFcXHroYXgP2K030Fobelg-UXXOByU969GitLwXT3YxYC5fz0jcQ3SU_npMcTu80-8iwaJz8aR0KhsJdbxmWx_fhvBSE6h8h3AIc396VGshnOGRU8peyvzxgjSArAVye47L8fscLyz61KnoVQxSZ-6HKSS-uIDEyVDyrOGoN4Q",
  heroAlt:
    "An expansive wide-angle shot of a minimalist concrete building against a clear pale blue sky at dawn, with clean horizontal lines and long elegant shadows.",
  takeaways: [
    "Minimalist architecture in workspaces increases sustained cognitive focus by up to 24%.",
    '"Subtractive architecture" aims to remove non-functional elements to reduce visual clutter.',
    "Tactile materials like natural stone and wood provide grounding contrast in modern designs.",
  ],
  lead: "In an era defined by constant digital notification and the cacophony of the information age, silence has become the ultimate luxury. The physical spaces we inhabit—once cluttered with the artifacts of industrial productivity—are undergoing a radical transformation. This is not merely a trend in interior design; it is a fundamental shift in how we perceive focus and intellectual clarity.",
  sectionHeading: "The Psychology of Empty Space",
  sectionBody:
    "Recent studies from the Zurich Institute of Urban Planning suggest that environments with reduced visual complexity lead to a 24% increase in sustained cognitive focus. When the eye is not forced to process extraneous details—shadowed moldings, vibrant color palettes, or stacked horizontal surfaces—the brain redirects its metabolic resources toward complex problem-solving.",
};

export type RelatedArticle = {
  category: string;
  title: string;
  excerpt: string;
  image: string;
  alt: string;
};

export const relatedArticles: RelatedArticle[] = [
  {
    category: "Analysis",
    title: "The Algorithms of Urban Flow",
    excerpt:
      "How AI is redesigning the traffic patterns of the world's most congested megacities.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCbSkHYIhjK3HhSbLJVJ_5fpcp4f4vc7QFXoqVcCQ9shL6-J1nZS3diFh1cOnckESFLEdOKWngKv9bsZE7sOuvrWh8GB5HYXW4BBpGAyv4O56YO57nhpIMrzNkL3TfF4ZmPg3nACFMuzvLmZcc8GMRft0biwfwKX3x2A1wQrr_1QWsKCicFnQilKaooqaEoH3lNziTVhnWNVClZehiLPiHrrofg8kYvHvOm5HvWjlfGNzYvZmi5lRELrNRM-e3y2nkmG1mmnD33dqvZ",
    alt: "A high-altitude nighttime view of a hyper-modern city grid illuminated by sapphire blue and silver lights.",
  },
  {
    category: "Culture",
    title: "The Return of the Analog Ritual",
    excerpt:
      "Why Gen Z is abandoning smartwatches for the ticking heart of mechanical horology.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD6UXHCkAsxE2XFLrPzNM5OQILU3SAe0pL9yP-bLBOIvhOzr8NsfjumMTiJ8JNShvVMXi7mgrChvRWxXk-5xev88lWJeZSvFEnr6MQPLoLlJhW2G3hiCe2sH79LpjZOU6QEe5DMhfI4CzgN5qomqOZcX9jKGW4wTSFYyrt_nAWDi0XzVLQEfv3mAhkj2IpMVqB9zHAv_tp0MOfMDclgbyu3jgWFLqBf2mlDATVN_utA47h2hxMimJRBggAqPDlZ_Ufxx89yCVDSmd9o",
    alt: "A macro close-up of a high-end mechanical watch movement revealing intricate gears and springs in brushed steel and gold.",
  },
  {
    category: "Latest",
    title: "The New Geography of Solitude",
    excerpt:
      "The rise of the high-tech hermit: Why the world's elite are moving off-grid.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCxKtSlR5kh6siDifZGUc4sIfOvZsi05T1F_80BmqXuo3ZYUEgEyeoL6581QC1yi_mi6MXkOHOdryaepSxdfcQmVTwbIzn5mz__xH6yylK0V2Wglwvf5M00WvIEAyOzhSvey6B2ArnzHuFiDZTp79j6sR4yAm03exqUTljAMA-fdk6Z4gmseUV0oi6fjuVf8Ew-FVo7H7ZtTZB_2Lnu9yiNj3wNxqeoC0-ENe7CF_4yILdI_20OZ53BDvHIHbwq9hJPMWKaaeKukqso",
    alt: "A serene minimalist landscape of a mountain range shrouded in morning mist with a single pine silhouette.",
  },
];

export type RecommendedArticle = {
  title: string;
  image: string;
};

export const recommendedArticles: RecommendedArticle[] = [
  {
    title: "The Future of Urban Quietude",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBeQERVjxgA-l3EkPpO3ZS-0lbFMZx-5pxgcS8EXT2QJkBTBT0E7ikc2ZyscdUQJic-7nyxdpwbPIkqN6BHMrfDY9KnU9nl9xICjLmFcXHroYXgP2K030Fobelg-UXXOByU969GitLwXT3YxYC5fz0jcQ3SU_npMcTu80-8iwaJz8aR0KhsJdbxmWx_fhvBSE6h8h3AIc396VGshnOGRU8peyvzxgjSArAVye47L8fscLyz61KnoVQxSZ-6HKSS-uIDEyVDyrOGoN4Q",
  },
  {
    title: "Designing for the Senses",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAYZITIxKczKckAn8XanPZNbZqtjKiBVKNpKAzK1J3SNgTxOI97QNIep4-h6nvi6RrpXwzrNsdtoMHdxpzSQ6zC7NJxmomesEdxTAkoQK2M1xbwHuVyY8ojcxfzb6kpTvroZqwhu_U8dnM4qH-bwMsUbNqZ3CCGpN01qD4wEWegiYz3Gve2-UnRRit67vBrq8DHONsDKdQiUbJwmMQ-QyuFnB_H4r8d0xCyb-SDKV0fIAUeMLIvtkEvA0qkfHo4HH-8RoCa0E0m7VnK",
  },
  {
    title: "The New Nordic Aesthetic",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCbSkHYIhjK3HhSbLJVJ_5fpcp4f4vc7QFXoqVcCQ9shL6-J1nZS3diFh1cOnckESFLEdOKWngKv9bsZE7sOuvrWh8GB5HYXW4BBpGAyv4O56YO57nhpIMrzNkL3TfF4ZmPg3nACFMuzvLmZcc8GMRft0biwfwKX3x2A1wQrr_1QWsKCicFnQilKaooqaEoH3lNziTVhnWNVClZehiLPiHrrofg8kYvHvOm5HvWjlfGNzYvZmi5lRELrNRM-e3y2nkmG1mmnD33dqvZ",
  },
];
