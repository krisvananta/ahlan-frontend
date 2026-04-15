import HeroSection from "@/components/sections/Hero";
import MagazineGrid from "@/components/sections/MagazineGrid";
import BlogFeed from "@/components/sections/BlogFeed";
import Merchandise from "@/components/sections/Merchandise";
import About from "@/components/sections/About";

export default function Home() {
  return (
    <>
      <HeroSection />
      <MagazineGrid />
      <BlogFeed />
      <Merchandise />
      <About />
    </>
  );
}
