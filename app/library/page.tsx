import { getMagazines, getArticles } from "@/lib/api";
import LibraryClient from "./LibraryClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Library — Ahlan Magazine",
  description: "Access your purchased e-magazines and exclusive digital collection.",
};

export const revalidate = 60; // Refresh library periodically

export default async function LibraryPage() {
  const [magazines, posts] = await Promise.all([
    getMagazines(),
    getArticles(20),
  ]);

  return <LibraryClient magazines={magazines} posts={posts} />;
}
