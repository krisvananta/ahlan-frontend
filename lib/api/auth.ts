/**
 * WordPress GraphQL API — Authentication & Viewer Sync
 */

import { wpQuery } from "./client";

// ================================
// GraphQL Mutations & Queries
// ================================

const LOGIN_MUTATION = `
  mutation LoginUser($username: String!, $password: String!) {
    login(input: { username: $username, password: $password }) {
      authToken
      user {
        id
        name
        nickname
        email
        roles {
          nodes {
            name
          }
        }
        userMembership {
          hasAllAccess
        }
      }
    }
  }
`;

const VIEWER_QUERY = `
  query GetViewer {
    viewer {
      id
      name
      nickname
      email
      roles {
        nodes {
          name
        }
      }
      userMembership {
        hasAllAccess
      }
    }
  }
`;

// ================================
// Types & Interfaces
// ================================

export interface WPViewerNode {
  id: string;
  name: string;
  nickname?: string;
  email?: string;
  roles?: {
    nodes: Array<{ name: string }>;
  };
  userMembership?: {
    hasAllAccess?: boolean | string | null;
  };
}

interface LoginMutationResponse {
  login?: {
    authToken?: string;
    user?: WPViewerNode;
  };
}

interface GetViewerResponse {
  viewer?: WPViewerNode;
}

// ================================
// Auth & Sync Functions
// ================================

export async function loginWithGraphQL(
  username: string,
  password: string,
): Promise<{ authToken: string; user?: WPViewerNode }> {
  // Pass explicit 0 revalidate to ensure no caching on auth keys
  const res = await wpQuery<LoginMutationResponse>(
    LOGIN_MUTATION,
    { username, password },
    0,
  );

  if (!res?.login?.authToken) throw new Error("Invalid Credentials");
  return res.login as { authToken: string; user?: WPViewerNode };
}

export async function fetchViewer(token: string): Promise<WPViewerNode> {
  const res = await wpQuery<GetViewerResponse>(
    VIEWER_QUERY,
    {},
    0,
    token,
  );

  if (!res?.viewer) throw new Error("Expired or Invalid Token");
  return res.viewer;
}
