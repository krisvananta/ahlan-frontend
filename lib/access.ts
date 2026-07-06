export interface AccessUser {
  role?: string;
  has_all_access?: boolean;
  purchased_magazines?: string[];
}

/**
 * Shared isomorphic access control check.
 * Enforces access control precedence per AGENTS.md §7:
 * 1. Admin bypass
 * 2. ACF "has all access" subscription flag (strict boolean evaluation per AGENTS.md §2.7)
 * 3. Individual magazine purchase
 */
export function hasAccess(user: AccessUser | null | undefined, magazineId?: string): boolean {
  if (!user) return false;
  
  // 1. Admin bypass
  if (user.role === "administrator") return true;
  
  // 2. ACF "has all access" subscription flag
  if (user.has_all_access === true) return true;
  
  // 3. Individual magazine purchase
  if (magazineId) {
    return user.purchased_magazines?.includes(magazineId) ?? false;
  }
  
  return false;
}

/**
 * Helper to parse userMembership.hasAllAccess from raw WPGraphQL response.
 * Handles boolean true or string "true" per AGENTS.md §2.7.
 */
export function parseWpHasAllAccess(userMembership?: { hasAllAccess?: boolean | string | null } | null): boolean {
  if (!userMembership) return false;
  return userMembership.hasAllAccess === true || userMembership.hasAllAccess === "true";
}
