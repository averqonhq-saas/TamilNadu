import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import IdeaBoard from "@/components/ideas/IdeaBoard";
import { Sparkles, MapPin } from "lucide-react";
import type { Metadata } from "next";
import { getSiteConfig } from "@/lib/data/siteConfig";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Public Ideas Gallery — Build Tamil Nadu | Citizen Problem Registry",
  description:
    "Explore community problems and civic tech ideas submitted by citizens across all 38 districts of Tamil Nadu.",
};

export default async function IdeasPage() {
  const { campaignStatus, siteName, supportEmail } = await getSiteConfig();

  return (
    <>
      <Navbar campaignStatus={campaignStatus} />
      <main id="main-content" className="bg-[#f8f7f4]">
        {/* Ambient Dark Hero Header */}
        <div className="relative bg-[#060913] text-white pt-24 pb-16 lg:pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_-10%,rgba(232,93,38,0.16),transparent)]" aria-hidden="true" />
          <div className="absolute top-1/2 right-10 w-80 h-80 bg-[#e85d26]/10 rounded-full blur-[130px] pointer-events-none" aria-hidden="true" />

          <div className="container relative z-10">
            <div className="max-w-3xl space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.08] border border-white/15 text-[12px] text-white/90 font-bold uppercase tracking-wider">
                  <Sparkles size={13} className="text-[#f59e0b]" />
                  <span>Phase 1 : Public Ingestion</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e85d26]/15 border border-[#e85d26]/30 text-[12px] text-[#f97316] font-medium">
                  <MapPin size={12} />
                  <span>38 மாவட்டங்கள் • தமிழ்நாடு</span>
                </div>
              </div>

              <h1 className="font-jakarta font-extrabold text-white text-[34px] sm:text-[46px] lg:text-[52px] leading-tight tracking-tight">
                What is Tamil Nadu{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b35] via-[#f97316] to-[#f59e0b]">
                  talking about?
                </span>
              </h1>

              <p className="text-white/70 text-[16px] sm:text-[17px] leading-relaxed max-w-2xl">
                Browse verified problems submitted by citizens across Tamil Nadu. Filter by district,
                theme, or search for issues impacting your locality.
              </p>
            </div>
          </div>
        </div>

        {/* Idea Board */}
        <div className="container py-10 lg:py-14">
          <IdeaBoard />
        </div>
      </main>
      <Footer siteName={siteName} supportEmail={supportEmail} campaignStatus={campaignStatus} />
    </>
  );
}
