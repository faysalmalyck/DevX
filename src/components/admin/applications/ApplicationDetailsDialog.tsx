"use client";

import {
  Download,
  ExternalLink,
  FileText,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";

import ApplicationStatusBadge from "./ApplicationStatusBadge";
import { getAdminCsrfHeaders } from "./csrf";
import {
  APPLICATION_STATUS_VALUES,
  formatApplicationStatus,
  isApplicationStatus,
  type ApplicationDetail,
  type ApplicationStatusValue,
} from "./types";

interface ApplicationDetailsDialogProps {
  applicationId: string | null;
  onClose: () => void;
  onSaved: (application: ApplicationDetail) => void;
}

function resumeHref(applicationId: string): string {
  return `/api/admin/applications/${encodeURIComponent(applicationId)}/resume`;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function safeExternalUrl(value: string | null): string | null {
  if (!value) return null;

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

function responseError(payload: unknown, fallback: string): string {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "error" in payload &&
    typeof payload.error === "string"
  ) {
    return payload.error;
  }

  return fallback;
}

function applicationFromPayload(value: unknown): ApplicationDetail | null {
  if (
    typeof value !== "object" ||
    value === null ||
    !("application" in value) ||
    typeof value.application !== "object" ||
    value.application === null
  ) {
    return null;
  }

  const application = value.application;
  if (
    !("id" in application) ||
    typeof application.id !== "string" ||
    !("status" in application) ||
    typeof application.status !== "string" ||
    !isApplicationStatus(application.status)
  ) {
    return null;
  }

  return application as ApplicationDetail;
}

export default function ApplicationDetailsDialog({
  applicationId,
  onClose,
  onSaved,
}: ApplicationDetailsDialogProps) {
  const [application, setApplication] = useState<ApplicationDetail | null>(null);
  const [status, setStatus] = useState<ApplicationStatusValue>("NEW");
  const [internalNotes, setInternalNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const fetchApplication = useCallback(async (id: string, signal: AbortSignal) => {
    setLoading(true);
    setError(null);
    setApplication(null);

    try {
      const response = await fetch(
        `/api/admin/applications/${encodeURIComponent(id)}`,
        { signal, cache: "no-store" }
      );
      const payload: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(responseError(payload, "Unable to load this application."));
      }

      const nextApplication = applicationFromPayload(payload);
      if (!nextApplication) {
        throw new Error("Unable to load this application.");
      }

      setApplication(nextApplication);
      setStatus(nextApplication.status);
      setInternalNotes(nextApplication.internalNotes ?? "");
    } catch (loadError) {
      if (loadError instanceof DOMException && loadError.name === "AbortError") {
        return;
      }

      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load this application."
      );
    } finally {
      if (!signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (!applicationId) return;

    const controller = new AbortController();
    void fetchApplication(applicationId, controller.signal);

    return () => controller.abort();
  }, [applicationId, fetchApplication]);

  useEffect(() => {
    if (!applicationId) return;

    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea:not([disabled]), select:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      const focusable = Array.from(focusableElements).filter(
        (element) => !element.hasAttribute("hidden")
      );

      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

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
      previouslyFocused?.focus();
    };
  }, [applicationId, onClose]);

  const handleStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
    if (isApplicationStatus(event.target.value)) {
      setStatus(event.target.value);
    }
  };

  const saveChanges = async () => {
    if (!application || saving) return;

    setSaving(true);
    setError(null);

    try {
      const csrfHeaders = await getAdminCsrfHeaders();
      const response = await fetch(
        `/api/admin/applications/${encodeURIComponent(application.id)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...csrfHeaders,
          },
          body: JSON.stringify({
            status,
            internalNotes: internalNotes.trim() || null,
          }),
        }
      );
      const payload: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(responseError(payload, "Unable to save changes."));
      }

      const updatedApplication = applicationFromPayload(payload);
      if (!updatedApplication) {
        throw new Error("Unable to save changes.");
      }

      setApplication(updatedApplication);
      setStatus(updatedApplication.status);
      setInternalNotes(updatedApplication.internalNotes ?? "");
      onSaved(updatedApplication);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save changes."
      );
    } finally {
      setSaving(false);
    }
  };

  if (!applicationId) return null;

  const linkedInUrl = application ? safeExternalUrl(application.linkedinUrl) : null;
  const portfolioUrl = application ? safeExternalUrl(application.portfolioUrl) : null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Close application details"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="application-details-title"
        className="relative flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-t-3xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#111827] sm:max-h-[90vh] sm:rounded-3xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-5 dark:border-white/10 sm:px-7">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand dark:text-brand">
              Candidate application
            </p>
            <h2
              id="application-details-title"
              className="mt-1 truncate text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl"
            >
              {application?.fullName ?? "Loading application"}
            </h2>
            {application && (
              <p className="mt-1 text-base text-slate-500 dark:text-zinc-400">
                {application.career.title}
              </p>
            )}
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white"
            aria-label="Close application details"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="min-h-0 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
          {loading && (
            <div className="flex min-h-72 items-center justify-center">
              <Loader2 className="h-7 w-7 animate-spin text-brand dark:text-brand" />
            </div>
          )}

          {error && !application && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-base font-medium text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300">
              {error}
            </div>
          )}

          {application && (
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="space-y-6">
                <section className="rounded-2xl border border-slate-200 p-5 dark:border-white/10 dark:bg-white/[0.02]">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-bold text-slate-900 dark:text-white">
                      Candidate details
                    </h3>
                    <ApplicationStatusBadge status={application.status} />
                  </div>
                  <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                    <DetailItem icon={Mail} label="Email" value={application.email} />
                    <DetailItem icon={Phone} label="Phone" value={application.phone} />
                    <DetailItem
                      icon={MapPin}
                      label="Current location"
                      value={application.currentLocation}
                    />
                    <DetailItem
                      icon={UserRound}
                      label="Experience"
                      value={`${application.yearsOfExperience} years`}
                    />
                  </dl>
                </section>

                <section className="rounded-2xl border border-slate-200 p-5 dark:border-white/10 dark:bg-white/[0.02]">
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    Resume and links
                  </h3>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-brand dark:bg-brand/10 dark:text-brand">
                        <FileText className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-base font-bold text-slate-900 dark:text-white">
                          {application.resumeOriginalFilename}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500 dark:text-zinc-500">
                          {application.resumeMimeType} · {formatFileSize(application.resumeSize)}
                        </p>
                      </div>
                    </div>
                    <a
                      href={resumeHref(application.id)}
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-base font-bold text-brand transition hover:bg-blue-100 dark:border-brand/20 dark:bg-brand/10 dark:text-brand dark:hover:bg-brand/20"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </a>
                  </div>
                  {(linkedInUrl || portfolioUrl) && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {linkedInUrl && (
                        <a
                          href={linkedInUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-base font-semibold text-brand transition hover:bg-blue-50 dark:text-brand dark:hover:bg-brand/10"
                        >
                          LinkedIn <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                      {portfolioUrl && (
                        <a
                          href={portfolioUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-base font-semibold text-brand transition hover:bg-blue-50 dark:text-brand dark:hover:bg-brand/10"
                        >
                          Portfolio <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  )}
                </section>

                <section className="rounded-2xl border border-slate-200 p-5 dark:border-white/10 dark:bg-white/[0.02]">
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    Cover letter
                  </h3>
                  <p className="mt-3 whitespace-pre-wrap break-words text-base leading-6 text-slate-700 dark:text-zinc-300">
                    {application.coverLetter}
                  </p>
                </section>

                <p className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-zinc-500">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  {application.consentConfirmed
                    ? "Privacy consent confirmed at submission."
                    : "Privacy consent was not recorded."}
                </p>
              </div>

              <aside className="h-fit rounded-2xl border border-slate-200 p-5 dark:border-white/10 dark:bg-white/[0.02]">
                <h3 className="font-bold text-slate-900 dark:text-white">
                  Application review
                </h3>
                <label className="mt-5 block text-base font-semibold text-slate-700 dark:text-zinc-300">
                  Application status
                  <select
                    value={status}
                    onChange={handleStatusChange}
                    disabled={saving}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-base font-medium text-slate-800 outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-200"
                  >
                    {APPLICATION_STATUS_VALUES.map((statusValue) => (
                      <option key={statusValue} value={statusValue}>
                        {formatApplicationStatus(statusValue)}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="mt-5 block text-base font-semibold text-slate-700 dark:text-zinc-300">
                  Internal notes
                  <textarea
                    value={internalNotes}
                    onChange={(event) => setInternalNotes(event.target.value)}
                    disabled={saving}
                    maxLength={10000}
                    rows={8}
                    placeholder="Visible only to administrators..."
                    className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-base leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-4 focus:ring-brand/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-200 dark:placeholder:text-zinc-600"
                  />
                  <span className="mt-1 block text-right text-xs font-medium text-slate-400 dark:text-zinc-600">
                    {internalNotes.length}/10,000
                  </span>
                </label>

                {error && (
                  <p
                    role="alert"
                    className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-base font-medium text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300"
                  >
                    {error}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => void saveChanges()}
                  disabled={saving}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-base font-bold text-white shadow-sm transition hover:bg-brand disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {saving ? "Saving..." : "Save review"}
                </button>
              </aside>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-zinc-500">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </dt>
      <dd className="mt-1 break-words text-base font-medium text-slate-800 dark:text-zinc-200">
        {value}
      </dd>
    </div>
  );
}
