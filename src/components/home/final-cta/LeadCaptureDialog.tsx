"use client";

import {
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cartDialogStyles } from "@/components/shared/cartDialogStyles";

export type LeadRequest = {
  intent:
    | "consultation"
    | "project"
    | "process"
    | "software-improvement"
    | "automation"
    | "integration";
  topics?: readonly string[];
} | null;

export type LeadIntent = NonNullable<LeadRequest>["intent"];

type LeadCaptureDialogProps = {
  request: LeadRequest;
  onClose: () => void;
};

export type LeadFormValues = {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
};

type LeadFieldName = keyof LeadFormValues;
type FieldErrors = Partial<Record<LeadFieldName, string>>;

const intentCopy: Record<
  LeadIntent,
  {
    title: string;
    description: string;
    messageLabel: string;
    messagePlaceholder: string;
    submitLabel: string;
  }
> = {
  consultation: {
    title: "Book a Free Consultation",
    description: "Share the challenge, and we’ll prepare for a useful first conversation.",
    messageLabel: "What would you like to solve?",
    messagePlaceholder: "Tell us what is slowing your business down or what you want to improve.",
    submitLabel: "Request consultation",
  },
  project: {
    title: "Tell Us About Your Project",
    description: "Give us the essentials and we’ll start understanding the right next step.",
    messageLabel: "Project details",
    messagePlaceholder: "Tell us about your goals, timeline, and the kind of solution you need.",
    submitLabel: "Send project enquiry",
  },
  process: {
    title: "Turn Your Business Challenges Into Better Processes",
    description:
      "Show us what’s slowing your business down, and we’ll build a smarter, faster way to move forward.",
    messageLabel: "What should work better?",
    messagePlaceholder:
      "Tell us how the process works today, where delays happen, and what a better outcome would look like.",
    submitLabel: "Send process enquiry",
  },
  "software-improvement": {
    title: "Improve My Software",
    description:
      "Share what is holding your current software back, and we’ll explore the most useful improvements.",
    messageLabel: "What needs improving?",
    messagePlaceholder:
      "Tell us about the software, the issues your team faces, and the improvement you want to see.",
    submitLabel: "Send improvement enquiry",
  },
  automation: {
    title: "Automate My Business",
    description:
      "Tell us what your team repeats by hand, and we’ll identify where automation can make work flow better.",
    messageLabel: "What would you like to automate?",
    messagePlaceholder:
      "Describe the repeated work, the people or systems involved, and the result you want automation to deliver.",
    submitLabel: "Send automation enquiry",
  },
  integration: {
    title: "Discuss an Integration",
    description:
      "Show us which systems need to work together, and we’ll help map a dependable connection between them.",
    messageLabel: "How should your systems connect?",
    messagePlaceholder:
      "Tell us what each system does today, what data needs to move, and where the connection breaks down.",
    submitLabel: "Send integration enquiry",
  },
};

const initialFormValues: LeadFormValues = {
  name: "",
  email: "",
  phone: "",
  company: "",
  message: "",
};

const inputClassName =
  cartDialogStyles.input;

const textareaClassName =
  cartDialogStyles.textarea;

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => element.tabIndex >= 0 && !element.hasAttribute("hidden"));
}

function validateForm(values: LeadFormValues): FieldErrors {
  const errors: FieldErrors = {};

  if (values.name.trim().length < 2 || values.name.trim().length > 120) {
    errors.name = "Enter your name (2–120 characters).";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (values.phone.trim() && !/^[0-9+().\-\s]{7,32}$/.test(values.phone.trim())) {
    errors.phone = "Enter a valid phone number, or leave this field blank.";
  }

  if (values.message.trim().length < 10 || values.message.trim().length > 5000) {
    errors.message = "Please enter a message between 10 and 5,000 characters.";
  }

  return errors;
}

function getFirstErrorField(errors: FieldErrors): LeadFieldName | undefined {
  return (["name", "email", "phone", "company", "message"] as const).find(
    (field) => Boolean(errors[field]),
  );
}

export default function LeadCaptureDialog({ request, onClose }: LeadCaptureDialogProps) {
  const [hasMounted, setHasMounted] = useState(false);
  const [formValues, setFormValues] = useState<LeadFormValues>(initialFormValues);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const idPrefix = useId();
  const isOpen = request !== null;
  const copy = request ? intentCopy[request.intent] : null;
  const topics = request?.topics?.map((topic) => topic.trim()).filter(Boolean) ?? [];

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    setFormValues(initialFormValues);
    setFieldErrors({});
    setSubmitError(null);
    setSubmitting(false);
  }, [request, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    triggerRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;

    const focusFirstField = window.requestAnimationFrame(() => {
      firstInputRef.current?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusableElements = getFocusableElements(dialogRef.current);
      if (focusableElements.length === 0) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }

      const firstFocusableElement = focusableElements[0];
      const lastFocusableElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey && activeElement === firstFocusableElement) {
        event.preventDefault();
        lastFocusableElement.focus();
      } else if (!event.shiftKey && activeElement === lastFocusableElement) {
        event.preventDefault();
        firstFocusableElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFirstField);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      triggerRef.current?.focus();
    };
  }, [isOpen, onClose]);

  const updateField = (field: LeadFieldName) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value;
    setFormValues((current) => ({ ...current, [field]: value }));
    setSubmitError(null);
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!request || !copy) return;

    const errors = validateForm(formValues);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      const firstErrorField = getFirstErrorField(errors);
      if (firstErrorField) {
        window.requestAnimationFrame(() => {
          document.getElementById(`${idPrefix}-${firstErrorField}`)?.focus();
        });
      }
      return;
    }

    const topicSummary = topics.length > 0 ? `\n\nSelected topics:\n${topics.map((topic) => `- ${topic}`).join("\n")}` : "";

    setSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/leads/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formValues.name,
          email: formValues.email,
          phone: formValues.phone || undefined,
          company: formValues.company || undefined,
          message: `${formValues.message.trim()}${topicSummary}`,
          formType: request.intent === "consultation" ? "CONSULTATION" : "CONTACT",
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(
          typeof payload?.error === "string"
            ? payload.error
            : "We could not send your enquiry. Please try again."
        );
      }

      onClose();
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "We could not send your enquiry. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!hasMounted || !isOpen || !copy) return null;

  const titleId = `${idPrefix}-title`;
  const descriptionId = `${idPrefix}-description`;

  return createPortal(
    <div className="fixed inset-0 z-[10003] flex items-end justify-center p-4 sm:items-center" role="presentation">
      <div
        aria-hidden="true"
        className={`absolute inset-0 ${cartDialogStyles.backdrop}`}
        onClick={onClose}
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        className={`relative z-10 max-h-[min(40rem,calc(100dvh-2rem))] w-full max-w-2xl overflow-y-auto overscroll-contain rounded-lg ${cartDialogStyles.panel}`}
      >
        <div className="relative p-5 sm:p-6 md:p-7">
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close enquiry form"
            className={`absolute right-3 top-3 ${cartDialogStyles.closeButton} sm:right-4 sm:top-4`}
          >
            <X className="h-5 w-5" />
          </button>

              <div className="pb-5 pr-10">
            <div className="max-w-xl">
              <h2 id={titleId} className={`text-2xl font-semibold tracking-tight sm:text-3xl ${cartDialogStyles.title}`}>
                {copy.title}
              </h2>
              <p id={descriptionId} className={`mt-2 max-w-lg text-sm leading-6 ${cartDialogStyles.description}`}>
                {copy.description}
              </p>
            </div>
          </div>

          {topics.length > 0 ? (
            <div
              aria-label="Selected topics"
              className={`mt-4 rounded-lg border ${cartDialogStyles.divider} bg-[#111725]/65 p-3.5`}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#c9d0e1]">
                Selected topics
              </p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {topics.map((topic) => (
                  <li
                    key={topic}
                    className="rounded-full border border-[#414b62] bg-[#1e2538] px-3 py-1.5 text-xs font-medium text-slate-100"
                  >
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <form className="mt-5 space-y-4" noValidate onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
              <FormField id={`${idPrefix}-name`} label="Name" error={fieldErrors.name} required>
                <input
                  ref={firstInputRef}
                  id={`${idPrefix}-name`}
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  placeholder="John Carter"
                  value={formValues.name}
                  onChange={updateField("name")}
                  aria-invalid={Boolean(fieldErrors.name)}
                  aria-describedby={fieldErrors.name ? `${idPrefix}-name-error` : undefined}
                  className={inputClassName}
                />
              </FormField>

              <FormField id={`${idPrefix}-email`} label="Email" error={fieldErrors.email} required>
                <input
                  id={`${idPrefix}-email`}
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="example@email.com"
                  value={formValues.email}
                  onChange={updateField("email")}
                  aria-invalid={Boolean(fieldErrors.email)}
                  aria-describedby={fieldErrors.email ? `${idPrefix}-email-error` : undefined}
                  className={inputClassName}
                />
              </FormField>

              <FormField id={`${idPrefix}-phone`} label="Phone" error={fieldErrors.phone} optional>
                <input
                  id={`${idPrefix}-phone`}
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="(123) 456 - 789"
                  value={formValues.phone}
                  onChange={updateField("phone")}
                  aria-invalid={Boolean(fieldErrors.phone)}
                  aria-describedby={fieldErrors.phone ? `${idPrefix}-phone-error` : undefined}
                  className={inputClassName}
                />
              </FormField>

              <FormField id={`${idPrefix}-company`} label="Company" optional>
                <input
                  id={`${idPrefix}-company`}
                  name="company"
                  type="text"
                  autoComplete="organization"
                  placeholder="Your company"
                  value={formValues.company}
                  onChange={updateField("company")}
                  className={inputClassName}
                />
              </FormField>
            </div>

            <FormField id={`${idPrefix}-message`} label={copy.messageLabel} error={fieldErrors.message} required>
              <textarea
                id={`${idPrefix}-message`}
                name="message"
                rows={4}
                required
                value={formValues.message}
                onChange={updateField("message")}
                placeholder={copy.messagePlaceholder}
                aria-invalid={Boolean(fieldErrors.message)}
                aria-describedby={fieldErrors.message ? `${idPrefix}-message-error` : undefined}
                className={textareaClassName}
              />
            </FormField>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-xs">
                <p className="text-xs leading-5 text-slate-400">
                  Your details are sent securely to our team. We’ll be in touch soon.
                </p>
                {submitError ? (
                  <p role="alert" className="mt-2 text-xs font-medium text-rose-300">
                    {submitError}
                  </p>
                ) : null}
              </div>
              <button
                type="submit"
                disabled={submitting}
                className={`${cartDialogStyles.primaryButton} w-full px-6 py-3.5 sm:w-auto`}
              >
                {submitting ? "Sending…" : copy.submitLabel}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body,
  );
}

type FormFieldProps = {
  id: string;
  label: string;
  children: ReactNode;
  error?: string;
  required?: boolean;
  optional?: boolean;
  className?: string;
};

function FormField({
  id,
  label,
  children,
  error,
  required = false,
  optional = false,
  className = "",
}: FormFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className={`text-base font-semibold ${cartDialogStyles.fieldLabel}`}>
          {label}
          {required ? <span aria-hidden="true" className="ml-1 text-brand">*</span> : null}
        </label>
        {optional ? <span className={`text-xs ${cartDialogStyles.optionalLabel}`}>Optional</span> : null}
      </div>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-xs font-medium text-rose-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}
