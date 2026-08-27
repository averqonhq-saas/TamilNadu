"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Plus,
  ShieldCheck,
  Mail,
  CheckCircle2,
  Trash2,
  X,
  Lock,
  UserCheck,
  RefreshCw,
  Crown,
  Shield,
  Eye,
  Edit,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

interface AdminUser {
  id: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "REVIEWER" | "EDITOR" | string;
  created_at: string;
  isMaster?: boolean;
}

const ROLE_BADGES: Record<string, { label: string; color: string; bg: string; border: string }> = {
  SUPER_ADMIN: {
    label: "Master Super Admin",
    color: "#e85d26",
    bg: "bg-[#e85d26]/10",
    border: "border-[#e85d26]/30",
  },
  ADMIN: {
    label: "Full Administrator",
    color: "#3b82f6",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  REVIEWER: {
    label: "Ideas Moderator",
    color: "#10b981",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  EDITOR: {
    label: "Content Editor",
    color: "#8b5cf6",
    bg: "bg-purple-50",
    border: "border-purple-200",
  },
};

export default function AdminAdminsPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("ADMIN");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchAdmins = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/admins");
      if (res.ok) {
        const data = await res.json();
        if (data.admins) setAdmins(data.admins);
      }
    } catch (err) {
      console.error("Failed to load admin list:", err);
      toast.error("Failed to load administrators");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newEmail.includes("@")) {
      toast.error("Please provide a valid email address");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail, role: newRole }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add administrator");
      }

      toast.success(`Admin access granted to ${newEmail}!`);
      setNewEmail("");
      setIsModalOpen(false);
      fetchAdmins();
    } catch (err: any) {
      toast.error(err?.message || "Failed to grant admin access");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevokeAdmin = async (admin: AdminUser) => {
    if (admin.isMaster || admin.email === "muneeswaranmd2004@gmail.com") {
      toast.error("Cannot revoke access for the Master Super Administrator");
      return;
    }

    if (!confirm(`Are you sure you want to revoke admin access for ${admin.email}?`)) {
      return;
    }

    setDeletingId(admin.id);
    try {
      const res = await fetch(`/api/admin/admins?id=${admin.id}&email=${encodeURIComponent(admin.email)}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to revoke access");
      }

      toast.success(`Revoked access for ${admin.email}`);
      fetchAdmins();
    } catch (err: any) {
      toast.error(err?.message || "Failed to revoke admin access");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-6xl space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge badge-accent text-xs">Security &amp; Permissions</span>
            <span className="text-xs text-[#64748b]">• Role-Based Access Control</span>
          </div>
          <h1 className="font-jakarta font-extrabold text-[28px] text-[#0a0e1a]">
            Admin Access &amp; Team Management
          </h1>
          <p className="text-[#64748b] text-[15px]">
            Manage authorized Google Accounts permitted to access this mission control center.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAdmins}
            disabled={isLoading}
            className="btn btn-secondary text-xs flex items-center gap-1.5"
          >
            <RefreshCw size={13} className={isLoading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary text-xs flex items-center gap-2 font-bold px-4 py-2.5 shadow-md shadow-[#e85d26]/20"
          >
            <Plus size={15} />
            <span>Grant Admin Access</span>
          </button>
        </div>
      </div>

      {/* Info Warning Card */}
      <div className="bg-[#fffaf7] border border-[#e85d26]/20 rounded-2xl p-5 flex items-start gap-3.5 text-xs text-[#0a0e1a]">
        <Crown size={20} className="text-[#e85d26] flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-[#e85d26] uppercase tracking-wider block">
            Master Administrator Protection Active
          </span>
          <p className="text-[#64748b] leading-relaxed">
            Primary Owner protection is active. Only users explicitly granted access below can log in to this portal with their Google Account.
          </p>
        </div>
      </div>

      {/* Admins Table */}
      <div className="bg-white rounded-3xl border border-[#e2e8f0] shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-[#e2e8f0] flex items-center justify-between">
          <div>
            <h2 className="font-jakarta font-bold text-[17px] text-[#0a0e1a]">
              Authorized Administrators ({admins.length})
            </h2>
            <p className="text-xs text-[#64748b]">
              Live accounts registered in the <code className="text-[#e85d26] bg-[#f8f7f4] px-1.5 py-0.5 rounded">admin_users</code> database
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[13.5px]">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8f7f4] text-xs font-bold text-[#64748b]">
                <th className="text-left px-6 py-4">Administrator</th>
                <th className="text-left px-6 py-4">Access Role</th>
                <th className="text-left px-6 py-4">Security Level</th>
                <th className="text-left px-6 py-4">Added Date</th>
                <th className="text-right px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {admins.map((adm) => {
                const roleConfig = ROLE_BADGES[adm.role] || ROLE_BADGES.ADMIN;
                const isMaster = adm.isMaster || adm.email.toLowerCase() === "muneeswaranmd2004@gmail.com";

                return (
                  <tr key={adm.id || adm.email} className="hover:bg-[#f8f7f4]/70 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                            isMaster
                              ? "bg-[#e85d26] text-white shadow-md shadow-[#e85d26]/30"
                              : "bg-[#f1f5f9] text-[#0a0e1a]"
                          }`}
                        >
                          {isMaster ? <Crown size={15} /> : adm.email[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="font-jakarta font-bold text-[#0a0e1a] flex items-center gap-2">
                            <span>{adm.email}</span>
                            {isMaster && (
                              <span className="px-2 py-0.2 rounded-md bg-[#e85d26]/15 text-[#e85d26] font-mono text-[10px] font-extrabold uppercase">
                                Primary Owner
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-[#94a3b8] font-mono">
                            Google Verified Identity
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border ${roleConfig.bg} ${roleConfig.border}`}
                        style={{ color: roleConfig.color }}
                      >
                        <Shield size={12} />
                        <span>{roleConfig.label}</span>
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                        <CheckCircle2 size={14} />
                        <span>Active &amp; Authorized</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-xs font-mono text-[#64748b]">
                      {new Date(adm.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    <td className="px-6 py-4 text-right">
                      {isMaster ? (
                        <span className="text-xs font-bold text-[#94a3b8] italic">Permanent</span>
                      ) : (
                        <button
                          onClick={() => handleRevokeAdmin(adm)}
                          disabled={deletingId === adm.id}
                          className="btn btn-ghost text-xs font-bold text-rose-500 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-lg inline-flex items-center gap-1 transition-colors"
                          title="Revoke Admin Access"
                        >
                          <Trash2 size={13} />
                          <span>Revoke Access</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grant Admin Access Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#e2e8f0] space-y-6 relative animate-scaleUp">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-[#94a3b8] hover:text-[#0a0e1a] transition-colors p-1"
            >
              <X size={18} />
            </button>

            <div>
              <div className="w-11 h-11 rounded-2xl bg-[#e85d26]/10 flex items-center justify-center text-[#e85d26] mb-3">
                <UserCheck size={22} />
              </div>
              <h2 className="font-jakarta font-extrabold text-[20px] text-[#0a0e1a]">
                Grant Admin Access
              </h2>
              <p className="text-xs text-[#64748b] mt-1">
                Enter the Google Account email of the team member you wish to authorize.
              </p>
            </div>

            <form onSubmit={handleAddAdmin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0a0e1a] uppercase tracking-wider mb-1.5">
                  Google Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="team.member@gmail.com"
                    className="input pl-10 h-11 text-sm bg-[#f8f7f4] w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0a0e1a] uppercase tracking-wider mb-1.5">
                  Permission Role
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="input h-11 text-sm bg-[#f8f7f4] w-full font-medium"
                >
                  <option value="ADMIN">Full Administrator (Moderate, Group &amp; Shortlist)</option>
                  <option value="REVIEWER">Ideas Moderator (Approve / Reject Submissions)</option>
                  <option value="EDITOR">Content Editor (Campaign &amp; Categories)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newEmail}
                  className="btn btn-primary text-xs font-bold px-5"
                >
                  {isSubmitting ? "Granting Access..." : "Grant Access"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
