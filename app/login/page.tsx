"use client";

import { useState, type FormEvent } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login({ email: identifier, password });
      toast.success("Login successful!");
      
      // Redirect after successful login
      router.push("/dashboard");
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || "Invalid Email or Password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-[var(--shadow-modal)]">
        <h2 className="text-2xl font-bold text-heading mb-6 text-center">Login to Ahlan</h2>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-muted mb-1.5">
              Email or Username
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-cream-dark bg-cream py-3 pl-10 pr-4 text-sm text-heading outline-none transition-all placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/10"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-muted mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-cream-dark bg-cream py-3 pl-10 pr-4 text-sm text-heading outline-none transition-all placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/10"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-white transition-all hover:bg-primary-light disabled:opacity-60 mt-6"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : null}
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
