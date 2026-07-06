import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Digital Magazine Library — Ahlan",
  description: "Browse official publications and fan-contributed community articles in the Ahlan digital library.",
};

export default function LibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
