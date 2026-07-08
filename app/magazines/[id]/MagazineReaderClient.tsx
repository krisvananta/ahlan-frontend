"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import SecurePdfViewer from "@/components/magazine/SecurePdfViewer";
import { useAuth } from "@/providers/AuthProvider";
import type { WPMagazine } from "@/types";
import { formatIDR } from "@/lib/format";
import { useAccess } from "@/hooks/useAccess";

interface MagazineReaderClientProps {
  magazine: WPMagazine | null;
  magazineId: string;
}

export default function MagazineReaderClient({
  magazine,
  magazineId,
}: MagazineReaderClientProps) {
  const router = useRouter();
  const { isAuthenticated, openAuthModal } = useAuth();
  const { hasAccess } = useAccess();

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

  if (!magazine) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-dark-bg)] pt-20">
        <div className="mx-4 max-w-md rounded-2xl bg-white p-10 text-center shadow-[var(--shadow-card)]">
          <AlertTriangle size={40} className="mx-auto mb-4 text-error" />
          <h1 className="font-heading text-xl font-bold text-heading">
            Magazine Not Found
          </h1>
          <p className="mt-2 text-sm text-muted">
            The magazine you&apos;re looking for could not be loaded or does not exist.
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

        {/* Secure PDF Viewer or Locked State */}
        <div className="min-h-[70vh]">
          {!hasAccess(magazineId) ? (
            <div className="flex h-[70vh] flex-col items-center justify-center rounded-2xl bg-[var(--color-dark-surface)] border border-white/10 p-10 text-center shadow-2xl">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-error/10">
                <AlertTriangle size={32} className="text-error" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-white mb-3">
                Magazine Locked
              </h2>
              <p className="max-w-md text-sm text-white/60 mb-8">
                You do not have access to this magazine. Please purchase it to continue reading.
              </p>
              <button className="rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-primary-light shadow-[var(--shadow-btn)] hover:shadow-[var(--shadow-btn-hover)]">
                Buy Now - {formatIDR(magazine.price)}
              </button>
            </div>
          ) : (
            <SecurePdfViewer
              magazineId={magazine.id}
              pdfUrl={magazine.pdfUrl}
              title={`${magazine.title} — Issue #${magazine.issueNumber}`}
              onClose={() => router.push("/library")}
            />
          )}
        </div>
      </div>
    </div>
  );
}
