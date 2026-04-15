"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ShoppingBag, ArrowUpRight } from "lucide-react";
import { mockProducts } from "@/lib/mock-data";

export default function Merchandise() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="merchandise"
      ref={ref}
      className="relative overflow-hidden bg-white py-[var(--spacing-section)]"
    >
      {/* Subtle pattern */}
      <div className="pattern-overlay pointer-events-none absolute inset-0 opacity-40" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 flex flex-col items-center text-center sm:mb-16"
        >
          <span className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-accent-dark">
            Ahlan Store
          </span>
          <h2 className="font-heading text-3xl font-bold text-heading sm:text-4xl lg:text-5xl">
            Merchandise
          </h2>
          <p className="mt-4 max-w-xl text-sm text-muted sm:text-base">
            Wear your identity. Premium, ethically sourced products inspired by
            Islamic art and calligraphy.
          </p>
          <div className="section-divider mt-6" />
        </motion.div>

        {/* Product Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {mockProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden rounded-xl bg-cream shadow-[var(--shadow-card)] transition-all duration-500 group-hover:shadow-[var(--shadow-card-hover)]">
                {/* Placeholder */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-cream to-cream-dark p-6 transition-transform duration-500 group-hover:scale-105">
                  <ShoppingBag
                    size={40}
                    className="text-primary/20"
                  />
                  <span className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted">
                    {product.category}
                  </span>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-primary/80 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                  <button className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary shadow-lg transition-transform hover:scale-105">
                    Quick View
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="mt-4">
                <h3 className="font-heading text-base font-bold text-heading transition-colors group-hover:text-primary">
                  {product.name}
                </h3>
                <p className="mt-1 line-clamp-1 text-xs text-muted">
                  {product.description}
                </p>
                <p className="mt-2 text-lg font-bold text-accent-dark">
                  ${product.price}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
