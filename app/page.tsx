import HeroSection from "@/components/sections/Hero";
import MagazineGrid from "@/components/sections/MagazineGrid";
import BlogFeed from "@/components/sections/BlogFeed";
import Merchandise from "@/components/sections/Merchandise";
import About from "@/components/sections/About";
import { getPosts } from "@/lib/api";

export const revalidate = 60; // Refresh home page periodically to show latest blog posts

export default async function Home() {
  const latestPosts = await getPosts(6); // Fetch 6 latest posts for Home Page preview

  return (
    <>
      <HeroSection />
      <MagazineGrid />
      <BlogFeed posts={latestPosts} />
      <Merchandise />
      <About />
    </>
  );
}
