import React from "react";

/**
 * Base atomic Skeleton box with pulse animation
 */
export function Skeleton({
  className = "",
  dark = false,
}: {
  className?: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`animate-pulse rounded ${
        dark ? "bg-white/10" : "bg-cream-dark"
      } ${className}`}
    />
  );
}

/**
 * Reusable Header Skeleton for pages and sections
 */
export function HeaderSkeleton({
  align = "center",
  showDivider = true,
  dark = false,
}: {
  align?: "center" | "left";
  showDivider?: boolean;
  dark?: boolean;
}) {
  return (
    <div className={`mb-10 ${align === "center" ? "text-center" : ""}`}>
      <Skeleton
        dark={dark}
        className={`mb-3 h-4 w-24 ${align === "center" ? "mx-auto" : ""}`}
      />
      <Skeleton
        dark={dark}
        className={`h-10 w-64 rounded-lg sm:h-12 ${
          align === "center" ? "mx-auto" : ""
        }`}
      />
      <Skeleton
        dark={dark}
        className={`mt-3 h-5 w-96 max-w-full ${
          align === "center" ? "mx-auto" : ""
        }`}
      />
      {showDivider && (
        <div
          className={`section-divider mt-6 ${
            align === "left" ? "!ml-0" : ""
          }`}
        />
      )}
    </div>
  );
}

/**
 * Reusable Card Skeleton for magazines, blog posts, and products
 */
export function CardSkeleton({
  aspectRatio = "aspect-[16/10]",
  showFooter = true,
  dark = false,
}: {
  aspectRatio?: string;
  showFooter?: boolean;
  dark?: boolean;
}) {
  return (
    <div
      className={`flex flex-col overflow-hidden rounded-2xl p-4 sm:p-5 ${
        dark
          ? "bg-white/5 border border-white/10"
          : "bg-white shadow-[var(--shadow-card)]"
      }`}
    >
      <Skeleton dark={dark} className={`${aspectRatio} w-full rounded-xl`} />
      <div className="mt-4 flex-1 space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton dark={dark} className="h-5 w-20 rounded-full" />
          <Skeleton dark={dark} className="h-4 w-16" />
        </div>
        <Skeleton dark={dark} className="h-6 w-full" />
        <Skeleton dark={dark} className="h-4 w-5/6" />
      </div>
      {showFooter && (
        <div
          className={`mt-6 flex items-center justify-between pt-4 ${
            dark ? "border-t border-white/10" : "border-t border-cream-dark"
          }`}
        >
          <div className="flex items-center gap-2">
            <Skeleton dark={dark} className="h-8 w-8 rounded-full" />
            <Skeleton dark={dark} className="h-3 w-20" />
          </div>
          <Skeleton dark={dark} className="h-4 w-12" />
        </div>
      )}
    </div>
  );
}

/**
 * Reusable Responsive Grid Skeleton
 */
export function GridSkeleton({
  count = 6,
  columns = 3,
  aspectRatio = "aspect-[16/10]",
  showFooter = true,
  dark = false,
}: {
  count?: number;
  columns?: 2 | 3 | 4;
  aspectRatio?: string;
  showFooter?: boolean;
  dark?: boolean;
}) {
  const gridColsMap = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={`grid gap-6 sm:gap-8 ${gridColsMap[columns]}`}>
      {[...Array(count)].map((_, i) => (
        <CardSkeleton
          key={i}
          aspectRatio={aspectRatio}
          showFooter={showFooter}
          dark={dark}
        />
      ))}
    </div>
  );
}

/**
 * Hero Section Skeleton for homepage or feature pages
 */
export function HeroSkeleton() {
  return (
    <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-6 text-center">
        <Skeleton className="mx-auto h-6 w-36 rounded-full" />
        <Skeleton className="h-14 w-full rounded-2xl sm:h-20" />
        <Skeleton className="mx-auto h-6 w-3/4" />
        <div className="mt-8 flex justify-center gap-4">
          <Skeleton className="h-12 w-36 rounded-xl" />
          <Skeleton className="h-12 w-36 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

/**
 * Featured Post Skeleton for Blog catalog
 */
export function FeaturedPostSkeleton() {
  return (
    <div className="mb-16 overflow-hidden rounded-3xl bg-white p-6 shadow-[var(--shadow-card)] sm:p-8 lg:p-10">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
        <Skeleton className="aspect-[16/10] w-full rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-28 rounded-full" />
          <Skeleton className="h-8 w-full rounded-lg sm:h-10" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <div className="flex items-center gap-3 pt-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Table Skeleton for Admin & Review queues
 */
export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white p-6 shadow-[var(--shadow-card)]">
      <div className="mb-6 flex justify-between">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-12 w-full rounded-lg opacity-50" />
        {[...Array(rows)].map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between border-b border-cream-dark py-3"
          >
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-8 w-20 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * List Skeleton for Dashboard & History lists
 */
export function ListSkeleton({ items = 5 }: { items?: number }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-[var(--shadow-card)]">
      <Skeleton className="mb-6 h-6 w-36" />
      <div className="space-y-4">
        {[...Array(items)].map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between border-b border-cream-dark pb-4 last:border-0 last:pb-0"
          >
            <div className="space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
