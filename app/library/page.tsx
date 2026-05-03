"use client";

import { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/providers/AuthProvider";
import { mockMagazines } from "@/lib/mock-data";
import { mockPosts } from "@/lib/mock-data";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  FileText,
  Eye,
  Lock,
  Newspaper,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type LibraryTab = "official" | "fan-made";

export default function LibraryPage() {
  const { isAuthenticated, user, openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState<LibraryTab>("official");

  // RBAC Access mapping
  const hasAccess = (id: string) => {
     if (user?.role === "administrator") return true;
     if (user?.has_all_access) return true;
     return user?.purchased_magazines?.includes(id) || false;
  };

  const purchasedMagazines = mockMagazines.filter(m => hasAccess(m.id));
  const fanArticles = mockPosts.slice(0, 4);

  // Auth gate
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
        <div className="mb-10">
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

        {/* Tab Switcher */}
        <div className="mb-8 flex gap-2">
          <button
            onClick={() => setActiveTab("official")}
            className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all ${
              activeTab === "official"
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "bg-white text-body hover:bg-cream-dark"
            }`}
          >
            <BookOpen size={16} />
            Official Magazines
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                activeTab === "official"
                  ? "bg-white/20 text-white"
                  : "bg-cream-dark text-muted"
              }`}
            >
              {purchasedMagazines.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("fan-made")}
            className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all ${
              activeTab === "fan-made"
                ? "bg-accent text-white shadow-lg shadow-accent/20"
                : "bg-white text-body hover:bg-cream-dark"
            }`}
          >
            <Newspaper size={16} />
            Fan-Writer Articles
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                activeTab === "fan-made"
                  ? "bg-white/20 text-white"
                  : "bg-cream-dark text-muted"
              }`}
            >
              {fanArticles.length}
            </span>
          </button>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === "official" ? (
            <motion.div
              key="official"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Type A: Official Magazines → PDF Viewer */}
              <div className="mb-4 flex items-center gap-2">
                <Sparkles size={16} className="text-primary" />
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  PDF E-Books — Secure Viewer
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {purchasedMagazines.map((mag, i) => (
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
                        <Image
                          src="/logo.png"
                          alt="Ahlan Logo"
                          width={120}
                          height={48}
                          className="opacity-20 grayscale"
                        />
                        <h3 className="mt-2 font-heading text-base font-bold text-white">
                          {mag.title}
                        </h3>
                        <p className="mt-1 text-xs text-white/50">
                          Issue #{mag.issueNumber}
                          {mag.pageCount && ` · ${mag.pageCount} pages`}
                        </p>
                      </div>

                      {/* Type badge */}
                      <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-accent/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                        <BookOpen size={10} />
                        PDF E-Book
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
                      <div className="mt-4">
                        <Link
                          href={`/magazines/${mag.id}`}
                          className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary py-2.5 text-xs font-semibold text-white transition-colors hover:bg-primary-light"
                        >
                          <Eye size={14} />
                          Open Reader
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="fan-made"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Type B: Fan-Writer Articles → ThemeWrapper (Text) */}
              <div className="mb-4 flex items-center gap-2">
                <FileText size={16} className="text-accent-dark" />
                <p className="text-xs font-semibold uppercase tracking-wider text-accent-dark">
                  Text Articles — Custom Design Engine
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {fanArticles.map((post, i) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group overflow-hidden rounded-xl bg-white shadow-[var(--shadow-card)] transition-all hover:shadow-[var(--shadow-card-hover)]"
                  >
                    {/* Preview with design config colors */}
                    <div
                      className="relative aspect-[16/10] transition-transform duration-300 group-hover:scale-[1.02]"
                      style={{
                        background: `linear-gradient(135deg, ${post.designConfig?.bgColor || "#faf6f0"} 0%, ${post.designConfig?.accentColor || "#0a5c36"}20 100%)`,
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Image
                          src="/logo.png"
                          alt="Ahlan Logo"
                          width={100}
                          height={40}
                          className="opacity-15 grayscale"
                        />
                      </div>

                      {/* Type badge */}
                      <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-heading backdrop-blur-sm">
                        <FileText size={10} />
                        Fan Article
                      </div>

                      {/* Categories */}
                      <div className="absolute bottom-3 left-3 flex gap-1">
                        {post.categories.slice(0, 2).map((cat) => (
                          <span
                            key={cat}
                            className="rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-5">
                      <h3 className="font-heading text-sm font-bold leading-snug text-heading line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="mt-1.5 text-xs text-muted line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="mt-2 flex items-center gap-2 text-xs text-muted">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                          {post.author.name.charAt(0)}
                        </div>
                        {post.author.name}
                      </div>
                      <div className="mt-4">
                        <Link
                          href={`/articles/${post.slug}`}
                          className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-accent py-2.5 text-xs font-semibold text-white transition-colors hover:bg-accent-light"
                        >
                          <FileText size={14} />
                          Read Article
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
