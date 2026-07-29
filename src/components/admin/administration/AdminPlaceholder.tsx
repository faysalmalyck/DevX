"use client";

import { ReactNode } from "react";

interface AdminPlaceholderProps {
  active: "roles" | "permissions" | "activity" | "sessions";
  title: string;
  description: string;
  children: ReactNode;
}

export default function AdminPlaceholder({
  title,
  description,
  children,
}: AdminPlaceholderProps) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-[.18em] text-primary">
          Administration
        </p>
        <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          {title}
        </h2>
        <p className="mt-2 text-zinc-400">{description}</p>
      </div>
      <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.01] p-6 shadow-xl backdrop-blur-md">
        {children}
      </div>
    </div>
  );
}
