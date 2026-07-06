/**
 * WordPress GraphQL API Client & Configuration
 *
 * Core GraphQL fetch utility, error definitions, and environment config.
 */

export const WP_GRAPHQL_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL ||
  "http://ahlan-backend.local/graphql";

/** Set to true to always use mock data (for local dev without WP) */
export const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

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
 * @param query - GraphQL query string
 * @param variables - Optional query variables
 * @param revalidate - Cache revalidation time in seconds (default: 60)
 * @param token - Optional Bearer authentication token
 */
export async function wpQuery<T>(
  query: string,
  variables?: Record<string, unknown>,
  revalidate: number = 60,
  token?: string,
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(WP_GRAPHQL_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({ query, variables }),
      next: { revalidate },
    });
  } catch (err: unknown) {
    throw new WordPressError(
      `Network error fetching WordPress GraphQL: ${err instanceof Error ? err.message : String(err)}`,
      503,
    );
  }

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
