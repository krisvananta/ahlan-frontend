"use client";

import { use, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, Check, X, Loader2, UploadCloud, FileText } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { approveArticle, getPendingArticles } from "@/lib/api";
import { WPPost } from "@/types";
import ThemeWrapper from "@/components/article/ThemeWrapper";

export default function ReviewArticleDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { token, user } = useAuth();
  
  const [post, setPost] = useState<WPPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewNote, setReviewNote] = useState("");
  
  // File Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pdfMediaId, setPdfMediaId] = useState<number | undefined>(undefined);
  const [isUploading, setIsUploading] = useState(false);

  const isAdmin = user?.role === "administrator" || user?.role === "editor";

  useEffect(() => {
    async function fetchDetail() {
      if (!token) return;
      try {
        // Find it in the pending queue
        // A direct GetPostById query logic is better, but doing this for simplicity
        const queue = await getPendingArticles(token);
        
        let found = queue.find((p) => p.id === resolvedParams.id || p.slug === resolvedParams.id);
        
        // Mock fallback
        if (!found && process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true") {
           const { mockPosts } = await import("@/lib/mock-data");
           found = { ...mockPosts[0], id: resolvedParams.id, status: "PENDING" } as any;
        }

        setPost(found || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    if (isAdmin) fetchDetail();
    else setLoading(false);
  }, [isAdmin, resolvedParams.id, token]);

  const handleFileUpload = async (file: File) => {
    if (!token) return;
    if (file.type !== "application/pdf") {
      alert("Only PDF files are allowed for E-books.");
      return;
    }

    setIsUploading(true);
    setSelectedFile(file);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", post?.title ? `${post.title} - Official Ebook` : file.name);

      const res = await fetch("/api/admin/upload-ebook", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Upload failed");
      }

      const data = await res.json();
      setPdfMediaId(data.id);
      alert("PDF Uploaded Successfully to Media Library!");
    } catch (err: any) {
      console.error(err);
      alert(`Upload failed: ${err.message}`);
      setSelectedFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDecision = async (status: "PUBLISH" | "TRASH") => {
    if (!token || !post) return;
    
    if (status === "TRASH" && !reviewNote) {
       alert("Please provide a review note when rejecting an article.");
       return;
    }

    setIsSubmitting(true);
    try {
      await approveArticle(
        {
          id: post.id,
          status,
          reviewNote,
          pdfMediaId,
        },
        token
      );
      
      alert(`Article successfully marked as ${status}`);
      router.push("/admin/review");
    } catch (err: any) {
      console.error(err);
      alert(`Failed to update status: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-4 text-center">
        <ShieldAlert size={48} className="mb-4 text-error" />
        <h1 className="font-heading text-2xl font-bold text-heading">Access Denied</h1>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream pt-24 pb-20">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream text-muted">
        Article not found in pending queue.
      </div>
    );
  }

  const designConfig = post.designConfig || {
    bgColor: "#ffffff",
    textColor: "#1f2937",
    primaryFont: "serif",
    decorationType: "minimal",
    accentColor: "#0a5c36",
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col md:flex-row pt-20">
      {/* Left Panel: Review Editor Actions */}
      <div className="w-full md:w-[400px] shrink-0 bg-white shadow-xl z-10 flex flex-col h-[calc(100vh-80px)] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <Link
            href="/admin/review"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-primary"
          >
            <ArrowLeft size={16} />
            Back to Queue
          </Link>
          <h2 className="font-heading text-2xl font-bold text-heading">Review Actions</h2>
          <p className="text-xs text-muted uppercase tracking-wider font-semibold mt-2">
            Target: {post.title}
          </p>
        </div>

        <div className="p-6 flex-1 space-y-8">
          {/* Note Input */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-heading">
              Editor Note (Will be visible to author)
            </label>
            <textarea
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
              placeholder="Great piece! We've uploaded the PDF output..."
              className="w-full h-32 rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* PDF Upload */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-heading">
              Final E-Book Upload (Optional)
            </label>
            <p className="text-xs text-muted">Upload the designed PDF version of this article if applicable.</p>
            
            <div 
               onClick={() => fileInputRef.current?.click()}
               className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-colors ${
                 pdfMediaId ? 'border-primary/50 bg-primary/5' : 'border-gray-300 hover:border-primary hover:bg-gray-50'
               }`}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="application/pdf"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                }}
              />
              
              {isUploading ? (
                <div className="flex flex-col items-center text-primary">
                  <Loader2 size={24} className="animate-spin mb-2" />
                  <span className="text-sm font-semibold">Uploading...</span>
                </div>
              ) : selectedFile ? (
                <div className="flex flex-col items-center text-primary">
                  <FileText size={24} className="mb-2" />
                  <span className="text-sm font-semibold text-center">{selectedFile.name}</span>
                  <span className="text-xs mt-1">Ready to attach (ID: {pdfMediaId})</span>
                </div>
              ) : (
                <div className="flex flex-col items-center text-muted">
                  <UploadCloud size={24} className="mb-2" />
                  <span className="text-sm font-semibold">Click to upload PDF</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
          <button
            onClick={() => handleDecision("TRASH")}
            disabled={isSubmitting || isUploading}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-white border border-red-200 px-4 py-3 text-sm font-bold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
          >
            <X size={16} /> Reject
          </button>
          <button
            onClick={() => handleDecision("PUBLISH")}
            disabled={isSubmitting || isUploading}
            className="flex-[2] flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-light disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} 
            Approve & Publish
          </button>
        </div>
      </div>

      {/* Right Panel: Reading Preview */}
      <div className="flex-1 h-[calc(100vh-80px)] overflow-y-auto relative bg-neutral-100 p-4 md:p-8">
         <div className="max-w-3xl mx-auto shadow-2xl rounded-2xl overflow-hidden ring-1 ring-black/5 bg-white">
            <ThemeWrapper designConfig={designConfig}>
              <div className="p-10 md:p-14">
                <header className="mb-10 text-center">
                  <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-orange-800">
                      Preview Map
                    </span>
                  </div>
                  <h1 className="mx-auto max-w-3xl font-heading text-4xl font-bold leading-tight">
                    {post.title}
                  </h1>
                  <p className="mt-4 text-sm uppercase tracking-wider font-semibold opacity-50">
                    By {post.author.name}
                  </p>
                </header>
                <div 
                  className="prose prose-lg mx-auto w-full max-w-none prose-headings:font-heading prose-headings:font-bold prose-p:font-sans"
                  dangerouslySetInnerHTML={{ __html: post.content }} 
                />
              </div>
            </ThemeWrapper>
         </div>
      </div>
    </div>
  );
}
