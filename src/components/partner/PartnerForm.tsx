"use client";

import { useState } from "react";
import { Send, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function PartnerForm() {
  const [form, setForm] = useState({
    organization: "",
    name: "",
    email: "",
    phone: "",
    role: "",
    track: "Pilot Program & Usability Testing",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.organization || !form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit partnership application");

      setTicketId(data.inquiry?.id || "PRT-2026-CONFIRMED");
      setSubmitted(true);
      toast.success("Partnership proposal submitted successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit proposal. Please try again.");
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
          <span className="font-mono text-xs font-bold text-[#e85d26] bg-[#e85d26]/10 px-3 py-1 rounded-full">
            Proposal #{ticketId}
          </span>
          <h3 className="font-jakarta font-extrabold text-[24px] text-[#0a0e1a] mt-3 mb-1">
            Partnership Inquiry Recorded
          </h3>
          <p className="text-[#64748b] text-[15px] max-w-md mx-auto leading-relaxed">
            Thank you for reaching out from <strong className="text-[#0a0e1a]">{form.organization}</strong>. Our partnership lead will review your institutional proposal and follow up with you at{" "}
            <strong className="text-[#0a0e1a]">{form.email}</strong> within 2–3 working days.
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={() => {
              setSubmitted(false);
              setForm({
                organization: "",
                name: "",
                email: "",
                phone: "",
                role: "",
                track: "Pilot Program & Usability Testing",
                message: "",
              });
            }}
            className="btn btn-secondary btn-sm rounded-xl font-bold px-6"
          >
            Submit Another Proposal
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm">
      <div>
        <h3 className="font-jakarta font-extrabold text-[22px] text-[#0a0e1a] mb-1">
          Initiate Collaboration
        </h3>
        <p className="text-xs text-[#64748b]">
          Submit your institutional, municipal, or academic partnership interest.
        </p>
      </div>

      <div>
        <label className="block text-[13px] font-bold text-[#0a0e1a] mb-1.5" htmlFor="org">
          Organization / Institution <span className="text-[#e85d26]">*</span>
        </label>
        <input
          id="org"
          type="text"
          className="input text-sm h-11"
          placeholder="e.g. Dept of Transport / University Lab / NGO"
          value={form.organization}
          onChange={(e) => setForm({ ...form, organization: e.target.value })}
          required
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[13px] font-bold text-[#0a0e1a] mb-1.5" htmlFor="pname">
            Contact Person <span className="text-[#e85d26]">*</span>
          </label>
          <input
            id="pname"
            type="text"
            className="input text-sm h-11"
            placeholder="e.g. Dr. K. Swaminathan"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-[13px] font-bold text-[#0a0e1a] mb-1.5" htmlFor="pemail">
            Official Email <span className="text-[#e85d26]">*</span>
          </label>
          <input
            id="pemail"
            type="email"
            className="input text-sm h-11"
            placeholder="you@institution.org"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[13px] font-bold text-[#0a0e1a] mb-1.5" htmlFor="role">
            Role / Designation
          </label>
          <input
            id="role"
            type="text"
            className="input text-sm h-11"
            placeholder="e.g. Director / Research Lead"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-[13px] font-bold text-[#0a0e1a] mb-1.5" htmlFor="ptrack">
            Partnership Track
          </label>
          <select
            id="ptrack"
            className="input text-sm h-11 bg-white font-medium"
            value={form.track}
            onChange={(e) => setForm({ ...form, track: e.target.value })}
          >
            <option value="Pilot Program & Usability Testing">Pilot Program &amp; Usability Testing</option>
            <option value="Data Sharing & Open API Feeds">Data Sharing &amp; Open API Feeds</option>
            <option value="Academic / Research Collaboration">Academic / Research Collaboration</option>
            <option value="Engineering & Open-Source Mentorship">Engineering &amp; Open-Source Mentorship</option>
            <option value="Municipal / District Deployment">Municipal / District Deployment</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-[13px] font-bold text-[#0a0e1a] mb-1.5" htmlFor="message">
          Partnership Proposal Details <span className="text-[#e85d26]">*</span>
        </label>
        <textarea
          id="message"
          className="input textarea text-sm p-3.5 resize-none leading-relaxed"
          placeholder="Tell us about your organization's resources, objectives, and how we could collaborate..."
          rows={4}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          required
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary w-full justify-center font-bold h-12 rounded-2xl shadow-lg shadow-[#e85d26]/20"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Transmitting Proposal...</span>
          </>
        ) : (
          <>
            <span>Send Partnership Proposal</span>
            <Send size={15} />
          </>
        )}
      </button>

      <p className="text-[12px] text-[#94a3b8] text-center">
        🔒 Applications are reviewed directly by initiative leadership.
      </p>
    </form>
  );
}
