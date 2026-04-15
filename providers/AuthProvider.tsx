"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
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

/** Mock user for demo purposes */
const mockUser: User = {
  id: "1",
  name: "Ahmad Faris",
  email: "ahmad@ahlan.com",
  avatar: "/mock/avatar-1.jpg",
  role: "subscriber",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const login = useCallback(async (creds: LoginCredentials) => {
    setIsLoading(true);
    try {
      // Mock login — in production, call /api/auth/login
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (creds.email && creds.password) {
        setUser(mockUser);
        setToken("mock-jwt-token");
        setIsAuthModalOpen(false);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (creds: RegisterCredentials) => {
    setIsLoading(true);
    try {
      // Mock register — in production, call /api/auth/register
      await new Promise((resolve) => setTimeout(resolve, 1200));
      if (creds.name && creds.email && creds.password) {
        setUser({ ...mockUser, name: creds.name, email: creds.email });
        setToken("mock-jwt-token");
        setIsAuthModalOpen(false);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
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
