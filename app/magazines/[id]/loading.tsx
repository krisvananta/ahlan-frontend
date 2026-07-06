import { Skeleton } from "@/components/ui/skeleton";

export default function MagazineReaderLoading() {
  return (
    <div className="min-h-screen bg-[var(--color-dark-bg)] pt-20 pb-16 text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Top bar skeleton */}
        <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-4">
          <Skeleton dark className="h-5 w-32" />
          <div className="flex gap-3">
            <Skeleton dark className="h-9 w-24 rounded-lg" />
            <Skeleton dark className="h-9 w-24 rounded-lg" />
          </div>
        </div>

        {/* Viewer skeleton */}
        <div className="flex flex-col items-center justify-center py-12">
          <Skeleton dark className="aspect-[3/4] w-full max-w-2xl rounded-2xl shadow-2xl" />
          <div className="mt-8 flex items-center gap-6">
            <Skeleton dark className="h-10 w-10 rounded-full" />
            <Skeleton dark className="h-5 w-36" />
            <Skeleton dark className="h-10 w-10 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
