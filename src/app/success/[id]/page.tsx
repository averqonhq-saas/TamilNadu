import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SuccessScreen from "@/components/submit/SuccessScreen";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Idea Submitted — Build Tamil Nadu",
  description: "Your idea has been submitted to Build Tamil Nadu.",
  robots: { index: false, follow: false },
};

interface SuccessPageProps {
  params: Promise<{ id: string }>;
}

export default async function SuccessPage({ params }: SuccessPageProps) {
  const { id } = await params;

  if (!id || !id.startsWith("TN-")) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="pt-16">
        <SuccessScreen ideaId={id} />
      </main>
      <Footer />
    </>
  );
}
