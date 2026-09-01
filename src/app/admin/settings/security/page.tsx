"use client";

import { useState, useEffect } from "react";
import {
  ShieldCheck,
  Lock,
  KeyRound,
  RefreshCw,
  Trash2,
  Copy,
  Download,
  Check,
  AlertTriangle,
  Loader2,
  X,
  Key,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminSecuritySettingsPage() {
  const [adminEmail, setAdminEmail] = useState("");
  const [adminRole, setAdminRole] = useState("");
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);
  const [lastVerified, setLastVerified] = useState<string | null>(null);

  // Modal states
  const [isRegeneratingCodes, setIsRegeneratingCodes] = useState(false);
  const [isDisabling2FA, setIsDisabling2FA] = useState(false);
  const [totpConfirmCode, setTotpConfirmCode] = useState("");
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);
  const [newRecoveryCodes, setNewRecoveryCodes] = useState<string[]>([]);
  const [codesCopied, setCodesCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const email = localStorage.getItem("admin_email") || "admin@buildtamilnadu.in";
      const role = localStorage.getItem("admin_role") || "ADMIN";
      setAdminEmail(email);
      setAdminRole(role);
      setLastVerified(new Date().toLocaleString());
    }
  }, []);

  const handleRegenerateCodes = async () => {
    if (!totpConfirmCode || totpConfirmCode.length < 6) {
      toast.error("Please enter your current 6-digit authenticator code.");
      return;
    }

    setIsSubmittingAction(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch("/api/admin/auth/2fa/manage", {
        method: "POST",
        headers,
        body: JSON.stringify({
          action: "REGENERATE_RECOVERY_CODES",
          code: totpConfirmCode.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Regeneration failed");

      setNewRecoveryCodes(data.recoveryCodes || []);
      toast.success("New recovery codes generated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to generate new recovery codes");
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const handleDisable2FA = async () => {
    if (!totpConfirmCode || totpConfirmCode.length < 6) {
      toast.error("Please enter your current 6-digit authenticator code.");
      return;
    }

    setIsSubmittingAction(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch("/api/admin/auth/2fa/manage", {
        method: "POST",
        headers,
        body: JSON.stringify({
          action: "DISABLE_2FA",
          code: totpConfirmCode.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to disable 2FA");

      setIs2FAEnabled(false);
      setIsDisabling2FA(false);
      setTotpConfirmCode("");
      toast.success("Two-factor authentication has been disabled.");
    } catch (err: any) {
      toast.error(err.message || "Failed to disable 2FA");
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const copyCodes = () => {
    if (newRecoveryCodes.length === 0) return;
    navigator.clipboard.writeText(newRecoveryCodes.join("\n"));
    setCodesCopied(true);
    toast.success("Recovery codes copied to clipboard!");
    setTimeout(() => setCodesCopied(false), 3000);
  };

  const downloadCodes = () => {
    if (newRecoveryCodes.length === 0) return;
    const blob = new Blob([
      `BUILD TAMIL NADU ADMIN — RECOVERY CODES\nAccount: ${adminEmail}\nGenerated: ${new Date().toISOString()}\n\n${newRecoveryCodes.join("\n")}`
    ], { type: "text/plain" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `recovery-codes-${adminEmail.slice(0, 8)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Recovery codes downloaded!");
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl space-y-8 select-none">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="badge badge-accent text-xs font-mono">RFC 6238 TOTP</span>
          <span className="text-xs text-[#64748b]">• Administrator Account Protection</span>
        </div>
        <h1 className="font-jakarta font-extrabold text-[28px] sm:text-[32px] text-[#0a0e1a]">
          Account Security &amp; 2FA Settings
        </h1>
        <p className="text-[#64748b] text-[15px]">
          Manage two-factor authentication, generate single-use recovery codes, and review authentication sessions.
        </p>
      </div>

      {/* 2FA Status Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2e8f0] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e2e8f0] pb-6">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${is2FAEnabled ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"}`}>
              <ShieldCheck size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-jakarta font-bold text-[18px] text-[#0a0e1a]">
                  Two-Factor Authentication (2FA)
                </h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold font-mono ${is2FAEnabled ? "bg-emerald-500/15 text-emerald-700 border border-emerald-500/30" : "bg-rose-500/15 text-rose-700 border border-rose-500/30"}`}>
                  {is2FAEnabled ? "● ENABLED" : "○ DISABLED"}
                </span>
              </div>
              <p className="text-xs text-[#64748b] mt-0.5">
                Authenticator app-based TOTP verification (Google Authenticator, Authy, 1Password)
              </p>
            </div>
          </div>
        </div>

        {/* Account Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-[#f8f7f4] p-4 rounded-2xl border border-[#e2e8f0]">
            <span className="text-[#64748b] font-semibold block mb-1">Connected Google Account:</span>
            <span className="font-mono font-bold text-[#0a0e1a] truncate block">{adminEmail}</span>
          </div>

          <div className="bg-[#f8f7f4] p-4 rounded-2xl border border-[#e2e8f0]">
            <span className="text-[#64748b] font-semibold block mb-1">Administrator Role:</span>
            <span className="font-bold text-[#e85d26] uppercase">{adminRole}</span>
          </div>

          <div className="bg-[#f8f7f4] p-4 rounded-2xl border border-[#e2e8f0]">
            <span className="text-[#64748b] font-semibold block mb-1">Last 2FA Verification:</span>
            <span className="font-mono text-[#0a0e1a]">{lastVerified || "Active Session"}</span>
          </div>
        </div>

        {/* Action Controls */}
        {is2FAEnabled && (
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => {
                setTotpConfirmCode("");
                setNewRecoveryCodes([]);
                setIsRegeneratingCodes(true);
              }}
              className="btn btn-secondary btn-sm flex items-center gap-2 font-bold px-4 h-10 rounded-xl"
            >
              <RefreshCw size={14} className="text-[#e85d26]" />
              <span>Generate New Recovery Codes</span>
            </button>

            <button
              onClick={() => {
                setTotpConfirmCode("");
                setIsDisabling2FA(true);
              }}
              className="btn btn-secondary btn-sm text-rose-600 hover:bg-rose-50 border-rose-200 flex items-center gap-2 font-bold px-4 h-10 rounded-xl"
            >
              <Trash2 size={14} />
              <span>Disable 2FA</span>
            </button>
          </div>
        )}
      </div>

      {/* Security Best Practices Card */}
      <div className="bg-[#fffbeb] border border-[#fde68a] rounded-3xl p-6 text-[13.5px] text-[#92400e] space-y-2">
        <div className="flex items-center gap-2 font-bold text-[#b45309]">
          <AlertTriangle size={18} />
          <span>Super Admin Security Policy</span>
        </div>
        <p className="leading-relaxed">
          Mandatory two-factor authentication is enforced across all administrator tiers (`SUPER_ADMIN`, `ADMIN`, `REVIEWER`, `EDITOR`). Super Admin actions (adding/removing admins, role modifications, platform settings changes) require active 2FA verification.
        </p>
      </div>

      {/* ================= REGENERATE RECOVERY CODES MODAL ================= */}
      {isRegeneratingCodes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-[#0a0e1a] shadow-2xl relative space-y-5 border border-[#e2e8f0]">
            <button
              onClick={() => setIsRegeneratingCodes(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#f1f5f9] flex items-center justify-center text-[#64748b]"
            >
              <X size={16} />
            </button>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-[#e85d26] uppercase tracking-wider block">
                Security Confirmation
              </span>
              <h3 className="font-jakarta font-extrabold text-[20px]">
                Regenerate Recovery Codes
              </h3>
              <p className="text-xs text-[#64748b]">
                Enter your current 6-digit authenticator code to generate 8 new single-use recovery codes.
              </p>
            </div>

            {newRecoveryCodes.length > 0 ? (
              <div className="bg-[#f8f7f4] border border-[#e2e8f0] rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0a0e1a]">New Recovery Codes</span>
                  <div className="flex gap-2">
                    <button
                      onClick={copyCodes}
                      className="btn btn-xs btn-secondary flex items-center gap-1"
                    >
                      {codesCopied ? <Check size={11} className="text-emerald-600" /> : <Copy size={11} />}
                      <span>{codesCopied ? "Copied" : "Copy"}</span>
                    </button>
                    <button
                      onClick={downloadCodes}
                      className="btn btn-xs btn-primary flex items-center gap-1"
                    >
                      <Download size={11} />
                      <span>Download</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 font-mono text-xs font-bold text-[#0a0e1a]">
                  {newRecoveryCodes.map((c, i) => (
                    <div key={i} className="bg-white p-2 rounded-lg text-center border border-[#e2e8f0]">
                      {c}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setIsRegeneratingCodes(false)}
                  className="btn btn-primary w-full h-10 text-xs font-bold justify-center rounded-xl"
                >
                  Done &amp; Close
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#0a0e1a] mb-1">
                    Enter 6-digit Authenticator Code:
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    autoFocus
                    value={totpConfirmCode}
                    onChange={(e) => setTotpConfirmCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="000 000"
                    className="input w-full text-center font-mono font-bold tracking-widest text-lg h-12"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setIsRegeneratingCodes(false)}
                    className="btn btn-secondary flex-1 h-11 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRegenerateCodes}
                    disabled={isSubmittingAction || totpConfirmCode.length < 6}
                    className="btn btn-primary flex-1 h-11 text-xs font-bold justify-center shadow-md shadow-[#e85d26]/20 disabled:opacity-40"
                  >
                    {isSubmittingAction ? <Loader2 size={16} className="animate-spin" /> : "Confirm & Regenerate"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= DISABLE 2FA MODAL ================= */}
      {isDisabling2FA && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-[#0a0e1a] shadow-2xl relative space-y-5 border border-[#e2e8f0]">
            <button
              onClick={() => setIsDisabling2FA(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#f1f5f9] flex items-center justify-center text-[#64748b]"
            >
              <X size={16} />
            </button>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider block">
                Warning: Security Action
              </span>
              <h3 className="font-jakarta font-extrabold text-[20px]">
                Disable Two-Factor Authentication
              </h3>
              <p className="text-xs text-[#64748b]">
                Enter your current 6-digit authenticator code to confirm disabling 2FA on your account.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0a0e1a] mb-1">
                  Enter 6-digit Authenticator Code:
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  autoFocus
                  value={totpConfirmCode}
                  onChange={(e) => setTotpConfirmCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="000 000"
                  className="input w-full text-center font-mono font-bold tracking-widest text-lg h-12"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsDisabling2FA(false)}
                  className="btn btn-secondary flex-1 h-11 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDisable2FA}
                  disabled={isSubmittingAction || totpConfirmCode.length < 6}
                  className="btn bg-rose-600 hover:bg-rose-700 text-white flex-1 h-11 text-xs font-bold justify-center disabled:opacity-40"
                >
                  {isSubmittingAction ? <Loader2 size={16} className="animate-spin" /> : "Confirm & Disable 2FA"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
