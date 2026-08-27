import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use — Build Tamil Nadu",
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <div className="bg-white border-b border-[#e2e8f0] py-12">
          <div className="container max-w-3xl">
            <h1 className="font-jakarta font-bold text-[36px] text-[#0a0e1a] mb-3">Terms of Use</h1>
            <p className="text-[#64748b]">Last updated: August 2026</p>
          </div>
        </div>
        <div className="bg-[#f8f7f4]">
          <div className="container max-w-3xl py-12">
            <div className="bg-white border border-[#e2e8f0] rounded-2xl p-8 space-y-6 text-[15px] text-[#374151] leading-relaxed">
              <p>
                By using Build Tamil Nadu, you agree to submit only genuine ideas and problems. 
                You agree not to submit spam, inappropriate content, or misleading information.
              </p>
              <p>
                Build Tamil Nadu reserves the right to remove or moderate any submission that 
                violates our content guidelines, without prior notice.
              </p>
              <p>
                Submitted ideas become part of the Build Tamil Nadu campaign. We may use 
                submitted ideas (anonymized) for research, product design, and public reporting.
              </p>
              <p>
                Build Tamil Nadu does not guarantee that any submitted idea will be selected, 
                built, or adopted by any government or institution.
              </p>
              <p>
                This platform is operated by WeDigi as an independent technology initiative. 
                It is not affiliated with any government department or political party.
              </p>
              <p>
                For questions, contact us at{" "}
                <a href="mailto:hello@buildtamilnadu.in" className="text-[#e85d26] hover:underline">
                  hello@buildtamilnadu.in
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
