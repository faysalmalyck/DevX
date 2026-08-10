"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import CareerForm from "./CareerForm";
import type { CareerContent } from "@/lib/careers/types";

type CareerDrawerProps = {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  career?: CareerContent | null;
  onSuccess?: () => void;
};

export default function CareerDrawer({
  open,
  onClose,
  mode,
  career,
  onSuccess,
}: CareerDrawerProps) {
  const drawerRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !drawerRef.current) return;
      const selector =
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
      const focusable = Array.from(
        drawerRef.current.querySelectorAll<HTMLElement>(selector)
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50" role="presentation">
      <button
        type="button"
        aria-label="Close job editor"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/40 backdrop-blur-sm"
      />
      <section
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="career-drawer-title"
        className="absolute right-0 top-0 flex h-dvh w-full max-w-3xl flex-col bg-white shadow-2xl dark:bg-slate-900"
      >
        <header className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-800">
          <div>
            <h2 id="career-drawer-title" className="text-2xl font-bold text-slate-900 dark:text-white">
              {mode === "create" ? "Create job" : "Edit job"}
            </h2>
            <p className="mt-1 text-base text-slate-500 dark:text-slate-400">
              {mode === "create"
                ? "Add a role using the existing public job-page content fields."
                : "Update the role without changing the public page layout."}
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            aria-label="Close job editor"
          >
            <X size={20} />
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          <CareerForm
            mode={mode}
            career={career}
            onClose={onClose}
            onSuccess={onSuccess}
          />
        </div>
      </section>
    </div>
  );
}
