"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";

export default function LibraryError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Library section error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-cream px-4 py-16">
      <div className="mx-auto max-w-md rounded-2xl bg-white p-8 text-center shadow-[var(--shadow-card)]">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
          <AlertTriangle size={32} />
        </div>
        <h2 className="font-heading text-xl font-bold text-heading sm:text-2xl">
          Failed to load library
        </h2>
        <p className="mt-3 text-sm text-muted">
          We couldn&apos;t load your magazines and articles at this time.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-light"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-cream-dark px-5 py-2.5 text-sm font-semibold text-body hover:border-primary hover:text-primary"
          >
            <ArrowLeft size={16} />
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
