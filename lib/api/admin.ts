/**
 * WordPress GraphQL API — Fan-Writer Workflows & Admin
 */

import type { WPPost } from "@/types";
import { wpQuery, USE_MOCK } from "./client";
import { transformPost, type WPGraphQLPostNode } from "./articles";

// ================================
// GraphQL Mutations & Queries
// ================================

const SUBMIT_ARTICLE_MUTATION = `
  mutation SubmitFanArticle($title: String!, $content: String!, $bgColor: String, $textColor: String, $primaryFont: String) {
    createPost(
      input: {
        title: $title, 
        content: $content, 
        status: PENDING,
        designConfig: {
          bgColor: $bgColor,
          textColor: $textColor,
          primaryFont: $primaryFont
        }
      }
    ) {
      post {
        id
        title
        status
      }
    }
  }
`;

const GET_PENDING_ARTICLES = `
  query GetPendingArticles {
    posts(first: 50, where: { status: PENDING }) {
      nodes {
        id
        slug
        title
        excerpt
        content
        date
        author {
          node {
            name
            email
          }
        }
        designConfig {
          bgColor
          textColor
        }
      }
    }
  }
`;

const UPDATE_ARTICLE_MUTATION = `
  mutation ApproveFanArticle($id: ID!, $status: PostStatusEnum!, $reviewNote: String, $pdfMediaId: Int) {
    updatePost(
      input: {
        id: $id, 
        status: $status,
        reviewNote: $reviewNote,
        magazinePdf: $pdfMediaId
      }
    ) {
      post {
        id
        status
      }
    }
  }
`;

interface GetPostsResponse {
  posts: { nodes: WPGraphQLPostNode[] };
}

// ================================
// Admin & Fan-Writer Functions
// ================================

export async function submitFanArticle(
  data: {
    title: string;
    content: string;
    bgColor?: string;
    textColor?: string;
    primaryFont?: string;
  },
  token: string,
): Promise<{ id: string; status: string }> {
  // If no WP GraphQL setup, mock success
  if (USE_MOCK) {
    return { id: "mock-id-123", status: "PENDING" };
  }

  const response = await wpQuery<{ createPost: { post: { id: string; status: string } } }>(
    SUBMIT_ARTICLE_MUTATION,
    data,
    0, // Don't cache mutations
    token, // Send Authorization Header
  );

  return response.createPost.post;
}

export async function getPendingArticles(token: string): Promise<WPPost[]> {
  if (USE_MOCK) {
    // Return empty or mock pending array
    return [];
  }

  const response = await wpQuery<GetPostsResponse>(
    GET_PENDING_ARTICLES,
    {},
    0, 
    token
  );

  return response.posts.nodes.map(node => ({
    ...transformPost(node),
  }));
}

export async function approveArticle(
  data: {
    id: string;
    status: "PUBLISH" | "TRASH" | "DRAFT";
    reviewNote?: string;
    pdfMediaId?: number;
  },
  token: string,
): Promise<{ id: string; status: string }> {
  if (USE_MOCK) return { id: data.id, status: data.status };

  interface ApproveArticleResponse {
    updatePost?: {
      post?: {
        id: string;
        status: string;
      };
    };
  }

  const response = await wpQuery<ApproveArticleResponse>(
    UPDATE_ARTICLE_MUTATION,
    data,
    0,
    token
  );

  return {
    id: response?.updatePost?.post?.id || data.id,
    status: response?.updatePost?.post?.status || data.status,
  };
}
