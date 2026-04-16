/**
 * Loading skeleton for article pages.
 * Shows while the Server Component fetches data from WordPress.
 */
export default function ArticleLoading() {
  return (
    <div className="min-h-screen bg-cream pt-20">
      {/* Back nav skeleton */}
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <div className="h-4 w-32 animate-pulse rounded bg-cream-dark" />
      </div>

      {/* Article skeleton */}
      <div className="mx-auto max-w-4xl px-6 py-12 sm:px-12 sm:py-16 lg:px-20 lg:py-20">
        {/* Category badges */}
        <div className="mb-6 flex gap-2">
          <div className="h-6 w-16 animate-pulse rounded-full bg-cream-dark" />
          <div className="h-6 w-20 animate-pulse rounded-full bg-cream-dark" />
        </div>

        {/* Title */}
        <div className="space-y-3">
          <div className="h-10 w-full animate-pulse rounded-lg bg-cream-dark" />
          <div className="h-10 w-3/4 animate-pulse rounded-lg bg-cream-dark" />
        </div>

        {/* Meta */}
        <div className="mt-6 flex gap-4">
          <div className="h-4 w-32 animate-pulse rounded bg-cream-dark" />
          <div className="h-4 w-28 animate-pulse rounded bg-cream-dark" />
        </div>

        {/* Divider */}
        <div className="mt-8 h-px w-full bg-cream-dark" />

        {/* Content paragraphs */}
        <div className="mt-10 space-y-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-full animate-pulse rounded bg-cream-dark" />
              <div className="h-4 w-full animate-pulse rounded bg-cream-dark" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-cream-dark" />
              <div className="h-4 w-4/6 animate-pulse rounded bg-cream-dark" />
            </div>
          ))}

          {/* Subheading */}
          <div className="h-7 w-2/3 animate-pulse rounded-lg bg-cream-dark" />

          {[...Array(3)].map((_, i) => (
            <div key={i + 4} className="space-y-2">
              <div className="h-4 w-full animate-pulse rounded bg-cream-dark" />
              <div className="h-4 w-full animate-pulse rounded bg-cream-dark" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-cream-dark" />
            </div>
          ))}
        </div>

        {/* Author box skeleton */}
        <div className="mt-16 border-t border-cream-dark pt-8">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 animate-pulse rounded-full bg-cream-dark" />
            <div className="space-y-2">
              <div className="h-3 w-16 animate-pulse rounded bg-cream-dark" />
              <div className="h-5 w-36 animate-pulse rounded bg-cream-dark" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
