import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PartnerForm from "@/components/partner/PartnerForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partner With Us — Build Tamil Nadu",
  description: "For government bodies and institutions interested in collaborating with Build Tamil Nadu.",
};

export default function PartnerPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <div className="bg-[#0a0e1a] py-16 lg:py-20">
          <div className="container max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-[13px] text-white/60 font-medium mb-6">
              🤝 Collaboration
            </div>
            <h1 className="font-jakarta font-bold text-white mb-4"
              style={{ fontSize: "clamp(28px, 4vw, 46px)", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
              For Government & Institutions
            </h1>
            <p className="text-white/50 text-[17px] leading-relaxed">
              Technology alone can only go so far. Solutions that serve millions of people often need 
              collaboration between builders, institutions, and government bodies.
            </p>
          </div>
        </div>

        <div className="bg-[#f8f7f4] py-12 lg:py-20">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-16 max-w-5xl mx-auto">
              {/* Left */}
              <div>
                <h2 className="font-jakarta font-bold text-[24px] text-[#0a0e1a] mb-4">
                  What does collaboration look like?
                </h2>
                <div className="space-y-4 text-[15px] text-[#374151] leading-relaxed mb-8">
                  <p>
                    Build Tamil Nadu is an independent technology initiative. We are not affiliated 
                    with any government body or political party.
                  </p>
                  <p>
                    However, when we build a product that could genuinely serve a large population, 
                    the most effective path to scale often involves working with the right institutions.
                  </p>
                  <p>
                    If you represent an organization, institution, or government department and are 
                    interested in what we're building, we'd like to have a conversation.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    "Technology research partnerships",
                    "Pilot program opportunities",
                    "Data sharing agreements",
                    "Co-development discussions",
                    "General interest and inquiry",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-[14px] text-[#374151]">
                      <div className="w-5 h-5 rounded-full bg-[#fde8dc] flex items-center justify-center flex-shrink-0">
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L4 7L9 1" stroke="#e85d26" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Form */}
              <PartnerForm />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
