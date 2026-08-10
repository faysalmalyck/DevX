"use client";

import toast, { Toaster as HotToaster } from "react-hot-toast";
import { CheckCircle2, XCircle, Info, Loader2 } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Pre-configured dark-themed Toast container.
 * Place `<ToastProvider />` once in your root layout.
 */
export function ToastProvider() {
  return (
    <HotToaster
      position="top-right"
      gutter={10}
      toastOptions={{
        duration: 4000,
        style: {
          background: "#0c1222",
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "1rem",
          padding: "14px 18px",
          fontSize: "14px",
          fontWeight: 600,
          boxShadow: "0 24px 80px rgba(0,0,0,0.45)",
          backdropFilter: "blur(24px)",
          maxWidth: "420px",
        },
      }}
    />
  );
}

function renderIcon(icon: ReactNode) {
  return <span className="shrink-0">{icon}</span>;
}

/**
 * Helper functions for showing styled toasts.
 *
 * @example
 * showToast.success("Profile updated");
 * showToast.error("Failed to save changes");
 * showToast.info("Session expiring soon");
 * showToast.loading("Saving...");
 */
export const showToast = {
  success: (message: string) =>
    toast(message, {
      icon: renderIcon(<CheckCircle2 className="h-5 w-5 text-emerald-400" />),
      style: { borderColor: "rgba(16,185,129,0.2)" },
    }),

  error: (message: string) =>
    toast(message, {
      icon: renderIcon(<XCircle className="h-5 w-5 text-rose-400" />),
      style: { borderColor: "rgba(244,63,94,0.2)" },
      duration: 5000,
    }),

  info: (message: string) =>
    toast(message, {
      icon: renderIcon(<Info className="h-5 w-5 text-brand" />),
      style: { borderColor: "rgba(54,88,255,0.2)" },
    }),

  loading: (message: string) =>
    toast(message, {
      icon: renderIcon(<Loader2 className="h-5 w-5 text-primary animate-spin" />),
      style: { borderColor: "rgba(139,92,246,0.2)" },
      duration: Infinity,
    }),

  /** Dismiss a specific toast or all toasts */
  dismiss: (id?: string) => toast.dismiss(id),
};
