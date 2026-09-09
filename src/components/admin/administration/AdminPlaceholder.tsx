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
        <p className="text-base font-bold uppercase tracking-[.18em] text-primary">
          Administration
        </p>
        <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          {title}
        </h2>
        <p className="mt-2 text-slate-500 dark:text-zinc-400">{description}</p>
      </div>
      <div className="cart-skin-box rounded-xl p-6">
        {children}
      </div>
    </div>
  );
}
