import { Skeleton } from "@/components/ui/skeleton";

export default function LoginLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4 py-20">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-[var(--shadow-card)] sm:p-10">
        <div className="mb-8 text-center">
          <Skeleton className="mx-auto mb-4 h-12 w-12 rounded-full" />
          <Skeleton className="mx-auto h-7 w-48 rounded-lg" />
          <Skeleton className="mx-auto mt-2 h-4 w-64" />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
          <Skeleton className="mt-6 h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
