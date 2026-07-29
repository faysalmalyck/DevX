"use client";

import { useEffect, useCallback, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

type ModalSize = "sm" | "md" | "lg" | "xl";

interface ModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback to close the modal */
  onClose: () => void;
  /** Modal title — rendered in the header */
  title?: string;
  /** Content to render inside the modal body */
  children: ReactNode;
  /** Width preset */
  size?: ModalSize;
  /** Whether clicking the backdrop closes the modal (default: true) */
  closeOnBackdrop?: boolean;
}

const sizeMap: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-xl",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

/**
 * Reusable glassmorphism modal with backdrop blur, keyboard escape, and click-outside support.
 *
 * @example
 * <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Confirm Action" size="md">
 *   <p>Are you sure?</p>
 * </Modal>
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  closeOnBackdrop = true,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", handleKeyDown);
    // Lock body scroll
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prev;
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-[fadeIn_150ms_ease]"
        onClick={closeOnBackdrop ? onClose : undefined}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className={`relative w-full ${sizeMap[size]} rounded-t-3xl sm:rounded-3xl border border-white/10 bg-[#0c1222] p-6 shadow-2xl animate-[slideUp_200ms_ease]`}
      >
        {/* Header */}
        {(title || true) && (
          <div className="mb-6 flex items-center justify-between">
            {title && (
              <h3 className="text-xl font-black text-white">{title}</h3>
            )}
            <button
              onClick={onClose}
              className="ml-auto text-zinc-400 hover:text-white transition cursor-pointer rounded-lg p-1 hover:bg-white/5"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Body */}
        <div>{children}</div>
      </div>

      {/* Keyframe styles (injected once) */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
