"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  Save,
  Download,
  ShieldCheck,
  Bell,
  Lock,
  Database,
  ExternalLink,
  Loader2,
  RefreshCw,
  Sparkles,
  Mic,
  Mail,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [siteName, setSiteName] = useState("Build Tamil Nadu");
  const [supportEmail, setSupportEmail] = useState("swayam@wedigistudio.com");
  const [enableVoiceInput, setEnableVoiceInput] = useState(true);
  const [requireEmailOtp, setRequireEmailOtp] = useState(false);
  const [rateLimitPerIp, setRateLimitPerIp] = useState(10);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        if (data.siteName) setSiteName(data.siteName);
        if (data.supportEmail) setSupportEmail(data.supportEmail);
        if (data.enableVoiceInput !== undefined) setEnableVoiceInput(data.enableVoiceInput);
        if (data.requireEmailOtp !== undefined) setRequireEmailOtp(data.requireEmailOtp);
        if (data.rateLimitPerIp !== undefined) setRateLimitPerIp(data.rateLimitPerIp);
        if (data.maintenanceMode !== undefined) setMaintenanceMode(data.maintenanceMode);
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteName: siteName.trim(),
          supportEmail: supportEmail.trim(),
          enableVoiceInput,
          requireEmailOtp,
          rateLimitPerIp,
          maintenanceMode,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save settings");

      toast.success("Platform settings saved and synchronized with entire website!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update platform settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleBackupExport = async () => {
    setIsExporting(true);
    try {
      const res = await fetch("/api/admin/settings/backup");
      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `build_tamil_nadu_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Full database snapshot exported to JSON backup!");
    } catch (err) {
      toast.error("Failed to export database snapshot");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-5xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge badge-accent text-xs">System &amp; Security</span>
            <span className="text-xs text-[#64748b]">• Real-time Infrastructure Config</span>
          </div>
          <h1 className="font-jakarta font-extrabold text-[28px] sm:text-[32px] text-[#0a0e1a]">
            Platform Settings &amp; Infrastructure
          </h1>
          <p className="text-[#64748b] text-[15px]">
            Global configuration, security limits, voice toggles, and live database backup utilities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchSettings}
            disabled={isLoading}
            className="btn btn-secondary btn-sm flex items-center gap-2"
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
            <span>Reload</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="btn btn-primary btn-sm flex items-center gap-2 font-bold px-6 h-11 rounded-xl shadow-lg shadow-[#e85d26]/20"
          >
            {isSaving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            <span>{isSaving ? "Saving..." : "Save Settings"}</span>
          </button>
        </div>
      </div>

      {/* General Config */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2e8f0] shadow-xs space-y-6">
        <div>
          <h2 className="font-jakarta font-bold text-[18px] text-[#0a0e1a]">
            1. General Platform Identity
          </h2>
          <p className="text-xs text-[#64748b]">
            Shown in public navigation bars, page footers, and official email notifications.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#0a0e1a] mb-1">
              Platform Name:
            </label>
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="input text-sm h-11 font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0a0e1a] mb-1">
              Public Contact &amp; Support Email:
            </label>
            <input
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              className="input text-sm h-11 font-semibold"
            />
          </div>
        </div>
      </div>

      {/* Security & Feature Toggles */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2e8f0] shadow-xs space-y-6">
        <div>
          <h2 className="font-jakarta font-bold text-[18px] text-[#0a0e1a]">
            2. Security, Voice &amp; Voting Infrastructure Toggles
          </h2>
          <p className="text-xs text-[#64748b]">
            Control citizen intake methods and voting verification safeguards.
          </p>
        </div>

        <div className="space-y-4">
          {/* Voice Input Toggle */}
          <label className="flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-[#f8f7f4] border border-[#e2e8f0] cursor-pointer hover:bg-[#f1f5f9]/80 transition-colors">
            <div className="space-y-0.5 pr-4">
              <div className="flex items-center gap-2">
                <Mic size={16} className="text-[#e85d26]" />
                <span className="font-jakarta font-bold text-sm text-[#0a0e1a]">
                  Enable Tamil Voice / Audio Submissions
                </span>
              </div>
              <p className="text-xs text-[#64748b]">
                Allows citizens to speak their problem aloud in spoken Tamil with browser audio recording on /submit.
              </p>
            </div>
            <input
              type="checkbox"
              checked={enableVoiceInput}
              onChange={(e) => setEnableVoiceInput(e.target.checked)}
              className="w-5 h-5 accent-[#e85d26] rounded cursor-pointer flex-shrink-0"
            />
          </label>

          {/* OTP Verification Toggle */}
          <label className="flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-[#f8f7f4] border border-[#e2e8f0] cursor-pointer hover:bg-[#f1f5f9]/80 transition-colors">
            <div className="space-y-0.5 pr-4">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#16a34a]" />
                <span className="font-jakarta font-bold text-sm text-[#0a0e1a]">
                  Enforce Mandatory 6-Digit Email OTP Verification
                </span>
              </div>
              <p className="text-xs text-[#64748b]">
                When enabled, voters must enter a 6-digit email OTP. When disabled, fast SHA-256 cryptographic token verification is used.
              </p>
            </div>
            <input
              type="checkbox"
              checked={requireEmailOtp}
              onChange={(e) => setRequireEmailOtp(e.target.checked)}
              className="w-5 h-5 accent-[#e85d26] rounded cursor-pointer flex-shrink-0"
            />
          </label>

          {/* Rate Limit per IP */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#f8f7f4] border border-[#e2e8f0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Lock size={16} className="text-[#3b82f6]" />
                <span className="font-jakarta font-bold text-sm text-[#0a0e1a]">
                  Hourly Submission Rate Limit per IP
                </span>
              </div>
              <p className="text-xs text-[#64748b]">
                Prevents denial-of-service and automated bot flooding during open ingestion.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={100}
                value={rateLimitPerIp}
                onChange={(e) => setRateLimitPerIp(parseInt(e.target.value) || 10)}
                className="input w-24 text-center font-mono font-bold h-10"
              />
              <span className="text-xs text-[#64748b] font-medium">req / hr</span>
            </div>
          </div>
        </div>
      </div>

      {/* Data Export & Backup */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2e8f0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-jakarta font-bold text-[18px] text-[#0a0e1a] mb-1 flex items-center gap-2">
            <Database size={17} className="text-[#e85d26]" />
            <span>Live Database Snapshot &amp; Backup</span>
          </h2>
          <p className="text-xs text-[#64748b]">
            Download an instant full snapshot of all registered ideas, manual clusters, voting candidates, and platform logs.
          </p>
        </div>

        <button
          onClick={handleBackupExport}
          disabled={isExporting}
          className="btn btn-secondary btn-sm flex items-center gap-2 font-bold px-5 h-11 rounded-xl shadow-xs"
        >
          {isExporting ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Download size={15} className="text-[#e85d26]" />
          )}
          <span>{isExporting ? "Exporting..." : "Export Full Database JSON"}</span>
        </button>
      </div>
    </div>
  );
}
