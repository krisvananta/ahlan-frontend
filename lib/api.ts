/**
 * WordPress GraphQL API Utility
 *
 * Fetches data from a WPGraphQL + ACF backend.
 * Falls back to mock data when the WordPress backend is unreachable.
 */

import type {
  WPPost,
  WPMagazine,
  WPProduct,
  DesignConfig,
  WPDesignConfigRaw,
} from "@/types";
import { mockPosts, mockMagazines, mockProducts } from "./mock-data";

// ================================
// Configuration
// ================================

const WP_GRAPHQL_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL ||
  "http://ahlan-backend.local/graphql";

/** Set to true to always use mock data (for local dev without WP) */
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

// ================================
// Error Handling
// ================================

export class WordPressError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public graphqlErrors?: Array<{ message: string }>,
  ) {
    super(message);
    this.name = "WordPressError";
  }
}

// ================================
// Core GraphQL Fetch
// ================================

/**
 * Generic GraphQL query function for WordPress.
 * Designed for use in Server Components — credentials stay on the server.
 *
 * @param query   - GraphQL query string
 * @param variables - Optional query variables
 * @param revalidate - Cache revalidation time in seconds (default: 60)
 */
export async function wpQuery<T>(
  query: string,
  variables?: Record<string, unknown>,
  revalidate: number = 60,
): Promise<T> {
  const res = await fetch(WP_GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate },
  });

  if (!res.ok) {
    throw new WordPressError(
      `WordPress API returned ${res.status}: ${res.statusText}`,
      res.status,
    );
  }

  const json = await res.json();

  if (json.errors?.length) {
    throw new WordPressError(
      `GraphQL Error: ${json.errors[0].message}`,
      undefined,
      json.errors,
    );
  }

  return json.data as T;
}

// ================================
// ACF Design Config Normalizer
// ================================

/** Default config when ACF fields are empty/null */
const DEFAULT_DESIGN_CONFIG: DesignConfig = {
  bgColor: "#faf6f0",
  textColor: "#2d3436",
  primaryFont: "serif",
  decorationType: "minimal",
  accentColor: "#0a5c36",
};

/**
 * Normalizes the raw ACF designConfig response into a safe DesignConfig.
 * Handles null fields, empty strings, and provides sensible defaults.
 */
function normalizeDesignConfig(
  raw: WPDesignConfigRaw | null | undefined,
): DesignConfig {
  if (!raw) return DEFAULT_DESIGN_CONFIG;

  return {
    bgColor: raw.bgColor?.trim() || DEFAULT_DESIGN_CONFIG.bgColor,
    textColor: raw.textColor?.trim() || DEFAULT_DESIGN_CONFIG.textColor,
    primaryFont: raw.primaryFont?.trim() || DEFAULT_DESIGN_CONFIG.primaryFont,
    decorationType:
      raw.decorationType?.trim() || DEFAULT_DESIGN_CONFIG.decorationType,
    // Derive accent from bgColor — invert lightness for contrast
    accentColor: DEFAULT_DESIGN_CONFIG.accentColor,
  };
}

// ================================
// GraphQL Queries (matching WPGraphQL + ACF schema)
// ================================

const GET_ARTICLES = `
  query GetArticles($first: Int = 20) {
    posts(first: $first, where: { status: PUBLISH }) {
      nodes {
        id
        slug
        title
        excerpt
        content
        date
        featuredImage {
          node {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
        author {
          node {
            name
            avatar {
              url
            }
          }
        }
        categories {
          nodes {
            name
          }
        }
        designConfig {
          bgColor
          textColor
          primaryFont
          decorationType
        }
      }
    }
  }
`;

const GET_ARTICLE_BY_SLUG = `
  query GetArticleBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      slug
      title
      content
      excerpt
      date
      featuredImage {
        node {
          sourceUrl
          altText
          mediaDetails {
            width
            height
          }
        }
      }
      author {
        node {
          name
          avatar {
            url
          }
          description
        }
      }
      categories {
        nodes {
          name
        }
      }
      designConfig {
        bgColor
        textColor
        primaryFont
        decorationType
      }
    }
  }
`;

const GET_ALL_SLUGS = `
  query GetAllSlugs {
    posts(first: 100, where: { status: PUBLISH }) {
      nodes {
        slug
      }
    }
  }
`;

// ================================
// Response Types (raw WPGraphQL shape)
// ================================

interface WPGraphQLPostNode {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  featuredImage: {
    node: {
      sourceUrl: string;
      altText: string;
      mediaDetails?: {
        width: number;
        height: number;
      };
    };
  } | null;
  author: {
    node: {
      name: string;
      avatar: { url: string } | null;
      description?: string;
    };
  };
  categories: {
    nodes: Array<{ name: string }>;
  };
  designConfig: WPDesignConfigRaw | null;
}

interface GetPostsResponse {
  posts: { nodes: WPGraphQLPostNode[] };
}

interface GetPostBySlugResponse {
  post: WPGraphQLPostNode | null;
}

interface GetAllSlugsResponse {
  posts: { nodes: Array<{ slug: string }> };
}

// ================================
// Data Transformers
// ================================

/** Transform a WPGraphQL post node into our app's WPPost type */
function transformPost(node: WPGraphQLPostNode): WPPost {
  return {
    id: node.id,
    slug: node.slug,
    title: node.title,
    excerpt: node.excerpt.replace(/<\/?[^>]+(>|$)/g, ""), // strip HTML
    content: node.content,
    date: node.date,
    featuredImage: node.featuredImage
      ? {
          url: node.featuredImage.node.sourceUrl,
          alt: node.featuredImage.node.altText || node.title,
          width: node.featuredImage.node.mediaDetails?.width || 1200,
          height: node.featuredImage.node.mediaDetails?.height || 800,
        }
      : null,
    author: {
      name: node.author.node.name,
      avatar: node.author.node.avatar?.url || "/mock/avatar-1.jpg",
      bio: node.author.node.description,
    },
    categories: node.categories.nodes.map((c) => c.name),
    designConfig: normalizeDesignConfig(node.designConfig),
  };
}

// ================================
// Public Data Fetching Functions
// ================================

/**
 * Fetch all published articles.
 * Falls back to mock data if WordPress is unreachable.
 */
export async function getArticles(count: number = 20): Promise<WPPost[]> {
  if (USE_MOCK) return mockPosts;

  try {
    const data = await wpQuery<GetPostsResponse>(GET_ARTICLES, {
      first: count,
    });
    return data.posts.nodes.map(transformPost);
  } catch (error) {
    console.error("[Ahlan API] Failed to fetch articles:", error);
    // Fallback to mock data in development
    if (process.env.NODE_ENV === "development") return mockPosts;
    throw error;
  }
}

/**
 * Fetch a single article by slug.
 * Returns null if not found.
 */
export async function getArticleBySlug(
  slug: string,
): Promise<WPPost | null> {
  if (USE_MOCK) {
    return mockPosts.find((p) => p.slug === slug) || null;
  }

  try {
    const data = await wpQuery<GetPostBySlugResponse>(
      GET_ARTICLE_BY_SLUG,
      { slug },
      30, // revalidate every 30s for individual articles
    );

    if (!data.post) return null;
    return transformPost(data.post);
  } catch (error) {
    console.error(`[Ahlan API] Failed to fetch article "${slug}":`, error);
    if (process.env.NODE_ENV === "development") {
      return mockPosts.find((p) => p.slug === slug) || null;
    }
    throw error;
  }
}

/**
 * Fetch all article slugs for static generation.
 */
export async function getAllArticleSlugs(): Promise<string[]> {
  if (USE_MOCK) {
    return mockPosts.map((p) => p.slug);
  }

  try {
    const data = await wpQuery<GetAllSlugsResponse>(GET_ALL_SLUGS);
    return data.posts.nodes.map((n) => n.slug);
  } catch (error) {
    console.error("[Ahlan API] Failed to fetch slugs:", error);
    if (process.env.NODE_ENV === "development") {
      return mockPosts.map((p) => p.slug);
    }
    return [];
  }
}

// ================================
// Legacy Aliases (backward compat for existing pages)
// ================================

export const getPosts = getArticles;
export async function getPostBySlug(
  slug: string,
): Promise<WPPost | undefined> {
  const result = await getArticleBySlug(slug);
  return result || undefined;
}

/** Fetch all magazine issues (still using mock data) */
export async function getMagazines(): Promise<WPMagazine[]> {
  return mockMagazines;
}

/** Fetch user's purchased magazines (still using mock data) */
export async function getUserPurchases(): Promise<WPMagazine[]> {
  return mockMagazines.slice(0, 3).map((m) => ({ ...m, isPurchased: true }));
}

/** Fetch merchandise products (still using mock data) */
export async function getProducts(): Promise<WPProduct[]> {
  return mockProducts;
}
