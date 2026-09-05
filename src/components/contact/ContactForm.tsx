"use client";

import { useState } from "react";
import { Send, CheckCircle2, Loader2 } from "lucide-react";
import { TAMIL_NADU_DISTRICTS } from "@/lib/constants/districts";
import { toast } from "sonner";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    district: "Chennai",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [inquiryId, setInquiryId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to submit inquiry");

      setInquiryId(data.inquiry?.id || "INQ-2026-CONFIRMED");
      setSubmitted(true);
      toast.success("Message sent successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white border border-[#e2e8f0] rounded-3xl p-8 sm:p-10 text-center shadow-lg animate-scale-in space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-[#f0fdf4] text-[#16a34a] flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle2 size={36} />
        </div>

        <div>
          <span
            className="font-mono text-xs font-bold text-[#e85d26] bg-[#e85d26]/10 px-3 py-1 rounded-full"
            title={inquiryId}
          >
            Ticket #{inquiryId.length > 12 ? inquiryId.slice(0, 8).toUpperCase() : inquiryId}
          </span>
          <h3 className="font-jakarta font-extrabold text-[24px] text-[#0a0e1a] mt-3 mb-1">
            Vanakkam! Your message has reached our team.
          </h3>
          <p className="text-[#64748b] text-[15px] max-w-md mx-auto leading-relaxed">
            Thank you for reaching out. An initiative team member will review your note and respond to{" "}
            <strong className="text-[#0a0e1a]">{form.email}</strong> shortly.
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={() => {
              setSubmitted(false);
              setForm({
                name: "",
                email: "",
                phone: "",
                subject: "General Inquiry",
                district: "Chennai",
                message: "",
              });
            }}
            className="btn btn-secondary btn-sm rounded-xl font-bold px-6"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-8 shadow-sm space-y-5"
    >
      <div>
        <h3 className="font-jakarta font-extrabold text-[22px] text-[#0a0e1a] mb-1">
          Send Us a Message
        </h3>
        <p className="text-xs text-[#64748b]">
          Have a question about the initiative, problem ingestion, or press inquiries? We&apos;d love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[13px] font-bold text-[#0a0e1a] mb-1" htmlFor="c-name">
            Full Name <span className="text-[#e85d26]">*</span>
          </label>
          <input
            id="c-name"
            type="text"
            required
            className="input text-sm h-11"
            placeholder="e.g. Senthil Nathan"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-[13px] font-bold text-[#0a0e1a] mb-1" htmlFor="c-email">
            Email Address <span className="text-[#e85d26]">*</span>
          </label>
          <input
            id="c-email"
            type="email"
            required
            className="input text-sm h-11"
            placeholder="senthil@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[13px] font-bold text-[#0a0e1a] mb-1" htmlFor="c-subject">
            Inquiry Topic <span className="text-[#e85d26]">*</span>
          </label>
          <select
            id="c-subject"
            className="input text-sm h-11 bg-white font-medium"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
          >
            <option value="General Inquiry">General Inquiry</option>
            <option value="Government Officials">Government Officials</option>
            <option value="Idea & Problem Intake Question">Idea &amp; Problem Intake Question</option>
            <option value="Public Voting & Ballot Verification">Public Voting &amp; Ballot Verification</option>
            <option value="Press & Media Coverage">Press &amp; Media Coverage</option>
            <option value="Student / Campus Workshop">Student / Campus Workshop</option>
            <option value="Technical Feedback / Bug Report">Technical Feedback / Bug Report</option>
          </select>
        </div>

        <div>
          <label className="block text-[13px] font-bold text-[#0a0e1a] mb-1" htmlFor="c-district">
            Your District (Optional)
          </label>
          <select
            id="c-district"
            className="input text-sm h-11 bg-white font-medium"
            value={form.district}
            onChange={(e) => setForm({ ...form, district: e.target.value })}
          >
            {TAMIL_NADU_DISTRICTS.map((d) => (
              <option key={d.name} value={d.name}>
                {d.name} ({d.nameTamil})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-[13px] font-bold text-[#0a0e1a] mb-1" htmlFor="c-message">
          Message <span className="text-[#e85d26]">*</span>
        </label>
        <textarea
          id="c-message"
          required
          rows={4}
          className="input textarea text-sm p-3.5 resize-none leading-relaxed"
          placeholder="How can we assist you? Please provide relevant details..."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary w-full justify-center font-bold h-12 rounded-2xl shadow-lg shadow-[#e85d26]/20"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Sending Message...</span>
          </>
        ) : (
          <>
            <span>Submit Message</span>
            <Send size={15} />
          </>
        )}
      </button>

      <p className="text-[12px] text-[#94a3b8] text-center">
        🔒 Responses are monitored by the core initiative team. No promotional emails or spam.
      </p>
    </form>
  );
}
