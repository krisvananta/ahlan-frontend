"use client";

import { useAuth } from "@/providers/AuthProvider";
import { hasAccess } from "@/lib/access";

/**
 * Hook to check if the currently authenticated user has access to a magazine or general subscriber features.
 * Eliminates duplicate access checks across UI components per ARCH-01.
 */
export function useAccess() {
  const { user } = useAuth();

  const checkAccess = (magazineId?: string) => {
    return hasAccess(user, magazineId);
  };

  return {
    user,
    hasAccess: checkAccess,
    isAdmin: user?.role === "administrator",
    isEditor: user?.role === "editor",
    hasAllAccess: user?.has_all_access === true || user?.role === "administrator",
  };
}
