import Link from "next/link";
import { ChevronRight } from "lucide-react";

const EXAMPLES = [
  {
    category: "Healthcare",
    categoryColor: "#EF4444",
    categoryBg: "#FEF2F2",
    quote: '"Finding available appointments at nearby government hospitals is very difficult and takes too much time."',
    context: "This is an example — not an actual submitted idea",
  },
  {
    category: "Transport",
    categoryColor: "#F59E0B",
    categoryBg: "#FFFBEB",
    quote: '"I want to know how crowded my bus will be before it arrives at my stop."',
    context: "This is an example — not an actual submitted idea",
  },
  {
    category: "Education",
    categoryColor: "#3B82F6",
    categoryBg: "#EFF6FF",
    quote: '"Students need one simple place to discover scholarships they\'re actually eligible for."',
    context: "This is an example — not an actual submitted idea",
  },
  {
    category: "Agriculture",
    categoryColor: "#22C55E",
    categoryBg: "#F0FDF4",
    quote: '"Farmers need simpler access to local weather forecasts and current market prices in their area."',
    context: "This is an example — not an actual submitted idea",
  },
];

export default function ExamplesSection() {
  return (
    <section className="section bg-[#f8f7f4]" aria-labelledby="examples-heading">
      <div className="container">
        <div className="max-w-2xl mb-12">
          <div className="section-eyebrow">
            <span className="w-4 h-px bg-[#e85d26]" />
            Not Sure What to Submit?
          </div>
          <h2 className="section-title" id="examples-heading">
            Your idea doesn't need to be technical.
          </h2>
          <p className="section-subtitle mt-4">
            You don't need to know how to build it. Just tell us the problem. 
            Here are the kinds of things people might submit:
          </p>
        </div>

        {/* Example Cards */}
        <div className="grid md:grid-cols-2 gap-5 mb-12">
          {EXAMPLES.map((example, index) => (
            <div
              key={index}
              className="bg-white border border-[#e2e8f0] rounded-2xl p-6 hover:border-[#cbd5e1] transition-colors"
            >
              {/* Category badge */}
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold mb-4"
                style={{ backgroundColor: example.categoryBg, color: example.categoryColor }}
              >
                {example.category}
              </div>

              {/* Quote */}
              <blockquote className="font-jakarta font-medium text-[17px] text-[#0a0e1a] leading-snug mb-4">
                {example.quote}
              </blockquote>

              {/* Context note */}
              <p className="text-[11px] text-[#94a3b8] italic border-t border-[#f1f5f9] pt-3">
                {example.context}
              </p>
            </div>
          ))}
        </div>

        {/* Message */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-8 text-center max-w-2xl mx-auto">
          <p className="font-jakarta font-bold text-[20px] text-[#0a0e1a] mb-3">
            Your idea is probably just as valid.
          </p>
          <p className="text-[#64748b] text-[15px] mb-6 leading-relaxed">
            Maybe you've wondered, "Why doesn't an app exist for this?" 
            That's exactly the kind of thing we want to hear.
          </p>
          <Link href="/submit" className="btn btn-primary" id="examples-cta">
            Submit Your Idea
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
