"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import AuthForm from "@/components/auth/AuthForm";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-modal)]">
        <AuthForm
          initialView="login"
          onSuccess={() => router.push("/dashboard")}
          showHeader={true}
        />
      </div>
    </div>
  );
}
