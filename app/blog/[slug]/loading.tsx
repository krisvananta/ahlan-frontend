import { Skeleton } from "@/components/ui/skeleton";

export default function ArticleDetailLoading() {
  return (
    <div className="min-h-screen bg-cream pt-28 pb-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Back Link Skeleton */}
        <Skeleton className="mb-8 h-6 w-32 rounded-lg" />

        {/* Article Header Skeleton */}
        <div className="mb-10 space-y-6 text-center">
          <Skeleton className="mx-auto h-6 w-28 rounded-full" />
          <Skeleton className="mx-auto h-12 w-full rounded-xl sm:h-16" />
          <div className="flex items-center justify-center gap-4 pt-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 text-left">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>

        {/* Hero Image Skeleton */}
        <Skeleton className="mb-12 aspect-[16/9] w-full rounded-3xl" />

        {/* Article Body Skeleton */}
        <div className="mx-auto max-w-3xl space-y-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-11/12" />
              <Skeleton className="h-5 w-4/5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
