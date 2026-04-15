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
  pdfUrl: string;
  price: number;
  isPurchased?: boolean;
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

export interface DesignConfig {
  bgColor: string;
  textColor: string;
  fontFamily: string;
  accentColor: string;
  borderStyle?: string;
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
