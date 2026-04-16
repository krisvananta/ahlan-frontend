import Link from "next/link";
import { ArrowLeft, Calendar, Tag, User, ArrowRight } from "lucide-react";
import { getPosts } from "@/lib/api";

export const revalidate = 60; // ISR revalidation

export default async function BlogPage() {
  const posts = await getPosts();

  if (!posts || posts.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream pt-20">
        <p className="text-muted">No blog posts found.</p>
      </div>
    );
  }

  // First post is featured
  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

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
            The Journal
          </h1>
          <p className="mt-3 max-w-xl text-muted">
            Stories, perspectives, and insights from our global community of writers.
          </p>
          <div className="section-divider mt-6 !ml-0" />
        </div>

        {/* Featured Post */}
        <div className="mb-16">
          <Link
            href={`/blog/${featuredPost.slug}`}
            className="group flex flex-col gap-8 rounded-2xl bg-white p-6 shadow-[var(--shadow-card)] transition-all hover:shadow-[var(--shadow-card-hover)] md:flex-row md:items-center lg:gap-12 lg:p-8"
          >
            {/* Featured Image - using CSS fallback if no image */}
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl md:w-1/2 lg:w-3/5">
              {featuredPost.featuredImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={featuredPost.featuredImage.url}
                  alt={featuredPost.featuredImage.alt}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center transition-transform duration-700 group-hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${
                      featuredPost.designConfig?.bgColor || "#e8f5e9"
                    } 0%, ${
                      featuredPost.designConfig?.accentColor || "#0a5c36"
                    }30 100%)`,
                  }}
                >
                  <span
                    className="font-heading text-8xl font-bold opacity-20"
                    style={{ color: featuredPost.designConfig?.accentColor }}
                  >
                    أ
                  </span>
                </div>
              )}
              {/* Featured Badge */}
              <div className="absolute left-4 top-4 rounded-full bg-accent px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
                Featured
              </div>
            </div>

            {/* Featured Content */}
            <div className="flex w-full flex-col md:w-1/2 lg:w-2/5">
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wider text-primary">
                {featuredPost.categories.slice(0, 2).map((cat) => (
                  <span key={cat}>{cat}</span>
                ))}
              </div>
              <h2 className="mt-4 font-heading text-2xl font-bold leading-tight text-heading transition-colors group-hover:text-primary md:text-3xl lg:text-4xl">
                {featuredPost.title}
              </h2>
              <p className="mt-4 line-clamp-3 text-base text-muted md:line-clamp-4">
                {featuredPost.excerpt}
              </p>

              <div className="mt-8 flex items-center justify-between border-t border-cream-dark pt-6 text-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                    {featuredPost.author.name.charAt(0)}
                  </div>
                  <div>
                    <span className="block font-semibold text-heading">
                      {featuredPost.author.name}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted">
                      <Calendar size={12} />
                      {new Date(featuredPost.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
                <div className="hidden items-center justify-center rounded-full bg-cream-dark p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-white sm:flex">
                  <ArrowRight size={18} />
                </div>
              </div>
            </div>
          </Link>
        </div>

        <h3 className="mb-8 font-heading text-2xl font-bold text-heading">
          Latest Articles
        </h3>

        {/* Standard Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {remainingPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex flex-col block overflow-hidden rounded-xl bg-white shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
            >
              {/* Card Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-cream-dark">
                {post.featuredImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.featuredImage.url}
                    alt={post.featuredImage.alt}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div
                    className="absolute inset-0 flex items-center justify-center transition-transform duration-500 group-hover:scale-105"
                    style={{
                      background: `linear-gradient(135deg, ${
                        post.designConfig?.bgColor || "#e8f5e9"
                      } 0%, ${
                        post.designConfig?.accentColor || "#0a5c36"
                      }30 100%)`,
                    }}
                  >
                    <span
                      className="font-heading text-5xl font-bold opacity-20"
                      style={{ color: post.designConfig?.accentColor }}
                    >
                      أ
                    </span>
                  </div>
                )}
                {/* Categories overlay */}
                <div className="absolute left-3 top-3 flex gap-1.5">
                  {post.categories.slice(0, 1).map((cat) => (
                    <span
                      key={cat}
                      className="rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-heading shadow-sm"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Content */}
              <div className="flex flex-col flex-1 p-6">
                <h2 className="font-heading text-xl font-bold leading-snug text-heading transition-colors group-hover:text-primary">
                  {post.title}
                </h2>
                <p className="mt-3 flex-1 line-clamp-2 text-sm text-muted">
                  {post.excerpt}
                </p>
                <div className="mt-6 flex items-center gap-3 border-t border-cream-dark pt-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <User size={14} className="text-primary" />
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-heading">
                      {post.author.name}
                    </span>
                    <span className="block text-[10px] text-muted">
                      {new Date(post.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
