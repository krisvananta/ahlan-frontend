"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { CheckCircle2, ChevronLeft, ChevronRight, Loader2, Send } from "lucide-react";
import TipTapEditor from "./TipTapEditor";
import { submitFanArticle } from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";

interface SubmitFormData {
  title: string;
  content: string;
  bgColor: string;
  textColor: string;
  primaryFont: string;
}

export default function SubmitForm() {
  const router = useRouter();
  const { token, isAuthenticated } = useAuth();
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    trigger,
    formState: { errors },
  } = useForm<SubmitFormData>({
    defaultValues: {
      title: "",
      content: "",
      bgColor: "#ffffff",
      textColor: "#1f2937",
      primaryFont: "serif",
    },
  });

  const formData = watch();

  const submitMutation = useMutation({
    mutationFn: async (data: SubmitFormData) => {
      if (!token) throw new Error("Authentication token missing - please log in.");
      return submitFanArticle(data, token);
    },
    onSuccess: () => {
      setIsSuccess(true);
    },
    onError: (error: any) => {
      console.error("Submission failed:", error);
      alert(`Submission failed: ${error.message || "Please try again."}`);
    },
  });

  const handleNext = async () => {
    // Validate step 1 fields before moving on
    if (step === 1) {
      const isValid = await trigger(["title", "content"]);
      if (isValid) setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const onSubmit = (data: SubmitFormData) => {
    if (!isAuthenticated) {
      alert("You need to be logged in to submit an article.");
      return;
    }
    submitMutation.mutate(data);
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-12 text-center shadow-[var(--shadow-modal)]">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-accent/20 text-accent">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="font-heading text-3xl font-bold text-heading">
          Submission Received!
        </h2>
        <p className="mt-4 max-w-md text-muted">
          Your article is now pending review. Our editors will prepare your design 
          configuration and bundle the final E-Book if approved.
        </p>
        <div className="mt-8 flex gap-4">
          <button
            onClick={() => router.push("/dashboard/history")}
            className="rounded-xl border border-cream-dark px-6 py-3 font-semibold text-heading transition-colors hover:bg-cream-dark"
          >
            Track Status
          </button>
          <button
            onClick={() => router.push("/")}
            className="rounded-xl bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-light"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white p-6 shadow-[var(--shadow-modal)] sm:p-10">
      {/* Stepper */}
      <div className="mb-10 flex items-center justify-center gap-2">
        <StepIndicator current={step} target={1} label="Draft" />
        <div className="h-px w-12 bg-cream-dark sm:w-24" />
        <StepIndicator current={step} target={2} label="Design" />
        <div className="h-px w-12 bg-cream-dark sm:w-24" />
        <StepIndicator current={step} target={3} label="Review" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* STEP 1: Content Setup */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="mb-6 space-y-2">
              <h2 className="font-heading text-2xl font-bold text-heading">
                Draft Your Article
              </h2>
              <p className="text-sm text-muted">
                What do you want to share with the Ahlan community?
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-heading">
                  Catchy Title
                </label>
                <input
                  type="text"
                  {...register("title", { required: "Title is required" })}
                  className="w-full rounded-xl border border-cream-dark bg-cream/30 p-3 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                  placeholder="The Beauty of Islamic Architecure..."
                />
                {errors.title && (
                  <p className="mt-2 text-xs text-error">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-heading">
                  Article Body
                </label>
                <Controller
                  name="content"
                  control={control}
                  rules={{
                    required: "Content is required",
                    validate: (value) =>
                      value.replace(/<[^>]+>/g, "").trim().length > 10 ||
                      "Provide at least a short paragraph.",
                  }}
                  render={({ field }) => (
                    <TipTapEditor
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Once upon a time in Cordoba..."
                    />
                  )}
                />
                {errors.content && (
                  <p className="mt-2 text-xs text-error">{errors.content.message}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Design Options */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="mb-6 space-y-2">
              <h2 className="font-heading text-2xl font-bold text-heading">
                Design Configuration
              </h2>
              <p className="text-sm text-muted">
                Customize how your article will look in the Reader Engine.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-heading">
                    Background Color
                  </label>
                  <div className="flex items-center gap-4 rounded-xl border border-cream-dark bg-cream/30 p-3">
                    <input
                      type="color"
                      {...register("bgColor")}
                      className="h-10 w-10 cursor-pointer rounded-lg border-0 bg-transparent p-0"
                    />
                    <input
                      type="text"
                      {...register("bgColor")}
                      className="w-full bg-transparent font-mono text-sm uppercase outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-heading">
                    Text Color
                  </label>
                  <div className="flex items-center gap-4 rounded-xl border border-cream-dark bg-cream/30 p-3">
                    <input
                      type="color"
                      {...register("textColor")}
                      className="h-10 w-10 cursor-pointer rounded-lg border-0 bg-transparent p-0"
                    />
                    <input
                      type="text"
                      {...register("textColor")}
                      className="w-full bg-transparent font-mono text-sm uppercase outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-heading">
                    Primary Font Stack
                  </label>
                  <select
                    {...register("primaryFont")}
                    className="w-full rounded-xl border border-cream-dark bg-cream/30 p-3 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="serif">Playfair Display (Serif)</option>
                    <option value="sans">Inter (Sans-Serif)</option>
                    <option value="mono">JetBrains Mono (Monospace)</option>
                  </select>
                </div>
              </div>

              {/* Live Preview */}
              <div className="relative overflow-hidden rounded-2xl border border-cream-dark shadow-sm">
                <div
                  className="flex h-full min-h-[300px] flex-col justify-center p-8 transition-colors duration-500"
                  style={{
                    backgroundColor: formData.bgColor,
                    color: formData.textColor,
                    fontFamily:
                      formData.primaryFont === "serif"
                        ? "var(--font-playfair)"
                        : formData.primaryFont === "mono"
                          ? "var(--font-jetbrains)"
                          : "var(--font-inter)",
                  }}
                >
                  <h3 className="mb-4 text-2xl font-bold leading-tight opacity-90">
                    {formData.title || "The Beauty of Islamic Architecture"}
                  </h3>
                  <div
                    className="line-clamp-4 text-sm opacity-80"
                    dangerouslySetInnerHTML={{
                      __html:
                        formData.content ||
                        "Preview how your paragraphs will look in the final renderer depending on the constraints...",
                    }}
                  />
                  <div className="mt-8 flex gap-2">
                    <span className="rounded-full bg-black/10 px-3 py-1 text-xs uppercase tracking-wider backdrop-blur-sm">
                      Preview
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Final Review */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="mb-6 space-y-2">
              <h2 className="font-heading text-2xl font-bold text-heading">
                Ready to Publish?
              </h2>
              <p className="text-sm text-muted">
                Review your submission details before sending it to the editorial team.
              </p>
            </div>

            <div className="rounded-xl border border-cream-dark bg-cream/20 p-6">
              <div className="space-y-4">
                <div>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-muted">
                    Title
                  </span>
                  <p className="mt-1 font-heading text-lg font-bold">
                    {formData.title}
                  </p>
                </div>
                <div>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-muted">
                    Word Count (Approx)
                  </span>
                  <p className="mt-1 text-sm font-medium">
                    {formData.content.replace(/<[^>]+>/g, "").split(" ").length} words
                  </p>
                </div>
                <div className="pt-4 border-t border-cream-dark">
                  <span className="block text-xs font-semibold uppercase tracking-wider text-muted">
                    Author Profile
                  </span>
                  <p className="mt-1 text-sm font-medium text-primary">
                    Linking submission to authenticated user session.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form Controls */}
        <div className="flex items-center justify-between border-t border-cream-dark pt-8">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1 || submitMutation.isPending}
            className="flex items-center gap-2 rounded-xl px-4 py-2 font-semibold text-muted transition-colors hover:bg-cream hover:text-heading disabled:opacity-30"
          >
            <ChevronLeft size={18} />
            Back
          </button>

          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 rounded-xl bg-heading px-6 py-3 font-semibold text-white transition-colors hover:bg-heading/90"
            >
              Next Step
              <ChevronRight size={18} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitMutation.isPending}
              className="flex items-center gap-2 rounded-xl bg-primary px-8 py-3 font-semibold text-white transition-colors hover:bg-primary-light disabled:opacity-70"
            >
              {submitMutation.isPending ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Submitting
                </>
              ) : (
                <>
                  <Send size={18} />
                  Submit for Review
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

// Helper 
function StepIndicator({
  current,
  target,
  label,
}: {
  current: number;
  target: number;
  label: string;
}) {
  const isActive = current >= target;
  const isCurrent = current === target;

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors duration-500 sm:h-10 sm:w-10 ${
          isActive
            ? "bg-primary text-white"
            : "border-2 border-cream-dark bg-white text-muted"
        }`}
      >
        {target}
      </div>
      <span
        className={`hidden text-xs font-semibold sm:block ${
          isCurrent ? "text-primary" : "text-muted"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
