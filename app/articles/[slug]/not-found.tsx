import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

/**
 * Custom 404 page for articles.
 * Shown when getArticleBySlug returns null (article doesn't exist).
 */
export default function ArticleNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream pt-20">
      <div className="mx-4 max-w-md text-center">
        {/* Decorative 404 */}
        <div className="relative mx-auto mb-8 flex h-32 w-32 items-center justify-center">
          <span className="font-heading text-8xl font-bold text-cream-dark">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <Search size={40} className="text-primary/30" />
          </div>
        </div>

        <h1 className="font-heading text-2xl font-bold text-heading sm:text-3xl">
          Article Not Found
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
          The article you&apos;re looking for may have been moved, removed, or
          doesn&apos;t exist. Try browsing our latest articles instead.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/blog"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-light"
          >
            Browse Articles
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-cream-dark px-6 py-3 text-sm font-semibold text-body transition-colors hover:border-primary hover:text-primary"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
