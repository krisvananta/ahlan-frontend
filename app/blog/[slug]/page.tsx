import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Tag, Link2 } from "lucide-react";
import { getPostBySlug, getPosts } from "@/lib/api";
import ThemeWrapper from "@/components/article/ThemeWrapper";
import type { Metadata } from "next";

export const revalidate = 60; // ISR for fast loading

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return { title: "Post Not Found — Ahlan" };

  return {
    title: `${post.title} — Ahlan`,
    description: post.excerpt,
  };
}

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

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
              {new Date(post.date).toLocaleDateString("en-US", {
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
            <div className="mt-12 overflow-hidden rounded-2xl shadow-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={post.featuredImage.url} 
                alt={post.featuredImage.alt}
                className="w-full object-cover aspect-[21/9]" 
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
          dangerouslySetInnerHTML={{ __html: post.content }} 
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
