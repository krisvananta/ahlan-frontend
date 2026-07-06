import HeroSection from "@/components/sections/Hero";
import MagazineGrid from "@/components/sections/MagazineGrid";
import BlogFeed from "@/components/sections/BlogFeed";
import Merchandise from "@/components/sections/Merchandise";
import About from "@/components/sections/About";
import { getArticles, getMagazines, getProducts } from "@/lib/api";

export const revalidate = 60; // Refresh home page periodically to show latest blog posts

export default async function Home() {
  const [latestPosts, magazines, products] = await Promise.all([
    getArticles(6), // Fetch 6 latest posts for Home Page preview
    getMagazines(),
    getProducts(),
  ]);

  return (
    <>
      <HeroSection />
      <MagazineGrid magazines={magazines} />
      <BlogFeed posts={latestPosts} />
      <Merchandise products={products} />
      <About />
    </>
  );
}
