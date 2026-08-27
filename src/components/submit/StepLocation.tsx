"use client";

import { useState } from "react";
import { DISTRICT_OPTIONS } from "@/lib/constants/districts";
import { MapPin, Search, Check, Globe } from "lucide-react";

interface StepLocationProps {
  value: string;
  onChange: (district: string) => void;
}

const SCOPE_OPTIONS = [
  { value: "my-locality", label: "My specific locality / ward", icon: "📍" },
  { value: "my-district", label: "My district as a whole", icon: "🗺️" },
  { value: "multiple-districts", label: "Multiple districts", icon: "📊" },
  { value: "all-of-tn", label: "All of Tamil Nadu (State-wide)", icon: "🇮🇳" },
  { value: "not-sure", label: "Not sure / General problem", icon: "🤔" },
];

export default function StepLocation({ value, onChange }: StepLocationProps) {
  const [districtSearch, setDistrictSearch] = useState("");
  const isSpecialOption = SCOPE_OPTIONS.some((s) => s.value === value);

  const filteredDistricts = DISTRICT_OPTIONS.filter((d) => {
    const isScope = ["Multiple districts", "All of Tamil Nadu", "Not sure"].includes(d as string);
    if (isScope) return false;
    return (d as string).toLowerCase().includes(districtSearch.toLowerCase());
  });

  return (
    <div>
      <div className="mb-7">
        <h2 className="font-jakarta font-extrabold text-[24px] sm:text-[28px] text-[#0a0e1a] mb-1.5">
          Where do you face this problem?
        </h2>
        <p className="text-[#64748b] text-[15px]">
          We only need general district-level information to map problem density across Tamil Nadu.
        </p>
      </div>

      {/* Scope quick choices */}
      <div className="space-y-2.5 mb-7">
        {SCOPE_OPTIONS.map((option) => {
          const isSelected = value === option.value;
          return (
            <button
              key={option.value}
              onClick={() => onChange(option.value)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer
                ${
                  isSelected
                    ? "border-[#e85d26] bg-[#fff8f5] shadow-xs"
                    : "border-[#e2e8f0] bg-white hover:border-[#cbd5e1] hover:bg-[#fcfcfb]"
                }`}
              aria-pressed={isSelected}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{option.icon}</span>
                <span
                  className={`text-[15px] ${
                    isSelected ? "text-[#0a0e1a] font-bold" : "text-[#334155] font-medium"
                  }`}
                >
                  {option.label}
                </span>
              </div>
              {isSelected && (
                <div className="w-5 h-5 rounded-full bg-[#e85d26] text-white flex items-center justify-center">
                  <Check size={12} strokeWidth={3} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 my-6">
        <div className="h-px flex-1 bg-[#e2e8f0]" />
        <span className="text-[12px] text-[#94a3b8] font-bold uppercase tracking-wider">
          Or select your district
        </span>
        <div className="h-px flex-1 bg-[#e2e8f0]" />
      </div>

      {/* Search district input */}
      <div className="relative mb-3">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
        <input
          type="search"
          className="input pl-10 text-[14px]"
          placeholder="Filter 38 districts (e.g. Madurai, Salem, Coimbatore...)"
          value={districtSearch}
          onChange={(e) => setDistrictSearch(e.target.value)}
        />
      </div>

      {/* District grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-60 overflow-y-auto p-1 bg-[#f8f7f4] rounded-2xl border border-[#e2e8f0]">
        {filteredDistricts.map((district) => {
          const isSelected = value === district;
          return (
            <button
              key={district}
              onClick={() => onChange(district as string)}
              className={`px-3 py-2.5 rounded-xl border text-left text-[13px] font-medium transition-all duration-150 cursor-pointer
                ${
                  isSelected
                    ? "border-[#e85d26] bg-[#e85d26] text-white font-bold shadow-xs scale-102"
                    : "border-white/80 bg-white text-[#334155] hover:border-[#cbd5e1] hover:bg-[#fff]"
                }`}
              aria-pressed={isSelected}
            >
              {district}
            </button>
          );
        })}
      </div>

      {/* Selected location feedback pill */}
      {value && (
        <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f0fdf4] border border-[#bbf7d0] text-[13px] text-[#16a34a] font-bold">
          <MapPin size={14} />
          <span>Selected: {SCOPE_OPTIONS.find((s) => s.value === value)?.label || value}</span>
        </div>
      )}

      {/* Privacy pledge */}
      <p className="mt-5 text-[12px] text-[#94a3b8] flex items-center gap-1.5">
        <span>🔒</span>
        <span>We never ask for or store GPS coordinates or street addresses. Only general district metrics are recorded.</span>
      </p>
    </div>
  );
}

