"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Root error boundary caught error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-cream px-4 py-20">
      <div className="mx-auto max-w-md rounded-2xl bg-white p-8 text-center shadow-[var(--shadow-card)] sm:p-10">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
          <AlertTriangle size={32} />
        </div>
        <h2 className="font-heading text-2xl font-bold text-heading">
          Something went wrong
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          We encountered an unexpected issue loading this content. Please try again or return to the homepage.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-light"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-cream-dark px-6 py-3 text-sm font-semibold text-body transition-colors hover:border-primary hover:text-primary"
          >
            <Home size={16} />
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
