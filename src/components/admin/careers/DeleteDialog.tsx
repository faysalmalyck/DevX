"use client";

import { useEffect, useRef } from "react";
import { AlertTriangle, X } from "lucide-react";

type DeleteDialogProps = {
  open: boolean;
  title: string;
  loading?: boolean;
  error?: string | null;
  onClose: () => void;
  onConfirm: () => void;
};

export default function DeleteDialog({
  open,
  title,
  loading = false,
  error,
  onClose,
  onConfirm,
}: DeleteDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    cancelRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !loading) onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [loading, onClose, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center p-4" role="presentation">
      <button
        type="button"
        aria-label="Close confirmation"
        className="absolute inset-0 cursor-default bg-slate-950/60 backdrop-blur-sm"
        onClick={loading ? undefined : onClose}
      />
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-career-title"
        className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
      >
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          aria-label="Close confirmation"
          className="absolute right-4 top-4 rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="flex items-start gap-4 pr-8">
          <div className="rounded-xl bg-rose-100 p-3 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h2 id="delete-career-title" className="text-lg font-bold text-slate-900 dark:text-white">
              Delete {title}?
            </h2>
            <p className="mt-2 text-base leading-6 text-slate-600 dark:text-slate-400">
              This permanently removes the job. Jobs with submitted applications
              must have those applications removed first so private resumes are
              not orphaned.
            </p>
          </div>
        </div>
        {error ? (
          <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-base text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300">
            {error}
          </p>
        ) : null}
        <div className="mt-6 flex justify-end gap-3">
          <button
            ref={cancelRef}
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-slate-300 px-4 py-2.5 text-base font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-xl bg-rose-600 px-4 py-2.5 text-base font-semibold text-white transition hover:bg-rose-700 disabled:cursor-wait disabled:opacity-60"
          >
            {loading ? "Deleting…" : "Delete job"}
          </button>
        </div>
      </section>
    </div>
  );
}
