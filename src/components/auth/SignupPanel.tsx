"use client";

import { useState } from "react";
import SignUp from "@/components/auth/sign-up";
import AdminLogin from "@/components/auth/AdminLogin";

export default function SignupPanel() {
  const [mode, setMode] = useState<"signup" | "admin">("signup");

  return (
    <>
      <div className="mb-8 flex rounded-xl bg-slate-100 p-1 dark:bg-white/[0.06]">
        <button onClick={() => setMode("signup")} className={`flex-1 rounded-lg px-3 py-2 text-sm font-bold transition ${mode === "signup" ? "bg-white text-primary shadow-sm dark:bg-white/10 dark:text-white" : "text-slate-500 dark:text-white/55"}`}>Sign up</button>
        <button onClick={() => setMode("admin")} className={`flex-1 rounded-lg px-3 py-2 text-sm font-bold transition ${mode === "admin" ? "bg-white text-primary shadow-sm dark:bg-white/10 dark:text-white" : "text-slate-500 dark:text-white/55"}`}>Admin login</button>
      </div>
      {mode === "signup" ? <SignUp /> : <AdminLogin />}
    </>
  );
}
