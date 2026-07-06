import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, User, Tag, Link2 } from "lucide-react";
import { getArticleBySlug, getArticles } from "@/lib/api";
import { sanitizeHtml } from "@/lib/sanitize";
import ThemeWrapper from "@/components/article/ThemeWrapper";
import type { Metadata } from "next";
import { formatDateID } from "@/lib/format";

export const revalidate = 60; // ISR for fast loading

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getArticleBySlug(slug);

  if (!post) return { title: "Post Not Found — Ahlan" };

  return {
    title: `${post.title} — Ahlan Magazine`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author.name],
      images: post.featuredImage
        ? [{ url: post.featuredImage.url, alt: post.featuredImage.alt }]
        : [],
    },
  };
}

export async function generateStaticParams() {
  const posts = await getArticles();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  let post;
  try {
    post = await getArticleBySlug(slug);
  } catch {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream pt-20">
        <div className="mx-4 max-w-md rounded-2xl bg-white p-10 text-center shadow-[var(--shadow-card)]">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-error/10">
            <span className="text-3xl">⚠️</span>
          </div>
          <h1 className="font-heading text-2xl font-bold text-heading">
            Connection Error
          </h1>
          <p className="mt-3 text-sm text-muted">
            We couldn&apos;t connect to our content server. Please check your
            connection and try again.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/blog"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-light"
            >
              <ArrowLeft size={16} />
              Back to Blog
            </Link>
            <Link
              href={`/blog/${slug}`}
              className="text-sm font-medium text-primary transition-colors hover:text-primary-light"
            >
              Try Again
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!post) notFound();

  // If the WP user defines a custom design, use it. Otherwise, fallback to a clean serif/sans default
  const designConfig = post.designConfig || {
    bgColor: "#ffffff",
    textColor: "#1f2937",
    primaryFont: "serif", // heading: serif, body: sans
    decorationType: "minimal",
    accentColor: "#0a5c36",
  };

  const accentColor = designConfig.accentColor || "#0a5c36";

  return (
    <div className="min-h-screen pt-20">
      {/* Back Navigation */}
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-primary"
        >
          <ArrowLeft size={16} />
          Back to Blog
        </Link>
      </div>

      {/* Article Wrapper */}
      <ThemeWrapper designConfig={designConfig}>
        {/* Article Header */}
        <header className="mb-10 text-center">
          {/* Categories */}
          <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
            {post.categories.map((cat) => (
              <span
                key={cat}
                className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider"
                style={{
                  backgroundColor: `${accentColor}15`,
                  color: accentColor,
                }}
              >
                <Tag size={10} />
                {cat}
              </span>
            ))}
          </div>

          <h1 className="mx-auto max-w-3xl font-heading text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm font-medium opacity-80">
            <span className="flex items-center gap-1.5">
              <Calendar size={16} />
              {formatDateID(post.date, {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1.5 border-l border-current pl-6">
              <User size={16} />
              {post.author.name}
            </span>
          </div>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="relative mt-12 aspect-[21/9] w-full overflow-hidden rounded-2xl shadow-xl">
              <Image 
                src={post.featuredImage.url} 
                alt={post.featuredImage.alt || post.title}
                fill
                priority
                sizes="100vw"
                className="object-cover" 
              />
            </div>
          )}

          {/* Divider */}
          {!post.featuredImage && (
            <div
              className="mt-10 h-px w-full"
              style={{ backgroundColor: `${accentColor}20` }}
            />
          )}
        </header>

        {/* Article Content (from WordPress) */}
        {/* Enforce serif headings and nice sans-serif body reading experience inside prose */}
        <div 
          className="prose prose-lg mx-auto w-full max-w-none prose-headings:font-heading prose-headings:font-bold prose-p:font-sans prose-a:text-primary"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }} 
        />

        {/* Share & Author Box */}
        <footer
          className="mt-20 border-t pt-10"
          style={{ borderColor: `${accentColor}20` }}
        >
          {/* Share Buttons */}
          <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <span className="text-sm font-bold uppercase tracking-wider opacity-60">
              Share this article
            </span>
            <div className="flex gap-3">
              <button 
                title="Share on X"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#000000]/10 text-[#000000] transition-colors hover:bg-[#000000] hover:text-white"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="css-i6dzq1"><path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" /></svg>
              </button>
              <button 
                title="Share on Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1877F2]/10 text-[#1877F2] transition-colors hover:bg-[#1877F2] hover:text-white"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="css-i6dzq1"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </button>
              <button 
                title="Copy Link"
                className="group flex h-10 w-10 items-center justify-center rounded-full transition-colors relative overflow-hidden"
                style={{ backgroundColor: `${accentColor}10` }}
              >
                <div 
                  className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100" 
                  style={{ backgroundColor: accentColor }} 
                />
                <Link2 
                  size={18} 
                  className="relative z-10 transition-colors group-hover:text-white" 
                  style={{ color: accentColor }} 
                />
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center gap-6 rounded-2xl p-8 text-center sm:flex-row sm:text-left" style={{ backgroundColor: `${accentColor}08` }}>
            <div
              className="flex h-20 w-20 shrink-0 mx-auto items-center justify-center rounded-full text-3xl font-bold text-white shadow-lg sm:mx-0"
              style={{ backgroundColor: accentColor }}
            >
              {post.author.name.charAt(0)}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest opacity-50">
                Written by
              </p>
              <p
                className="mt-1 font-heading text-2xl font-bold"
                style={{ color: accentColor }}
              >
                {post.author.name}
              </p>
              <p className="mt-2 text-sm leading-relaxed opacity-80 max-w-xl">
                {post.author.bio || "Contributing Editor at Ahlan Magazine. Exploring intersections of culture, faith, and modern living."}
              </p>
            </div>
          </div>
        </footer>
      </ThemeWrapper>
    </div>
  );
}
