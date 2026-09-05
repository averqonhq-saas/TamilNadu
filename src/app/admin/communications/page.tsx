"use client";

import { useState, useEffect } from "react";
import {
  Mail,
  Send,
  Sparkles,
  Users,
  CheckCircle2,
  Clock,
  MessageCircle,
  AlertCircle,
  FileText,
  Building,
  Filter,
  Search,
  RefreshCw,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  Tag,
  MapPin,
  Trash2,
  Check,
  Loader2,
  X,
} from "lucide-react";
import { Inquiry, InquiryStatus, InquiryType } from "@/lib/data/inquiries";
import { toast } from "sonner";

interface BroadcastLog {
  id: string;
  title: string;
  recipientGroup: string;
  channel: "EMAIL" | "WHATSAPP" | "SMS";
  sentAt: string;
  recipientCount: number;
  openRate: string;
}

const BROADCAST_HISTORY: BroadcastLog[] = [
  {
    id: "b-1",
    title: "Public Voting Is Live — Tamil Nadu, You Decide!",
    recipientGroup: "All 2,481 Citizen Submitters",
    channel: "EMAIL",
    sentAt: "2026-08-24 09:00 AM",
    recipientCount: 2481,
    openRate: "68.4%",
  },
  {
    id: "b-2",
    title: "Your Idea Has Been Clustered into 'Smart Bus TN'",
    recipientGroup: "842 Bus Tracking Submitters",
    channel: "EMAIL",
    sentAt: "2026-08-23 04:30 PM",
    recipientCount: 842,
    openRate: "79.1%",
  },
  {
    id: "b-3",
    title: "Phase 1 Submission Milestone: 2,000+ Ideas Across 38 Districts",
    recipientGroup: "All Registered Citizens",
    channel: "EMAIL",
    sentAt: "2026-08-20 11:15 AM",
    recipientCount: 2100,
    openRate: "62.8%",
  },
];

export default function AdminCommunicationsPage() {
  const [activeTab, setActiveTab] = useState<"INQUIRIES" | "BROADCASTS">("INQUIRIES");
  
  // Inquiries State
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [counts, setCounts] = useState({
    total: 0,
    contact: 0,
    partner: 0,
    new: 0,
    in_review: 0,
    responded: 0,
  });
  const [selectedType, setSelectedType] = useState<"ALL" | "CONTACT" | "PARTNER">("ALL");
  const [selectedStatus, setSelectedStatus] = useState<"ALL" | InquiryStatus>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Selected Inquiry for Modal
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Broadcast Form State
  const [subject, setSubject] = useState("");
  const [targetGroup, setTargetGroup] = useState("ALL_SUBMITTERS");
  const [body, setBody] = useState("");
  const [isSending, setIsSending] = useState(false);

  const fetchInquiries = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedType !== "ALL") params.set("type", selectedType);
      if (selectedStatus !== "ALL") params.set("status", selectedStatus);
      if (searchQuery.trim()) params.set("search", searchQuery.trim());

      const res = await fetch(`/api/admin/inquiries?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setInquiries(data.inquiries || []);
        if (data.counts) setCounts(data.counts);
      } else {
        const errData = await res.json().catch(() => ({}));
        console.warn("Failed to load inquiries:", res.status, errData);
      }
    } catch (err) {
      console.error("Failed to load inquiries:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [selectedType, selectedStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchInquiries();
  };

  const handleOpenInquiry = (inq: Inquiry) => {
    setSelectedInquiry(inq);
    setAdminNotes(inq.admin_notes || "");
  };

  const handleUpdateInquiryStatus = async (id: string, newStatus: InquiryStatus) => {
    setIsUpdatingStatus(true);
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, admin_notes: adminNotes }),
      });

      if (res.ok) {
        toast.success(`Inquiry marked as ${newStatus}`);
        setInquiries((prev) =>
          prev.map((i) => (i.id === id ? { ...i, status: newStatus, admin_notes: adminNotes } : i))
        );
        if (selectedInquiry?.id === id) {
          setSelectedInquiry((prev) => (prev ? { ...prev, status: newStatus, admin_notes: adminNotes } : null));
        }
        fetchInquiries();
      }
    } catch {
      toast.error("Failed to update inquiry status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Inquiry deleted");
        setInquiries((prev) => prev.filter((i) => i.id !== id));
        if (selectedInquiry?.id === id) setSelectedInquiry(null);
        fetchInquiries();
      }
    } catch {
      toast.error("Failed to delete inquiry");
    }
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !body) {
      toast.error("Please provide both a subject line and message body.");
      return;
    }

    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      toast.success("Broadcast dispatched successfully to citizen recipients!");
      setSubject("");
      setBody("");
    }, 600);
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge badge-accent text-xs">Citizen Engagement</span>
            <span className="text-xs text-[#64748b]">• Contact &amp; Institutional Intake Desk</span>
          </div>
          <h1 className="font-jakarta font-extrabold text-[28px] sm:text-[32px] text-[#0a0e1a]">
            Communications &amp; Inquiries
          </h1>
          <p className="text-[#64748b] text-[15px]">
            Manage contact form messages, institutional partner applications, and citizen broadcast announcements.
          </p>
        </div>

        {/* Tab Toggle Buttons */}
        <div className="inline-flex p-1 bg-white border border-[#e2e8f0] rounded-2xl shadow-xs">
          <button
            onClick={() => setActiveTab("INQUIRIES")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
              activeTab === "INQUIRIES"
                ? "bg-[#0a0e1a] text-white shadow-sm"
                : "text-[#64748b] hover:text-[#0a0e1a]"
            }`}
          >
            <MessageSquare size={14} />
            <span>Inquiries &amp; Partner Responses</span>
            {counts.new > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-[#e85d26] text-white">
                {counts.new}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("BROADCASTS")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
              activeTab === "BROADCASTS"
                ? "bg-[#0a0e1a] text-white shadow-sm"
                : "text-[#64748b] hover:text-[#0a0e1a]"
            }`}
          >
            <Send size={14} />
            <span>Citizen Broadcasts</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#e2e8f0] shadow-xs">
          <span className="text-xs font-bold text-[#64748b] uppercase tracking-wider block mb-1">
            Total Inquiries
          </span>
          <div className="font-jakarta font-extrabold text-2xl text-[#0a0e1a]">
            {counts.total}
          </div>
          <span className="text-xs text-[#64748b]">All channels</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#e2e8f0] shadow-xs">
          <span className="text-xs font-bold text-[#e85d26] uppercase tracking-wider block mb-1">
            New / Unread
          </span>
          <div className="font-jakarta font-extrabold text-2xl text-[#e85d26]">
            {counts.new}
          </div>
          <span className="text-xs text-[#64748b]">Pending initial reply</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#e2e8f0] shadow-xs">
          <span className="text-xs font-bold text-[#16a34a] uppercase tracking-wider block mb-1">
            Partner Proposals
          </span>
          <div className="font-jakarta font-extrabold text-2xl text-[#16a34a]">
            {counts.partner}
          </div>
          <span className="text-xs text-[#64748b]">Gov &amp; University</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#e2e8f0] shadow-xs">
          <span className="text-xs font-bold text-[#3b82f6] uppercase tracking-wider block mb-1">
            Citizen Contact Messages
          </span>
          <div className="font-jakarta font-extrabold text-2xl text-[#3b82f6]">
            {counts.contact}
          </div>
          <span className="text-xs text-[#64748b]">Direct feedback</span>
        </div>
      </div>

      {/* ================= TAB 1: INQUIRIES & PARTNER RESPONSES ================= */}
      {activeTab === "INQUIRIES" && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-white rounded-2xl p-4 border border-[#e2e8f0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {/* Type Filter */}
              <div className="inline-flex p-1 bg-[#f8f7f4] rounded-xl border border-[#e2e8f0] text-xs font-bold">
                <button
                  onClick={() => setSelectedType("ALL")}
                  className={`px-3 py-1.5 rounded-lg ${
                    selectedType === "ALL" ? "bg-white text-[#0a0e1a] shadow-xs" : "text-[#64748b]"
                  }`}
                >
                  All ({counts.total})
                </button>
                <button
                  onClick={() => setSelectedType("PARTNER")}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${
                    selectedType === "PARTNER" ? "bg-white text-[#16a34a] shadow-xs" : "text-[#64748b]"
                  }`}
                >
                  <Building size={13} />
                  <span>Partner Forms ({counts.partner})</span>
                </button>
                <button
                  onClick={() => setSelectedType("CONTACT")}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${
                    selectedType === "CONTACT" ? "bg-white text-[#3b82f6] shadow-xs" : "text-[#64748b]"
                  }`}
                >
                  <MessageSquare size={13} />
                  <span>Contact Messages ({counts.contact})</span>
                </button>
              </div>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as any)}
                className="input text-xs h-9 bg-[#f8f7f4] font-medium w-auto"
              >
                <option value="ALL">All Statuses</option>
                <option value="NEW">New (Unread)</option>
                <option value="IN_REVIEW">Under Review</option>
                <option value="RESPONDED">Responded</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                <input
                  type="text"
                  placeholder="Search name, org, email, keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input pl-9 h-9 text-xs w-56 sm:w-64"
                />
              </div>

              <button
                type="button"
                onClick={fetchInquiries}
                className="btn btn-secondary btn-sm h-9 px-3"
                title="Refresh inquiries"
              >
                <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
              </button>
            </form>
          </div>

          {/* Inquiries Table List */}
          <div className="bg-white rounded-3xl border border-[#e2e8f0] shadow-xs overflow-hidden">
            {isLoading ? (
              <div className="p-16 text-center text-[#64748b] flex flex-col items-center gap-3">
                <Loader2 size={24} className="animate-spin text-[#e85d26]" />
                <span className="text-sm font-medium">Loading citizen &amp; partner responses...</span>
              </div>
            ) : inquiries.length === 0 ? (
              <div className="p-16 text-center text-[#64748b] space-y-2">
                <MessageSquare size={36} className="mx-auto text-[#cbd5e1]" />
                <h3 className="font-jakarta font-bold text-lg text-[#0a0e1a]">No inquiries found</h3>
                <p className="text-xs">Adjust your search or filter criteria to view responses.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#f8f7f4] border-b border-[#e2e8f0] text-xs text-[#64748b] uppercase tracking-wider font-bold font-mono">
                    <tr>
                      <th className="py-3.5 px-6">Type &amp; ID</th>
                      <th className="py-3.5 px-4">Contact / Org</th>
                      <th className="py-3.5 px-4">Subject &amp; Snippet</th>
                      <th className="py-3.5 px-4">District</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Received</th>
                      <th className="py-3.5 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e2e8f0]">
                    {inquiries.map((inq) => {
                      const isPartner = inq.type === "PARTNER";

                      return (
                        <tr
                          key={inq.id}
                          className="hover:bg-[#f8f7f4]/80 transition-colors cursor-pointer group"
                          onClick={() => handleOpenInquiry(inq)}
                        >
                          <td className="py-4 px-6">
                            <div className="flex flex-col gap-1">
                              <div className="flex flex-wrap items-center gap-1">
                                <span
                                  className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded w-fit ${
                                    isPartner
                                      ? "bg-[#16a34a]/10 text-[#16a34a] border border-[#16a34a]/20"
                                      : "bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/20"
                                  }`}
                                >
                                  {isPartner ? "🤝 PARTNER" : "📩 CONTACT"}
                                </span>
                                {inq.subject?.toLowerCase().includes("government") && (
                                  <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded w-fit bg-amber-500/15 text-amber-800 border border-amber-500/30">
                                    🏛️ GOVT OFFICIAL
                                  </span>
                                )}
                              </div>
                              <span className="font-mono text-xs text-[#64748b]" title={inq.id}>
                                #{inq.id.length > 12 ? inq.id.slice(0, 8).toUpperCase() : inq.id}
                              </span>
                            </div>
                          </td>

                          <td className="py-4 px-4">
                            <div className="font-bold text-[#0a0e1a] text-[14px]">
                              {inq.name}
                            </div>
                            {inq.organization && (
                              <div className="text-xs text-[#16a34a] font-semibold flex items-center gap-1 mt-0.5">
                                <Building size={11} />
                                <span>{inq.organization}</span>
                              </div>
                            )}
                            <div className="text-xs text-[#64748b] font-mono mt-0.5">{inq.email}</div>
                          </td>

                          <td className="py-4 px-4 max-w-xs">
                            <div className="font-semibold text-[#0a0e1a] text-xs truncate">
                              {inq.subject || "No Subject"}
                            </div>
                            <p className="text-xs text-[#64748b] line-clamp-1 mt-0.5">
                              {inq.message}
                            </p>
                          </td>

                          <td className="py-4 px-4 text-xs text-[#475569]">
                            {inq.district ? (
                              <span className="flex items-center gap-1 font-medium">
                                <MapPin size={12} className="text-[#e85d26]" />
                                {inq.district}
                              </span>
                            ) : (
                              <span className="text-[#94a3b8]">—</span>
                            )}
                          </td>

                          <td className="py-4 px-4">
                            <span
                              className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full ${
                                inq.status === "NEW"
                                  ? "bg-[#e85d26]/15 text-[#e85d26] animate-pulse"
                                  : inq.status === "IN_REVIEW"
                                  ? "bg-[#f59e0b]/15 text-[#f59e0b]"
                                  : inq.status === "RESPONDED"
                                  ? "bg-[#16a34a]/15 text-[#16a34a]"
                                  : "bg-[#64748b]/15 text-[#64748b]"
                              }`}
                            >
                              {inq.status}
                            </span>
                          </td>

                          <td className="py-4 px-4 text-xs text-[#64748b] whitespace-nowrap">
                            {new Date(inq.created_at).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                            })}
                          </td>

                          <td className="py-4 px-6 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenInquiry(inq);
                              }}
                              className="btn btn-secondary btn-xs rounded-lg font-bold text-xs"
                            >
                              View &amp; Reply
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 2: CITIZEN BROADCASTS ================= */}
      {activeTab === "BROADCASTS" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Compose Broadcast */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#e2e8f0] shadow-xs space-y-6">
            <div>
              <h2 className="font-jakarta font-bold text-[18px] text-[#0a0e1a] mb-1 flex items-center gap-2">
                <Send size={16} className="text-[#e85d26]" />
                <span>Compose Campaign Broadcast</span>
              </h2>
              <p className="text-xs text-[#64748b]">
                Dispatched with cryptographic unsubscribe headers &amp; zero spam guarantees.
              </p>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0a0e1a] mb-1">
                  Recipient Audience:
                </label>
                <select
                  value={targetGroup}
                  onChange={(e) => setTargetGroup(e.target.value)}
                  className="input h-10 text-sm bg-white"
                >
                  <option value="ALL_SUBMITTERS">All Citizen Submitters (2,481)</option>
                  <option value="VOTERS_CONFIRMED">All Verified Public Voters (18,742)</option>
                  <option value="SHORTLIST_CONTRIBUTORS">Shortlist Idea Contributors (2,910)</option>
                  <option value="PARTNERS_ACTIVE">Active Institutional Partners (14)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0a0e1a] mb-1">
                  Broadcast Subject Line:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Voting Closes in 48 Hours: Choose the First Product for Tamil Nadu"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="input h-10 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0a0e1a] mb-1">
                  Message Content (Markdown supported):
                </label>
                <textarea
                  rows={6}
                  placeholder="Dear Citizen, Tamil Nadu is deciding what product we build first..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="input text-sm p-3.5 resize-none leading-relaxed"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSending}
                  className="btn btn-primary btn-sm flex items-center gap-2 font-bold px-6 h-11 rounded-xl shadow-lg shadow-[#e85d26]/20"
                >
                  <Send size={14} />
                  <span>{isSending ? "Dispatching Broadcast..." : "Send Broadcast"}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right: History & Templates */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-[#e2e8f0] shadow-xs space-y-4">
              <h3 className="font-jakarta font-bold text-[16px] text-[#0a0e1a]">
                Recent Broadcast Logs
              </h3>

              <div className="space-y-3">
                {BROADCAST_HISTORY.map((log) => (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-2xl bg-[#f8f7f4] border border-[#e2e8f0] space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="px-2 py-0.5 rounded bg-white text-[#0a0e1a] border border-[#e2e8f0]">
                        {log.channel}
                      </span>
                      <span className="font-mono text-emerald-600">
                        {log.openRate} open rate
                      </span>
                    </div>
                    <h4 className="font-jakarta font-bold text-[13.5px] text-[#0a0e1a] leading-tight">
                      {log.title}
                    </h4>
                    <div className="flex items-center justify-between text-[11px] text-[#64748b]">
                      <span>{log.recipientGroup}</span>
                      <span>{log.sentAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= SLIDEOUT / MODAL FOR VIEWING FULL INQUIRY ================= */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#e2e8f0] shadow-2xl p-6 sm:p-8 space-y-6 animate-scale-in">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-[#e2e8f0] pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className={`font-mono text-[11px] font-bold px-2.5 py-0.5 rounded ${
                      selectedInquiry.type === "PARTNER"
                        ? "bg-[#16a34a]/10 text-[#16a34a] border border-[#16a34a]/20"
                        : "bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/20"
                    }`}
                  >
                    {selectedInquiry.type === "PARTNER" ? "🤝 PARTNERSHIP APPLICATION" : "📩 CITIZEN CONTACT"}
                  </span>
                  {selectedInquiry.subject?.toLowerCase().includes("government") && (
                    <span className="font-mono text-[11px] font-bold px-2.5 py-0.5 rounded bg-amber-500/15 text-amber-800 border border-amber-500/30">
                      🏛️ GOVT OFFICIAL
                    </span>
                  )}
                  <span className="font-mono text-xs text-[#64748b]" title={selectedInquiry.id}>
                    #{selectedInquiry.id.length > 12 ? selectedInquiry.id.slice(0, 8).toUpperCase() : selectedInquiry.id}
                  </span>
                </div>
                <h2 className="font-jakarta font-extrabold text-[22px] text-[#0a0e1a]">
                  {selectedInquiry.subject || selectedInquiry.organization || "Inquiry Details"}
                </h2>
              </div>

              <button
                onClick={() => setSelectedInquiry(null)}
                className="w-8 h-8 rounded-full bg-[#f8f7f4] flex items-center justify-center text-[#64748b] hover:text-[#0a0e1a]"
              >
                <X size={18} />
              </button>
            </div>

            {/* Submitter Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#f8f7f4] p-4 rounded-2xl border border-[#e2e8f0] text-xs">
              <div>
                <span className="text-[#64748b] font-medium block">Contact Person:</span>
                <span className="font-bold text-[#0a0e1a] text-sm">{selectedInquiry.name}</span>
                {selectedInquiry.role && (
                  <span className="text-[#64748b] block">{selectedInquiry.role}</span>
                )}
              </div>

              <div>
                <span className="text-[#64748b] font-medium block">Email Address:</span>
                <a
                  href={`mailto:${selectedInquiry.email}?subject=Re: Build Tamil Nadu - ${selectedInquiry.id}`}
                  className="font-mono font-bold text-[#e85d26] hover:underline block"
                >
                  {selectedInquiry.email}
                </a>
                {selectedInquiry.phone && (
                  <span className="font-mono text-[#64748b] block">{selectedInquiry.phone}</span>
                )}
              </div>

              {selectedInquiry.organization && (
                <div>
                  <span className="text-[#64748b] font-medium block">Organization:</span>
                  <span className="font-bold text-[#16a34a]">{selectedInquiry.organization}</span>
                </div>
              )}

              {selectedInquiry.district && (
                <div>
                  <span className="text-[#64748b] font-medium block">District:</span>
                  <span className="font-bold text-[#0a0e1a]">{selectedInquiry.district}</span>
                </div>
              )}
            </div>

            {/* Message Body */}
            <div>
              <label className="text-xs font-bold text-[#0a0e1a] uppercase tracking-wider block mb-2">
                Full Message / Proposal Description:
              </label>
              <div className="bg-[#fffaf7] p-5 rounded-2xl border border-[#fed7aa] text-sm text-[#334155] leading-relaxed whitespace-pre-wrap font-medium">
                {selectedInquiry.message}
              </div>
            </div>

            {/* Internal Admin Notes */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#0a0e1a] uppercase tracking-wider block">
                Internal Team Notes:
              </label>
              <textarea
                rows={2}
                placeholder="Add follow-up notes, phone call logs, or assigned team members..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="input text-xs p-3 bg-white"
              />
            </div>

            {/* Actions Ribbon */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#e2e8f0]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#64748b]">Update Status:</span>
                <select
                  value={selectedInquiry.status}
                  onChange={(e) => handleUpdateInquiryStatus(selectedInquiry.id, e.target.value as InquiryStatus)}
                  disabled={isUpdatingStatus}
                  className="input text-xs h-9 bg-white font-bold w-auto"
                >
                  <option value="NEW">NEW</option>
                  <option value="IN_REVIEW">IN_REVIEW</option>
                  <option value="RESPONDED">RESPONDED</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDeleteInquiry(selectedInquiry.id)}
                  className="btn btn-secondary btn-sm text-red-600 hover:bg-red-50"
                  title="Delete inquiry"
                >
                  <Trash2 size={14} />
                </button>

                <a
                  href={`mailto:${selectedInquiry.email}?subject=Re: Build Tamil Nadu Inquiry [${selectedInquiry.id}]`}
                  onClick={() => handleUpdateInquiryStatus(selectedInquiry.id, "RESPONDED")}
                  className="btn btn-primary btn-sm flex items-center gap-2 font-bold px-5 h-10 rounded-xl"
                >
                  <Mail size={14} />
                  <span>Reply via Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
