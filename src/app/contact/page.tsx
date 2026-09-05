import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactForm from "@/components/contact/ContactForm";
import { Mail, MessageSquare, MapPin, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us — Build Tamil Nadu | Citizen Support & Inquiries",
  description:
    "Have questions, press inquiries, or feedback? Get in touch with the Build Tamil Nadu initiative team.",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-[#f8f7f4]">
        {/* Header Banner */}
        <section className="bg-[#0a0e1a] text-white py-16 lg:py-20 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#e85d26] rounded-full blur-[140px] opacity-[0.12]" />
            <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#3b82f6] rounded-full blur-[140px] opacity-[0.08]" />
          </div>

          <div className="container max-w-4xl relative z-10 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/10 text-[13px] text-white/80 font-medium">
              <MessageSquare size={14} className="text-[#fb923c]" />
              <span>Direct Citizen Support &amp; Inquiries</span>
            </div>

            <h1
              className="font-jakarta font-extrabold text-white tracking-tight"
              style={{ fontSize: "clamp(30px, 4.5vw, 50px)", lineHeight: 1.1 }}
            >
              We&apos;re Listening to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b35] via-[#f97316] to-[#f59e0b]">
                Tamil Nadu.
              </span>
            </h1>

            <p className="text-white/60 text-[16px] sm:text-[18px] max-w-2xl mx-auto leading-relaxed">
              Whether you want to follow up on a problem submission, offer feedback on public voting, or report a technical bug, our team is here to assist.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12 lg:py-16">
          <div className="container max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Left Column: Direct Info */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                  <div>
                    <h2 className="font-jakarta font-bold text-[20px] text-[#0a0e1a] mb-1">
                      Direct Email Desks
                    </h2>
                    <p className="text-xs text-[#64748b]">
                      Reach the specific working group for your inquiry:
                    </p>
                  </div>

                  <div className="space-y-4 text-sm">
                    <div className="p-4 rounded-2xl bg-[#f8f7f4] border border-[#e2e8f0]">
                      <span className="text-xs font-bold text-[#64748b] uppercase tracking-wider block mb-1">
                        General &amp; Citizen Inquiries
                      </span>
                      <a
                        href="mailto:swayam@wedigistudio.com"
                        className="font-bold text-[#e85d26] hover:underline flex items-center gap-2 text-[15px]"
                      >
                        <Mail size={16} />
                        <span>swayam@wedigistudio.com</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* FAQ Quick Callout */}
                <div className="bg-gradient-to-br from-[#0a0e1a] to-[#1e293b] text-white rounded-3xl p-6 sm:p-7 border border-white/10 space-y-3 shadow-md">
                  <span className="text-xs font-mono font-bold text-[#fb923c] uppercase">
                    Have a quick question?
                  </span>
                  <h3 className="font-jakarta font-bold text-[17px] text-white">
                    Explore How the Initiative Works
                  </h3>
                  <p className="text-xs text-white/60 leading-relaxed">
                    Check out our 7-step roadmap from citizen voice to production software and voting verification FAQs.
                  </p>
                  <Link
                    href="/how-it-works"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#fb923c] hover:underline pt-1"
                  >
                    <span>Read How It Works FAQ →</span>
                  </Link>
                </div>
              </div>

              {/* Right Column: Contact Form */}
              <div className="lg:col-span-7">
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
