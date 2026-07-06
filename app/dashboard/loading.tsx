import {
  HeaderSkeleton,
  ListSkeleton,
  Skeleton,
} from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-cream pt-28 pb-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <HeaderSkeleton align="left" showDivider={false} />

        {/* Cards Skeleton */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white p-6 shadow-[var(--shadow-card)]"
            >
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <ListSkeleton items={5} />
        </div>
      </div>
    </div>
  );
}
