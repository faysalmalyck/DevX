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

const contactEmail = "faysal.malick@icloud.com";

const intentCopy: Record<
  LeadIntent,
  {
    title: string;
    description: string;
    messageLabel: string;
    messagePlaceholder: string;
    emailSubject: string;
    submitLabel: string;
  }
> = {
  consultation: {
    title: "Book a Free Consultation",
    description: "Share the challenge, and we’ll prepare for a useful first conversation.",
    messageLabel: "What would you like to solve?",
    messagePlaceholder: "Tell us what is slowing your business down or what you want to improve.",
    emailSubject: "Consultation request",
    submitLabel: "Prepare consultation email",
  },
  project: {
    title: "Tell Us About Your Project",
    description: "Give us the essentials and we’ll start understanding the right next step.",
    messageLabel: "Project details",
    messagePlaceholder: "Tell us about your goals, timeline, and the kind of solution you need.",
    emailSubject: "Project enquiry",
    submitLabel: "Prepare project email",
  },
  process: {
    title: "Let’s Fix Your Process",
    description:
      "Show us where work gets stuck, and we’ll help shape a clearer, faster way forward.",
    messageLabel: "What should work better?",
    messagePlaceholder:
      "Tell us how the process works today, where delays happen, and what a better outcome would look like.",
    emailSubject: "Business process improvement request",
    submitLabel: "Prepare process email",
  },
  "software-improvement": {
    title: "Improve My Software",
    description:
      "Share what is holding your current software back, and we’ll explore the most useful improvements.",
    messageLabel: "What needs improving?",
    messagePlaceholder:
      "Tell us about the software, the issues your team faces, and the improvement you want to see.",
    emailSubject: "Software improvement request",
    submitLabel: "Prepare improvement email",
  },
  automation: {
    title: "Automate My Business",
    description:
      "Tell us what your team repeats by hand, and we’ll identify where automation can make work flow better.",
    messageLabel: "What would you like to automate?",
    messagePlaceholder:
      "Describe the repeated work, the people or systems involved, and the result you want automation to deliver.",
    emailSubject: "Business automation request",
    submitLabel: "Prepare automation email",
  },
  integration: {
    title: "Discuss an Integration",
    description:
      "Show us which systems need to work together, and we’ll help map a dependable connection between them.",
    messageLabel: "How should your systems connect?",
    messagePlaceholder:
      "Tell us what each system does today, what data needs to move, and where the connection breaks down.",
    emailSubject: "System integration request",
    submitLabel: "Prepare integration email",
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
  "w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-brand focus:ring-1 focus:ring-brand/40 hover:ring-1 hover:ring-slate-300 dark:border-[#2e3850] dark:bg-[#232b3e] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-400 dark:focus:ring-blue-400/40 dark:hover:ring-slate-500/30 sm:px-5 sm:py-3 sm:text-base";

const textareaClassName =
  "w-full resize-y rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-brand focus:ring-1 focus:ring-brand/40 hover:ring-1 hover:ring-slate-300 dark:border-[#2e3850] dark:bg-[#232b3e] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-400 dark:focus:ring-blue-400/40 dark:hover:ring-slate-500/30 sm:px-5 sm:text-base";

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

export function buildLeadMailto(
  request: NonNullable<LeadRequest>,
  values: LeadFormValues,
): string {
  const copy = intentCopy[request.intent];
  const topics = request.topics?.map((topic) => topic.trim()).filter(Boolean) ?? [];
  const message = [
    `Name: ${values.name.trim()}`,
    `Email: ${values.email.trim()}`,
    values.phone.trim() ? `Phone: ${values.phone.trim()}` : null,
    values.company.trim() ? `Company: ${values.company.trim()}` : null,
    topics.length > 0 ? "" : null,
    topics.length > 0 ? "Selected topics:" : null,
    ...topics.map((topic) => `- ${topic}`),
    "",
    copy.messageLabel,
    values.message.trim(),
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  return `mailto:${contactEmail}?subject=${encodeURIComponent(`${copy.emailSubject} — ${values.name.trim()}`)}&body=${encodeURIComponent(message)}`;
}

export default function LeadCaptureDialog({ request, onClose }: LeadCaptureDialogProps) {
  const [hasMounted, setHasMounted] = useState(false);
  const [formValues, setFormValues] = useState<LeadFormValues>(initialFormValues);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
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
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
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

    const mailto = buildLeadMailto(request, formValues);

    onClose();
    window.location.assign(mailto);
  };

  if (!hasMounted || !isOpen || !copy) return null;

  const titleId = `${idPrefix}-title`;
  const descriptionId = `${idPrefix}-description`;

  return createPortal(
    <div className="fixed inset-0 z-[10003] flex items-end justify-center p-4 sm:items-center" role="presentation">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        className="relative z-10 max-h-[min(40rem,calc(100dvh-2rem))] w-full max-w-2xl overflow-y-auto overscroll-contain rounded-lg border border-slate-200 bg-slate-50 shadow-2xl dark:border-[#273046] dark:bg-[#232c3e]"
      >
        <div className="relative p-5 sm:p-6 md:p-7">
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close enquiry form"
            className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full text-slate-500 transition hover:bg-white hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white sm:right-4 sm:top-4"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="max-w-xl pr-10">
            <h2 id={titleId} className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              {copy.title}
            </h2>
            <p id={descriptionId} className="mt-2 max-w-lg text-sm leading-6 text-slate-600 dark:text-slate-300">
              {copy.description}
            </p>
          </div>

          {topics.length > 0 ? (
            <div
              aria-label="Selected topics"
              className="mt-4 rounded-lg border border-brand/15 bg-brand/[0.06] p-3.5 dark:border-brand/25 dark:bg-brand/10"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300">
                Selected topics
              </p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {topics.map((topic) => (
                  <li
                    key={topic}
                    className="rounded-full border border-brand/20 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 dark:border-brand/30 dark:bg-[#192133] dark:text-slate-100"
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
              <p className="max-w-xs text-xs leading-5 text-slate-500 dark:text-slate-400">
                This opens your default email app. Nothing is sent until you choose Send there.
              </p>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-brand to-brand px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:from-brand hover:to-indigo-500 hover:shadow-brand/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand active:scale-[0.98] sm:w-auto"
              >
                {copy.submitLabel}
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
        <label htmlFor={id} className="text-base font-semibold text-slate-700 dark:text-white">
          {label}
          {required ? <span aria-hidden="true" className="ml-1 text-brand">*</span> : null}
        </label>
        {optional ? <span className="text-xs text-slate-500 dark:text-slate-400">Optional</span> : null}
      </div>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-xs font-medium text-rose-600 dark:text-rose-400">
          {error}
        </p>
      ) : null}
    </div>
  );
}
