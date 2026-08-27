import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function FinalSection() {
  return (
    <section className="section bg-[#f8f7f4]" aria-labelledby="final-heading">
      <div className="container text-center">
        <h2
          className="font-jakarta font-bold text-[#0a0e1a] mb-4 max-w-2xl mx-auto"
          id="final-heading"
          style={{ fontSize: "clamp(28px, 5vw, 48px)", letterSpacing: "-0.02em", lineHeight: 1.1 }}
        >
          Tamil Nadu has the ideas.
          <br />
          We want to hear yours.
        </h2>
        <p className="text-[#64748b] text-[17px] mb-3 max-w-xl mx-auto">
          One problem can start a conversation.
        </p>
        <p className="text-[#64748b] text-[17px] mb-3 max-w-xl mx-auto">
          One idea can become a product.
        </p>
        <p className="text-[#64748b] text-[17px] mb-12 max-w-xl mx-auto">
          One product can help thousands of people.
        </p>

        <Link
          href="/submit"
          className="btn btn-primary btn-lg mx-auto inline-flex"
          style={{ fontSize: "17px", padding: "18px 40px" }}
          id="final-cta"
        >
          Share Your Idea →
        </Link>

        <p className="mt-5 text-[13px] text-[#94a3b8]">
          Idea collection is currently open.
        </p>

        {/* District challenge */}
        <div className="mt-16 max-w-md mx-auto bg-white border border-[#e2e8f0] rounded-2xl p-6">
          <p className="text-[13px] text-[#94a3b8] font-medium uppercase tracking-wider mb-2">Campaign goal</p>
          <p className="font-jakarta font-bold text-[18px] text-[#0a0e1a] mb-2">
            Hear from all 38 districts of Tamil Nadu.
          </p>
          <p className="text-[14px] text-[#64748b]">
            Every district has unique problems. Help us make sure every district is represented.
          </p>
        </div>
      </div>
    </section>
  );
}
