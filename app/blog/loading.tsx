import {
  HeaderSkeleton,
  FeaturedPostSkeleton,
  GridSkeleton,
} from "@/components/ui/skeleton";

export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-cream pt-28 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <HeaderSkeleton />
        <FeaturedPostSkeleton />
        <GridSkeleton count={6} columns={3} />
      </div>
    </div>
  );
}
