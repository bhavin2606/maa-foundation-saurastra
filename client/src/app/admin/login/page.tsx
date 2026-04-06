"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Heart, Lock, User, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import { useLoginMutation, useVerifyOtpMutation } from "@/store/api/authApi";
import { setCredentials } from "@/store/slices/authSlice";

export default function LoginPage() {
  const [step, setStep] = useState<"login" | "otp">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();
  const dispatch = useDispatch();

  const [login, { isLoading: isLogginIn }] = useLoginMutation();
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login({ username, password }).unwrap();
      setStep("otp");
    } catch (err: any) {
      setError(err.data?.message || "Invalid credentials");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const result = await verifyOtp({ username, otp }).unwrap();
      dispatch(setCredentials(result));
      router.push("/admin");
    } catch (err: any) {
      setError(err.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white flex items-center justify-center p-6">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-12">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-[28px] bg-secondary text-white shadow-premium mb-6">
            <Heart size={40} fill="currentColor" />
          </div>
          <h1 className="text-4xl font-black text-secondary tracking-tighter leading-tight mb-3">
            Admin <span className="text-primary italic">Portal</span>
          </h1>
          <p className="text-muted font-medium tracking-tight">
            Authentication required for administrative access
          </p>
        </div>

        {/* Login Card */}
        <div className="relative group">
          <div className="absolute -inset-2 bg-gradient-to-r from-primary/10 to-accent/10 rounded-[40px] blur-xl opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="relative glass-morphism p-10 rounded-[36px] border-white/40 shadow-premium">
            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold text-center animate-shake">
                {error}
              </div>
            )}

            {step === "login" ? (
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] px-1">Username</label>
                  <div className="relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-muted" size={18} />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="admin_username"
                      className="w-full rounded-2xl border border-slate-100 bg-surface/50 pl-14 pr-6 py-4 text-secondary outline-none transition-all focus:border-primary focus:bg-white focus:shadow-glow"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] px-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-muted" size={18} />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-2xl border border-slate-100 bg-surface/50 pl-14 pr-6 py-4 text-secondary outline-none transition-all focus:border-primary focus:bg-white focus:shadow-glow"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLogginIn}
                  className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-secondary py-5 text-sm font-black uppercase tracking-[0.2em] text-white shadow-premium transition-all hover:bg-primary hover:-translate-y-0.5 active:scale-95 disabled:opacity-50"
                >
                  {isLogginIn ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      <span>Continue</span>
                      <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="space-y-2 text-center mb-8">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
                    <ShieldCheck size={32} />
                  </div>
                  <p className="text-sm font-bold text-secondary">Verify your identity</p>
                  <p className="text-xs text-muted">We've sent a 6-digit code to your email.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] px-1">Security Code</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="000 000"
                    maxLength={6}
                    className="w-full text-center text-3xl font-black tracking-[0.5em] rounded-2xl border border-slate-100 bg-surface/50 px-6 py-5 text-secondary outline-none transition-all focus:border-primary focus:bg-white focus:shadow-glow"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isVerifying}
                  className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-secondary py-5 text-sm font-black uppercase tracking-[0.2em] text-white shadow-premium transition-all hover:bg-primary hover:-translate-y-0.5 active:scale-95 disabled:opacity-50"
                >
                  {isVerifying ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      <span>Verify & Login</span>
                      <ShieldCheck size={18} />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep("login")}
                  className="w-full text-xs font-bold text-muted hover:text-primary transition-colors mt-4"
                >
                  Back to credentials
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer Link */}
        <div className="mt-12 text-center">
          <button
            onClick={() => router.push("/")}
            className="text-xs font-black text-muted uppercase tracking-[0.2em] hover:text-secondary transition-colors"
          >
            ← Back to Public Site
          </button>
        </div>
      </div>
    </div>
  );
}
