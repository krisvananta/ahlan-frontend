import {
  HeaderSkeleton,
  GridSkeleton,
  Skeleton,
} from "@/components/ui/skeleton";

export default function LibraryLoading() {
  return (
    <div className="min-h-screen bg-cream pt-28 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <HeaderSkeleton align="left" />

        {/* Tabs Skeleton */}
        <div className="mb-8 flex gap-2">
          <Skeleton className="h-12 w-48 rounded-xl" />
          <Skeleton className="h-12 w-48 rounded-xl" />
        </div>

        <GridSkeleton count={8} columns={4} aspectRatio="aspect-[3/4]" />
      </div>
    </div>
  );
}
