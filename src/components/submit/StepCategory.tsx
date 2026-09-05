"use client";

import {
  HeartPulse,
  GraduationCap,
  Bus,
  Wheat,
  Briefcase,
  Shield,
  Building2,
  Building,
  Cpu,
  Leaf,
  Smile,
  MoreHorizontal,
  Check,
  Sparkles,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  HeartPulse,
  GraduationCap,
  Bus,
  Wheat,
  Briefcase,
  Shield,
  Building2,
  Building,
  Cpu,
  Leaf,
  Smile,
  MoreHorizontal,
};

const CATEGORIES_DATA = [
  {
    id: "healthcare",
    name: "Healthcare",
    nameTamil: "சுகாதாரம் & நலம்",
    icon: "HeartPulse",
    color: "#EF4444",
    bgGradient: "from-[#fee2e2] to-[#fef2f2]",
    tags: ["Hospital Queues", "PHC Access", "Medicines"],
  },
  {
    id: "education",
    name: "Education",
    nameTamil: "பள்ளிகள் & கல்லூரி",
    icon: "GraduationCap",
    color: "#3B82F6",
    bgGradient: "from-[#dbeafe] to-[#eff6ff]",
    tags: ["Scholarships", "Rural Teaching", "Skill Dev"],
  },
  {
    id: "transport",
    name: "Transport",
    nameTamil: "பேருந்து & போக்குவரத்து",
    icon: "Bus",
    color: "#F59E0B",
    bgGradient: "from-[#fef3c7] to-[#fffbeb]",
    tags: ["Live Bus GPS", "Crowding Alerts", "Rural Routes"],
  },
  {
    id: "agriculture",
    name: "Agriculture",
    nameTamil: "விவசாயம் & சந்தை",
    icon: "Wheat",
    color: "#16A34A",
    bgGradient: "from-[#dcfce7] to-[#f0fdf4]",
    tags: ["Fair Crop Prices", "Water Alerts", "Direct Sales"],
  },
  {
    id: "jobs",
    name: "Jobs & MSMEs",
    nameTamil: "வேலை & சிறுதொழில்",
    icon: "Briefcase",
    color: "#8B5CF6",
    bgGradient: "from-[#ede9fe] to-[#f5f3ff]",
    tags: ["Local Job Match", "MSME Loans", "Youth Skills"],
  },
  {
    id: "safety",
    name: "Safety & Emergency",
    nameTamil: "பாதுகாப்பு & அவசரம்",
    icon: "Shield",
    color: "#DC2626",
    bgGradient: "from-[#fee2e2] to-[#fff1f2]",
    tags: ["Quick SOS", "Night Safety", "Disaster Alert"],
  },
  {
    id: "public-services",
    name: "Civic Services",
    nameTamil: "அரசு & நகராட்சி சேவைகள்",
    icon: "Building2",
    color: "#0891B2",
    bgGradient: "from-[#cffafe] to-[#ecfeff]",
    tags: ["Ration / PDS", "Certificates", "Pensions"],
  },
  {
    id: "cities",
    name: "Smart Cities & Infra",
    nameTamil: "நகர கட்டமைப்பு & சாலைகள்",
    icon: "Building",
    color: "#475569",
    bgGradient: "from-[#e2e8f0] to-[#f8fafc]",
    tags: ["Pothole Repair", "Clean Water", "Waste Mgmt"],
  },
  {
    id: "technology",
    name: "AI & Digital TN",
    nameTamil: "செயற்கை நுண்ணறிவு & தமிழ் AI",
    icon: "Cpu",
    color: "#DB2777",
    bgGradient: "from-[#fce7f3] to-[#fdf4ff]",
    tags: ["Tamil Voice AI", "Digital Literacy", "Scam Defense"],
  },
  {
    id: "environment",
    name: "Environment & Water",
    nameTamil: "நீர் & சுற்றுச்சூழல்",
    icon: "Leaf",
    color: "#059669",
    bgGradient: "from-[#d1fae5] to-[#ecfdf5]",
    tags: ["Lake Protection", "Air Quality", "Plastic Waste"],
  },
  {
    id: "everyday",
    name: "Everyday Living",
    nameTamil: "அன்றாட மக்கள் வாழ்வு",
    icon: "Smile",
    color: "#EA580C",
    bgGradient: "from-[#ffedd5] to-[#fff7ed]",
    tags: ["Senior Care", "Renting Issues", "Civic Access"],
  },
  {
    id: "other",
    name: "Other Challenges",
    nameTamil: "பிற மக்கள் பிரச்சனைகள்",
    icon: "MoreHorizontal",
    color: "#64748B",
    bgGradient: "from-[#e2e8f0] to-[#f1f5f9]",
    tags: ["Custom Problem", "Special Idea", "Unlisted Area"],
  },
];

interface StepCategoryProps {
  value: string;
  onChange: (id: string, name: string) => void;
}

export default function StepCategory({ value, onChange }: StepCategoryProps) {
  return (
    <div className="w-full mb-6">
      {/* Step Header with balanced spacing */}
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e85d26]/10 text-[#e85d26] text-[12px] font-bold uppercase tracking-wider mb-4">
          <Sparkles size={14} />
          <span>Choose Category • Phase 1 Ingestion</span>
        </div>
        <h2 className="font-jakarta font-extrabold text-[28px] sm:text-[36px] text-[#0a0e1a] tracking-tight leading-tight mb-2.5">
          What area of Tamil Nadu needs technology?
        </h2>
        <p className="text-[#e85d26] font-semibold text-[15px] font-tamil mb-3">
          உங்கள் அன்றாட வாழ்வில் மாற்றம் தேவைப்படும் துறையை தேர்ந்தெடுக்கவும்.
        </p>
        <p className="text-[#64748b] text-[14px] sm:text-[15px] leading-relaxed">
          Select the category that best matches your problem. You can submit as many ideas as you want.
        </p>
      </div>

      {/* Categories Grid with generous gap and padding */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {CATEGORIES_DATA.map((cat) => {
          const Icon = ICON_MAP[cat.icon] || MoreHorizontal;
          const isSelected = value === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onChange(cat.id, cat.name)}
              className={`relative flex flex-col justify-between p-4 sm:p-6 rounded-2xl border-2 transition-all duration-200 text-left cursor-pointer group
                ${
                  isSelected
                    ? "border-[#e85d26] bg-[#fffaf7] shadow-lg shadow-[#e85d26]/15 ring-2 ring-[#e85d26]/20 -translate-y-1"
                    : "border-[#e2e8f0] bg-white hover:border-[#cbd5e1] hover:shadow-md hover:-translate-y-0.5"
                }`}
              aria-pressed={isSelected}
              id={`category-${cat.id}`}
            >
              {/* Top Row: Icon + Selected Checkmark */}
              <div className="flex items-center justify-between gap-3 mb-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${cat.bgGradient} shadow-xs group-hover:scale-105 transition-transform`}
                  style={{ color: cat.color }}
                >
                  <Icon size={24} strokeWidth={2.2} />
                </div>

                {isSelected ? (
                  <div className="w-6 h-6 rounded-full bg-[#e85d26] text-white flex items-center justify-center shadow-xs animate-scale-in">
                    <Check size={14} strokeWidth={3} />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-[#e2e8f0] group-hover:border-[#cbd5e1] transition-colors" />
                )}
              </div>

              {/* Title & Tamil Subtitle */}
              <div className="mb-4">
                <h3 className="font-jakarta font-extrabold text-[17px] text-[#0a0e1a] leading-snug group-hover:text-[#e85d26] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[12.5px] font-semibold text-[#e85d26] font-tamil mt-0.5">
                  {cat.nameTamil}
                </p>
              </div>

              {/* Micro-tags / Examples */}
              <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[#f1f5f9]">
                {cat.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-md transition-colors ${
                      isSelected
                        ? "bg-[#e85d26]/10 text-[#e85d26] font-semibold"
                        : "bg-[#f8f7f4] text-[#64748b] group-hover:bg-[#f1f5f9] group-hover:text-[#334155]"
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}


