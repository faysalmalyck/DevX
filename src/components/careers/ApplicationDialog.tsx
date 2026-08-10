"use client";

import {
  type ChangeEvent,
  type FormEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, FileText, LoaderCircle, Paperclip, Upload, X } from "lucide-react";

const MAX_RESUME_SIZE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_RESUME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);
const ACCEPTED_RESUME_EXTENSIONS = [".pdf", ".doc", ".docx"] as const;

const TEXT_FIELD_NAMES = [
  "fullName",
  "email",
  "phone",
  "currentLocation",
  "yearsOfExperience",
  "linkedInUrl",
  "portfolioUrl",
  "coverLetter",
] as const;

type TextFieldName = (typeof TEXT_FIELD_NAMES)[number];
type ApplicationErrorField = TextFieldName | "resume" | "privacyConsent";
type FieldErrors = Partial<Record<ApplicationErrorField, string>>;

interface ApplicationFormValues {
  fullName: string;
  email: string;
  phone: string;
  currentLocation: string;
  yearsOfExperience: string;
  linkedInUrl: string;
  portfolioUrl: string;
  coverLetter: string;
  privacyConsent: boolean;
  website: string;
}

interface ApiApplicationResponse {
  success?: boolean;
  message?: string;
  code?: string;
  fieldErrors?: FieldErrors;
}

export interface ApplicationDialogProps {
  careerSlug: string;
  careerTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
}

interface FormFieldProps {
  id: string;
  label: string;
  children: ReactNode;
  error?: string;
  required?: boolean;
  optional?: boolean;
  className?: string;
}

const initialFormValues: ApplicationFormValues = {
  fullName: "",
  email: "",
  phone: "",
  currentLocation: "",
  yearsOfExperience: "",
  linkedInUrl: "",
  portfolioUrl: "",
  coverLetter: "",
  privacyConsent: false,
  website: "",
};

const inputBaseClassName =
  "min-h-11 w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-[#2e3850] dark:bg-[#232b3e] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-400 dark:focus:ring-blue-400/20";

function getInputClassName(hasError?: boolean): string {
  if (!hasError) return inputBaseClassName;
  return `${inputBaseClassName} border-rose-500 text-rose-900 focus:border-rose-500 focus:ring-rose-500/20 dark:border-rose-400 dark:text-rose-100 dark:focus:border-rose-400 dark:focus:ring-rose-400/20`;
}

function FormField({ id, label, children, error, required, optional, className = "" }: FormFieldProps) {
  return (
    <div className={className}>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <label htmlFor={id} className="block text-xs font-semibold text-slate-700 dark:text-slate-200 sm:text-sm">
          {label} {required && <span className="text-brand dark:text-brand">*</span>}
        </label>
        {optional && <span className="text-xs text-slate-500 dark:text-slate-400">Optional</span>}
      </div>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400">
          {error}
        </p>
      )}
    </div>
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function isApiApplicationResponse(value: unknown): value is ApiApplicationResponse {
  return isRecord(value);
}

function isApplicationErrorField(value: string): value is ApplicationErrorField {
  return (
    value === "resume" ||
    value === "privacyConsent" ||
    (TEXT_FIELD_NAMES as readonly string[]).includes(value)
  );
}

function normalizeFieldErrors(value: unknown): FieldErrors {
  if (!isRecord(value)) return {};

  const errors: FieldErrors = {};
  for (const [field, message] of Object.entries(value)) {
    const normalizedField = field === "linkedinUrl" ? "linkedInUrl" : field;
    if (!isApplicationErrorField(normalizedField)) continue;

    if (typeof message === "string") {
      errors[normalizedField] = message;
    } else if (Array.isArray(message) && typeof message[0] === "string") {
      errors[normalizedField] = message[0];
    }
  }

  return errors;
}

function parseApiResponse(value: unknown): ApiApplicationResponse {
  if (!isApiApplicationResponse(value)) return {};

  return {
    success: typeof value.success === "boolean" ? value.success : undefined,
    message: readString(value.message),
    code: readString(value.code),
    fieldErrors: normalizeFieldErrors(value.fieldErrors),
  };
}

function validateOptionalUrl(value: string, label: string): string | undefined {
  if (!value.trim()) return undefined;

  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return `${label} must start with http:// or https://.`;
    }
  } catch {
    return `Enter a valid ${label.toLowerCase()} URL.`;
  }

  return undefined;
}

function validateResume(file: File | null): string | undefined {
  if (!file) return "Please attach your resume.";
  if (file.size === 0) return "The selected resume is empty.";
  if (file.size > MAX_RESUME_SIZE_BYTES) return "Your resume must be 5 MB or smaller.";

  const lowerCaseName = file.name.toLowerCase();
  const hasSupportedExtension = ACCEPTED_RESUME_EXTENSIONS.some((extension) =>
    lowerCaseName.endsWith(extension)
  );
  const hasSupportedMimeType =
    file.type.length === 0 || ACCEPTED_RESUME_TYPES.has(file.type);

  if (!hasSupportedExtension || !hasSupportedMimeType) {
    return "Upload a PDF, DOC, or DOCX resume.";
  }

  return undefined;
}

function validateForm(values: ApplicationFormValues, resume: File | null): FieldErrors {
  const errors: FieldErrors = {};
  const fullName = values.fullName.trim();
  const email = values.email.trim();
  const phone = values.phone.trim();
  const currentLocation = values.currentLocation.trim();
  const yearsOfExperience = values.yearsOfExperience.trim();
  const coverLetter = values.coverLetter.trim();

  if (fullName.length < 2 || fullName.length > 120) {
    errors.fullName = "Enter your full name (2–120 characters).";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    errors.email = "Enter a valid email address.";
  }
  if (!/^[0-9+().\-\s]{7,32}$/.test(phone)) {
    errors.phone = "Enter a valid phone number.";
  }
  if (currentLocation.length < 2 || currentLocation.length > 160) {
    errors.currentLocation = "Enter your current location.";
  }

  const years = Number(yearsOfExperience);
  if (
    !yearsOfExperience ||
    !/^\d{1,2}$/.test(yearsOfExperience) ||
    !Number.isInteger(years) ||
    years < 0 ||
    years > 60
  ) {
    errors.yearsOfExperience = "Enter whole years of experience from 0 to 60.";
  }

  const linkedInError = validateOptionalUrl(values.linkedInUrl, "LinkedIn");
  if (linkedInError) errors.linkedInUrl = linkedInError;

  const portfolioError = validateOptionalUrl(values.portfolioUrl, "portfolio");
  if (portfolioError) errors.portfolioUrl = portfolioError;

  if (coverLetter.length < 10 || coverLetter.length > 5000) {
    errors.coverLetter = "Please enter a message between 10 and 5,000 characters.";
  }

  const resumeError = validateResume(resume);
  if (resumeError) errors.resume = resumeError;

  if (!values.privacyConsent) {
    errors.privacyConsent = "Please confirm that you consent to the processing of your application.";
  }

  return errors;
}

function getFirstErrorField(errors: FieldErrors): ApplicationErrorField | undefined {
  const fields: ApplicationErrorField[] = [
    "fullName",
    "email",
    "phone",
    "currentLocation",
    "yearsOfExperience",
    "linkedInUrl",
    "portfolioUrl",
    "coverLetter",
    "resume",
    "privacyConsent",
  ];
  return fields.find((field) => Boolean(errors[field]));
}

function formatFileSize(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(bytes >= 1024 * 1024 ? 1 : 2)} MB`;
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  ).filter(
    (element) =>
      element.tabIndex >= 0 &&
      !element.hasAttribute("hidden") &&
      element.getClientRects().length > 0
  );
}

export default function ApplicationDialog({
  careerSlug,
  careerTitle,
  isOpen,
  onClose,
  onSubmitted,
}: ApplicationDialogProps) {
  const [hasMounted, setHasMounted] = useState(false);
  const [formValues, setFormValues] = useState<ApplicationFormValues>(initialFormValues);
  const [resume, setResume] = useState<File | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resumePickerRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  const isSubmittingRef = useRef(isSubmitting);
  const idPrefix = useId();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    isSubmittingRef.current = isSubmitting;
  }, [isSubmitting]);

  useEffect(() => {
    if (isOpen) setIsSubmitted(false);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !isSubmitted) return;

    const focusSuccessHeading = window.requestAnimationFrame(() => {
      successHeadingRef.current?.focus();
    });

    return () => window.cancelAnimationFrame(focusSuccessHeading);
  }, [isOpen, isSubmitted]);

  useEffect(() => {
    if (!isOpen) return;

    triggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;

    const focusCloseButton = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        if (!isSubmittingRef.current) onCloseRef.current();
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

      if (event.shiftKey && (activeElement === firstFocusableElement || !dialogRef.current.contains(activeElement))) {
        event.preventDefault();
        lastFocusableElement.focus();
      } else if (!event.shiftKey && (activeElement === lastFocusableElement || !dialogRef.current.contains(activeElement))) {
        event.preventDefault();
        firstFocusableElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusCloseButton);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      triggerRef.current?.focus();
    };
  }, [isOpen]);

  const inputId = (name: string) => `${idPrefix}-${name}`;

  const clearError = (field: ApplicationErrorField) => {
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const updateTextField = (field: TextFieldName, value: string) => {
    setFormValues((current) => ({ ...current, [field]: value }));
    clearError(field);
    if (formError) setFormError(null);
  };

  const resetForm = () => {
    setFormValues(initialFormValues);
    setResume(null);
    setFieldErrors({});
    setFormError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const focusFirstError = (errors: FieldErrors) => {
    const firstErrorField = getFirstErrorField(errors);
    if (!firstErrorField) return;

    window.requestAnimationFrame(() => {
      if (firstErrorField === "resume") {
        resumePickerRef.current?.focus();
      } else {
        document.getElementById(inputId(firstErrorField))?.focus();
      }
    });
  };

  const handleResumeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] ?? null;
    const resumeError = validateResume(selectedFile);

    if (resumeError) {
      setResume(null);
      setFieldErrors((current) => ({ ...current, resume: resumeError }));
      event.target.value = "";
      return;
    }

    setResume(selectedFile);
    clearError("resume");
    if (formError) setFormError(null);
  };

  const removeResume = () => {
    setResume(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setFieldErrors((current) => ({ ...current, resume: "Please attach your resume." }));
  };

  const handleBackdropMouseDown = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && !isSubmittingRef.current) onClose();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting || isSubmittingRef.current) return;

    const clientErrors = validateForm(formValues, resume);
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      setFormError("Please correct the highlighted fields and try again.");
      focusFirstError(clientErrors);
      return;
    }

    if (!resume) return;

    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setFieldErrors({});
    setFormError(null);

    const submission = new FormData();
    submission.set("fullName", formValues.fullName.trim());
    submission.set("email", formValues.email.trim());
    submission.set("phone", formValues.phone.trim());
    submission.set("currentLocation", formValues.currentLocation.trim());
    submission.set("yearsOfExperience", formValues.yearsOfExperience.trim());
    submission.set("linkedInUrl", formValues.linkedInUrl.trim());
    submission.set("portfolioUrl", formValues.portfolioUrl.trim());
    submission.set("coverLetter", formValues.coverLetter.trim());
    submission.set("privacyConsent", String(formValues.privacyConsent));
    submission.set("website", formValues.website);
    submission.set("resume", resume, resume.name);

    try {
      const response = await fetch(
        `/api/careers/${encodeURIComponent(careerSlug)}/applications`,
        {
          method: "POST",
          body: submission,
          headers: { Accept: "application/json" },
        }
      );

      let responseBody: unknown = null;
      try {
        responseBody = await response.json();
      } catch {
        // Fallback for non-JSON responses
      }
      const result = parseApiResponse(responseBody);

      if (!response.ok || result.success !== true) {
        const serverErrors = result.fieldErrors ?? {};
        if (Object.keys(serverErrors).length > 0) {
          setFieldErrors(serverErrors);
          focusFirstError(serverErrors);
        }

        if (response.status === 409 || result.code === "DUPLICATE_APPLICATION") {
          setFormError("An application with this email has already been submitted for this job.");
        } else if (response.status === 429) {
          setFormError("Too many attempts. Please wait a moment before trying again.");
        } else {
          setFormError(result.message ?? "We could not submit your application. Please try again.");
        }
        return;
      }

      resetForm();
      setIsSubmitted(true);
      onSubmitted?.();
    } catch {
      setFormError("We could not submit your application. Please check your connection and try again.");
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmittingRef.current) return;
    onClose();
  };

  const handleSubmitAnother = () => {
    setIsSubmitted(false);
    resetForm();
    window.requestAnimationFrame(() => {
      document.getElementById(inputId("fullName"))?.focus();
    });
  };

  if (!hasMounted || !isOpen) return null;

  const dialogContent = (
    <div
      className="fixed inset-x-0 bottom-0 top-20 z-[100] flex items-end justify-center overflow-hidden bg-slate-950/65 p-0 backdrop-blur-sm sm:items-center sm:p-4 lg:p-6"
      onMouseDown={handleBackdropMouseDown}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={inputId("title")}
        aria-describedby={inputId("description")}
        tabIndex={-1}
        className="relative flex h-full max-h-full w-full max-w-3xl flex-col self-end overflow-hidden rounded-t-2xl border border-slate-200 bg-white shadow-2xl dark:border-[#2e3850] dark:bg-[#232c3e] sm:my-auto sm:h-auto sm:max-h-[calc(100dvh-7rem)] sm:self-auto sm:rounded-2xl lg:max-h-[calc(100dvh-8rem)]"
      >
        <div className="h-full min-h-0 overflow-y-auto overscroll-contain p-4 pb-6 sm:h-auto sm:max-h-[calc(100dvh-7rem)] sm:p-6 lg:max-h-[calc(100dvh-8rem)] lg:p-7">
          <div className="mb-5 flex items-start justify-between gap-4 border-b border-slate-200 pb-4 dark:border-[#2e3850]">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-brand dark:text-brand sm:text-sm">Application for</p>
              <h2 id={inputId("title")} className="mt-1 break-words text-xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                {careerTitle}
              </h2>
              <p id={inputId("description")} className="mt-1.5 max-w-2xl text-base leading-6 text-slate-600 dark:text-slate-300">
                Tell us about yourself and attach your resume. Fields marked with an asterisk are required.
              </p>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              aria-label="Close application form"
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-slate-300 hover:bg-slate-100 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#39435b] dark:text-slate-300 dark:hover:border-slate-500 dark:hover:bg-[#232b3e] dark:hover:text-white dark:focus:ring-offset-[#232c3e]"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>

          {isSubmitted ? (
            <div className="mx-auto flex max-w-lg flex-col items-center py-7 text-center sm:py-10" role="status" aria-live="polite">
              <div className="flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300">
                <CheckCircle2 className="size-8" aria-hidden="true" />
              </div>
              <h3 ref={successHeadingRef} tabIndex={-1} className="mt-5 text-2xl font-semibold text-slate-900 outline-none dark:text-white">Application received</h3>
              <p className="mt-3 text-base leading-6 text-slate-600 dark:text-slate-300">
                Thank you for applying for {careerTitle}. Our team will review your application and contact you if there is a match.
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="mt-7 rounded-full bg-brand px-7 py-3 text-lg font-semibold text-white shadow-lg shadow-brand/20 transition hover:bg-brand focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 dark:focus:ring-offset-[#232c3e]"
              >
                Done
              </button>
              <button
                type="button"
                onClick={handleSubmitAnother}
                className="mt-4 text-lg font-semibold text-brand underline-offset-4 transition hover:text-brand hover:underline focus:outline-none focus:ring-2 focus:ring-brand dark:text-brand"
              >
                Submit another application
              </button>
            </div>
          ) : (
            <form noValidate onSubmit={handleSubmit}>
              {formError && (
                <div
                  role="alert"
                  className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 dark:border-rose-400/25 dark:bg-rose-400/10 dark:text-rose-200"
                >
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                <FormField
                  id={inputId("fullName")}
                  label="Full name"
                  error={fieldErrors.fullName}
                  required
                >
                  <input
                    id={inputId("fullName")}
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    maxLength={120}
                    required
                    aria-required="true"
                    value={formValues.fullName}
                    onChange={(event) => updateTextField("fullName", event.target.value)}
                    aria-invalid={Boolean(fieldErrors.fullName)}
                    aria-describedby={fieldErrors.fullName ? inputId("fullName-error") : undefined}
                    className={getInputClassName(Boolean(fieldErrors.fullName))}
                    placeholder="John Carter"
                  />
                </FormField>

                <FormField id={inputId("email")} label="Email address" error={fieldErrors.email} required>
                  <input
                    id={inputId("email")}
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    maxLength={254}
                    required
                    aria-required="true"
                    value={formValues.email}
                    onChange={(event) => updateTextField("email", event.target.value)}
                    aria-invalid={Boolean(fieldErrors.email)}
                    aria-describedby={fieldErrors.email ? inputId("email-error") : undefined}
                    className={getInputClassName(Boolean(fieldErrors.email))}
                    placeholder="example@email.com"
                  />
                </FormField>

                <FormField id={inputId("phone")} label="Phone number" error={fieldErrors.phone} required>
                  <input
                    id={inputId("phone")}
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    maxLength={32}
                    required
                    aria-required="true"
                    value={formValues.phone}
                    onChange={(event) => updateTextField("phone", event.target.value)}
                    aria-invalid={Boolean(fieldErrors.phone)}
                    aria-describedby={fieldErrors.phone ? inputId("phone-error") : undefined}
                    className={getInputClassName(Boolean(fieldErrors.phone))}
                    placeholder="+1 (555) 123-4567"
                  />
                </FormField>

                <FormField
                  id={inputId("currentLocation")}
                  label="Current location"
                  error={fieldErrors.currentLocation}
                  required
                >
                  <input
                    id={inputId("currentLocation")}
                    name="currentLocation"
                    type="text"
                    autoComplete="address-level2"
                    maxLength={160}
                    required
                    aria-required="true"
                    value={formValues.currentLocation}
                    onChange={(event) => updateTextField("currentLocation", event.target.value)}
                    aria-invalid={Boolean(fieldErrors.currentLocation)}
                    aria-describedby={fieldErrors.currentLocation ? inputId("currentLocation-error") : undefined}
                    className={getInputClassName(Boolean(fieldErrors.currentLocation))}
                    placeholder="Islamabad, Pakistan"
                  />
                </FormField>

                <FormField
                  id={inputId("yearsOfExperience")}
                  label="Years of experience"
                  error={fieldErrors.yearsOfExperience}
                  required
                >
                  <input
                    id={inputId("yearsOfExperience")}
                    name="yearsOfExperience"
                    type="number"
                    min="0"
                    max="60"
                    step="1"
                    inputMode="numeric"
                    required
                    aria-required="true"
                    value={formValues.yearsOfExperience}
                    onChange={(event) => updateTextField("yearsOfExperience", event.target.value)}
                    aria-invalid={Boolean(fieldErrors.yearsOfExperience)}
                    aria-describedby={fieldErrors.yearsOfExperience ? inputId("yearsOfExperience-error") : undefined}
                    className={getInputClassName(Boolean(fieldErrors.yearsOfExperience))}
                    placeholder="3"
                  />
                </FormField>

                <FormField id={inputId("linkedInUrl")} label="LinkedIn URL" error={fieldErrors.linkedInUrl} optional>
                  <input
                    id={inputId("linkedInUrl")}
                    name="linkedInUrl"
                    type="url"
                    autoComplete="url"
                    inputMode="url"
                    maxLength={2048}
                    value={formValues.linkedInUrl}
                    onChange={(event) => updateTextField("linkedInUrl", event.target.value)}
                    aria-invalid={Boolean(fieldErrors.linkedInUrl)}
                    aria-describedby={fieldErrors.linkedInUrl ? inputId("linkedInUrl-error") : undefined}
                    className={getInputClassName(Boolean(fieldErrors.linkedInUrl))}
                    placeholder="https://linkedin.com/in/your-name"
                  />
                </FormField>

                <FormField
                  id={inputId("portfolioUrl")}
                  label="Portfolio URL"
                  error={fieldErrors.portfolioUrl}
                  optional
                  className="sm:col-span-2"
                >
                  <input
                    id={inputId("portfolioUrl")}
                    name="portfolioUrl"
                    type="url"
                    autoComplete="url"
                    inputMode="url"
                    maxLength={2048}
                    value={formValues.portfolioUrl}
                    onChange={(event) => updateTextField("portfolioUrl", event.target.value)}
                    aria-invalid={Boolean(fieldErrors.portfolioUrl)}
                    aria-describedby={fieldErrors.portfolioUrl ? inputId("portfolioUrl-error") : undefined}
                    className={getInputClassName(Boolean(fieldErrors.portfolioUrl))}
                    placeholder="https://your-portfolio.com"
                  />
                </FormField>

                <FormField
                  id={inputId("coverLetter")}
                  label="Cover letter or message"
                  error={fieldErrors.coverLetter}
                  required
                  className="sm:col-span-2"
                >
                  <textarea
                    id={inputId("coverLetter")}
                    name="coverLetter"
                    rows={4}
                    maxLength={5000}
                    required
                    aria-required="true"
                    value={formValues.coverLetter}
                    onChange={(event) => updateTextField("coverLetter", event.target.value)}
                    aria-invalid={Boolean(fieldErrors.coverLetter)}
                    aria-describedby={fieldErrors.coverLetter ? inputId("coverLetter-error") : undefined}
                    className={`${getInputClassName(Boolean(fieldErrors.coverLetter))} min-h-28 resize-y rounded-xl py-3 sm:min-h-32`}
                    placeholder="Tell us why you are a good fit for this role..."
                  />
                </FormField>

                <div className="sm:col-span-2">
                  <label htmlFor={inputId("resume")} id={inputId("resume-label")} className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-200 sm:text-sm">
                    Resume <span className="text-brand dark:text-brand">*</span>
                  </label>
                  <input
                    ref={fileInputRef}
                    id={inputId("resume")}
                    name="resume"
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleResumeChange}
                    tabIndex={-1}
                    required
                    aria-required="true"
                    aria-invalid={Boolean(fieldErrors.resume)}
                    aria-describedby={fieldErrors.resume ? inputId("resume-error") : resume ? undefined : inputId("resume-hint")}
                    className="sr-only"
                  />

                  {resume ? (
                    <div className="flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-[#2e3850] dark:bg-[#232b3e] sm:px-4 sm:py-3">
                      <FileText className="size-5 shrink-0 text-brand dark:text-brand" aria-hidden="true" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{resume.name}</p>
                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{formatFileSize(resume.size)}</p>
                      </div>
                      <button
                        ref={resumePickerRef}
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        aria-label="Replace your resume"
                        aria-describedby={fieldErrors.resume ? inputId("resume-error") : undefined}
                        className="shrink-0 rounded-full px-2.5 py-1.5 text-xs font-semibold text-brand transition hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-brand dark:text-brand dark:hover:bg-blue-400/10"
                      >
                        Replace
                      </button>
                      <button
                        type="button"
                        onClick={removeResume}
                        className="shrink-0 rounded-xl p-1.5 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
                        aria-label="Remove selected resume"
                      >
                        <X className="size-4" aria-hidden="true" />
                      </button>
                    </div>
                  ) : (
                    <button
                      ref={resumePickerRef}
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      aria-describedby={fieldErrors.resume ? inputId("resume-error") : inputId("resume-hint")}
                      className={`group flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed p-4 text-center transition focus:outline-none focus:ring-2 focus:ring-brand dark:focus:ring-offset-[#232c3e] sm:p-5 ${
                        fieldErrors.resume
                          ? "border-rose-400 bg-rose-50/50 hover:bg-rose-50 dark:border-rose-400/40 dark:bg-rose-400/5 dark:hover:bg-rose-400/10"
                          : "border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100 dark:border-[#39435b] dark:bg-[#232b3e] dark:hover:border-slate-500 dark:hover:bg-[#273046]"
                      }`}
                    >
                      <div className="flex size-10 items-center justify-center rounded-full bg-blue-100 text-brand transition group-hover:scale-105 dark:bg-blue-400/10 dark:text-brand sm:size-11">
                        <Upload className="size-5 sm:size-6" aria-hidden="true" />
                      </div>
                      <p className="mt-2 text-xs font-semibold text-slate-800 dark:text-slate-200 sm:text-sm">
                        Click to upload resume
                      </p>
                      <p id={inputId("resume-hint")} className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        PDF, DOC, or DOCX up to 5 MB
                      </p>
                    </button>
                  )}

                  {fieldErrors.resume && (
                    <p id={inputId("resume-error")} className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400">
                      {fieldErrors.resume}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <div className="relative flex items-start gap-3">
                    <div className="flex h-6 items-center">
                      <input
                        id={inputId("privacyConsent")}
                        name="privacyConsent"
                        type="checkbox"
                        required
                        aria-required="true"
                        checked={formValues.privacyConsent}
                        onChange={(event) => {
                          const checked = event.target.checked;
                          setFormValues((current) => ({ ...current, privacyConsent: checked }));
                          if (checked) clearError("privacyConsent");
                        }}
                        aria-invalid={Boolean(fieldErrors.privacyConsent)}
                        aria-describedby={fieldErrors.privacyConsent ? inputId("privacyConsent-error") : undefined}
                        className="size-4.5 rounded border-slate-300 text-brand focus:ring-2 focus:ring-brand dark:border-[#39435b] dark:bg-[#232b3e] dark:focus:ring-blue-400"
                      />
                    </div>
                    <label htmlFor={inputId("privacyConsent")} className="text-xs leading-5 text-slate-600 dark:text-slate-300 sm:text-sm sm:leading-6">
                      I agree to allow DevX to store and process my personal data for recruitment purposes. <span className="text-brand dark:text-brand">*</span>
                    </label>
                  </div>
                  {fieldErrors.privacyConsent && (
                    <p id={inputId("privacyConsent-error")} className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400">
                      {fieldErrors.privacyConsent}
                    </p>
                  )}
                </div>

                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formValues.website}
                  onChange={(event) => setFormValues((current) => ({ ...current, website: event.target.value }))}
                  className="hidden"
                  aria-hidden="true"
                />
              </div>

              <div className="mt-6 flex flex-col-reverse justify-end gap-3 border-t border-slate-200 pt-5 dark:border-[#2e3850] sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-200 px-6 text-lg font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-brand disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#39435b] dark:text-slate-200 dark:hover:bg-[#232b3e]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-brand px-7 text-lg font-semibold text-white shadow-lg shadow-brand/20 transition hover:bg-brand focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-[#232c3e]"
                >
                  {isSubmitting ? (
                    <>
                      <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Submit Application</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(dialogContent, document.body);
}
