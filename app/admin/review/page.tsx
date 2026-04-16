"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPendingArticles } from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";
import { WPPost } from "@/types";
import { Clock, Eye, ShieldAlert } from "lucide-react";

export default function AdminReviewDashboard() {
  const { token, user } = useAuth();
  const [pending, setPending] = useState<WPPost[]>([]);
  const [loading, setLoading] = useState(true);

  // We enforce basic admin role checks on client side as an example.
  // Full protection should be enforced natively analyzing token via MW.
  const isAdmin = user?.role === "administrator" || user?.role === "editor";

  useEffect(() => {
    async function fetchPending() {
      if (!token) return;
      try {
        const data = await getPendingArticles(token);
        
        // Mock fallback if active
        if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true" && data.length === 0) {
           const { mockPosts } = await import("@/lib/mock-data");
           setPending([{ ...mockPosts[0], id: "mock-id-123" }]);
        } else {
           setPending(data);
        }
      } catch (err) {
        console.error("Failed to load pending articles", err);
      } finally {
        setLoading(false);
      }
    }
    
    if (isAdmin) {
      fetchPending();
    } else {
      setLoading(false);
    }
  }, [isAdmin, token]);

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-4 text-center">
        <ShieldAlert size={48} className="mb-4 text-error" />
        <h1 className="font-heading text-2xl font-bold text-heading">Access Denied</h1>
        <p className="mt-2 text-muted">You must have editorial privileges to view this section.</p>
        <Link href="/" className="mt-6 text-sm font-semibold text-primary">Return to Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7f9] pt-24 pb-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold text-heading">
              Editorial Review Queue
            </h1>
            <p className="mt-2 text-muted">
              Approve pending Fan-Writer submissions.
            </p>
          </div>
          <div className="flex h-10 items-center justify-center rounded-lg bg-orange-100 px-4 text-sm font-bold uppercase tracking-wider text-orange-800 shadow-sm">
            {pending.length} Pending
          </div>
        </div>

        {loading ? (
          <div className="flex py-20 justify-center">
            <span className="text-sm text-muted">Loading queue...</span>
          </div>
        ) : pending.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-gray-300 p-16 text-center">
            <p className="font-heading text-2xl font-bold text-gray-500">Inbox Zero!</p>
            <p className="mt-2 text-gray-400">There are no pending submissions in the queue right now.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-200">
            <table className="w-full text-left text-sm text-muted">
              <thead className="bg-[#1f2937] text-xs uppercase text-white shadow-sm">
                <tr>
                  <th className="px-6 py-4 font-bold tracking-wider">Article Title</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Author</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Submitted</th>
                  <th className="px-6 py-4 text-right font-bold tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pending.map((post) => (
                  <tr key={post.id} className="transition-colors hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-heading">
                      <div className="flex items-center gap-3">
                        <Clock size={16} className="text-orange-500" />
                        <span className="line-clamp-1">{post.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {post.author.name}
                    </td>
                    <td className="px-6 py-4">
                      {post.date ? new Date(post.date).toLocaleDateString() : "Just now"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/review/${post.id || post.slug}`}
                        className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
                      >
                        <Eye size={16} />
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
