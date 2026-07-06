"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Loader2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import type { ModalView } from "@/types";
import { toast } from "sonner";

interface AuthFormProps {
  initialView?: ModalView;
  onSuccess?: () => void;
  showHeader?: boolean;
}

/**
 * Shared Authentication Form (ARCH-02).
 * Single source of truth for login and registration UI/logic across
 * both AuthModal and the standalone /login page.
 */
export default function AuthForm({
  initialView = "login",
  onSuccess,
  showHeader = true,
}: AuthFormProps) {
  const { login, register, isLoading } = useAuth();
  const [view, setView] = useState<ModalView>(initialView);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (view === "login") {
        await login({ email: formData.email, password: formData.password });
        toast.success("Welcome back to Ahlan!");
      } else {
        await register(formData);
        toast.success("Account created! Welcome to the family.");
      }
      setFormData({ name: "", email: "", password: "" });
      onSuccess?.();
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      toast.error(message);
    }
  };

  const switchView = () => {
    setView(view === "login" ? "register" : "login");
    setFormData({ name: "", email: "", password: "" });
  };

  return (
    <div className="w-full">
      {showHeader && (
        <div className="relative overflow-hidden gradient-hero px-8 pb-8 pt-10">
          <div className="pattern-overlay pointer-events-none absolute inset-0 opacity-20" aria-hidden="true" />
          <div className="relative">
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 overflow-hidden p-2">
              <Image
                src="/logo.png"
                alt="Ahlan Logo"
                width={32}
                height={32}
                className="w-full h-auto object-contain"
              />
            </div>
            <h2 className="font-heading text-2xl font-bold !text-white">
              {view === "login" ? "Welcome Back" : "Join Ahlan"}
            </h2>
            <p className="mt-1 text-sm text-white/70">
              {view === "login"
                ? "Sign in to access your library"
                : "Create your account to get started"}
            </p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-8 py-6">
        <div className="space-y-4">
          {/* Name (register only) */}
          <AnimatePresence mode="popLayout">
            {view === "register" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted">
                  Full Name
                </label>
                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                  />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter your name"
                    className="w-full rounded-xl border border-cream-dark bg-cream py-3 pl-10 pr-4 text-sm text-heading outline-none transition-all placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/10"
                    required
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Email */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted">
              Email Address
            </label>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="you@example.com"
                className="w-full rounded-xl border border-cream-dark bg-cream py-3 pl-10 pr-4 text-sm text-heading outline-none transition-all placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/10"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted">
              Password
            </label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="••••••••"
                className="w-full rounded-xl border border-cream-dark bg-cream py-3 pl-10 pr-12 text-sm text-heading outline-none transition-all placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/10"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-heading"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-white transition-all hover:bg-primary-light disabled:opacity-60"
        >
          {isLoading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : null}
          {view === "login" ? "Sign In" : "Create Account"}
        </button>

        {/* Switch View */}
        <p className="mt-5 text-center text-sm text-muted">
          {view === "login"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={switchView}
            className="font-semibold text-primary transition-colors hover:text-primary-light"
          >
            {view === "login" ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </form>
    </div>
  );
}
