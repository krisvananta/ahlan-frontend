import SubmitForm from "@/components/dashboard/SubmitForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Submit Article | Ahlan Dashboard",
};

export default function SubmitArticlePage() {
  return (
    <div className="min-h-screen bg-cream pt-24 pb-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="mb-8">
          <Link
            href="/dashboard/history"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-primary"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
          <h1 className="font-heading text-3xl font-bold text-heading">
            Submit an Article
          </h1>
          <p className="mt-2 text-muted">
            Share your voice with the global Ahlan community. Fan-Writers undergo 
            editorial review before publishing.
          </p>
        </div>

        <SubmitForm />
      </div>
    </div>
  );
}
