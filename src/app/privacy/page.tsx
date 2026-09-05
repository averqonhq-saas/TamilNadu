import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Build Tamil Nadu",
  description: "How Build Tamil Nadu collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <div className="bg-white border-b border-[#e2e8f0] py-12">
          <div className="container max-w-3xl">
            <h1 className="font-jakarta font-bold text-[36px] text-[#0a0e1a] mb-3">
              Privacy Policy
            </h1>
            <p className="text-[#64748b]">
              Last updated: August 2026
            </p>
          </div>
        </div>

        <div className="bg-[#f8f7f4]">
          <div className="container max-w-3xl py-12 lg:py-16">
            <div className="bg-white border border-[#e2e8f0] rounded-2xl p-8 space-y-8">
              <Section title="What information we collect">
                <p>When you submit an idea, we collect:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li><strong>Email address</strong> — required, so we can send you updates about your idea.</li>
                  <li><strong>Name</strong> — optional, only if you choose to provide it.</li>
                  <li><strong>District</strong> — the district or region you selected.</li>
                  <li><strong>Idea content</strong> — the category, problem, description, and any optional solution you described.</li>
                  <li><strong>Submission timestamp</strong> — when your idea was submitted.</li>
                </ul>
                <p className="mt-3">We do <strong>not</strong> collect phone numbers, home addresses, Aadhaar numbers, GPS location, or any government ID.</p>
              </Section>

              <Section title="Why we collect email">
                <p>Your email is used only to:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Send you a confirmation that your idea was received.</li>
                  <li>Notify you when your idea is shortlisted.</li>
                  <li>Notify you when voting begins.</li>
                  <li>Inform you of the voting outcome.</li>
                  <li>Share updates about the product being built (if your idea wins).</li>
                </ul>
                <p className="mt-3">We will never sell your email, share it with third parties for marketing, or use it for any purpose other than Build Tamil Nadu campaign updates.</p>
              </Section>

              <Section title="What information is made public">
                <p>Ideas that are shortlisted and made public will appear on the ideas board. When displayed publicly, an idea shows:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Category</li>
                  <li>Problem title</li>
                  <li>Description (if provided)</li>
                  <li>District</li>
                  <li>Idea ID (e.g., TN-2026-00001)</li>
                </ul>
                <p className="mt-3"><strong>Your email address, name, and any personal information are never publicly displayed.</strong></p>
              </Section>

              <Section title="How your information is protected">
                <ul className="list-disc pl-5 space-y-1">
                  <li>All data is stored in a secure, encrypted database (Supabase / PostgreSQL).</li>
                  <li>Access to personal information is restricted to authorized platform administrators.</li>
                  <li>We use row-level security to prevent unauthorized data access.</li>
                  <li>All connections are encrypted in transit (HTTPS/TLS).</li>
                  <li>We do not store passwords — email-based communication only.</li>
                </ul>
              </Section>

              <Section title="Data retention">
                <p>
                  We retain submitted ideas and associated contact information for the duration of the campaign
                  and for a reasonable period thereafter to fulfill campaign obligations (e.g., notifying voters of results,
                  updating submitters on product progress).
                </p>
                <p className="mt-3">
                  You may request deletion of your personal information at any time by contacting us.
                </p>
              </Section>

              <Section title="Your rights">
                <ul className="list-disc pl-5 space-y-1">
                  <li>You may request access to the personal information we hold about you.</li>
                  <li>You may request correction of inaccurate information.</li>
                  <li>You may request deletion of your personal data.</li>
                  <li>You may withdraw your consent to email communications at any time.</li>
                </ul>
                <p className="mt-3">To exercise any of these rights, contact us at <a href="mailto:swayam@wedigistudio.com" className="text-[#e85d26] hover:underline">swayam@wedigistudio.com</a>.</p>
              </Section>

              <Section title="Independence">
                <p>
                  Build Tamil Nadu is an independent initiative by WeDigi. It is not an official government
                  platform. Your data is held by WeDigi and is not shared with any government department.
                </p>
              </Section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-jakarta font-bold text-[20px] text-[#0a0e1a] mb-3">{title}</h2>
      <div className="text-[15px] text-[#374151] leading-relaxed space-y-2">{children}</div>
    </div>
  );
}
