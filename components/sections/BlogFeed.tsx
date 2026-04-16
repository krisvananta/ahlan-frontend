"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Calendar, Tag } from "lucide-react";
import type { WPPost } from "@/types";

interface BlogFeedProps {
  posts: WPPost[];
}

export default function BlogFeed({ posts }: BlogFeedProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="blog"
      ref={ref}
      className="relative py-[var(--spacing-section)] bg-cream"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 flex flex-col items-center text-center sm:mb-16"
        >
          <span className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-accent-dark">
            Fan-Writer Community
          </span>
          <h2 className="font-heading text-3xl font-bold text-heading sm:text-4xl lg:text-5xl">
            Latest from the Blog
          </h2>
          <p className="mt-4 max-w-xl text-sm text-muted sm:text-base">
            Perspectives, stories, and insights from our global community of
            Muslim writers and thinkers.
          </p>
          <div className="section-divider mt-6" />
        </motion.div>

        {/* Blog Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, 6).map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group"
            >
              <Link href={`/blog/${post.slug}`} className="block">
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-cream-dark">
                  {/* Placeholder with design-config-inspired colors */}
                  <div
                    className="absolute inset-0 flex items-center justify-center transition-transform duration-500 group-hover:scale-105"
                    style={{
                      background: `linear-gradient(135deg, ${post.designConfig?.bgColor || "#e8f5e9"} 0%, ${post.designConfig?.accentColor || "#0a5c36"}30 100%)`,
                    }}
                  >
                    <span
                      className="font-heading text-5xl font-bold opacity-20"
                      style={{ color: post.designConfig?.accentColor }}
                    >
                      أ
                    </span>
                  </div>

                  {/* Category badge */}
                  <div className="absolute left-3 top-3 flex gap-1.5">
                    {post.categories.slice(0, 2).map((cat) => (
                      <span
                        key={cat}
                        className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-heading backdrop-blur-sm"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>

                  {/* Arrow icon on hover */}
                  <div className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-heading opacity-0 shadow-sm backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
                    <ArrowUpRight size={14} />
                  </div>
                </div>

                {/* Content */}
                <div className="mt-4">
                  <div className="flex items-center gap-3 text-xs text-muted">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(post.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Tag size={12} />
                      {post.categories[0]}
                    </span>
                  </div>

                  <h3 className="mt-2 font-heading text-lg font-bold leading-snug text-heading transition-colors group-hover:text-primary">
                    {post.title}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
                    {post.excerpt}
                  </p>

                  {/* Author */}
                  <div className="mt-4 flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {post.author.name.charAt(0)}
                    </div>
                    <span className="text-xs font-medium text-body">
                      {post.author.name}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 rounded-full border-2 border-primary px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-primary transition-all hover:bg-primary hover:text-white"
          >
            View All Articles
            <ArrowUpRight
              size={16}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
