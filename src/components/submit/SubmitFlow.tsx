"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Check, AlertCircle } from "lucide-react";
import StepCategory from "@/components/submit/StepCategory";
import StepProblem from "@/components/submit/StepProblem";
import StepDescribe from "@/components/submit/StepDescribe";
import StepLocation from "@/components/submit/StepLocation";
import StepEmail from "@/components/submit/StepEmail";
import StepReview from "@/components/submit/StepReview";

export interface FormData {
  category_id: string;
  category_name: string;
  problem_option: string;
  problem_custom: string;
  description: string;
  solution_description: string;
  district: string;
  name: string;
  email: string;
  consent: boolean;
}

const INITIAL_DATA: FormData = {
  category_id: "",
  category_name: "",
  problem_option: "",
  problem_custom: "",
  description: "",
  solution_description: "",
  district: "",
  name: "",
  email: "",
  consent: false,
};

const STORAGE_KEY = "btn_submit_draft";

const STEPS = [
  { id: 1, label: "Category", labelTamil: "வகை" },
  { id: 2, label: "Problem", labelTamil: "பிரச்சனை" },
  { id: 3, label: "Describe", labelTamil: "விளக்கம்" },
  { id: 4, label: "Location", labelTamil: "இடம்" },
  { id: 5, label: "Contact", labelTamil: "தொடர்பு" },
];

function loadDraft(): FormData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...INITIAL_DATA, ...JSON.parse(raw) };
  } catch {}
  return INITIAL_DATA;
}

function saveDraft(data: FormData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

function clearDraft() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

export default function SubmitFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const router = useRouter();

  // Restore draft from localStorage on mount
  useEffect(() => {
    const draft = loadDraft();
    setFormData(draft);
    setHydrated(true);
  }, []);

  // Persist draft on every change
  useEffect(() => {
    if (hydrated) saveDraft(formData);
  }, [formData, hydrated]);

  const updateFormData = useCallback((updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  const goNext = useCallback(() => {
    if (currentStep === 5) {
      setShowReview(true);
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStep]);

  const goBack = useCallback(() => {
    setSubmitError(null);
    if (showReview) {
      setShowReview(false);
    } else {
      setCurrentStep((prev) => Math.max(prev - 1, 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [showReview]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const response = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Submission failed. Please try again.");
      }

      const { public_id } = await response.json();
      // Clear draft only on success
      clearDraft();
      router.push(`/success/${public_id}`);
    } catch (error: any) {
      setIsSubmitting(false);
      setSubmitError(
        error?.message ||
          "Your idea wasn't submitted due to a network error. Don't worry — your answers are saved. Please try again."
      );
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return !!formData.category_id;
      case 2: return !!(formData.problem_option || formData.problem_custom);
      case 3: return true;
      case 4: return !!formData.district;
      case 5: return !!(formData.email && formData.consent);
      default: return false;
    }
  };

  const containerMaxWidth = currentStep === 1 && !showReview ? "max-w-5xl" : "max-w-2xl";

  // Show nothing until hydrated to prevent draft flash
  if (!hydrated) return null;

  return (
    <div className="min-h-screen bg-[#f8f7f4] pb-28">
      {/* Top Stepper Banner */}
      <div className="bg-white border-b border-[#e2e8f0] shadow-xs">
        <div className="container py-5 sm:py-6">
          <div className="max-w-3xl mx-auto">
            {!showReview ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-[#64748b]">
                  <span className="flex items-center gap-2 text-[#e85d26] text-[13px]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#e85d26]" />
                    Step {currentStep} of 5: {STEPS[currentStep - 1].label}
                  </span>
                  <span className="text-[#94a3b8] font-mono text-[12px] bg-[#f8f7f4] px-2.5 py-0.5 rounded-md border border-[#e2e8f0]">
                    {Math.round((currentStep / 5) * 100)}% Completed
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-2.5">
                  {STEPS.map((step) => {
                    const isCompleted = step.id < currentStep;
                    const isCurrent = step.id === currentStep;
                    return (
                      <div
                        key={step.id}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          isCompleted
                            ? "bg-[#22c55e]"
                            : isCurrent
                            ? "bg-[#e85d26] shadow-sm shadow-[#e85d26]/40"
                            : "bg-[#e2e8f0]"
                        }`}
                      />
                    );
                  })}
                </div>

                <div className="grid grid-cols-5 text-center text-[11px] sm:text-[12px] font-semibold text-[#64748b] pt-0.5">
                  {STEPS.map((step) => (
                    <span
                      key={step.id}
                      className={`truncate transition-colors ${
                        step.id === currentStep
                          ? "text-[#e85d26] font-bold"
                          : step.id < currentStep
                          ? "text-[#22c55e]"
                          : "text-[#94a3b8]"
                      }`}
                    >
                      {step.label} <span className="font-tamil opacity-80 hidden sm:inline">({step.labelTamil})</span>
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 text-[14px] font-bold text-[#16a34a] py-1">
                <Check size={18} />
                <span>All 5 steps completed — Ready for Final Review</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container pt-10 sm:pt-14">
        <div className={`${containerMaxWidth} mx-auto transition-all duration-300`}>
          {/* Submission error banner */}
          {submitError && (
            <div className="mb-6 flex items-start gap-3 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-[14px]">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5 text-red-500" />
              <div>
                <p className="font-bold mb-0.5">Submission failed</p>
                <p className="text-red-600 text-[13px]">{submitError}</p>
                <p className="text-red-500 text-[12px] mt-1">✓ Your answers are saved — just try again below.</p>
              </div>
            </div>
          )}

          {showReview ? (
            <div className="bg-white rounded-3xl p-7 sm:p-12 border border-[#e2e8f0] shadow-sm">
              <StepReview
                formData={formData}
                onBack={goBack}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-7 sm:p-12 border border-[#e2e8f0] shadow-sm">
              {currentStep === 1 && (
                <StepCategory
                  value={formData.category_id}
                  onChange={(id, name) => updateFormData({ category_id: id, category_name: name })}
                />
              )}
              {currentStep === 2 && (
                <StepProblem
                  categoryId={formData.category_id}
                  categoryName={formData.category_name}
                  value={formData.problem_option}
                  customValue={formData.problem_custom}
                  onChange={(option, custom) =>
                    updateFormData({ problem_option: option, problem_custom: custom || "" })
                  }
                />
              )}
              {currentStep === 3 && (
                <StepDescribe
                  description={formData.description}
                  solution={formData.solution_description}
                  onChange={(description, solution) =>
                    updateFormData({ description, solution_description: solution })
                  }
                />
              )}
              {currentStep === 4 && (
                <StepLocation
                  value={formData.district}
                  onChange={(district) => updateFormData({ district })}
                />
              )}
              {currentStep === 5 && (
                <StepEmail
                  email={formData.email}
                  name={formData.name}
                  consent={formData.consent}
                  onChange={(email, name, consent) =>
                    updateFormData({ email, name: name || "", consent })
                  }
                />
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-12 pt-6 border-t border-[#f1f5f9]">
                <button
                  onClick={goBack}
                  className={`btn btn-secondary flex items-center gap-2 h-12 px-6 rounded-2xl font-bold ${
                    currentStep === 1 ? "invisible" : ""
                  }`}
                >
                  <ChevronLeft size={16} />
                  <span>Back</span>
                </button>

                <button
                  onClick={goNext}
                  disabled={!canProceed()}
                  className="btn btn-primary btn-lg flex items-center gap-2 h-12 px-8 rounded-2xl shadow-lg shadow-[#e85d26]/20 font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                  id={`step-${currentStep}-next`}
                >
                  {currentStep === 5 ? (
                    <>
                      <span>Review Submission</span>
                      <Check size={16} />
                    </>
                  ) : (
                    <>
                      <span>Continue</span>
                      <ChevronRight size={16} />
                    </>
                  )}
                </button>
              </div>

              {/* Helper notes */}
              {currentStep === 1 && (
                <p className="text-center text-[12.5px] text-[#94a3b8] mt-6">
                  💡 You can pick any category to proceed. You can submit another idea later for different categories.
                </p>
              )}
              {currentStep === 3 && (
                <p className="text-center text-[12px] text-[#94a3b8] mt-5">
                  ✦ Voice input supports Tamil, English, and Tanglish. You can also skip this step.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
