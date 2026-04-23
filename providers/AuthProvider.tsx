"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
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
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Requirement 4: Data Sync - Refresh user data from WP on load
  useEffect(() => {
     async function hydrateSession() {
        try {
           const res = await fetch("/api/auth/me");
           if (res.ok) {
              const data = await res.json();
              setUser(data.user);
              setToken(data.token);
           }
        } catch (error) {
           console.error("Session hydration failed", error);
        } finally {
           setIsLoading(false);
        }
     }
     hydrateSession();
  }, []);

  const login = useCallback(async (creds: LoginCredentials) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(creds)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login Failed");
      
      setUser(data.user);
      setToken(data.token);
      setIsAuthModalOpen(false);
    } catch (error) {
       console.error(error);
       throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (creds: RegisterCredentials) => {
    setIsLoading(true);
    try {
      // Typically registers against WP /wp/v2/users, then logs in.
      // For now we assume register might hit a mock or backend endpoint safely.
      // To strictly remove 'Ahmad Faris', we must map register dynamically. 
      // If no register proxy is wired, throw an error.
      throw new Error("Registration endpoint is currently restricted to Administrators.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      setUser(null);
      setToken(null);
    }
  }, []);

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
