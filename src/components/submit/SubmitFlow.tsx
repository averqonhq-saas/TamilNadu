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
      {/* ================= REDESIGNED CIVIC STEP TRACKER ================= */}
      <div className="container pt-6 sm:pt-8 pb-4 sm:pb-6 mt-5">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl border border-[#e2e8f0] shadow-sm p-4 sm:p-6 transition-all">
            {!showReview ? (
              <div className="space-y-4">
                {/* Header row: Step pill, current title, and % completed */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#f1f5f9]">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e85d26]/10 border border-[#e85d26]/20 text-[#e85d26] text-[11.5px] font-bold uppercase tracking-wider flex-shrink-0">
                      <span className="w-2 h-2 rounded-full bg-[#e85d26] animate-pulse" />
                      Step {currentStep} of 5
                    </span>
                    <span className="font-jakarta font-extrabold text-[15px] sm:text-[16px] text-[#0a0e1a] truncate">
                      {STEPS[currentStep - 1].label}
                    </span>
                    <span className="text-[12px] font-tamil text-[#e85d26] font-semibold hidden sm:inline">
                      ({STEPS[currentStep - 1].labelTamil})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#64748b] bg-[#f8f7f4] px-2.5 py-1 rounded-lg border border-[#e2e8f0]">
                      {Math.round((currentStep / 5) * 100)}% Completed
                    </span>
                  </div>
                </div>

                {/* Connected Step Nodes */}
                <div className="relative pt-1">
                  {/* Background Progress Rail */}
                  <div className="absolute top-[17px] left-6 right-6 h-1 bg-[#f1f5f9] rounded-full -z-0" />
                  {/* Active Progress Fill */}
                  <div
                    className="absolute top-[17px] left-6 h-1 bg-gradient-to-r from-[#e85d26] via-[#f97316] to-[#f59e0b] rounded-full transition-all duration-500 -z-0"
                    style={{
                      width: `${((Math.max(1, currentStep) - 1) / 4) * 100}%`,
                      maxWidth: "calc(100% - 48px)",
                    }}
                  />

                  {/* 5 Step Indicator Nodes */}
                  <div className="grid grid-cols-5 relative z-10">
                    {STEPS.map((step) => {
                      const isCompleted = step.id < currentStep;
                      const isCurrent = step.id === currentStep;
                      const canClick = step.id < currentStep;

                      return (
                        <div
                          key={step.id}
                          onClick={() => {
                            if (canClick) {
                              setShowReview(false);
                              setCurrentStep(step.id);
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }
                          }}
                          className={`flex flex-col items-center text-center group ${
                            canClick ? "cursor-pointer" : "cursor-default"
                          }`}
                        >
                          {/* Circle Icon / Number */}
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs sm:text-[13px] transition-all duration-300 ${
                              isCompleted
                                ? "bg-[#16a34a] text-white shadow-sm shadow-[#16a34a]/30 group-hover:scale-110"
                                : isCurrent
                                ? "bg-[#e85d26] text-white ring-4 ring-[#e85d26]/20 shadow-md shadow-[#e85d26]/30 scale-105"
                                : "bg-white text-[#94a3b8] border-2 border-[#e2e8f0]"
                            }`}
                          >
                            {isCompleted ? (
                              <Check size={16} strokeWidth={2.5} />
                            ) : (
                              <span>0{step.id}</span>
                            )}
                          </div>

                          {/* Step Label */}
                          <span
                            className={`mt-2 text-[11px] sm:text-[12px] font-bold tracking-tight transition-colors line-clamp-1 ${
                              isCurrent
                                ? "text-[#e85d26]"
                                : isCompleted
                                ? "text-[#16a34a] group-hover:text-[#0a0e1a]"
                                : "text-[#94a3b8]"
                            }`}
                          >
                            {step.label}
                          </span>
                          <span
                            className={`text-[10px] font-tamil hidden sm:block ${
                              isCurrent
                                ? "text-[#e85d26]/80 font-medium"
                                : "text-[#94a3b8]"
                            }`}
                          >
                            {step.labelTamil}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-1 px-2 text-center sm:text-left">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#16a34a] text-white flex items-center justify-center shadow-md shadow-[#16a34a]/20 flex-shrink-0">
                    <Check size={20} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="font-jakarta font-extrabold text-[16px] text-[#0a0e1a]">
                      All 5 Steps Completed
                    </h3>
                    <p className="text-xs text-[#64748b]">
                      Please review your problem details below before final submission.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowReview(false)}
                  className="btn btn-secondary btn-sm rounded-xl text-xs font-bold text-[#e85d26] hover:bg-[#e85d26]/10 hover:border-[#e85d26]/30 transition-colors"
                >
                  Edit Answers
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container pt-6 sm:pt-10 lg:pt-12">
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
            <div className="bg-white rounded-3xl p-5 sm:p-7 md:p-12 border border-[#e2e8f0] shadow-sm">
              <StepReview
                formData={formData}
                onBack={goBack}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-5 sm:p-7 md:p-12 border border-[#e2e8f0] shadow-sm">
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
              <div className="flex items-center justify-between mt-10 sm:mt-12 pt-6 border-t border-[#f1f5f9]">
                <button
                  onClick={goBack}
                  className={`btn btn-secondary flex items-center gap-2 h-11 sm:h-12 px-4 sm:px-6 rounded-2xl font-bold ${
                    currentStep === 1 ? "invisible" : ""
                  }`}
                >
                  <ChevronLeft size={16} />
                  <span>Back</span>
                </button>

                <button
                  onClick={goNext}
                  disabled={!canProceed()}
                  className="btn btn-primary btn-lg flex items-center gap-2 h-11 sm:h-12 px-5 sm:px-8 rounded-2xl shadow-lg shadow-[#e85d26]/20 font-bold disabled:opacity-40 disabled:cursor-not-allowed"
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
                  ✦ You can write in Tamil, English, or Tanglish. You can also skip this step.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
