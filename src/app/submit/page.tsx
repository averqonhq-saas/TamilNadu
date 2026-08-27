import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SubmitFlow from "@/components/submit/SubmitFlow";
import type { Metadata } from "next";
import { getSiteConfig } from "@/lib/data/siteConfig";

export const metadata: Metadata = {
  title: "Share Your Idea — Build Tamil Nadu",
  description:
    "Tell us about a problem you face in Tamil Nadu. Your idea could become the next product we build.",
};

export default async function SubmitPage() {
  const { campaignStatus, siteName, supportEmail } = await getSiteConfig();

  return (
    <>
      <Navbar campaignStatus={campaignStatus} />
      <main className="pt-[76px] lg:pt-[84px]">
        <SubmitFlow />
      </main>
      <Footer siteName={siteName} supportEmail={supportEmail} campaignStatus={campaignStatus} />
    </>
  );
}
