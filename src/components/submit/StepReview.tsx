"use client";

import { useState } from "react";
import { toast } from "sonner";
import { FormData } from "./SubmitFlow";
import { Edit2, Send, Loader2, CheckCircle2, ShieldCheck } from "lucide-react";

interface StepReviewProps {
  formData: FormData;
  onBack: () => void;
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
}

export default function StepReview({ formData, onBack, onSubmit, isSubmitting }: StepReviewProps) {
  const handleSubmit = async () => {
    try {
      await onSubmit();
    } catch (error) {
      toast.error("Something went wrong while submitting your idea. Your information hasn't been lost. Please try again.", {
        duration: 5000,
      });
    }
  };

  const getProblemDisplay = () => {
    if (formData.problem_option === "other") {
      return formData.problem_custom || "Custom problem description";
    }
    return formData.problem_option;
  };

  const getLocationDisplay = () => {
    const SCOPE_LABELS: Record<string, string> = {
      "my-locality": "My specific locality / ward",
      "my-district": "My district as a whole",
      "multiple-districts": "Multiple districts",
      "all-of-tn": "All of Tamil Nadu (State-wide)",
      "not-sure": "Not sure / General problem",
    };
    return SCOPE_LABELS[formData.district] || formData.district;
  };

  return (
    <div>
      <div className="mb-7">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f0fdf4] text-[#16a34a] text-[12px] font-bold mb-3 border border-[#bbf7d0]">
          <CheckCircle2 size={13} />
          <span>Ready for Phase 1 Ingestion</span>
        </div>
        <h2 className="font-jakarta font-extrabold text-[24px] sm:text-[28px] text-[#0a0e1a] mb-1.5">
          Review Your Submission
        </h2>
        <p className="text-[#64748b] text-[15px]">
          Please confirm your details. You can tap edit to change any section before final submission.
        </p>
      </div>

      {/* Review card */}
      <div className="bg-[#f8f7f4] border border-[#e2e8f0] rounded-3xl overflow-hidden divide-y divide-[#e2e8f0] mb-6">
        <ReviewRow label="Category / Theme" value={formData.category_name} />
        <ReviewRow label="Problem Statement" value={getProblemDisplay()} />
        {formData.description && (
          <ReviewRow label="Detailed Context" value={formData.description} multiline />
        )}
        {formData.solution_description && (
          <ReviewRow label="Proposed Feature / Solution" value={formData.solution_description} multiline />
        )}
        <ReviewRow label="Geographic Scope" value={getLocationDisplay()} />
        {formData.name && (
          <ReviewRow label="Citizen Name" value={formData.name} />
        )}
        <ReviewRow label="Notification Email" value={formData.email} />
      </div>

      {/* Privacy reminder */}
      <div className="flex items-center justify-center gap-2 text-[12px] text-[#94a3b8] mb-6">
        <ShieldCheck size={14} className="text-[#10b981]" />
        <span>Your contact email is private and will never be shown on public boards.</span>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="btn btn-secondary flex items-center gap-2 flex-1 justify-center h-12 text-[14px] font-bold rounded-2xl"
        >
          <Edit2 size={15} />
          <span>Edit Details</span>
        </button>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="btn btn-primary btn-lg flex items-center gap-2 flex-1 justify-center disabled:opacity-50 h-12 rounded-2xl shadow-lg shadow-[#e85d26]/20 font-bold"
          id="final-submit-btn"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={17} className="animate-spin" />
              <span>Registering Problem...</span>
            </>
          ) : (
            <>
              <span>Submit to Build Tamil Nadu</span>
              <Send size={16} />
            </>
          )}
        </button>
      </div>

      {isSubmitting && (
        <p className="text-center text-[12px] text-[#94a3b8] mt-4">
          Please wait — encrypting and registering your submission in the database...
        </p>
      )}
    </div>
  );
}

function ReviewRow({
  label,
  value,
  multiline = false,
}: {
  label: string;
  value: string;
  multiline?: boolean;
}) {
  return (
    <div className="px-6 py-4.5 bg-white/60 hover:bg-white transition-colors">
      <span className="block text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider mb-1">
        {label}
      </span>
      <span className={`text-[15px] font-semibold text-[#0a0e1a] ${multiline ? "whitespace-pre-wrap font-normal text-[#334155]" : ""}`}>
        {value}
      </span>
    </div>
  );
}

