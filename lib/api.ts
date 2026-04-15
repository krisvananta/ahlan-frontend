/**
 * WordPress GraphQL API Utility
 *
 * In production, this will query the WPGraphQL endpoint.
 * Currently returns mock data for development.
 */

import type { WPPost, WPMagazine, WPProduct } from "@/types";
import { mockPosts, mockMagazines, mockProducts } from "./mock-data";

// ================================
// GraphQL Fetch Utility
// ================================

const WP_GRAPHQL_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL ||
  "https://cms.ahlan.com/graphql";

export class WordPressError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
  ) {
    super(message);
    this.name = "WordPressError";
  }
}

/**
 * Generic GraphQL query function for WordPress.
 * Used in Server Components for secure data fetching.
 */
export async function wpQuery<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  try {
    const res = await fetch(WP_GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!res.ok) {
      throw new WordPressError(
        `WordPress API error: ${res.statusText}`,
        res.status,
      );
    }

    const json = await res.json();

    if (json.errors) {
      throw new WordPressError(json.errors[0].message);
    }

    return json.data as T;
  } catch (error) {
    if (error instanceof WordPressError) throw error;
    throw new WordPressError("Failed to connect to WordPress API");
  }
}

// ================================
// Data Fetching Functions (Mock)
// ================================

/** Simulate network delay for realistic loading states */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Fetch all published blog posts */
export async function getPosts(): Promise<WPPost[]> {
  await delay(300);
  return mockPosts;
}

/** Fetch a single post by slug */
export async function getPostBySlug(
  slug: string,
): Promise<WPPost | undefined> {
  await delay(200);
  return mockPosts.find((p) => p.slug === slug);
}

/** Fetch all magazine issues */
export async function getMagazines(): Promise<WPMagazine[]> {
  await delay(300);
  return mockMagazines;
}

/** Fetch user's purchased magazines (requires auth) */
export async function getUserPurchases(): Promise<WPMagazine[]> {
  await delay(400);
  // Mock: return first 3 as purchased
  return mockMagazines.slice(0, 3).map((m) => ({ ...m, isPurchased: true }));
}

/** Fetch merchandise products */
export async function getProducts(): Promise<WPProduct[]> {
  await delay(300);
  return mockProducts;
}

// ================================
// GraphQL Query Strings (for production)
// ================================

export const QUERIES = {
  GET_POSTS: `
    query GetPosts($first: Int = 10) {
      posts(first: $first) {
        nodes {
          id
          slug
          title
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
            fontFamily
            accentColor
            borderStyle
          }
        }
      }
    }
  `,

  GET_POST_BY_SLUG: `
    query GetPostBySlug($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        id
        slug
        title
        content
        date
        featuredImage {
          node {
            sourceUrl
            altText
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
        designConfig {
          bgColor
          textColor
          fontFamily
          accentColor
          borderStyle
        }
      }
    }
  `,

  GET_MAGAZINES: `
    query GetMagazines($first: Int = 10) {
      magazines(first: $first) {
        nodes {
          id
          title
          slug
          coverImage {
            sourceUrl
          }
          description
          issueNumber
          publishDate
          price
        }
      }
    }
  `,
} as const;
