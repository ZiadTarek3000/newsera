export type SavedArticle = {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  image: string;
  alt: string;
};

export const savedArticles: SavedArticle[] = [
  {
    id: "semiconductor-sovereignty",
    category: "Analysis",
    title: "The Geopolitics of Semi-Conductor Sovereignty",
    excerpt:
      "How nations are racing to secure silicon supply chains in a fracturing global economy.",
    readTime: "12 Min Read",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA40HUcNfR3_MoOokF7zYcup-fDjKZ02PhdVLBG_2u0b3YCTVj4IKjBhWh-aWN6Xh5pNRQ-3IZ1y4zRSAd5Dd4G6Rr2Z4uN13fXfTADWdJc15rmPoSa4ZCiJk4sarpIsXrU-_a-4acr_pgETwgSyZEQ6p1lTqhcSxOmYNpVmB4XvuBHVoKrKzySMvFiF9dK0-ztK4MOy-HWlyGIvAW8Q-ZSG58Neb7Wubuz5_st2oY5X7CQEKR70yuWScbrNPdjJ4BmwyEdquIAvkjy",
    alt: "An artistic high-angle shot of a sleek, modern architectural building with sharp lines and glass panels reflecting a soft blue sky.",
  },
  {
    id: "algorithmic-governance",
    category: "Technology",
    title: "The Architecture of Algorithmic Governance",
    excerpt:
      "Exploring the invisible structures that manage our digital interactions and civic duties.",
    readTime: "15 Min Read",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD8a19-yHO0dt5W_A3UDPFKQuSYa8iL5UxKV_YyGcaZlx3BVq-iV4Wi9nucn23kFD9hwBw7qS2cEQP3_8mNENrIYM4r-rqACPdYmIgaAeE7yAy0D4xRwQ-9YOHNuzq7ZgfhVCXLGcXbM0-ACS6ms6iT_y0u0ZGQIn27OAeU-TNJbqzfNJfqdL55SW780WKHEAuhYkfSN2EXEgg5xYqS4ZJt644I6JSjqtMCudOrTG78q1m_HRqgtGTjmvFtMiBMzM9HNScbKl8z6End",
    alt: "A minimalist digital-focused workspace with high-end electronic components and retro-futuristic monitors displaying data visualizations.",
  },
];

export type HistoryEntry = {
  title: string;
  timestamp: string;
  detail: string;
  status: "reading" | "finished";
};

export const readingHistory: HistoryEntry[] = [
  {
    title: "The Renaissance of High-Speed Rail",
    timestamp: "Today • 10:45 AM",
    detail: "Read for 4 minutes • 60% completion",
    status: "reading",
  },
  {
    title: "Modernism and its Discontents",
    timestamp: "Yesterday • 6:20 PM",
    detail: "Finished Reading • Editorial Category",
    status: "finished",
  },
  {
    title: "The Future of Urban Farming",
    timestamp: "Yesterday • 9:15 AM",
    detail: "Finished Reading • Global Trends",
    status: "finished",
  },
];

export type SuggestedArticle = {
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  image: string;
  alt: string;
};

export const suggestedArticles: SuggestedArticle[] = [
  {
    category: "Economy",
    title: "Inflation Markets Re-Evaluated",
    excerpt:
      "A deep look into how global markets are adjusting to new economic realities.",
    readTime: "8 Min Read",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBEvHyPBov6p8uvMIZA6auWa0W_YvKC-pDiriYTPpDikWpLb8RtLfhEo-NyH9kV608ewNnQwvWZnUL8qILKSBFkX049lOmXG_6eCAvPPkhQqhs2Wp1M0Cw4KQyFn0pYJxBadVpPtDWyfRKE1n2NCVA5wBzS0B_yTTxsLEoOZPIu1zC2D0NoxUae4x8wST6gXS8t5jjpJ0umvK1feyYwp4o-_KOcUAVwTrMZWUDVLh31Qq6ZT5nswo9fLOWx1PJMYq9GJqHupSiulIp6",
    alt: "An editorial photograph representing global economic trends.",
  },
  {
    category: "Culture",
    title: "The Brutalist Revival",
    excerpt:
      "Why concrete behemoths of the past are finding new love in modern urban planning.",
    readTime: "10 Min Read",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAFKn0Av2HRZyTRVg3sg5j-hmy6YwPQKe0wJATE_46cTQC-_Leec9a8V6IWeuzo_xiflix-NsFBeghrwPTaatdwamegyG5ztai6infRbUr98SYycFcaTUMoJ-CsJD4fFHtvGlNvugWmVBbb4NDu__ie6vcvjjjxXN_YxN1-aGin3pV78W64cvePUzA81wzUbkyYNKmAKcQa32oQfRgm7SxVOY4lC5OlmeBeDAdoLuZ9j9-2ItiBbz7YN3_OhJIqVT5uysz-8GHh3S52",
    alt: "A photograph of brutalist concrete architecture in a modern urban setting.",
  },
  {
    category: "Technology",
    title: "Beyond the Cloud",
    excerpt:
      "The next generation of decentralized infrastructure and what it means for data ownership.",
    readTime: "14 Min Read",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBrnSEROTm5J31TH9WA6gM25nc2EAPU2rWEPk9zMC5-qWRWIM540eCgjTy775Vpx4Hw0mA32LYre8NtBfJ7jKw0r3cdJPRbPn6kofq6bOi5ZYLIF_En8SH0KZF0Ubvf6_9oG7J9luaPoamFo-23_9FqBBMZuNmUq5pmWKwb3o_UbmVEaxRdk-izktLybyWILdCbxu6BIFs2VQ73pXzATc3OLXZ0vrgIrVTQ793uXhVZxdLTzwH4FAkdP0IjDsCUemQt-7cnTKygVJvg",
    alt: "A moody photograph of advanced technology infrastructure with blue and white glows.",
  },
];
