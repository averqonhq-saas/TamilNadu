"use client";

import { useState } from "react";
import { CATEGORIES } from "@/lib/constants/categories";
import { Check, Edit3 } from "lucide-react";

interface StepProblemProps {
  categoryId: string;
  categoryName: string;
  value: string;
  customValue: string;
  onChange: (option: string, custom?: string) => void;
}

export default function StepProblem({
  categoryId,
  categoryName,
  value,
  customValue,
  onChange,
}: StepProblemProps) {
  const [showCustom, setShowCustom] = useState(value === "other" || !!customValue);

  const category = CATEGORIES.find((c) => c.id === categoryId);
  const problems = category?.problemOptions || [];

  const handleSelect = (problem: string) => {
    if (problem === "other") {
      setShowCustom(true);
      onChange("other", customValue);
    } else {
      setShowCustom(false);
      onChange(problem, "");
    }
  };

  return (
    <div>
      <div className="mb-7">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fde8dc] text-[#e85d26] text-[12px] font-bold mb-3">
          <span>Theme:</span>
          <span>{categoryName}</span>
        </div>
        <h2 className="font-jakarta font-extrabold text-[24px] sm:text-[28px] text-[#0a0e1a] mb-1.5">
          What specific problem are you facing?
        </h2>
        <p className="text-[#64748b] text-[15px]">
          Choose the closest option below, or write your own custom challenge.
        </p>
      </div>

      <div className="space-y-3">
        {problems.map((problem) => {
          const isSelected = value === problem;
          return (
            <button
              key={problem}
              onClick={() => handleSelect(problem)}
              className={`w-full flex items-center justify-between p-4.5 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer
                ${
                  isSelected
                    ? "border-[#e85d26] bg-[#fff8f5] shadow-xs"
                    : "border-[#e2e8f0] bg-white hover:border-[#cbd5e1] hover:bg-[#fcfcfb]"
                }`}
              aria-pressed={isSelected}
            >
              <div className="flex items-center gap-3.5 pr-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                    isSelected ? "border-[#e85d26] bg-[#e85d26]" : "border-[#cbd5e1]"
                  }`}
                >
                  {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <span
                  className={`text-[15px] leading-snug ${
                    isSelected ? "text-[#0a0e1a] font-bold" : "text-[#334155] font-medium"
                  }`}
                >
                  {problem}
                </span>
              </div>
            </button>
          );
        })}

        {/* Other / Custom Problem Option */}
        <button
          onClick={() => handleSelect("other")}
          className={`w-full flex items-center justify-between p-4.5 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer
            ${
              value === "other"
                ? "border-[#e85d26] bg-[#fff8f5] shadow-xs"
                : "border-dashed border-[#cbd5e1] bg-white hover:border-[#e85d26] hover:bg-[#fffbf8]"
            }`}
          aria-pressed={value === "other"}
        >
          <div className="flex items-center gap-3.5">
            <div
              className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                value === "other" ? "border-[#e85d26] bg-[#e85d26]" : "border-[#cbd5e1]"
              }`}
            >
              {value === "other" && <div className="w-2 h-2 rounded-full bg-white" />}
            </div>
            <span
              className={`text-[15px] ${
                value === "other" ? "text-[#0a0e1a] font-bold" : "text-[#64748b] font-medium"
              }`}
            >
              ✍️ Write a different problem in {categoryName}...
            </span>
          </div>
        </button>
      </div>

      {/* Custom input textarea */}
      {showCustom && (
        <div className="mt-5 p-5 bg-[#f8f7f4] rounded-2xl border border-[#e2e8f0] animate-fade-in">
          <label htmlFor="custom-problem-input" className="block text-[13px] font-bold text-[#0a0e1a] mb-2">
            Describe your problem in your own words:
          </label>
          <textarea
            id="custom-problem-input"
            className="input textarea bg-white"
            placeholder={`Explain what is difficult in ${categoryName}... (e.g. Bus timings for rural schools, medicine availability...)`}
            value={customValue}
            onChange={(e) => onChange("other", e.target.value)}
            rows={3}
            maxLength={500}
            autoFocus
          />
          <p className="text-right text-[12px] text-[#94a3b8] mt-1.5 font-mono">
            {customValue.length} / 500 characters
          </p>
        </div>
      )}
    </div>
  );
}

