import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import ExamplesSection from "@/components/home/ExamplesSection";
import CtaSection from "@/components/home/CtaSection";
import GovernmentSection from "@/components/home/GovernmentSection";
import FinalSection from "@/components/home/FinalSection";
import { getSiteStats } from "@/lib/data/stats";
import { getSiteConfig } from "@/lib/data/siteConfig";

export const dynamic = "force-dynamic";

// Parallel server-side data fetching — single round-trip, no client-side calls
async function getPageData() {
  const [config, stats] = await Promise.all([
    getSiteConfig(),
    getSiteStats(),
  ]);
  return { config, stats };
}

export default async function Home() {
  const { config, stats } = await getPageData();
  const { campaignStatus, siteName, supportEmail } = config;

  return (
    <>
      {/* Navbar gets campaign status from server — no client fetch */}
      <Navbar campaignStatus={campaignStatus} />

      <main>
        {/* ---- ABOVE THE FOLD: renders instantly as static HTML ---- */}
        <HeroSection campaignStatus={campaignStatus} />

        {/* Stats — server-fetched, passed as props */}
        <StatsSection stats={stats} />

        {/* ---- BELOW THE FOLD: loaded after hero paint ---- */}
        <HowItWorksSection />
        <CategoriesSection />
        <ExamplesSection />

        {/* CTA is now a server component — pure static HTML */}
        <CtaSection campaignStatus={campaignStatus} />

        <GovernmentSection />
        <FinalSection />
      </main>

      {/* Footer gets all data from server — no client fetches */}
      <Footer
        siteName={siteName}
        supportEmail={supportEmail}
        campaignStatus={campaignStatus}
      />
    </>
  );
}
