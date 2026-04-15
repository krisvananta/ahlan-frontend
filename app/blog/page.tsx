import Link from "next/link";
import { ArrowLeft, Calendar, Tag, User } from "lucide-react";
import { mockPosts } from "@/lib/mock-data";

export default function BlogPage() {
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
          <h1 className="font-heading text-3xl font-bold text-heading sm:text-4xl lg:text-5xl">
            Blog
          </h1>
          <p className="mt-3 max-w-xl text-muted">
            Stories, perspectives, and insights from our global community of
            Muslim writers.
          </p>
          <div className="section-divider mt-6 !ml-0" />
        </div>

        {/* Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {mockPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group block"
            >
              {/* Card Image */}
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-cream-dark">
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
                <div className="absolute left-3 top-3 flex gap-1.5">
                  {post.categories.map((cat) => (
                    <span
                      key={cat}
                      className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-heading"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Content */}
              <div className="mt-4">
                <div className="flex items-center gap-3 text-xs text-muted">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(post.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Tag size={12} />
                    {post.categories[0]}
                  </span>
                </div>
                <h2 className="mt-2 font-heading text-lg font-bold text-heading transition-colors group-hover:text-primary">
                  {post.title}
                </h2>
                <p className="mt-2 line-clamp-2 text-sm text-muted">
                  {post.excerpt}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                    <User size={12} className="text-primary" />
                  </div>
                  <span className="text-xs font-medium text-body">
                    {post.author.name}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
