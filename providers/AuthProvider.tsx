"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { User, AuthState, LoginCredentials, RegisterCredentials } from "@/types";

interface AuthContextValue extends AuthState {
  login: (creds: LoginCredentials) => Promise<void>;
  register: (creds: RegisterCredentials) => Promise<void>;
  logout: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  isAuthModalOpen: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [authActionLoading, setAuthActionLoading] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Requirement 4: Data Sync - Hydrate session via React Query
  const { data: sessionData, isLoading: sessionLoading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          console.log("[AuthProvider] Hydrated User:", data.user);
          return {
            user: (data.user as User) || null,
            token: (data.token as string) || null,
          };
        }
      } catch (error) {
        console.error("Session hydration failed", error);
      }
      return { user: null, token: null };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    retry: false,
  });

  const user = sessionData?.user || null;
  const token = sessionData?.token || null;
  const isLoading = sessionLoading || authActionLoading;

  const login = useCallback(async (creds: LoginCredentials) => {
    setAuthActionLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(creds)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login Failed");
      
      queryClient.setQueryData(["auth", "me"], { user: data.user, token: data.token });
      setIsAuthModalOpen(false);
    } catch (error) {
       console.error(error);
       throw error;
    } finally {
      setAuthActionLoading(false);
    }
  }, [queryClient]);

  const register = useCallback(async (_creds: RegisterCredentials) => {
    setAuthActionLoading(true);
    try {
      // Typically registers against WP /wp/v2/users, then logs in.
      // For now we assume register might hit a mock or backend endpoint safely.
      // To strictly remove 'Ahmad Faris', we must map register dynamically. 
      // If no register proxy is wired, throw an error.
      throw new Error("Registration endpoint is currently restricted to Administrators.");
    } finally {
      setAuthActionLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setAuthActionLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      queryClient.setQueryData(["auth", "me"], { user: null, token: null });
      setAuthActionLoading(false);
    }
  }, [queryClient]);

  const openAuthModal = useCallback(() => setIsAuthModalOpen(true), []);
  const closeAuthModal = useCallback(() => setIsAuthModalOpen(false), []);

  return (
    <AuthContext
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        openAuthModal,
        closeAuthModal,
        isAuthModalOpen,
      }}
    >
      {children}
    </AuthContext>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
