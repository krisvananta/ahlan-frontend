"use client";

import { useAuth } from "@/providers/AuthProvider";
import { mockMagazines } from "@/lib/mock-data";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Download,
  Eye,
  Lock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LibraryPage() {
  const { isAuthenticated, user, openAuthModal } = useAuth();

  // Mock purchased items (first 3)
  const purchased = mockMagazines.slice(0, 3);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream pt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-4 max-w-md rounded-2xl bg-white p-10 text-center shadow-[var(--shadow-card)]"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Lock size={28} className="text-primary" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-heading">
            Access Your Library
          </h1>
          <p className="mt-3 text-sm text-muted">
            Sign in to view your purchased e-magazines and exclusive content.
          </p>
          <button
            onClick={openAuthModal}
            className="mt-6 w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-white transition-colors hover:bg-primary-light"
          >
            Sign In to Continue
          </button>
          <Link
            href="/"
            className="mt-4 inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-primary"
          >
            <ArrowLeft size={14} />
            Back to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pt-28 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-primary"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-lg font-bold text-white">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold text-heading sm:text-3xl">
                My Library
              </h1>
              <p className="text-sm text-muted">
                Welcome back, {user?.name}
              </p>
            </div>
          </div>
          <div className="section-divider mt-6 !ml-0" />
        </div>

        {/* Purchased Magazines */}
        <div>
          <h2 className="mb-6 flex items-center gap-2 font-heading text-xl font-bold text-heading">
            <BookOpen size={20} className="text-primary" />
            Purchased Magazines
          </h2>

          <AnimatePresence>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {purchased.map((mag, i) => (
                <motion.div
                  key={mag.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group overflow-hidden rounded-xl bg-white shadow-[var(--shadow-card)] transition-all hover:shadow-[var(--shadow-card-hover)]"
                >
                  {/* Cover */}
                  <div className="relative aspect-[4/3] bg-gradient-to-br from-primary/80 via-primary-dark to-primary-dark">
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                      <span className="font-heading text-4xl font-bold text-accent opacity-30">
                        أ
                      </span>
                      <h3 className="mt-2 font-heading text-base font-bold text-white">
                        {mag.title}
                      </h3>
                      <p className="mt-1 text-xs text-white/50">
                        Issue #{mag.issueNumber}
                      </p>
                    </div>

                    {/* Purchased badge */}
                    <div className="absolute right-3 top-3 rounded-full bg-success px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                      Purchased
                    </div>
                  </div>

                  {/* Info + Actions */}
                  <div className="p-5">
                    <p className="line-clamp-2 text-sm text-muted">
                      {mag.description}
                    </p>
                    <div className="mt-4 flex gap-2">
                      <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary py-2.5 text-xs font-semibold text-white transition-colors hover:bg-primary-light">
                        <Eye size={14} />
                        Read
                      </button>
                      <button className="flex items-center justify-center rounded-lg border border-cream-dark p-2.5 text-muted transition-colors hover:border-primary hover:text-primary">
                        <Download size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
