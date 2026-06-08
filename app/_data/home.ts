export type Article = {
  category: string;
  title: string;
  excerpt: string;
  source: string;
  date: string;
  image: string;
  alt: string;
};

export const heroArticle: Article = {
  category: "Top Headlines",
  title:
    "The Silent Architecture of Global Finance: A Decade of Invisible Shifts",
  excerpt:
    "Behind the frantic headlines of daily market fluctuations, a profound structural transformation is quietly redesigning how nations trade and store value.",
  source: "Financial Times",
  date: "Oct 24, 2023, 14:30 GMT",
  image:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBftjHQaEa81RndHy3o6y0_chbTGylHrl2t7XRbGQz_No5eMXaRo0pP611YenWXIIy99eHbilnwy45I7kbh6kWYzk96Wa3vo39gt2C6XRbOhQrLFH-mD8fSKESWNJwnB69mZLgj1z5T7aq4eSSDKbrapAA_uJ8spWCcZR0AuMQaMIfea1OuZaMBMRogDyiwCa53jL66v7ravaxfWw1w_H8tbqxA8NKMGu-DiadTkCd79ywLbTJGiJcDg9cVg7r7yriiMsRlQSFt_pM7",
  alt: "A low-angle architectural photograph of a modern glass skyscraper reflecting a clear blue sky and other urban structures, conveying the sophisticated atmosphere of a global financial hub.",
};

export const trendingArticles: Article[] = [
  {
    category: "Technology",
    title: "The Silicon Frontier: AI's Second Act",
    excerpt: "",
    source: "Wired",
    date: "2 hrs ago",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBLjWLLizLQx0KP5R2dwRw7YcXyTrOsr8EebDurCzfulisL5WdOnnB0xUM0G1610Q4JT9Rc7QKjElEQCJ4Km1vUs4rkAkM3JVmLrwvDk6UuxueLANPNx_Lxj8hPJ9oF9ERP6FVOPhvYv-iTEwGknlMw3pQSN5qOJr2LN9-15oIvwjo791uJcM-RJRDhKxg2DSz7OoiJoyS61dvAkLT0UMKMd3_SAJyih3i7RyG_U8BaldI-YO_I4uMQ7pJ5ka8r44uWw7hLR0oNlBq_",
    alt: "A sleek, modern workspace featuring high-end technology and a minimalist aesthetic with soft lighting.",
  },
  {
    category: "Science",
    title: "Rewilding the North: A Success Story",
    excerpt: "",
    source: "National Geographic",
    date: "4 hrs ago",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuChsiDmmkNCypA2V0ujSxZeK3XBS8sWW-Wp-vpurlzjry-kb7O-Gh5fm7yA2fJ8D5PaJRhShiYNy4d8KKz_s0DK8eUg6_VUv-FUgT8lfjl26upFlW_5szOFDT4kfvRuqm6--xF5bIjVMvTyKTJN_tugG-r1tFfBJXAnQA3GBdpW_ijPRjFiobdX5m1_6nvTlh6re1A5r7dP-rQiqD7dlPs_Vec84lSeUi_jdawMDMuUiYPIkr5A482D9PMEmmd1KiH81NFoVwYnlp3K",
    alt: "A lush, verdant forest seen from an aerial perspective, with sunlight filtering through the dense canopy.",
  },
  {
    category: "Entertainment",
    title: "The Return of the Grand Tour",
    excerpt: "",
    source: "Vanity Fair",
    date: "5 hrs ago",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCs2JEbFYtPy7FWpGQCVJG3CkGSNARZGMZrB9KCjffZ1p2cmMF40_Tf8umvNIuHp5nbHcOXZ1yiybnHlWNdai9fv82h0HB-sMOGIBIamaxkR0K_181NtTXJYS5rl5xzj0fW43sp-DrKx6nvLbWAheaGwpIhOulRB8Iz_ZjINp48yEdj-G_c8uQBS8uo0R7hoGX__na-Beb15JQdTkwA_8IYwoMdhYYYsUK1KDyv6NEH8AjGb36MuXss2VQt_GH2IBjQycYyNMnpS2dE",
    alt: "A sophisticated mountain retreat overlooking a tranquil alpine lake, with modern minimalist architecture.",
  },
  {
    category: "Business",
    title: "Predicting the Unpredictable: New Models",
    excerpt: "",
    source: "Bloomberg",
    date: "6 hrs ago",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBv0WpWXH6HMBpeuVP-TTR-qkiCMpWV40Nd4y1EBecsHp5jQr4xAv6drRS-kJrkeXRcxMmYZhveq2dDi4pZiw2krHna1Oxl5ggudxfxlnetSJKg9pm4YIgvMJuunQZSPuC2s_0oON9tYeDFuAySaoYikCv28fKC4qdqDU7APm32hmUCTubPy5oTamv1u6UpSiJ5OFaykuyJAxfQfKi4cDYhKbTrtwaKdKNSgkZoXV3UfOfd5yLPSiGW4E_bzT59trUNaj3fCeE7qNlD",
    alt: "A high-density data visualization displayed on a sleek, transparent glass screen within a dark, modern laboratory.",
  },
];

export const latestArticles: Article[] = [
  {
    category: "Science",
    title: "The Molecule of Memory: New Frontiers in Neuroscience",
    excerpt:
      "Researchers have identified a specific protein structure that may hold the key to long-term memory retrieval, opening doors for Alzheimer's treatment.",
    source: "Scientific American",
    date: "Oct 24, 2023",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCpm0FRIXNndjp7VwIrvN37Rduk8qbH35Aeo7M23lj4nmHHzru-5jLPzQFPGBXJpDFJKcpQonaagka0p2_aBXX7D5Xm9ByXgJ4cN9knyAYpUxR9_LgCyUWDmMki93qamPYg8gDccdz03-a3DATCF21pmdV08ks2YXiALqLpco1A5BtE5aAYMWtGRq010t_rwXAe3jq1TiXlWwNnis3mWP9RDEUzGH1Ls4oBDAOXbhC6jqHODDmDXwVABEmDblPFVqvhKym_43_X_yw-",
    alt: "A futuristic laboratory scene with a holographic projection of a molecular structure in cool blue ambient light.",
  },
  {
    category: "Entertainment",
    title: "The Quiet Room: Diplomacy Behind Closed Doors",
    excerpt:
      "A deep dive into the informal channels that prevented a major trade conflict in Northern Europe last winter.",
    source: "The Guardian",
    date: "Oct 24, 2023",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB5_h292Q9ANtDxXAIom38120LNXr_19Ti_SQ2ZGylSK7k3aco4pMZBFqwxBuT3Qz-yQiHPjwvmGiyQcJiY_t1EbqmkNnQm95_0q-84pWcyOrNMzLvyVG6pY_vKTWJjIV2s4hMpMOnSWPTcyBY6heh6g40va9E4haE1jUGy_BKGepv0KglI5HLzeI5XSZ_b0d9ibZuBPphRGoCGkrQfgLr2ipqRGfEkKjRLvPdFKq-bAoklQown-SXnrLfi7ndeCenIt1yV7EROzF5L",
    alt: "An elegant, dimly lit jazz club with a saxophone player in soft focus, warm amber lighting on polished wood and brass.",
  },
  {
    category: "Technology",
    title: "Is the Code Dead? The Rise of Generative Engineering",
    excerpt:
      "As AI begins to write more software than humans, we examine what it means for the future of the engineering profession.",
    source: "TechCrunch",
    date: "Oct 23, 2023",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDNoLRcF7Il_L-g84Rj5unKfN7EBiZLiUAcq_dHtZRRpk1kK61FSV88IFML3OBN-lH7YRFKYoNkeLh1W2mJ4AWtn7aBYeGM7f_OiUbnt8RCdQkALgfNL_IKyFd7tkF-dcvBfdh1iPvhVHTZy3xLWpI41raBwAwrPDVaBdFx8qrTIpplDZURQIVxVJOPXcEs7VCIFTpBtgd9MtMkHXsedo4Cb1IEcNhNPHBauhl9KrJwr_HAuu5q7NOKM3nAGp1R-WLP-AYUA8O7Vgn-",
    alt: "A minimalist tech office with an open laptop displaying complex code, clean architectural lines and soft natural light.",
  },
  {
    category: "Health",
    title: "The Value of Stillness in an Accelerated World",
    excerpt:
      "Why modern leaders are turning to stoic principles and silent retreats to manage the pressures of high-stakes decision making.",
    source: "The Atlantic",
    date: "Oct 23, 2023",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDleTQQFTmiOtmofqFrmIDFhvWzGaM3QMxEIbkUcpiubOOk8dLZORYa5_zfrCNjGE8KoBFNM8Xyq5ifHyRhjeq8B75UM614ivyEOFNz1V3skQiKPBUuhi7EL6wnKIXL-w05uYb6U0YG7F_olav3BLkP0PNLaFYGPaHY42YDkxjzUGW132oO5Fq2mVJ-gSEj9uXV11jRVk4yDu_Q3wo1AeC_SxGntdDiNtlhJ5CZZlGaqzGGbI3yxzycgGlzHohzBqU3xsryJWz2ef_f",
    alt: "A serene still lake at dawn reflecting a soft pastel sky and distant hazy mountains, minimalist and calm.",
  },
  {
    category: "Entertainment",
    title: "Brutalism's Second Spring: The New Aesthetic",
    excerpt:
      "How the once-hated architectural style is finding new life in sustainable urban planning and interior design across Europe.",
    source: "Vogue",
    date: "Oct 22, 2023",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBqypJawNenlMyGG3F-Bbj_lJZexcysIipiMabsJwaJtHWPFYjVDCI4oT7N-mUwtlXAFLwaOz826AGrjLd6OOsfBHrSl1E62AfTz9CdO1Yb9KFVyICvezOCNkErQfny2_cKeai1s9H6CX6zcEaMlT0xpW78KZHQOU0iQHsHYlu787PXB6YnFLiU0XOp6UvDpPdWtjFSHB-KE5jV1Qy3cELcsBFtp2RBBPFZzatN_GTUJ8wI8idQlGdmEf6yCtT-aShnL_4x-sUhrvEn",
    alt: "A high-fashion editorial shot of a model in an avant-garde outfit against a stark brutalist concrete wall.",
  },
  {
    category: "Business",
    title: "The Interest Trap: Navigating the New Normal",
    excerpt:
      "With central banks holding steady, investors are forced to rethink long-term strategies for a high-rate environment.",
    source: "Wall Street Journal",
    date: "Oct 22, 2023",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDi9FUGMR-z9cDwRGc_WiRU3dD5dQc1dupfJpWg0LTITH6i9c07V592RrMyJEoifo-4snip-0c8n2xQvtSJV7h1nJI9pI6YmA0YI5loGGF19CPALzwaj__Zv7DsPTMf1Z4wPF57xjsHpZAhUfZUW4efRs1qX0d0rIJDhtj5rBGpEmxfs3NlLAvwzZrsQ07RSDsw6dElEx03vOMas-isw-KCr4VxDBQFoUOxB1fOrVLRUUgDRLXRbazEYNciMUYp8Ritth3nOKpqTtgI",
    alt: "A traditional financial ledger book next to a modern tablet displaying stock graphs, in a prestigious old-world library.",
  },
];

export type BriefItem = {
  title: string;
  source: string;
  date: string;
  excerpt: string;
};

export const businessBriefs: BriefItem[] = [
  {
    title: "The Midterm Shift: Demographic Realignments",
    source: "CNBC",
    date: "Oct 24, 2023",
    excerpt:
      "A statistical analysis of the changing voter blocs that are reshaping the electoral map in suburban districts.",
  },
  {
    title: "Sovereign Debt and the New Geopolitics",
    source: "Financial Times",
    date: "Oct 23, 2023",
    excerpt:
      "How emerging economies are leveraging debt restructuring to forge new strategic alliances.",
  },
  {
    title: "The Digital Polis: Democracy in the Age of Algorithms",
    source: "Reuters",
    date: "Oct 22, 2023",
    excerpt:
      "Regulating the invisible hands that guide public opinion and political discourse.",
  },
];

export const analysisFeature: Article = {
  category: "Technology",
  title: "The Global Grid: Mapping Tomorrow's Energy Infrastructure",
  excerpt:
    "An exclusive report on the multinational consortium building a unified energy network across three continents, and the political hurdles they face.",
  source: "The Verge",
  date: "Oct 24, 2023",
  image:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBZuc8hZ1UpOZCk4YuOjPfkbnuohRjHex3LJPVjXyqwZ1gBhA10u-_1WH9qYtTSkvxsivT901b5_5EeYOZjbEPV85gDBT3BUtC-G5u4y52-Kqk8dsK9m5tEjRSVjvPLsJFtS9GEq1ehUuaD8VZV2IeHj70N10HR8EdHUx-gZnlLJcJPHgVzPixBjDKVHmFQDNKyeP_Ta4rWDzDbF6-jRhtb2fMdk_TJZsp3UchxdG3LEqAdEja9QfTXWufcqtOuNQCIDINAoqA0aKJz",
  alt: "A satellite view of Earth at night showing interconnected networks of city lights across continents.",
};
