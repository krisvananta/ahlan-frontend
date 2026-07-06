/**
 * WordPress GraphQL API — Magazines & e-Books
 */

import type { WPMagazine } from "@/types";
import { mockMagazines } from "../mock-data";
import { wpQuery, USE_MOCK } from "./client";

// ================================
// Magazine GraphQL Queries
// ================================

const GET_MAGAZINES = `
  query GetMagazines($first: Int = 20) {
    magazines(first: $first, where: { status: PUBLISH }) {
      nodes {
        id
        slug
        title
        date
        featuredImage {
          node {
            sourceUrl
          }
        }
        magazineData {
          magazinePdf {
            node {
              mediaItemUrl
              databaseId
            }
          }
        }
      }
    }
  }
`;

const GET_MAGAZINE_BY_ID = `
  query GetMagazineById($id: ID!) {
    magazine(id: $id, idType: ID) {
      id
      slug
      title
      date
      featuredImage {
        node {
          sourceUrl
        }
      }
      magazineData {
        magazinePdf {
          node {
            mediaItemUrl
            databaseId
          }
        }
      }
    }
  }
`;

// ================================
// Magazine Response Types
// ================================

export interface WPGraphQLMagazineNode {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  date: string;
  featuredImage: {
    node: { sourceUrl: string };
  } | null;
  magazineData?: {
    magazinePdf?: {
      node?: {
        mediaItemUrl: string;
        databaseId: number;
      };
      mediaItemUrl?: string;
      databaseId?: number;
    } | null;
    issueNumber?: string | null;
    price?: number | null;
    pageCount?: number | null;
  } | null;
  magazineFields?: {
    issueNumber?: string | null;
    price?: number | null;
    pageCount?: number | null;
    magazinePdf?: {
      mediaItemUrl?: string;
      databaseId?: number;
      node?: {
        mediaItemUrl: string;
        databaseId: number;
      };
    } | null;
  } | null;
}

interface GetMagazinesResponse {
  magazines: { nodes: WPGraphQLMagazineNode[] };
}

interface GetMagazineByIdResponse {
  magazine: WPGraphQLMagazineNode | null;
}

// ================================
// Magazine Transformer
// ================================

export function transformMagazine(node: WPGraphQLMagazineNode): WPMagazine {
  const data = node.magazineData || node.magazineFields;
  const pdfNode = data?.magazinePdf?.node || data?.magazinePdf;
  return {
    id: node.id,
    slug: node.slug,
    title: node.title,
    description: node.excerpt?.replace(/<\/?[^>]+(>|$)/g, "") || "Digital E-Magazine Issue from Ahlan.",
    coverImage: node.featuredImage?.node.sourceUrl || "/mock/magazine-1.jpg",
    issueNumber: data?.issueNumber || "1",
    publishDate: node.date,
    pdfUrl: pdfNode?.mediaItemUrl || "",
    pdfMediaId: pdfNode?.databaseId?.toString(),
    price: data?.price || 0,
    pageCount: data?.pageCount || undefined,
    contentType: "official", // All magazines from WP are Official PDF e-books
  };
}

// ================================
// Magazine Fetching Functions
// ================================

/** Fetch all published magazine issues */
export async function getMagazines(): Promise<WPMagazine[]> {
  if (USE_MOCK) return mockMagazines;

  try {
    const data = await wpQuery<GetMagazinesResponse>(GET_MAGAZINES);
    return data.magazines.nodes.map(transformMagazine);
  } catch (error) {
    console.error("[Ahlan API] Failed to fetch magazines:", error);
    if (process.env.NODE_ENV === "development") return mockMagazines;
    throw error;
  }
}

/** Fetch a single magazine by database ID */
export async function getMagazineById(
  id: string,
): Promise<WPMagazine | null> {
  if (USE_MOCK) {
    return mockMagazines.find((m) => m.id === id) || null;
  }

  try {
    const data = await wpQuery<GetMagazineByIdResponse>(
      GET_MAGAZINE_BY_ID,
      { id },
      30,
    );
    if (!data.magazine) return null;
    return transformMagazine(data.magazine);
  } catch (error) {
    console.error(`[Ahlan API] Failed to fetch magazine "${id}":`, error);
    if (process.env.NODE_ENV === "development") {
      return mockMagazines.find((m) => m.id === id) || null;
    }
    throw error;
  }
}

const GET_USER_PURCHASES = `
  query GetUserPurchases {
    viewer {
      userMembership {
        purchasedMagazines {
          nodes {
            id
            slug
            title
            date
            featuredImage {
              node {
                sourceUrl
              }
            }
            magazineData {
              magazinePdf {
                node {
                  mediaItemUrl
                  databaseId
                }
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * Fetch user's purchased magazines via WPGraphQL / ACF userMembership.
 * Falls back to empty array if the user has no purchases or if the backend
 * WooCommerce/ACF purchasedMagazines endpoint is not yet configured.
 */
export async function getUserPurchases(token?: string): Promise<WPMagazine[]> {
  if (USE_MOCK) {
    // In mock mode, return the first magazine as purchased for local dev testing
    return mockMagazines.slice(0, 1);
  }

  if (!token) {
    return [];
  }

  try {
    interface GetUserPurchasesResponse {
      viewer?: {
        userMembership?: {
          purchasedMagazines?: {
            nodes: WPGraphQLMagazineNode[];
          };
        };
      };
    }

    const data = await wpQuery<GetUserPurchasesResponse>(
      GET_USER_PURCHASES,
      {},
      0,
      token,
    );

    const nodes = data?.viewer?.userMembership?.purchasedMagazines?.nodes;
    if (!nodes || !Array.isArray(nodes)) {
      return [];
    }

    return nodes.map(transformMagazine);
  } catch (error) {
    console.error("[Ahlan API] Failed to fetch user purchases (known gap if WooCommerce/ACF field is unconfigured):", error);
    return [];
  }
}
