"use client";

import { useState } from "react";
import { Lightbulb } from "lucide-react";

interface StepDescribeProps {
  description: string;
  solution: string;
  onChange: (description: string, solution: string) => void;
}

export default function StepDescribe({ description, solution, onChange }: StepDescribeProps) {
  const [showSolution, setShowSolution] = useState(!!solution);

  return (
    <div>
      <div className="mb-7">
        <h2 className="font-jakarta font-extrabold text-[24px] sm:text-[28px] text-[#0a0e1a] mb-1.5">
          Want to add more details?
        </h2>
        <p className="text-[#64748b] text-[15px]">
          Optional: Describe what happens in your own words, or skip directly.
        </p>
      </div>

      <div className="space-y-5">
        <div className="bg-[#f8f7f4] rounded-3xl p-6 border border-[#e2e8f0]">
          <label
            htmlFor="description"
            className="block text-[14px] font-bold text-[#0a0e1a] mb-2"
          >
            Tell us what happens today:{" "}
            <span className="text-[#94a3b8] font-normal">(optional)</span>
          </label>
          <textarea
            id="description"
            className="input textarea bg-white"
            placeholder="What happens today? Why is it difficult? How does it affect you, your family, or your community?"
            value={description}
            onChange={(e) => onChange(e.target.value, solution)}
            rows={4}
            maxLength={2000}
          />
          <div className="flex items-center justify-end mt-2">
            <span className="text-[12px] text-[#94a3b8] font-mono">
              {description.length} / 2000
            </span>
          </div>
        </div>

        {/* Solution idea box */}
        {!showSolution ? (
          <button
            type="button"
            onClick={() => setShowSolution(true)}
            className="text-[14px] font-semibold text-[#64748b] hover:text-[#e85d26] border-2 border-dashed border-[#cbd5e1] hover:border-[#e85d26] rounded-2xl p-4.5 w-full text-left transition-colors flex items-center gap-2 bg-white cursor-pointer"
          >
            <Lightbulb size={18} className="text-[#f59e0b]" />
            <span>+ Do you have a suggestion or idea for how software could solve this? (optional)</span>
          </button>
        ) : (
          <div className="bg-[#f8f7f4] rounded-3xl p-6 border border-[#e2e8f0] animate-fade-in">
            <label
              htmlFor="solution"
              className="block text-[14px] font-bold text-[#0a0e1a] mb-2"
            >
              How do you imagine technology helping?{" "}
              <span className="text-[#94a3b8] font-normal">(optional)</span>
            </label>
            <textarea
              id="solution"
              className="input textarea bg-white"
              placeholder="Maybe an app could display... / An automated SMS that... / A scanner tool that..."
              value={solution}
              onChange={(e) => onChange(description, e.target.value)}
              rows={3}
              maxLength={2000}
            />
            <p className="text-[12px] text-[#94a3b8] mt-1.5">
              You don't need technical skills — just share what product or feature you imagine.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
