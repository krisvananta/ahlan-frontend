"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Clock, CheckCircle2, XCircle } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { getPosts, getPendingArticles } from "@/lib/api";
import { WPPost } from "@/types";

export default function HistoryPage() {
  const { user, token, isAuthenticated } = useAuth();
  const [submissions, setSubmissions] = useState<{ post: WPPost; status: string; reviewNote?: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      if (!token) return;
      try {
        // Fetch both published and pending (in a real WP app, we'd have a specific query for 'my posts')
        // For demonstration, we aggregate pending articles and published ones.
        const pending = await getPendingArticles(token);
        const published = await getPosts(50); // Get latest

        // Filter out by current user email or name for "my posts" representation
        // If USE_MOCK is true, just show some dummy data
        const isMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";
        
        let aggregated = [
          ...pending.map(p => ({ post: p, status: "PENDING" })),
          ...published.map(p => ({ post: p, status: "PUBLISHED" }))
        ];

        if (!isMock && user) {
           // Basic filter to isolate user's posts.
           aggregated = aggregated.filter(item => item.post.author.name === user.name);
        } else if (isMock) {
           // Emulate mock History
           aggregated = [
             {
               post: { ...published[0], title: "My Awesome Fan Article" },
               status: "PENDING",
               reviewNote: "Needs a bit more typography matching, we will review the PDF soon.",
             },
             {
               post: { ...published[1], title: "A history of calligraphy" },
               status: "PUBLISHED",
             }
           ] as any[];
        }

        setSubmissions(aggregated);
      } catch (err) {
        console.error("Failed to fetch history:", err);
      } finally {
        setLoading(false);
      }
    }

    if (isAuthenticated) {
      fetchHistory();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, token, user]);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <p className="text-muted">Please log in to view your submissions.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pt-24 pb-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="font-heading text-3xl font-bold text-heading">
              Submission History
            </h1>
            <p className="mt-2 text-muted">
              Track the status of your fan-articles and read editorial review notes.
            </p>
          </div>
          <Link
            href="/dashboard/submit"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-light"
          >
            <Plus size={16} />
            New Submission
          </Link>
        </div>

        {loading ? (
          <div className="flex py-20 justify-center">
            <span className="text-sm text-muted">Loading your articles...</span>
          </div>
        ) : submissions.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-cream-dark p-12 text-center">
            <p className="font-heading text-xl font-bold text-heading">No submissions yet.</p>
            <p className="mt-2 text-sm text-muted">Share your first article with the community!</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {submissions.map((item, i) => (
              <div key={item.post.id || i} className="rounded-2xl border border-cream-dark bg-white p-6 shadow-sm">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                       {item.status === "PUBLISHED" ? (
                         <span className="flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-green-800">
                           <CheckCircle2 size={12} /> Approved
                         </span>
                       ) : item.status === "PENDING" ? (
                         <span className="flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-orange-800">
                           <Clock size={12} /> Pending Review
                         </span>
                       ) : (
                         <span className="flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-red-800">
                           <XCircle size={12} /> Rejected
                         </span>
                       )}
                       <span className="text-xs text-muted">
                         Submitted {item.post.date ? new Date(item.post.date).toLocaleDateString() : "Recently"}
                       </span>
                    </div>
                    <h3 className="font-heading text-xl font-bold text-heading">
                      {item.post.title || "Untitled Article"}
                    </h3>
                  </div>

                  {item.status === "PUBLISHED" && (
                    <Link
                      href={`/blog/${item.post.slug}`}
                      className="text-sm font-semibold text-primary transition-colors hover:text-primary-light"
                    >
                      View Live Article &rarr;
                    </Link>
                  )}
                </div>

                {item.reviewNote && (
                  <div className="mt-6 rounded-xl bg-cream/50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-1">
                      Note from the Editor:
                    </p>
                    <p className="text-sm italic text-heading opacity-90">
                      "{item.reviewNote}"
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
