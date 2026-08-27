"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  KeyRound,
  Mail,
  ExternalLink,
  ShieldAlert,
  ShieldX,
} from "lucide-react";
import { signInWithGoogle, subscribeToAdminAuth, signOutAdmin, checkRedirectResult } from "@/lib/firebase/auth";
import { AppIconBadge } from "@/components/brand/Logo";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const [googleLoading, setGoogleLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Check if returning from redirect sign-in
    checkRedirectResult().catch(() => {});

    // If already authenticated and verified in session
    const unsubscribe = subscribeToAdminAuth(async (user) => {
      if (user?.email) {
        try {
          const verifyRes = await fetch("/api/admin/auth/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: user.email }),
          });

          if (verifyRes.ok) {
            const authData = await verifyRes.json();
            if (authData.authorized) {
              localStorage.setItem("admin_email", user.email);
              localStorage.setItem("admin_name", user.displayName || "Administrator");
              localStorage.setItem("admin_role", authData.role || "ADMIN");
              if (user.photoURL) localStorage.setItem("admin_photo", user.photoURL);
              router.push("/admin");
            }
          }
        } catch {
          // Stay on login if verification fails
        }
      }
    });

    return () => unsubscribe();
  }, [router]);

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
        // Strict Authorization Check: Verify if email is registered as an admin
        const verifyRes = await fetch("/api/admin/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email }),
        });

        const authData = await verifyRes.json();

        if (!verifyRes.ok || !authData.authorized) {
          // Unauthorized email: Force Firebase sign out and show access denied
          await signOutAdmin();
          localStorage.removeItem("admin_email");
          localStorage.removeItem("admin_name");
          localStorage.removeItem("admin_photo");

          const denMsg = `Access Denied: Your account (${user.email}) is not registered as an authorized administrator. Please log in with an authorized administrator account or request access from the team.`;
          setError(denMsg);
          toast.error("Unauthorized Administrator Account");
          setGoogleLoading(false);
          return;
        }

        toast.success(`Welcome back, ${user.displayName || user.email}!`);
        localStorage.setItem("admin_email", user.email);
        localStorage.setItem("admin_name", user.displayName || "Administrator");
        localStorage.setItem("admin_role", authData.role || "ADMIN");
        if (user.photoURL) localStorage.setItem("admin_photo", user.photoURL);
        router.push("/admin");
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
    if (!email) return;
    setEmailLoading(true);
    setError("");

    try {
      const verifyRes = await fetch("/api/admin/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const authData = await verifyRes.json();

      if (!verifyRes.ok || !authData.authorized) {
        setError(`Access Denied: ${email} is not registered as an authorized administrator.`);
        toast.error("Unauthorized email address");
        setEmailLoading(false);
        return;
      }

      setSent(true);
      toast.success("Security login link dispatched!");
    } catch {
      setError("Failed to verify administrator email.");
    } finally {
      setEmailLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#06080f] text-white flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden select-none">
      {/* Ambient background glows */}
      <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-[#e85d26]/12 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[15%] w-[600px] h-[600px] bg-[#10b981]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-[40%] right-[30%] w-[400px] h-[400px] bg-[#3b82f6]/8 rounded-full blur-[130px] pointer-events-none" />

      {/* Top Bar */}
      <header className="relative z-10 w-full max-w-6xl mx-auto flex items-center justify-between py-2">
        <Link href="/" className="flex items-center gap-2.5 group">
          <AppIconBadge size={36} />
          <div>
            <span className="font-jakarta font-bold text-sm text-white block leading-none">
              Build Tamil Nadu
            </span>
            <span className="text-[10px] text-white/50 font-mono mt-0.5 block">
              Mission Control
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
      <div className="relative z-10 w-full max-w-md mx-auto my-auto py-8">
        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl p-7 sm:p-9 shadow-2xl space-y-6 relative overflow-hidden">
          {/* Subtle glowing top border */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#e85d26] to-transparent opacity-80" />

          {/* Header Title */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold font-mono">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>RESTRICTED ACCESS PORTAL</span>
            </div>

            <h1 className="font-jakarta font-extrabold text-[26px] sm:text-[30px] tracking-tight text-white">
              Administrator Login
            </h1>
            <p className="text-white/50 text-[13.5px] leading-relaxed">
              Authenticate via your authorized administrator Google Account to access mission control.
            </p>
          </div>

          {error && (
            <div className="p-4 bg-rose-500/15 border border-rose-500/30 rounded-2xl flex items-start gap-3 text-rose-200 text-[13px] animate-fadeIn leading-relaxed">
              <ShieldX size={18} className="flex-shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Primary Action: Google Sign In */}
          <div className="space-y-4 pt-1">
            <button
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full py-4 px-5 bg-white hover:bg-[#f1f5f9] active:scale-[0.99] text-[#0a0e1a] rounded-2xl font-jakarta font-bold text-[14.5px] flex items-center justify-center gap-3 transition-all duration-200 shadow-xl shadow-black/40 hover:shadow-white/10 disabled:opacity-60 cursor-pointer group"
            >
              {googleLoading ? (
                <Loader2 size={20} className="animate-spin text-[#0a0e1a]" />
              ) : (
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>{googleLoading ? "Verifying Authorization..." : "Sign in with Google Account"}</span>
            </button>

            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-white/10 w-full" />
              <span className="bg-[#0a0f1d] px-3.5 text-[11px] font-bold text-white/40 uppercase tracking-widest absolute">
                Or Admin Email
              </span>
            </div>

            {/* Email Alternative Form */}
            {sent ? (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 text-center space-y-2">
                <CheckCircle2 size={32} className="mx-auto text-emerald-400" />
                <h3 className="font-jakarta font-bold text-white text-[15px]">Authorized Login Link Sent</h3>
                <p className="text-white/60 text-[13px]">
                  A one-time sign in link was dispatched to <strong className="text-white font-mono">{email}</strong>.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="text-xs text-[#e85d26] hover:underline font-bold pt-1 block mx-auto"
                >
                  Use a different email
                </button>
              </div>
            ) : (
              <form onSubmit={handleEmailSubmit} className="space-y-3">
                <div>
                  <label htmlFor="admin-email" className="block text-[11.5px] font-bold text-white/50 uppercase tracking-wider mb-1.5">
                    Authorized Administrator Email
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                      id="admin-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@buildtamilnadu.in"
                      className="input pl-10 w-full h-11 bg-white/5 border-white/15 focus:border-[#e85d26] text-white text-sm rounded-xl placeholder:text-white/20 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={emailLoading || !email}
                  className="btn bg-white/10 hover:bg-white/15 border-white/15 text-white w-full h-10 text-xs font-bold justify-center rounded-xl transition-all disabled:opacity-40"
                >
                  {emailLoading ? <Loader2 size={15} className="animate-spin" /> : "Verify & Send Login Link"}
                </button>
              </form>
            )}
          </div>

          {/* Security Features Info Box */}
          <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-3 text-[11px] text-white/40">
            <div className="flex items-center gap-1.5">
              <Lock size={12} className="text-emerald-400" />
              <span>TLS 1.3 256-bit Encrypted</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={12} className="text-[#3b82f6]" />
              <span>Strict Role Guard</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto text-center py-3 text-xs text-white/30 space-y-1">
        <p>© 2026 Build Tamil Nadu • State Innovation Initiative • All unauthorized login attempts are logged and blocked.</p>
      </footer>
    </div>
  );
}
