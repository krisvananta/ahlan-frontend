import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editorial Review Queue — Ahlan Admin",
  description: "Review, edit, and approve community-submitted articles for publication.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
