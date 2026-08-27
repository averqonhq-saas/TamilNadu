"use client";

import { useState } from "react";
import {
  ShieldAlert,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  Tag,
  Search,
  Filter,
} from "lucide-react";

interface AuditEntry {
  id: string;
  action: string;
  adminEmail: string;
  details: string;
  ipAddress: string;
  timestamp: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
}

const AUDIT_DATA: AuditEntry[] = [
  {
    id: "log-1",
    action: "PHASE_CHANGE",
    adminEmail: "admin@buildtamilnadu.in",
    details: "Switched active campaign status from 'COLLECTING' to 'VOTING'",
    ipAddress: "103.21.144.12",
    timestamp: "2026-08-24 11:28:45",
    severity: "CRITICAL",
  },
  {
    id: "log-2",
    action: "SHORTLIST_REORDER",
    adminEmail: "tech@buildtamilnadu.in",
    details: "Reordered finalist 01 to 'Smart Bus TN' and saved public ballot",
    ipAddress: "49.207.182.91",
    timestamp: "2026-08-24 10:14:22",
    severity: "INFO",
  },
  {
    id: "log-3",
    action: "IDEA_STATUS_UPDATE",
    adminEmail: "curation@buildtamilnadu.in",
    details: "Approved submission #TN-2026-00482 and made visibility PUBLIC",
    ipAddress: "157.49.210.4",
    timestamp: "2026-08-24 09:40:10",
    severity: "INFO",
  },
  {
    id: "log-4",
    action: "ADMIN_LOGIN",
    adminEmail: "admin@buildtamilnadu.in",
    details: "Google OAuth sign-in successful",
    ipAddress: "103.21.144.12",
    timestamp: "2026-08-24 09:00:01",
    severity: "INFO",
  },
  {
    id: "log-5",
    action: "GROUP_CREATED",
    adminEmail: "curation@buildtamilnadu.in",
    details: "Clustered 842 ideas into 'Real-time Bus Tracking'",
    ipAddress: "157.49.210.4",
    timestamp: "2026-08-23 18:22:15",
    severity: "INFO",
  },
];

export default function AdminAuditLogsPage() {
  const [search, setSearch] = useState("");

  const filtered = AUDIT_DATA.filter(
    (l) =>
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.details.toLowerCase().includes(search.toLowerCase()) ||
      l.adminEmail.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8 max-w-6xl space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="badge badge-accent text-xs">Security &amp; Traceability</span>
          <span className="text-xs text-[#64748b]">• Immutable Audit Trail</span>
        </div>
        <h1 className="font-jakarta font-extrabold text-[28px] text-[#0a0e1a]">
          Operations Audit Logs
        </h1>
        <p className="text-[#64748b] text-[15px]">
          Chronological record of every status transition, phase change, and administrative action.
        </p>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-[#e2e8f0]">
        <input
          type="text"
          placeholder="Search by admin email, action type, or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input h-10 text-sm max-w-md bg-[#f8f7f4]"
        />
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-3xl border border-[#e2e8f0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13.5px]">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8f7f4] text-xs font-bold text-[#64748b]">
                <th className="text-left px-5 py-3.5">Action</th>
                <th className="text-left px-5 py-3.5">Admin Email</th>
                <th className="text-left px-5 py-3.5">Details</th>
                <th className="text-left px-5 py-3.5">IP Address</th>
                <th className="text-right px-5 py-3.5">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-[#f8f7f4]/80 transition-colors">
                  <td className="px-5 py-3.5">
                    <span
                      className={`badge font-mono text-[10.5px] font-bold ${
                        log.severity === "CRITICAL"
                          ? "badge-danger"
                          : log.severity === "WARNING"
                          ? "badge-warning"
                          : "badge-ghost"
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-[#0a0e1a]">
                    {log.adminEmail}
                  </td>
                  <td className="px-5 py-3.5 text-[#334155] max-w-md font-medium">
                    {log.details}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-[#94a3b8]">
                    {log.ipAddress}
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono text-xs text-[#64748b]">
                    {log.timestamp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
