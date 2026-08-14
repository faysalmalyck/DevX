"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, ShieldAlert, ArrowLeft } from "lucide-react";

export default function AdminRegisterCard() {
  const router = useRouter();
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          username,
          email,
          password,
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      router.push("/login");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-lg px-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          Register Operator
        </h1>
        <p className="mt-3 text-base text-zinc-400">
          Create a new administrative terminal account
        </p>
      </div>

      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-b from-white/10 to-white/[0.02] p-8 shadow-2xl backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                First Name
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3.5 text-white placeholder-zinc-600 outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Last Name
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3.5 text-white placeholder-zinc-600 outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/20 pl-11 pr-4 py-3.5 text-white placeholder-zinc-600 outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              />
              <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-600" />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/20 pl-11 pr-4 py-3.5 text-white placeholder-zinc-600 outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              />
              <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-600" />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/20 pl-11 pr-4 py-3.5 text-white placeholder-zinc-600 outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              />
              <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-600" />
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
            className="w-full rounded-lg bg-primary py-3.5 text-lg font-semibold text-white transition-all duration-200 hover:brightness-110 active:scale-[0.99] shadow-lg shadow-primary/20 mt-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Registering..." : "Create Admin Account"}
          </button>
          
          <div className="text-center pt-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-base font-semibold text-zinc-400 hover:text-white transition"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
