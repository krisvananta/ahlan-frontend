import type { Metadata } from "next";
import { getMagazines } from "@/lib/api";

interface LayoutProps {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({
  params,
}: LayoutProps): Promise<Metadata> {
  const { id } = await params;
  const magazines = await getMagazines();
  const mag = magazines.find((m) => m.id === id);

  if (!mag) {
    return {
      title: "Magazine Reader — Ahlan",
      description: "Secure digital magazine reader.",
    };
  }

  return {
    title: `${mag.title} — Issue #${mag.issueNumber} Reader`,
    description: mag.description,
  };
}

export default function MagazineReaderLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
