"use client";

import Link from "next/link";
import { Share2, Copy, Check, ArrowRight, Sparkles, CheckCircle2, Clock, MapPin } from "lucide-react";
import { useState } from "react";

const WHATSAPP_MESSAGE = (url: string) =>
  `Tamil Nadu-ku enna technology venum-nu oru new initiative ideas collect panranga. Namma problem-ah submit pannalaam. Maybe namma idea dhaan first product-ah build pannuvanga 👇 ${url}`;

const NEXT_STEPS = [
  { step: "01", title: "Review & Deduplication", titleTamil: "ஆய்வு & தொகுத்தல்", description: "Our system reviews and indexes your submission with similar regional issues." },
  { step: "02", title: "Demographic Pattern Matching", titleTamil: "மாவட்ட வாரியான வகைப்படுத்தல்", description: "We analyze cross-district patterns (e.g. bus transport across Madurai & Trichy)." },
  { step: "03", title: "Public Democratic Vote", titleTamil: "மக்கள் பொது வாக்கெடுப்பு", description: "Top problem statements enter a transparent, open vote across Tamil Nadu." },
  { step: "04", title: "Open Source Engineering", titleTamil: "திறந்த மூல உருவாக்கம்", description: "Engineers and designers build and deploy the winning digital public tool." },
];

export default function SuccessScreen({ ideaId }: { ideaId: string }) {
  const [copied, setCopied] = useState(false);
  const siteUrl = typeof window !== "undefined" ? window.location.origin : "https://buildtamilnadu.in";
  const shareUrl = siteUrl;

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    const msg = encodeURIComponent(WHATSAPP_MESSAGE(shareUrl));
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4] flex flex-col justify-between pt-10 pb-16">
      <div className="container flex-1 flex items-center justify-center">
        <div className="max-w-xl w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f0fdf4] border border-[#bbf7d0] text-[#16a34a] text-xs font-bold uppercase tracking-wider mb-4 shadow-xs">
              <CheckCircle2 size={15} />
              <span>Problem Registered Successfully</span>
            </div>

            <h1 className="font-jakarta font-extrabold text-[30px] sm:text-[36px] text-[#0a0e1a] leading-tight mb-2">
              Your Voice Is Now Part of Build Tamil Nadu.
            </h1>
            <p className="text-[#64748b] text-[16px]">
              Thank you for contributing. Every citizen submission shapes what we build next.
            </p>
          </div>

          {/* Ticket Card */}
          <div className="bg-[#060913] text-white rounded-3xl p-8 mb-6 relative overflow-hidden shadow-xl border border-white/10 text-center">
            {/* Ambient glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#e85d26]/20 rounded-full blur-3xl pointer-events-none" />

            <span className="text-[11px] uppercase tracking-widest text-[#fb923c] font-bold block mb-1">
              Official Public ID
            </span>
            <div className="font-mono font-black text-[38px] sm:text-[44px] text-white tracking-widest my-2">
              #{ideaId}
            </div>
            <p className="text-[13px] text-white/60 max-w-sm mx-auto">
              Save this tracking ID. You can use it to search your submission on the public board.
            </p>
          </div>

          {/* What happens next */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-7 mb-6 shadow-sm">
            <h2 className="font-jakarta font-bold text-[18px] text-[#0a0e1a] mb-5 flex items-center gap-2">
              <Clock size={18} className="text-[#e85d26]" />
              <span>What Happens Next?</span>
            </h2>
            <div className="space-y-4">
              {NEXT_STEPS.map((item, index) => (
                <div key={item.step} className="flex gap-4">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-8 h-8 rounded-xl bg-[#fde8dc] text-[#e85d26] font-jakarta font-bold text-[12px] flex items-center justify-center shadow-xs">
                      {item.step}
                    </div>
                    {index < NEXT_STEPS.length - 1 && (
                      <div className="w-0.5 flex-1 bg-[#f1f5f9] mt-2 min-h-[20px]" />
                    )}
                  </div>
                  <div className="pb-3">
                    <p className="font-bold text-[14.5px] text-[#0a0e1a]">
                      {item.title} <span className="text-[12px] text-[#e85d26] font-tamil font-semibold">({item.titleTamil})</span>
                    </p>
                    <p className="text-[13px] text-[#64748b] mt-0.5 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Spread the word */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-7 mb-6 shadow-sm">
            <h3 className="font-jakarta font-bold text-[17px] text-[#0a0e1a] mb-1">
              Help Other Citizens Speak Up
            </h3>
            <p className="text-[13px] text-[#64748b] mb-4">
              Share Build Tamil Nadu with friends, family, and colleagues in your district.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={shareWhatsApp}
                className="btn flex-1 justify-center font-bold text-white h-11 rounded-xl shadow-xs"
                style={{ backgroundColor: "#25D366" }}
                id="share-whatsapp"
              >
                <Share2 size={16} />
                <span>Share on WhatsApp</span>
              </button>
              <button
                onClick={copyLink}
                className="btn btn-secondary flex-1 justify-center font-bold h-11 rounded-xl"
                id="share-copy"
              >
                {copied ? (
                  <>
                    <Check size={16} className="text-[#22c55e]" />
                    <span>Copied link!</span>
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    <span>Copy Share Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Explore ideas and submit another problem CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/submit"
              className="btn btn-primary flex-1 justify-center h-12 rounded-2xl font-bold text-[14px] shadow-md shadow-[#e85d26]/20"
              id="submit-another-btn"
            >
              <span>+ Submit Another Problem</span>
            </Link>

            <Link
              href="/ideas"
              className="btn btn-secondary flex-1 justify-center group h-12 rounded-2xl font-bold text-[14px]"
              id="success-explore-btn"
            >
              <span>Explore All Problems</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
