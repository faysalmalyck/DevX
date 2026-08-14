"use client";

import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";
import { useEffect, useRef } from "react";

import type { ApplicationListItem } from "./types";

interface DeleteApplicationDialogProps {
  application: ApplicationListItem | null;
  deleting: boolean;
  error: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteApplicationDialog({
  application,
  deleting,
  error,
  onClose,
  onConfirm,
}: DeleteApplicationDialogProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!application) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    cancelButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !deleting) {
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [application, deleting, onClose]);

  if (!application) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Close delete confirmation"
        onClick={deleting ? undefined : onClose}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
      />
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-application-title"
        aria-describedby="delete-application-description"
        className="relative w-full max-w-md rounded-t-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#111827] sm:rounded-3xl"
      >
        <button
          type="button"
          onClick={onClose}
          disabled={deleting}
          className="absolute right-4 top-4 rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white"
          aria-label="Close delete confirmation"
        >
          <X className="h-4 w-4" />
        </button>

        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
          <AlertTriangle className="h-5 w-5" />
        </span>
        <h2
          id="delete-application-title"
          className="mt-4 pr-8 text-xl font-bold tracking-tight text-slate-900 dark:text-white"
        >
          Delete application?
        </h2>
        <p
          id="delete-application-description"
          className="mt-2 text-base leading-6 text-slate-600 dark:text-zinc-400"
        >
          This permanently removes {application.fullName}&apos;s application and
          stored resume. This action cannot be undone.
        </p>

        {error && (
          <p
            role="alert"
            className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-base font-medium text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300"
          >
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-base font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:text-zinc-300 dark:hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-rose-600 px-4 py-2.5 text-base font-bold text-white shadow-sm transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            {deleting ? "Deleting..." : "Delete application"}
          </button>
        </div>
      </section>
    </div>
  );
}
