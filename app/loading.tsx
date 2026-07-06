import {
  HeroSkeleton,
  HeaderSkeleton,
  GridSkeleton,
  Skeleton,
} from "@/components/ui/skeleton";

export default function RootLoading() {
  return (
    <div className="min-h-screen bg-cream pt-20">
      <HeroSkeleton />

      {/* Magazine Grid Skeleton */}
      <div className="bg-[var(--color-dark-bg)] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Skeleton dark className="mb-8 h-8 w-48" />
          <div className="flex gap-6 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <Skeleton
                key={i}
                dark
                className="h-80 w-56 flex-shrink-0 rounded-xl sm:w-64"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Blog Feed Skeleton */}
      <div className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <HeaderSkeleton align="left" showDivider={false} />
          <GridSkeleton count={6} columns={3} />
        </div>
      </div>
    </div>
  );
}
