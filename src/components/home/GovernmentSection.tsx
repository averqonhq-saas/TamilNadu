import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function GovernmentSection() {
  return (
    <section className="section bg-white border-t border-[#e2e8f0]" aria-labelledby="gov-heading">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <div className="section-eyebrow">
              <span className="w-4 h-px bg-[#e85d26]" />
              Collaboration
            </div>
            <h2 className="section-title mb-4" id="gov-heading">
              Technology can only go so far alone.
            </h2>
            <p className="text-[#64748b] text-[16px] leading-relaxed mb-4">
              We can research, design and build technology. But solutions that can serve millions of 
              people often need collaboration between builders, institutions, and government.
            </p>
            <p className="text-[#64748b] text-[16px] leading-relaxed mb-8">
              If you represent an organization, institution, or government body and are interested in 
              what comes out of this initiative, we'd like to hear from you.
            </p>
            <Link
              href="/partner"
              className="btn btn-secondary group"
              id="gov-cta"
            >
              For Government & Institutions
              <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          {/* Right: Story flow */}
          <div className="space-y-4">
            {[
              { who: "You", action: "Share a real problem you face", color: "#e85d26" },
              { who: "Build Tamil Nadu", action: "Listens, reviews and organizes", color: "#3b82f6" },
              { who: "Tamil Nadu", action: "Votes on what to build first", color: "#22c55e" },
              { who: "We", action: "Build the winning product", color: "#f59e0b" },
              { who: "Government / Institutions", action: "May help scale suitable solutions", color: "#8b5cf6" },
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-[11px]"
                    style={{ backgroundColor: item.color }}
                  >
                    {index + 1}
                  </div>
                  {index < 4 && (
                    <div className="w-px h-6 bg-[#e2e8f0] mt-1" />
                  )}
                </div>
                <div className="pt-1.5">
                  <span className="font-jakarta font-bold text-[14px] text-[#0a0e1a]">{item.who}</span>
                  <span className="text-[#64748b] text-[14px]"> — {item.action}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
