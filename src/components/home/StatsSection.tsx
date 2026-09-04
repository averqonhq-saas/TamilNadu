import { Lightbulb, Map, Tag, Clock, ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface Stats {
  totalIdeas: number;
  districtsRepresented: number;
  categoriesActive: number;
  daysRemaining: number | null;
}

interface StatsSectionProps {
  stats: Stats;
}

export default function StatsSection({ stats }: StatsSectionProps) {
  const statItems = [
    {
      icon: <Lightbulb size={22} className="text-[#e85d26]" />,
      iconBg: "bg-[#e85d26]/10",
      value: stats.totalIdeas === 0 ? "Open" : stats.totalIdeas.toLocaleString("en-IN"),
      label: "Ideas Ingested",
      sublabel: stats.totalIdeas === 0 ? "Be among the first" : "citizens contributing",
      href: "/ideas",
    },
    {
      icon: <Map size={22} className="text-[#3b82f6]" />,
      iconBg: "bg-[#3b82f6]/10",
      value: `${stats.districtsRepresented} / 38`,
      label: "Districts Represented",
      sublabel: "across Tamil Nadu",
      href: "/ideas",
    },
    {
      icon: <Tag size={22} className="text-[#10b981]" />,
      iconBg: "bg-[#10b981]/10",
      value: stats.categoriesActive.toString(),
      label: "Core Themes",
      sublabel: "healthcare, transit & more",
      href: "/ideas",
    },
    {
      icon: <Clock size={22} className="text-[#f59e0b]" />,
      iconBg: "bg-[#f59e0b]/10",
      value: stats.daysRemaining !== null ? `${stats.daysRemaining}d` : "Phase 1",
      label: "Collection Period",
      sublabel: "before public voting",
      href: "/ideas",
    },
  ];

  return (
    <section className="relative bg-[#f8f7f4] border-b border-[#e2e8f0] py-10 lg:py-14" aria-label="Campaign statistics">
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {statItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="bg-white rounded-2xl p-6 border border-[#e2e8f0] shadow-sm hover:shadow-md hover:border-[#e85d26]/40 transition-all duration-200 group relative flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${item.iconBg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                  {item.icon}
                </div>
                <ArrowUpRight size={16} className="text-[#94a3b8] group-hover:text-[#e85d26] transition-colors" />
              </div>

              <div>
                <div className="font-jakarta font-extrabold text-[32px] lg:text-[38px] text-[#0a0e1a] leading-none tracking-tight mb-1">
                  {item.value}
                </div>
                <div className="font-bold text-[14px] text-[#0a0e1a] mb-0.5">
                  {item.label}
                </div>
                <div className="text-[12px] text-[#64748b]">
                  {item.sublabel}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

