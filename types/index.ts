// ================================
// WordPress / CMS Data Types
// ================================

export interface WPPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  featuredImage: WPMediaItem | null;
  author: WPAuthor;
  categories: string[];
  designConfig?: DesignConfig;
}

export interface WPMagazine {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  description: string;
  issueNumber: string;
  publishDate: string;
  /** URL from ACF field `magazine_pdf` (File type) — the PDF e-book source */
  pdfUrl: string;
  /** Media item ID for the PDF in WordPress (used for secure blob fetching) */
  pdfMediaId?: string;
  price: number;
  pageCount?: number;
  isPurchased?: boolean;
  /**
   * Content type discriminator:
   * - "official"  → PDF e-book, opens in Secure PDF Viewer
   * - "fan-made"  → Text-based article, opens in ThemeWrapper Design Engine
   */
  contentType: "official" | "fan-made";
}

export interface WPMediaItem {
  url: string;
  alt: string;
  width: number;
  height: number;
}

export interface WPAuthor {
  name: string;
  avatar: string;
  bio?: string;
}

export interface WPProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

// ================================
// Design Engine (ACF / Fan-Writer)
// ================================

/** ACF field group: "Design Config" — drives per-article visual theming */
export interface DesignConfig {
  /** Background color for the article page (hex) */
  bgColor: string;
  /** Primary text color (hex) */
  textColor: string;
  /** Font selection: "serif" | "sans" | "mono" */
  primaryFont: string;
  /** Visual decoration style: "vintage" | "modern" | "minimal" | "classic" */
  decorationType: string;
  /** Accent color for headings, links, borders (hex). Derived from bgColor if absent. */
  accentColor?: string;
}

/** Shape of the raw ACF response from WPGraphQL */
export interface WPDesignConfigRaw {
  bgColor: string | null;
  textColor: string | null;
  primaryFont: string | null;
  decorationType: string | null;
}

// ================================
// Auth Types
// ================================

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

// ================================
// UI Types
// ================================

export interface NavLink {
  label: string;
  href: string;
  sectionId: string;
}

export type ModalView = "login" | "register";
