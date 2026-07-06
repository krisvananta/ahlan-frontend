import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Dashboard — Ahlan Magazine",
  description: "Manage your magazine subscriptions, article submissions, and reading history.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
