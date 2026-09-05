"use client";

import { useState } from "react";
import { ShieldCheck, Check } from "lucide-react";

interface StepEmailProps {
  email: string;
  name: string;
  consent: boolean;
  onChange: (email: string, name: string | undefined, consent: boolean) => void;
}

export default function StepEmail({ email, name, consent, onChange }: StepEmailProps) {
  const [showName, setShowName] = useState(!!name);

  return (
    <div>
      <div className="mb-7">
        <h2 className="font-jakarta font-extrabold text-[24px] sm:text-[28px] text-[#0a0e1a] mb-1.5">
          Where should we send progress updates?
        </h2>
        <p className="text-[#64748b] text-[15px] leading-relaxed">
          We&apos;ll notify you when your idea is shortlisted, when the democratic vote goes live, and when the open-source repo is published.
        </p>
      </div>

      <div className="space-y-4.5">
        {/* Email field */}
        <div>
          <label htmlFor="email" className="block text-[14px] font-bold text-[#0a0e1a] mb-2">
            Your email address <span className="text-[#e85d26]">*</span>
          </label>
          <input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            className="input h-12 text-[15px]"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => onChange(e.target.value, name, consent)}
            required
          />
        </div>

        {/* Optional name */}
        {!showName ? (
          <button
            type="button"
            onClick={() => setShowName(true)}
            className="text-[13px] font-semibold text-[#64748b] hover:text-[#e85d26] transition-colors"
          >
            + Add your name or display handle (optional)
          </button>
        ) : (
          <div className="animate-fade-in">
            <label htmlFor="name" className="block text-[14px] font-bold text-[#0a0e1a] mb-2">
              Your name <span className="text-[#94a3b8] font-normal">(optional)</span>
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              className="input h-12 text-[15px]"
              placeholder="Citizen name / pseudonym"
              value={name}
              onChange={(e) => onChange(email, e.target.value, consent)}
            />
          </div>
        )}

        {/* Consent checkbox */}
        <div className="bg-[#f8f7f4] border border-[#e2e8f0] rounded-2xl p-4.5">
          <label className="flex items-start gap-3.5 cursor-pointer">
            <div className="relative mt-0.5 flex-shrink-0">
              <input
                type="checkbox"
                className="sr-only"
                checked={consent}
                onChange={(e) => onChange(email, name, e.target.checked)}
                id="consent-checkbox"
              />
              <div
                onClick={() => onChange(email, name, !consent)}
                className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all cursor-pointer ${
                  consent
                    ? "bg-[#e85d26] border-[#e85d26] shadow-xs"
                    : "border-[#cbd5e1] bg-white"
                }`}
              >
                {consent && <Check size={12} className="text-white" strokeWidth={3} />}
              </div>
            </div>
            <div>
              <span className="text-[14px] font-semibold text-[#0a0e1a] leading-relaxed block">
                I agree to receive milestone notifications for Build Tamil Nadu.
              </span>
              <p className="text-[12px] text-[#64748b] mt-1">
                Zero spam. You will only receive genuine status emails about your idea and the public vote.
              </p>
            </div>
          </label>
        </div>

        {/* Privacy badge */}
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-[#e2e8f0] shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-[#f0fdf4] text-[#16a34a] flex items-center justify-center flex-shrink-0">
            <ShieldCheck size={18} />
          </div>
          <div>
            <p className="text-[13px] font-bold text-[#0a0e1a]">100% Privacy Protected</p>
            <p className="text-[12px] text-[#64748b] leading-relaxed mt-0.5">
              Your email will <strong>never</strong> be published on the public idea board or sold to 3rd parties. All ideas are anonymized before publication.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

