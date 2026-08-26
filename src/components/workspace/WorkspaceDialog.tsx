"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

import { workspaceCn } from "./cn";

type WorkspaceDialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  closeOnBackdrop?: boolean;
};

export function WorkspaceDialog({
  open,
  onClose,
  title,
  description,
  children,
  className,
  closeOnBackdrop = true,
}: WorkspaceDialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const bodyOverflow = document.body.style.overflow;
    previouslyFocused.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    requestAnimationFrame(() => panelRef.current?.focus());

    return () => {
      document.body.style.overflow = bodyOverflow;
      window.removeEventListener("keydown", onKeyDown);
      previouslyFocused.current?.focus();
      previouslyFocused.current = null;
    };
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close dialog"
        tabIndex={-1}
        onClick={closeOnBackdrop ? onClose : undefined}
        className="absolute inset-0 cursor-default bg-slate-950/70 backdrop-blur-sm"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="workspace-dialog-title"
        tabIndex={-1}
        className={workspaceCn(
          "workspace-dialog relative max-h-[min(88vh,48rem)] w-full max-w-2xl overflow-y-auto rounded-t-[28px] p-5 outline-none sm:rounded-[28px] sm:p-6",
          className
        )}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 id="workspace-dialog-title" className="workspace-dialog-title">{title}</h2>
            {description ? <p className="workspace-dialog-description">{description}</p> : null}
          </div>
          <button type="button" onClick={onClose} className="workspace-icon-button" aria-label="Close dialog">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
