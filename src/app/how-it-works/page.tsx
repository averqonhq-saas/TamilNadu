import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HowItWorksContent from "@/components/how-it-works/HowItWorksContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works — Build Tamil Nadu | The 7-Step Civic Innovation Lifecycle",
  description:
    "Discover how an everyday problem becomes a production open-source software solution. The full 7-step process from listening to state-wide deployment.",
};

export default function HowItWorksPage() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <HowItWorksContent />
      </main>
      <Footer />
    </>
  );
}

