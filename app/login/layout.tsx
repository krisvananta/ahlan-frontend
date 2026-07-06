import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log In — Ahlan Magazine",
  description: "Access your subscriber account to read official magazines and submit fan articles.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
