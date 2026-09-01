"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  Lock,
  Mail,
  ExternalLink,
  ShieldCheck,
  ShieldX,
  CheckCircle2,
  KeyRound,
  QrCode,
  Download,
  Copy,
  Check,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Key,
} from "lucide-react";
import { signInWithGoogle, signOutAdmin, checkRedirectResult } from "@/lib/firebase/auth";
import { AppIconBadge } from "@/components/brand/Logo";
import { toast } from "sonner";

type LoginStep = "GOOGLE_AUTH" | "2FA_SETUP" | "2FA_VERIFY";

function AdminLoginForm() {
  const [step, setStep] = useState<LoginStep>("GOOGLE_AUTH");
  const [googleLoading, setGoogleLoading] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  // 2FA Setup state
  const [setupLoading, setSetupLoading] = useState(false);
  const [qrCodeSvg, setQrCodeSvg] = useState("");
  const [setupKey, setSetupKey] = useState("");
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [secretEncrypted, setSecretEncrypted] = useState("");
  const [showManualKey, setShowManualKey] = useState(false);
  const [codesCopied, setCodesCopied] = useState(false);

  // 2FA Verification state
  const [totpCode, setTotpCode] = useState("");
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [useRecoveryCode, setUseRecoveryCode] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    checkRedirectResult().catch(() => {});

    const errorParam = searchParams.get("error");
    if (errorParam === "unauthorized") {
      setError("Your Google account is not on the authorized administrators registry. Please sign in with an approved administrator account.");
    } else if (errorParam === "session_expired") {
      setError("Session expired. Please re-authenticate to continue.");
    } else if (errorParam === "2fa_required") {
      setError("Two-factor authentication is mandatory before accessing administrator tools.");
    }
  }, [searchParams]);

  // Handle Step 1 Verification Response
  const handleAuthVerificationSuccess = async (email: string, is2FAEnrolled: boolean, token?: string) => {
    setAdminEmail(email);
    if (token && typeof window !== "undefined") {
      localStorage.setItem("admin_token", token);
    }

    if (is2FAEnrolled) {
      setStep("2FA_VERIFY");
    } else {
      // Trigger 2FA Setup
      await fetch2faSetup(token);
    }
  };

  const fetch2faSetup = async (token?: string) => {
    setSetupLoading(true);
    setError("");
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch("/api/admin/auth/2fa/setup", {
        method: "POST",
        headers,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to initialize 2FA setup");

      setQrCodeSvg(data.qrCodeSvg);
      setSetupKey(data.setupKey);
      setRecoveryCodes(data.recoveryCodes || []);
      if (data.secretEncrypted) setSecretEncrypted(data.secretEncrypted);
      setStep("2FA_SETUP");
    } catch (err: any) {
      setError(err.message || "Failed to initialize 2FA setup");
      toast.error("2FA initialization failed");
    } finally {
      setSetupLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError("");
    try {
      const { user, error: authError } = await signInWithGoogle();
      if (authError) {
        if (authError.code === "auth/popup-closed-by-user" || authError.code === "auth/cancelled-popup-request") {
          setGoogleLoading(false);
          return;
        }
        setError(authError.message || "Google authentication failed. Please try again.");
        toast.error("Google sign in failed");
        setGoogleLoading(false);
        return;
      }

      if (user?.email) {
        const verifyRes = await fetch("/api/admin/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email }),
        });

        const authData = await verifyRes.json();

        if (!verifyRes.ok || !authData.authorized) {
          await signOutAdmin();
          if (typeof window !== "undefined") {
            localStorage.removeItem("admin_email");
            localStorage.removeItem("admin_name");
            localStorage.removeItem("admin_photo");
            localStorage.removeItem("admin_role");
            localStorage.removeItem("admin_token");
          }

          setError("Your account does not have access to the Build Tamil Nadu Admin.");
          toast.error("Access Denied");
          setGoogleLoading(false);
          return;
        }

        if (typeof window !== "undefined") {
          localStorage.setItem("admin_email", user.email);
          localStorage.setItem("admin_name", user.displayName || "Administrator");
          localStorage.setItem("admin_role", authData.role || "ADMIN");
          if (authData.token) localStorage.setItem("admin_token", authData.token);
          if (user.photoURL) localStorage.setItem("admin_photo", user.photoURL);
        }

        await handleAuthVerificationSuccess(user.email, authData.is2FAEnrolled, authData.token);
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred during Google sign in.");
      toast.error("Authentication failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail) return;
    setEmailLoading(true);
    setError("");

    try {
      const verifyRes = await fetch("/api/admin/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: adminEmail }),
      });

      const authData = await verifyRes.json();

      if (!verifyRes.ok || !authData.authorized) {
        setError("Your account does not have access to the Build Tamil Nadu Admin.");
        toast.error("Access Denied");
        setEmailLoading(false);
        return;
      }

      await handleAuthVerificationSuccess(adminEmail, authData.is2FAEnrolled, authData.token);
    } catch {
      setError("Failed to verify administrator email.");
    } finally {
      setEmailLoading(false);
    }
  };

  // Submit 2FA Verification (Setup & Login)
  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!totpCode || totpCode.trim().length < 6) {
      toast.error("Please enter a valid 6-digit code or recovery code.");
      return;
    }

    setVerifyLoading(true);
    setError("");

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch("/api/admin/auth/2fa/verify", {
        method: "POST",
        headers,
        body: JSON.stringify({
          code: totpCode.trim(),
          isRecoveryCode: useRecoveryCode,
          secretEncrypted,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed");

      if (data.token && typeof window !== "undefined") {
        localStorage.setItem("admin_token", data.token);
      }

      toast.success(data.message || "Identity verified successfully!");
      router.push("/admin");
    } catch (err: any) {
      setError(err.message || "Verification code incorrect. Please try again.");
      toast.error("2FA Verification Failed");
    } finally {
      setVerifyLoading(false);
    }
  };

  const copyRecoveryCodes = () => {
    if (recoveryCodes.length === 0) return;
    navigator.clipboard.writeText(recoveryCodes.join("\n"));
    setCodesCopied(true);
    toast.success("Recovery codes copied to clipboard!");
    setTimeout(() => setCodesCopied(false), 3000);
  };

  const downloadRecoveryCodes = () => {
    if (recoveryCodes.length === 0) return;
    const blob = new Blob([
      `BUILD TAMIL NADU ADMIN — ONE-TIME RECOVERY CODES\nAccount: ${adminEmail}\nGenerated: ${new Date().toISOString()}\n\nSAVE THESE CODES IN A SECURE LOCATION. EACH CODE CAN ONLY BE USED ONCE.\n\n${recoveryCodes.join("\n")}`
    ], { type: "text/plain" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `build-tamil-nadu-recovery-codes-${adminEmail.slice(0, 8)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Recovery codes downloaded!");
  };

  return (
    <div className="min-h-screen w-full bg-[#06080f] text-white flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden select-none">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-[#e85d26]/12 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[15%] w-[600px] h-[600px] bg-[#10b981]/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 w-full max-w-6xl mx-auto flex items-center justify-between py-2">
        <Link href="/" className="flex items-center gap-2.5 group">
          <AppIconBadge size={36} />
          <div>
            <span className="font-jakarta font-bold text-sm text-white block leading-none">
              Build Tamil Nadu
            </span>
            <span className="text-[10px] text-white/50 font-mono mt-0.5 block">
              Admin Control Center
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="text-xs font-semibold text-white/60 hover:text-white flex items-center gap-1.5 transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/10"
        >
          <span>View Public Platform</span>
          <ExternalLink size={12} />
        </Link>
      </header>

      {/* Main Authentication Card */}
      <div className="relative z-10 w-full max-w-md mx-auto my-auto py-6">
        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl p-7 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#e85d26] to-transparent opacity-80" />

          {/* ================= STEP Indicator ================= */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${step === "GOOGLE_AUTH" ? "bg-[#e85d26] text-white" : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"}`}>
                {step === "GOOGLE_AUTH" ? "1" : "✓"}
              </span>
              <span className={step === "GOOGLE_AUTH" ? "text-white font-bold" : "text-white/50"}>
                Google Auth
              </span>
            </div>

            <span className="text-white/30">→</span>

            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${step !== "GOOGLE_AUTH" ? "bg-[#e85d26] text-white animate-pulse" : "bg-white/10 text-white/40"}`}>
                2
              </span>
              <span className={step !== "GOOGLE_AUTH" ? "text-white font-bold" : "text-white/40"}>
                2FA Verification
              </span>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-rose-500/15 border border-rose-500/30 rounded-2xl flex items-start gap-3 text-rose-200 text-[13px] leading-relaxed">
              <ShieldX size={18} className="flex-shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* ================= STEP 1: GOOGLE AUTHENTICATION ================= */}
          {step === "GOOGLE_AUTH" && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold font-mono">
                  <Lock size={12} />
                  <span>STEP 1 OF 2 — AUTHENTICATION</span>
                </div>
                <h1 className="font-jakarta font-extrabold text-[24px] sm:text-[28px] text-white">
                  Administrator Login
                </h1>
                <p className="text-white/50 text-[13px] leading-relaxed">
                  Sign in with your authorized administrator Google Account.
                </p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading}
                  className="w-full py-4 px-5 bg-white hover:bg-[#f1f5f9] active:scale-[0.99] text-[#0a0e1a] rounded-2xl font-jakarta font-bold text-[14.5px] flex items-center justify-center gap-3 transition-all duration-200 shadow-xl disabled:opacity-60 cursor-pointer"
                >
                  {googleLoading ? (
                    <Loader2 size={20} className="animate-spin text-[#0a0e1a]" />
                  ) : (
                    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                  )}
                  <span>{googleLoading ? "Verifying Authorization..." : "Continue with Google"}</span>
                </button>

                <div className="relative flex items-center justify-center my-4">
                  <div className="border-t border-white/10 w-full" />
                  <span className="bg-[#0a0f1d] px-3 text-[10.5px] font-bold text-white/40 uppercase tracking-widest absolute">
                    Or Admin Email
                  </span>
                </div>

                <form onSubmit={handleEmailSubmit} className="space-y-3">
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                      type="email"
                      required
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="admin@buildtamilnadu.in"
                      className="input pl-10 w-full h-11 bg-white/5 border-white/15 focus:border-[#e85d26] text-white text-sm rounded-xl"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={emailLoading || !adminEmail}
                    className="btn bg-white/10 hover:bg-white/15 text-white w-full h-10 text-xs font-bold justify-center rounded-xl transition-all disabled:opacity-40"
                  >
                    {emailLoading ? <Loader2 size={15} className="animate-spin" /> : "Verify Admin Email"}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ================= STEP 2A: 2FA SETUP (FIRST TIME) ================= */}
          {step === "2FA_SETUP" && (
            <div className="space-y-5">
              <div className="text-center space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e85d26]/15 border border-[#e85d26]/30 text-[#e85d26] text-xs font-bold font-mono">
                  <QrCode size={13} />
                  <span>STEP 2 OF 2 — MANDATORY 2FA ENROLLMENT</span>
                </div>
                <h2 className="font-jakarta font-extrabold text-[22px] text-white">
                  Secure Your Admin Account
                </h2>
                <p className="text-white/60 text-[12.5px]">
                  Set up two-factor authentication before accessing the admin panel.
                </p>
              </div>

              {setupLoading ? (
                <div className="py-12 text-center space-y-3">
                  <Loader2 size={32} className="animate-spin text-[#e85d26] mx-auto" />
                  <p className="text-xs text-white/50 font-mono">Generating secure 2FA keys...</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* QR Code */}
                  <div className="bg-white p-4 rounded-2xl flex flex-col items-center justify-center space-y-2 border border-white/20 shadow-xl">
                    {qrCodeSvg && (
                      <div
                        className="w-52 h-52 flex items-center justify-center"
                        dangerouslySetInnerHTML={{ __html: qrCodeSvg }}
                      />
                    )}
                    <p className="text-[11px] font-bold text-slate-700 text-center">
                      Scan with Google Authenticator, Authy, or 1Password
                    </p>
                  </div>

                  {/* Manual Key Option */}
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setShowManualKey(!showManualKey)}
                      className="text-xs text-[#e85d26] hover:underline font-semibold"
                    >
                      {showManualKey ? "Hide manual key" : "Can't scan the QR code?"}
                    </button>
                    {showManualKey && (
                      <div className="mt-2 p-3 bg-white/5 border border-white/10 rounded-xl font-mono text-xs text-amber-300 break-all select-all">
                        {setupKey}
                      </div>
                    )}
                  </div>

                  {/* Recovery Codes Download Box */}
                  {recoveryCodes.length > 0 && (
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11.5px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                          <Key size={13} />
                          <span>One-Time Recovery Codes</span>
                        </span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={copyRecoveryCodes}
                            className="text-[11px] font-bold bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded-lg flex items-center gap-1"
                          >
                            {codesCopied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                            <span>{codesCopied ? "Copied" : "Copy"}</span>
                          </button>
                          <button
                            type="button"
                            onClick={downloadRecoveryCodes}
                            className="text-[11px] font-bold bg-amber-500 text-slate-950 px-2 py-1 rounded-lg flex items-center gap-1 hover:bg-amber-400"
                          >
                            <Download size={11} />
                            <span>Save</span>
                          </button>
                        </div>
                      </div>
                      <p className="text-[11.5px] text-amber-200/70 leading-tight">
                        Save these codes in a safe place. Each code can be used once if you lose your authenticator app.
                      </p>
                      <div className="grid grid-cols-2 gap-1.5 font-mono text-[11px] text-amber-300 pt-1">
                        {recoveryCodes.map((c, i) => (
                          <div key={i} className="bg-black/30 px-2 py-1 rounded-md text-center">
                            {c}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* OTP Input Form */}
                  <form onSubmit={handleVerify2FA} className="space-y-3 pt-1">
                    <div>
                      <label htmlFor="2fa-setup-code" className="block text-[11.5px] font-bold text-white/60 uppercase tracking-wider mb-1.5">
                        Enter 6-digit verification code
                      </label>
                      <input
                        id="2fa-setup-code"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={6}
                        autoFocus
                        required
                        value={totpCode}
                        onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
                        placeholder="000 000"
                        className="input w-full h-12 bg-white/5 border-white/20 focus:border-[#e85d26] text-white font-mono font-bold tracking-widest text-center text-xl rounded-xl"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={verifyLoading || totpCode.length < 6}
                      className="btn bg-[#e85d26] hover:bg-[#ff6c37] text-white w-full h-12 text-sm font-bold justify-center rounded-xl shadow-lg shadow-[#e85d26]/30 disabled:opacity-40 cursor-pointer"
                    >
                      {verifyLoading ? <Loader2 size={18} className="animate-spin" /> : "Verify & Enable 2FA"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* ================= STEP 2B: 2FA VERIFICATION (RETURNING ADMIN) ================= */}
          {step === "2FA_VERIFY" && (
            <div className="space-y-5">
              <div className="text-center space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold font-mono">
                  <KeyRound size={13} />
                  <span>STEP 2 OF 2 — VERIFY IDENTITY</span>
                </div>
                <h2 className="font-jakarta font-extrabold text-[22px] text-white">
                  Two-Factor Verification
                </h2>
                <p className="text-white/60 text-[12.5px]">
                  {useRecoveryCode
                    ? "Enter a single-use backup recovery code."
                    : "Enter the 6-digit code from your authenticator app."}
                </p>
              </div>

              <form onSubmit={handleVerify2FA} className="space-y-4 pt-2">
                <div>
                  <label htmlFor="2fa-verify-code" className="block text-[11.5px] font-bold text-white/60 uppercase tracking-wider mb-1.5">
                    {useRecoveryCode ? "8-Character Recovery Code" : "6-Digit Authenticator Code"}
                  </label>
                  <input
                    id="2fa-verify-code"
                    type="text"
                    inputMode={useRecoveryCode ? "text" : "numeric"}
                    autoFocus
                    required
                    maxLength={useRecoveryCode ? 11 : 6}
                    value={totpCode}
                    onChange={(e) =>
                      setTotpCode(
                        useRecoveryCode
                          ? e.target.value.toUpperCase()
                          : e.target.value.replace(/\D/g, "")
                      )
                    }
                    placeholder={useRecoveryCode ? "XXXXX-XXXXX" : "000 000"}
                    className="input w-full h-13 bg-white/5 border-white/20 focus:border-[#e85d26] text-white font-mono font-bold tracking-widest text-center text-xl rounded-xl"
                  />
                </div>

                <button
                  type="submit"
                  disabled={verifyLoading || totpCode.length < 6}
                  className="btn bg-[#e85d26] hover:bg-[#ff6c37] text-white w-full h-12 text-sm font-bold justify-center rounded-xl shadow-lg shadow-[#e85d26]/30 disabled:opacity-40 cursor-pointer"
                >
                  {verifyLoading ? <Loader2 size={18} className="animate-spin" /> : "Verify Identity"}
                </button>
              </form>

              <div className="pt-2 text-center space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setUseRecoveryCode(!useRecoveryCode);
                    setTotpCode("");
                  }}
                  className="text-xs text-[#e85d26] hover:underline font-bold"
                >
                  {useRecoveryCode ? "Use 6-digit Authenticator app code" : "Use a recovery code"}
                </button>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("GOOGLE_AUTH");
                      setTotpCode("");
                      setError("");
                    }}
                    className="text-xs text-white/40 hover:text-white/80"
                  >
                    ← Sign in with a different account
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Security Banner */}
          <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-[11px] text-white/40">
            <div className="flex items-center gap-1.5">
              <Lock size={12} className="text-emerald-400" />
              <span>TLS 1.3 Encrypted</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={12} className="text-[#3b82f6]" />
              <span>RFC 6238 TOTP 2FA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto text-center py-3 text-xs text-white/30 space-y-1">
        <p>© 2026 Build Tamil Nadu • Mandatory Administrator Two-Factor System</p>
      </footer>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-[#06080f] flex items-center justify-center text-white">
          <Loader2 className="w-8 h-8 animate-spin text-[#e85d26]" />
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
