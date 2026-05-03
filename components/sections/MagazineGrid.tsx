"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight, Eye, Download, ShoppingCart, LockOpen } from "lucide-react";
import { mockMagazines } from "@/lib/mock-data";
import { useAuth } from "@/providers/AuthProvider";
import Link from "next/link";
import Image from "next/image";

export default function MagazineGrid() {
  const { user } = useAuth();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.7;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  const hasAccess = (id: string) => {
     if (user?.role === "administrator") return true;
     if (user?.has_all_access) return true;
     return user?.purchased_magazines?.includes(id) || false;
  };

  return (
    <section
      id="magazine"
      ref={ref}
      className="relative overflow-hidden bg-[var(--color-dark-bg)] py-[var(--spacing-section)]"
    >
      {/* Pattern overlay */}
      <div className="pattern-overlay pointer-events-none absolute inset-0 opacity-20" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 flex flex-col items-center text-center sm:mb-16"
        >
          <span className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Digital Collection
          </span>
          <h2 className="font-heading text-3xl font-bold !text-white sm:text-4xl lg:text-5xl">
            E-Magazine Library
          </h2>
          <p className="mt-4 max-w-xl text-sm text-white/50 sm:text-base">
            Explore our collection of beautifully crafted digital magazines
            covering Islamic art, culture, and contemporary discourse.
          </p>
          <div className="section-divider mt-6" />
        </motion.div>

        {/* Scroll Controls */}
        <div className="mb-6 flex justify-end gap-2">
          <button
            onClick={() => scroll("left")}
            className="rounded-full border border-white/10 p-2.5 text-white/50 transition-all hover:border-primary hover:text-primary"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="rounded-full border border-white/10 p-2.5 text-white/50 transition-all hover:border-primary hover:text-primary"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Horizontal Scroll */}
        <div
          ref={scrollRef}
          className="scrollbar-hide flex gap-6 overflow-x-auto pb-4"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {mockMagazines.map((mag, i) => {
            const owned = hasAccess(mag.id);
            
            return (
              <motion.div
                key={mag.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group flex-shrink-0"
                style={{ scrollSnapAlign: "start" }}
              >
                <div className="relative w-56 sm:w-64">
                  {/* Cover */}
                  <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-[var(--color-dark-surface)] shadow-lg transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-primary/10">
                    {/* Placeholder cover with gradient */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-primary/80 via-primary-dark to-primary-dark p-6 text-center">
                      <Image
                        src="/logo.png"
                        alt="Ahlan Logo"
                        width={120}
                        height={48}
                        className="opacity-20 grayscale"
                      />
                      <h3 className="mt-3 font-heading text-lg font-bold text-white">
                        {mag.title}
                      </h3>
                      <p className="mt-2 text-xs text-white/50">
                        Issue #{mag.issueNumber}
                      </p>
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-transparent to-transparent p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <div className="flex w-full gap-2">
                        {owned ? (
                          <Link href="/library" className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-green-600/90 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-green-500">
                            <LockOpen size={14} />
                            Read Now
                          </Link>
                        ) : (
                          <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary py-2.5 text-xs font-semibold text-white transition-colors hover:bg-primary-light">
                            <ShoppingCart size={14} />
                            Buy - ${mag.price}
                          </button>
                        )}
                        <button className="flex items-center justify-center rounded-lg border border-white/20 p-2.5 text-white transition-colors hover:bg-white/10" title="Preview Summary">
                          <Eye size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                {/* Meta */}
                <div className="mt-4">
                  <p className="text-xs text-white/40">
                    {new Date(mag.publishDate).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-primary">
                    ${mag.price}
                  </p>
                </div>
              </div>
            </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
