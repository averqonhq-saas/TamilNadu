import Link from "next/link";
import { ChevronRight, HeartPulse, GraduationCap, Bus, Wheat, Briefcase, Shield, Building2, Building, Cpu, Leaf, Smile, MoreHorizontal } from "lucide-react";

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

const CATEGORIES = [
  { icon: "HeartPulse", name: "Healthcare", description: "Hospital access, appointments, medicines, health information", color: "#EF4444", bg: "#FEF2F2" },
  { icon: "GraduationCap", name: "Education", description: "Students, schools, scholarships, learning, career discovery", color: "#3B82F6", bg: "#EFF6FF" },
  { icon: "Bus", name: "Transport", description: "Buses, trains, traffic, parking, routes, public mobility", color: "#F59E0B", bg: "#FFFBEB" },
  { icon: "Wheat", name: "Agriculture", description: "Farmers, markets, weather, crop information, logistics", color: "#22C55E", bg: "#F0FDF4" },
  { icon: "Briefcase", name: "Jobs & Business", description: "Employment, local businesses, entrepreneurship", color: "#8B5CF6", bg: "#F5F3FF" },
  { icon: "Shield", name: "Safety", description: "Emergency response, public safety, disaster preparedness", color: "#EF4444", bg: "#FFF1F2" },
  { icon: "Building2", name: "Public Services", description: "Government services, civic issues, municipal systems", color: "#06B6D4", bg: "#ECFEFF" },
  { icon: "Building", name: "Cities & Communities", description: "Waste, water, infrastructure, neighbourhood issues", color: "#64748B", bg: "#F8FAFC" },
  { icon: "Cpu", name: "AI & Technology", description: "Useful technology or AI solutions for everyday life", color: "#EC4899", bg: "#FDF4FF" },
  { icon: "Leaf", name: "Environment", description: "Pollution, waste management, water, sustainability", color: "#10B981", bg: "#ECFDF5" },
  { icon: "Smile", name: "Everyday Life", description: "Anything else that makes everyday life harder", color: "#F97316", bg: "#FFF7ED" },
];

export default function CategoriesSection() {
  return (
    <section className="section bg-white" aria-labelledby="categories-heading">
      <div className="container">
        <div className="max-w-2xl mb-12">
          <div className="section-eyebrow">
            <span className="w-4 h-px bg-[#e85d26]" />
            What Can You Submit?
          </div>
          <h2 className="section-title" id="categories-heading">
            Think beyond government services.
          </h2>
          <p className="section-subtitle mt-4">
            We're interested in any technology that can make life better for people in Tamil Nadu — 
            from healthcare and farming to everyday frustrations.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
          {CATEGORIES.map((category) => {
            const Icon = ICON_MAP[category.icon] || MoreHorizontal;
            return (
              <Link
                href={`/submit?category=${category.name.toLowerCase().replace(/\s+/g, "-")}`}
                key={category.name}
                className="card card-hover group"
                style={{ padding: "20px" }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: category.bg }}
                >
                  <Icon size={20} style={{ color: category.color }} />
                </div>
                <h3 className="font-jakarta font-bold text-[15px] text-[#0a0e1a] mb-2">
                  {category.name}
                </h3>
                <p className="text-[13px] text-[#64748b] leading-relaxed">
                  {category.description}
                </p>
              </Link>
            );
          })}

          {/* Other card */}
          <Link
            href="/submit"
            className="card card-hover group border-dashed"
            style={{ padding: "20px" }}
          >
            <div className="w-10 h-10 rounded-xl bg-[#f1f5f9] flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
              <MoreHorizontal size={20} className="text-[#94a3b8]" />
            </div>
            <h3 className="font-jakarta font-bold text-[15px] text-[#0a0e1a] mb-2">
              Other
            </h3>
            <p className="text-[13px] text-[#64748b] leading-relaxed">
              An idea that doesn't fit the categories above
            </p>
          </Link>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/submit" className="btn btn-primary btn-lg" id="categories-cta">
            Share Your Problem
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
