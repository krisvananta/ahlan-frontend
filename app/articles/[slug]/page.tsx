import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import { getArticleBySlug, getAllArticleSlugs } from "@/lib/api";
import ThemeWrapper from "@/components/article/ThemeWrapper";
import type { Metadata } from "next";

// ================================
// Types
// ================================

interface PageProps {
  params: Promise<{ slug: string }>;
}

// ================================
// Metadata
// ================================

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article Not Found — Ahlan",
      description: "The article you're looking for doesn't exist.",
    };
  }

  return {
    title: `${article.title} — Ahlan Magazine`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.date,
      authors: [article.author.name],
      images: article.featuredImage
        ? [{ url: article.featuredImage.url, alt: article.featuredImage.alt }]
        : [],
    },
  };
}

// ================================
// Static Params (ISR)
// ================================

export async function generateStaticParams() {
  const slugs = await getAllArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

// ================================
// Page Component
// ================================

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;

  let article;
  try {
    article = await getArticleBySlug(slug);
  } catch {
    // API connection error — show a friendly error
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
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-light"
            >
              <ArrowLeft size={16} />
              Back to Home
            </Link>
            <Link
              href={`/articles/${slug}`}
              className="text-sm font-medium text-primary transition-colors hover:text-primary-light"
            >
              Try Again
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!article) notFound();

  const designConfig = article.designConfig || {
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
          Back to Articles
        </Link>
      </div>

      {/* Article with Design Engine */}
      <ThemeWrapper designConfig={designConfig}>
        {/* Article Header */}
        <header className="mb-10">
          {/* Categories */}
          {article.categories.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {article.categories.map((cat) => (
                <span
                  key={cat}
                  className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider"
                  style={{
                    backgroundColor: `${accentColor}12`,
                    color: accentColor,
                  }}
                >
                  <Tag size={10} />
                  {cat}
                </span>
              ))}
            </div>
          )}

          <h1>{article.title}</h1>

          {/* Meta */}
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm opacity-70">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {new Date(article.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <User size={14} />
              {article.author.name}
            </span>
          </div>

          {/* Divider */}
          <div
            className="mt-8 h-px w-full"
            style={{ backgroundColor: `${accentColor}20` }}
          />
        </header>

        {/* Article Content (HTML from WordPress) */}
        <div dangerouslySetInnerHTML={{ __html: article.content }} />

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
              {article.author.name.charAt(0)}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider opacity-50">
                Written by
              </p>
              <p
                className="mt-0.5 font-heading text-lg font-bold"
                style={{ color: accentColor }}
              >
                {article.author.name}
              </p>
              {article.author.bio && (
                <p className="mt-1 text-sm leading-relaxed opacity-60">
                  {article.author.bio}
                </p>
              )}
            </div>
          </div>
        </footer>
      </ThemeWrapper>
    </div>
  );
}
