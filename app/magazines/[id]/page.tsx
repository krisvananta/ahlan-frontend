"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, AlertTriangle } from "lucide-react";
import SecurePdfViewer from "@/components/magazine/SecurePdfViewer";
import { useAuth } from "@/providers/AuthProvider";
import type { WPMagazine } from "@/types";

/**
 * Magazine Reader Page
 *
 * Opens the Secure PDF Viewer for Official Magazines.
 * - Verifies authentication
 * - Fetches magazine metadata
 * - Renders the anti-leak PDF viewer
 */
export default function MagazineReaderPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { isAuthenticated, openAuthModal } = useAuth();
  const [magazine, setMagazine] = useState<WPMagazine | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMagazine() {
      if (!params.id) return;
      setLoading(true);

      try {
        // Import dynamically to avoid server/client mismatch
        const { getMagazineById } = await import("@/lib/api");
        const mag = await getMagazineById(params.id);

        if (!mag) {
          setError("Magazine not found.");
          return;
        }

        setMagazine(mag);
      } catch {
        setError("Failed to load magazine. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadMagazine();
  }, [params.id]);

  // Auth gate
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-dark-bg)] pt-20">
        <div className="mx-4 max-w-md rounded-2xl bg-white p-10 text-center shadow-[var(--shadow-card)]">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <span className="text-3xl">🔒</span>
          </div>
          <h1 className="font-heading text-2xl font-bold text-heading">
            Sign In Required
          </h1>
          <p className="mt-3 text-sm text-muted">
            You need to be signed in to read this magazine.
          </p>
          <button
            onClick={openAuthModal}
            className="mt-6 w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-white transition-colors hover:bg-primary-light"
          >
            Sign In
          </button>
          <Link
            href="/library"
            className="mt-4 inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-primary"
          >
            <ArrowLeft size={14} />
            Back to Library
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-dark-bg)] pt-20">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-accent" />
          <p className="text-sm text-white/50">Loading magazine...</p>
        </div>
      </div>
    );
  }

  if (error || !magazine) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-dark-bg)] pt-20">
        <div className="mx-4 max-w-md rounded-2xl bg-white p-10 text-center shadow-[var(--shadow-card)]">
          <AlertTriangle size={40} className="mx-auto mb-4 text-error" />
          <h1 className="font-heading text-xl font-bold text-heading">
            {error || "Magazine Not Found"}
          </h1>
          <p className="mt-2 text-sm text-muted">
            The magazine you&apos;re looking for could not be loaded.
          </p>
          <Link
            href="/library"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-light"
          >
            <ArrowLeft size={16} />
            Back to Library
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-dark-bg)] pt-20 pb-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Back nav */}
        <div className="mb-4">
          <Link
            href="/library"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/50 transition-colors hover:text-accent"
          >
            <ArrowLeft size={16} />
            Back to Library
          </Link>
        </div>

        {/* Secure PDF Viewer */}
        <div className="min-h-[70vh]">
          <SecurePdfViewer
            magazineId={magazine.id}
            pdfUrl={magazine.pdfUrl}
            title={`${magazine.title} — Issue #${magazine.issueNumber}`}
            onClose={() => router.push("/library")}
          />
        </div>
      </div>
    </div>
  );
}
