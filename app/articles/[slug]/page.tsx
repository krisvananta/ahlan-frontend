import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Redirect legacy /articles/[slug] route to canonical /blog/[slug] route.
 * Prevents SEO duplicate content issues while preserving any bookmarked or external links.
 */
export default async function ArticlesRedirectPage({ params }: PageProps) {
  const { slug } = await params;
  redirect(`/blog/${slug}`);
}
