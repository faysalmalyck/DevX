"use client";

import {
  type ButtonHTMLAttributes,
  type ReactNode,
  useState,
} from "react";
import ApplicationDialog from "./ApplicationDialog";

export interface ApplyButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "onClick"> {
  careerSlug: string;
  careerTitle: string;
  children: ReactNode;
  onOpen?: () => void;
  onSubmitted?: () => void;
}

/**
 * A drop-in replacement for the existing public "Apply now" anchors.
 * Preserve the original button text and className when replacing an anchor:
 *
 * <ApplyButton careerSlug={career.slug} careerTitle={career.title} className="...">
 *   Apply now
 * </ApplyButton>
 */
export default function ApplyButton({
  careerSlug,
  careerTitle,
  children,
  onOpen,
  onSubmitted,
  disabled,
  ...buttonProps
}: ApplyButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = () => {
    if (disabled) return;
    onOpen?.();
    setIsOpen(true);
  };

  return (
    <>
      <button
        {...buttonProps}
        type="button"
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={openDialog}
      >
        {children}
      </button>
      <ApplicationDialog
        careerSlug={careerSlug}
        careerTitle={careerTitle}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmitted={onSubmitted}
      />
    </>
  );
}
