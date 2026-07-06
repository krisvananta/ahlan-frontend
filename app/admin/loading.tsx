import {
  HeaderSkeleton,
  TableSkeleton,
} from "@/components/ui/skeleton";

export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-cream pt-28 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <HeaderSkeleton align="left" showDivider={false} />
        <TableSkeleton rows={6} />
      </div>
    </div>
  );
}
