import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import { getPostBySlug, getPosts } from "@/lib/api";
import ThemeWrapper from "@/components/article/ThemeWrapper";
import type { Metadata } from "next";

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

  const designConfig = post.designConfig || {
    bgColor: "#faf6f0",
    textColor: "#2d3436",
    primaryFont: "serif",
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

      {/* Article with Design Engine */}
      <ThemeWrapper designConfig={designConfig}>
        {/* Article Header */}
        <header className="mb-10">
          {/* Categories */}
          <div className="mb-4 flex flex-wrap gap-2">
            {post.categories.map((cat) => (
              <span
                key={cat}
                className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider"
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

          <h1>{post.title}</h1>

          {/* Meta */}
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm opacity-70">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {new Date(post.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <User size={14} />
              {post.author.name}
            </span>
          </div>

          {/* Divider */}
          <div
            className="mt-8 h-px w-full"
            style={{ backgroundColor: `${accentColor}20` }}
          />
        </header>

        {/* Article Content (from WordPress) */}
        <div dangerouslySetInnerHTML={{ __html: post.content }} />

        {/* Author Box */}
        <footer
          className="mt-16 border-t pt-8"
          style={{ borderColor: `${accentColor}20` }}
        >
          <div className="flex items-start gap-4">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white"
              style={{ backgroundColor: accentColor }}
            >
              {post.author.name.charAt(0)}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider opacity-50">
                Written by
              </p>
              <p
                className="mt-0.5 font-heading text-lg font-bold"
                style={{ color: accentColor }}
              >
                {post.author.name}
              </p>
              <p className="mt-1 text-sm opacity-60">
                Contributing Writer at Ahlan
              </p>
            </div>
          </div>
        </footer>
      </ThemeWrapper>
    </div>
  );
}
