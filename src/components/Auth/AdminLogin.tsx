"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { LockKeyhole } from "lucide-react";
import { ADMIN_SESSION_KEY } from "@/lib/permissions/rbac";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const expectedUsername = process.env.NEXT_PUBLIC_ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_USERNAME || "ceo@DevX.com";
    const expectedPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";

    if (username !== expectedUsername || password !== expectedPassword) {
      setError("Incorrect admin email or password.");
      return;
    }

    window.sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
    window.dispatchEvent(new Event("DevX-auth-change"));
    toast.success("Welcome back, admin.");
    router.push("/admin");
  }

  return (
    <>
      <Toaster position="top-center" />
      <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <LockKeyhole className="h-5 w-5" />
      </div>
      <form onSubmit={handleSubmit}>
        <label className="mb-4 block text-sm font-bold">Admin email<input type="email" value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" required className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base outline-none transition focus:border-primary dark:border-white/10 dark:bg-white/5" /></label>
        <label className="block text-sm font-bold">Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base outline-none transition focus:border-primary dark:border-white/10 dark:bg-white/5" /></label>
        {error && <p className="mt-3 text-sm font-medium text-rose-500" role="alert">{error}</p>}
        <button className="premium-gradient-button mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold"><LockKeyhole className="h-4 w-4" />Log in to admin</button>
      </form>
    </>
  );
}
