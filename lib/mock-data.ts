import type {
  WPPost,
  WPMagazine,
  WPProduct,
  DesignConfig,
} from "@/types";

// ================================
// Mock Magazine Data
// ================================

export const mockMagazines: WPMagazine[] = [
  {
    id: "1",
    title: "Ahlan Issue #12",
    slug: "ahlan-issue-12",
    coverImage: "/mock/magazine-1.jpg",
    description:
      "Exploring the beauty of Islamic architecture across the modern world.",
    issueNumber: "12",
    publishDate: "2026-04-01",
    pdfUrl: "/mock/magazine-12.pdf",
    price: 4.99,
    pageCount: 48,
    contentType: "official",
  },
  {
    id: "2",
    title: "Ahlan Issue #11",
    slug: "ahlan-issue-11",
    coverImage: "/mock/magazine-2.jpg",
    description: "A deep dive into contemporary Muslim fashion and identity.",
    issueNumber: "11",
    publishDate: "2026-03-01",
    pdfUrl: "/mock/magazine-11.pdf",
    price: 4.99,
    pageCount: 44,
    contentType: "official",
  },
  {
    id: "3",
    title: "Ahlan Issue #10",
    slug: "ahlan-issue-10",
    coverImage: "/mock/magazine-3.jpg",
    description:
      "Stories of innovation from Muslim entrepreneurs around the globe.",
    issueNumber: "10",
    publishDate: "2026-02-01",
    pdfUrl: "/mock/magazine-10.pdf",
    price: 3.99,
    pageCount: 40,
    contentType: "official",
  },
  {
    id: "4",
    title: "Ahlan Issue #9",
    slug: "ahlan-issue-9",
    coverImage: "/mock/magazine-4.jpg",
    description:
      "Celebrating calligraphy: the timeless art form that bridges tradition and modernity.",
    issueNumber: "9",
    publishDate: "2026-01-01",
    pdfUrl: "/mock/magazine-09.pdf",
    price: 3.99,
    pageCount: 36,
    contentType: "official",
  },
  {
    id: "5",
    title: "Ahlan Issue #8",
    slug: "ahlan-issue-8",
    coverImage: "/mock/magazine-5.jpg",
    description:
      "The rise of halal travel — destinations that cater to the modern Muslim explorer.",
    issueNumber: "8",
    publishDate: "2025-12-01",
    pdfUrl: "/mock/magazine-08.pdf",
    price: 3.99,
    pageCount: 36,
    contentType: "official",
  },
  {
    id: "6",
    title: "Ahlan Issue #7",
    slug: "ahlan-issue-7",
    coverImage: "/mock/magazine-6.jpg",
    description:
      "How technology is transforming Islamic education in the 21st century.",
    issueNumber: "7",
    publishDate: "2025-11-01",
    pdfUrl: "/mock/magazine-07.pdf",
    price: 3.99,
    pageCount: 32,
    contentType: "official",
  },
];

// ================================
// Mock Blog Posts
// ================================

const defaultDesignConfig: DesignConfig = {
  bgColor: "#faf6f0",
  textColor: "#2d3436",
  primaryFont: "serif",
  decorationType: "minimal",
  accentColor: "#0a5c36",
};

export const mockPosts: WPPost[] = [
  {
    id: "1",
    slug: "beauty-of-islamic-geometry",
    title: "The Infinite Beauty of Islamic Geometry",
    excerpt:
      "Exploring the mathematical precision and spiritual depth behind Islamic geometric patterns that have inspired artists for centuries.",
    content: `<p>Islamic geometric patterns are one of the most recognizable visual expressions of Islamic art and architecture. These intricate designs are built upon simple geometric forms — circles, squares, and polygons — arranged in complex combinations to create mesmerizing patterns of infinite variety.</p>
<h2>The Spiritual Dimension</h2>
<p>For Muslim artists, geometric patterns served as a way to explore and express the infinite nature of God. The repeating patterns suggest the infinite reach of the divine, while their mathematical precision reflects the order inherent in creation.</p>
<p>Each pattern begins from a single point — a metaphor for the unity of God (Tawhid) — and expands outward into complex, interlocking designs that can, in theory, extend infinitely in all directions.</p>
<h2>Mathematical Foundations</h2>
<p>The beauty of Islamic geometry lies in its mathematical sophistication. Artists used compasses and straightedges to construct their designs, employing principles that Western mathematicians would not formally describe for centuries.</p>`,
    date: "2026-04-10",
    featuredImage: {
      url: "/mock/blog-1.jpg",
      alt: "Islamic geometric patterns",
      width: 1200,
      height: 800,
    },
    author: {
      name: "Fatima Al-Rashid",
      avatar: "/mock/avatar-1.jpg",
    },
    categories: ["Art", "Culture"],
    designConfig: defaultDesignConfig,
  },
  {
    id: "2",
    slug: "modern-muslim-fashion",
    title: "Redefining Modesty: Modern Muslim Fashion",
    excerpt:
      "How a new generation of designers is reshaping the modest fashion industry with innovation and cultural pride.",
    content:
      "<p>The modest fashion industry has grown into a global force, valued at hundreds of billions of dollars. A new wave of Muslim designers is leading this transformation.</p>",
    date: "2026-04-05",
    featuredImage: {
      url: "/mock/blog-2.jpg",
      alt: "Modern Muslim fashion",
      width: 1200,
      height: 800,
    },
    author: {
      name: "Yusuf Ibrahim",
      avatar: "/mock/avatar-2.jpg",
    },
    categories: ["Fashion", "Lifestyle"],
    designConfig: {
      bgColor: "#f3e5f5",
      textColor: "#2d3436",
      primaryFont: "serif",
      decorationType: "vintage",
      accentColor: "#6c5ce7",
    },
  },
  {
    id: "3",
    slug: "halal-food-revolution",
    title: "The Global Halal Food Revolution",
    excerpt:
      "From street food stalls to Michelin-starred restaurants, halal cuisine is experiencing unprecedented global recognition.",
    content:
      "<p>Halal food has transcended its traditional boundaries to become a significant global culinary force. The industry is now worth over $2 trillion.</p>",
    date: "2026-03-28",
    featuredImage: {
      url: "/mock/blog-3.jpg",
      alt: "Halal cuisine spread",
      width: 1200,
      height: 800,
    },
    author: {
      name: "Amira Hassan",
      avatar: "/mock/avatar-3.jpg",
    },
    categories: ["Food", "Culture"],
    designConfig: {
      bgColor: "#fff8e1",
      textColor: "#3e2723",
      primaryFont: "sans",
      decorationType: "modern",
      accentColor: "#f57c00",
    },
  },
  {
    id: "4",
    slug: "islamic-architecture-today",
    title: "Islamic Architecture in the 21st Century",
    excerpt:
      "How contemporary architects are weaving traditional Islamic motifs into futuristic buildings that define city skylines.",
    content:
      "<p>Modern Islamic architecture is a fascinating blend of tradition and innovation. From the grandeur of mosques to cutting-edge museums, architects are pushing boundaries.</p>",
    date: "2026-03-20",
    featuredImage: {
      url: "/mock/blog-4.jpg",
      alt: "Modern mosque architecture",
      width: 1200,
      height: 800,
    },
    author: {
      name: "Omar Khalid",
      avatar: "/mock/avatar-1.jpg",
    },
    categories: ["Architecture", "Design"],
    designConfig: {
      bgColor: "#e8f5e9",
      textColor: "#1b5e20",
      primaryFont: "serif",
      decorationType: "classic",
      accentColor: "#2e7d32",
    },
  },
  {
    id: "5",
    slug: "digital-quran-apps",
    title: "Digital Quran: Apps Transforming Islamic Learning",
    excerpt:
      "A look at how mobile technology is making Quran study more accessible and interactive than ever before.",
    content:
      "<p>Technology has revolutionized how millions of Muslims interact with the Quran. From AI-powered tajweed correction to gamified memorization platforms.</p>",
    date: "2026-03-15",
    featuredImage: {
      url: "/mock/blog-5.jpg",
      alt: "Digital Quran apps",
      width: 1200,
      height: 800,
    },
    author: {
      name: "Layla Nur",
      avatar: "/mock/avatar-2.jpg",
    },
    categories: ["Technology", "Education"],
    designConfig: defaultDesignConfig,
  },
  {
    id: "6",
    slug: "muslim-travel-destinations",
    title: "Hidden Gems: Muslim-Friendly Travel Destinations",
    excerpt:
      "Discover breathtaking destinations that welcome Muslim travelers with open arms, halal food, and prayer facilities.",
    content:
      "<p>The halal tourism sector is booming. More destinations worldwide are recognizing the value of catering to Muslim travelers.</p>",
    date: "2026-03-08",
    featuredImage: {
      url: "/mock/blog-6.jpg",
      alt: "Travel destinations",
      width: 1200,
      height: 800,
    },
    author: {
      name: "Tariq Mansour",
      avatar: "/mock/avatar-3.jpg",
    },
    categories: ["Travel", "Lifestyle"],
    designConfig: {
      bgColor: "#e0f7fa",
      textColor: "#004d40",
      primaryFont: "sans",
      decorationType: "modern",
      accentColor: "#00897b",
    },
  },
];

// ================================
// Mock Merchandise
// ================================

export const mockProducts: WPProduct[] = [
  {
    id: "1",
    name: "Ahlan Signature Tee",
    slug: "ahlan-signature-tee",
    price: 29.99,
    image: "/mock/merch-1.jpg",
    description: "Premium cotton tee with embossed Ahlan calligraphy.",
    category: "Apparel",
  },
  {
    id: "2",
    name: "Geometric Art Print",
    slug: "geometric-art-print",
    price: 49.99,
    image: "/mock/merch-2.jpg",
    description:
      "Museum-quality giclée print of Islamic geometric patterns. 18×24 inches.",
    category: "Art",
  },
  {
    id: "3",
    name: "Ahlan Tote Bag",
    slug: "ahlan-tote-bag",
    price: 19.99,
    image: "/mock/merch-3.jpg",
    description: "Eco-friendly canvas tote with minimalist Ahlan branding.",
    category: "Accessories",
  },
  {
    id: "4",
    name: "Calligraphy Notebook",
    slug: "calligraphy-notebook",
    price: 14.99,
    image: "/mock/merch-4.jpg",
    description:
      "Handcrafted journal with Arabic calligraphy cover. 200 dot-grid pages.",
    category: "Stationery",
  },
];
