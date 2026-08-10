"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, ArrowLeft, CheckCircle, ShieldAlert, Eye, EyeOff } from "lucide-react";

export default function ResetPasswordCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Password strength check
  const [strength, setStrength] = useState({ score: 0, text: "Weak", color: "bg-rose-500" });

  useEffect(() => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    let text = "Too Weak";
    let color = "bg-rose-500";

    if (score === 3) {
      text = "Fair";
      color = "bg-amber-500";
    } else if (score === 4) {
      text = "Good";
      color = "bg-brand";
    } else if (score === 5) {
      text = "Strong";
      color = "bg-emerald-500";
    }

    setStrength({ score, text, color });
  }, [password]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Reset token is missing from the URL.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (strength.score < 4) {
      setError("Please choose a stronger password (must contain uppercase, lowercase, numbers, and special characters).");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-lg px-4">
      {/* Header Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          Set New Password
        </h1>
        <p className="mt-3 text-base text-zinc-400">
          Enter your new security credentials below
        </p>
      </div>

      {/* Glassmorphic Container */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-b from-white/10 to-white/[0.02] p-8 shadow-2xl backdrop-blur-xl">
        {!token ? (
          <div className="text-center py-6 space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500">
              <ShieldAlert className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Invalid Reset Attempt
            </h2>
            <p className="text-base text-zinc-400 leading-relaxed max-w-md mx-auto">
              This password reset link is invalid, incomplete, or has expired. Please request a new recovery link.
            </p>
            <div className="pt-4">
              <Link
                href="/forgot-password"
                className="inline-flex items-center gap-2 text-base font-semibold text-primary hover:text-primary/80 transition"
              >
                <ArrowLeft className="h-4 w-4" />
                Request Reset Email
              </Link>
            </div>
          </div>
        ) : success ? (
          <div className="text-center py-6 space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <CheckCircle className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Password Changed!
              </h2>
              <p className="text-base text-zinc-400 leading-relaxed">
                Your credentials have been securely updated. Redirecting to login in a moment...
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 pl-11 pr-11 py-3.5 text-white placeholder-zinc-600 outline-none transition duration-200 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                />
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-600" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {/* Password strength meter */}
              {password && (
                <div className="mt-3 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500">Password Strength:</span>
                    <span className="font-semibold text-zinc-300">{strength.text}</span>
                  </div>
                  <div className="h-1 w-full rounded-full bg-white/5 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${strength.color}`}
                      style={{ width: `${(strength.score / 5) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 pl-11 pr-4 py-3.5 text-white placeholder-zinc-600 outline-none transition duration-200 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                />
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-600" />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-base font-semibold text-rose-500">
                <ShieldAlert className="h-5 w-5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-primary py-3.5 text-lg font-semibold text-white transition-all duration-200 hover:brightness-110 active:scale-[0.99] shadow-lg shadow-primary/20 disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Resetting password..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
