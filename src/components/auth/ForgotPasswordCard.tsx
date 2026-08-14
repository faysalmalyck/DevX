"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle, ShieldAlert } from "lucide-react";

export default function ForgotPasswordCard() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to request password reset link");
      }

      setSuccessMessage(data.message || "A reset link has been dispatched to your email address.");
      setEmail("");
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
          Recover Password
        </h1>
        <p className="mt-3 text-base text-zinc-400">
          Enter your email to receive a secure password recovery token
        </p>
      </div>

      {/* Glassmorphic Container */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-b from-white/10 to-white/[0.02] p-8 shadow-2xl backdrop-blur-xl">
        {successMessage ? (
          <div className="text-center py-6 space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <CheckCircle className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Request Complete
              </h2>
              <p className="text-base text-zinc-400 leading-relaxed">
                {successMessage}
              </p>
            </div>
            <div className="pt-4">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-base font-semibold text-primary hover:text-primary/80 transition"
              >
                <ArrowLeft className="h-4 w-4" />
                Return to Login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Registered Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/20 pl-11 pr-4 py-3.5 text-white placeholder-zinc-600 outline-none transition duration-200 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                />
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-600" />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2.5 rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-base font-semibold text-rose-500">
                <ShieldAlert className="h-5 w-5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary py-3.5 text-lg font-semibold text-white transition-all duration-200 hover:brightness-110 active:scale-[0.99] shadow-lg shadow-primary/20 disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Sending link..." : "Send Recovery Link"}
            </button>

            <div className="text-center pt-2">
              <Link
                href="/login"
                className="mt-12 mb-8 inline-flex items-center gap-2 text-base font-semibold text-slate-700 transition-all duration-300 hover:-translate-x-1 hover:text-brand dark:text-white dark:hover:text-brand"
>
  <ArrowLeft className="h-4 w-4" />
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
