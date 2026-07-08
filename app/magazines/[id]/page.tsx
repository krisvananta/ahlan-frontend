import { getMagazineById } from "@/lib/api";
import MagazineReaderClient from "./MagazineReaderClient";

export const revalidate = 60; // Refresh magazine data periodically

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * Magazine Reader Page (Server Component)
 *
 * Fetches magazine metadata on the server so that WordPress GraphQL credentials
 * and local hostnames (e.g. ahlan-backend.local) remain server-side.
 * Passes the data cleanly to the client reader component.
 */
export default async function MagazineReaderPage({ params }: PageProps) {
  const { id } = await params;
  let magazine = null;
  try {
    magazine = await getMagazineById(id);
  } catch {
    magazine = null;
  }

  return <MagazineReaderClient magazine={magazine} magazineId={id} />;
}
