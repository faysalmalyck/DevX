"use client";

import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { getClientCsrfToken } from "@/lib/auth/client-csrf";
import {
  careerCategories,
  careerDepartments,
  careerEmploymentTypes,
  careerExperienceMonths,
  careerExperienceYears,
  careerWorkModes,
  formatCareerExperience,
  parseCareerExperience,
} from "@/lib/careers/constants";
import type { CareerContent } from "@/lib/careers/types";
import { careerStatusLabels } from "@/lib/careers/status";
import {
  careerSchema,
  type CareerFormValues,
} from "@/lib/validations/career";

type CareerFormProps = {
  mode: "create" | "edit";
  career?: CareerContent | null;
  onClose: () => void;
  onSuccess?: () => void;
};

type ListName =
  | "responsibilities"
  | "requirements"
  | "preferredQualifications";

type ApiError = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

const statuses = Object.keys(careerStatusLabels) as CareerFormValues["status"][];

const initialValues: CareerFormValues = {
  title: "",
  slug: "",
  department: "",
  category: "",
  location: "",
  employmentType: "Full time",
  workMode: "",
  experience: "",
  shortDescription: "",
  overview: "",
  responsibilitiesDescription: "",
  responsibilities: [],
  requirementsDescription: "",
  requirements: [],
  preferredQualifications: [],
  hiringProcess: [],
  featured: false,
  displayOrder: 0,
  status: "DRAFT",
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 160);
}

function toFormValues(career?: CareerContent | null): CareerFormValues {
  if (!career) return initialValues;

  return {
    title: career.title,
    slug: career.slug,
    department: career.department,
    category: career.category,
    location: career.location,
    employmentType: career.employmentType,
    workMode: career.workMode,
    experience: career.experience,
    shortDescription: career.shortDescription,
    overview: career.overview,
    responsibilitiesDescription: career.responsibilitiesDescription,
    responsibilities: career.responsibilities,
    requirementsDescription: career.requirementsDescription,
    requirements: career.requirements,
    preferredQualifications: career.preferredQualifications,
    hiringProcess: career.hiringProcess.map(({ title, description }) => ({
      title,
      description,
    })),
    featured: career.featured,
    displayOrder: career.displayOrder,
    status: career.status,
  };
}

function reorderItems<T>(items: T[], index: number, direction: -1 | 1): T[] {
  const destination = index + direction;
  if (destination < 0 || destination >= items.length) return items;

  const next = [...items];
  const current = next[index];
  next[index] = next[destination];
  next[destination] = current;
  return next;
}

function RepeatableList({
  label,
  description,
  values,
  error,
  onChange,
}: {
  label: string;
  description: string;
  values: string[];
  error?: string;
  onChange: (next: string[]) => void;
}) {
  return (
    <fieldset className="space-y-3 rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <legend className="text-base font-semibold text-slate-900 dark:text-white">
            {label}
          </legend>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onChange([...values, ""])}
          className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-brand transition hover:bg-blue-50 dark:border-brand/30 dark:text-brand dark:hover:bg-brand/10"
        >
          <Plus className="h-3.5 w-3.5" />
          Add item
        </button>
      </div>
      {values.length === 0 ? (
        <p className="rounded-xl bg-slate-50 px-3 py-2 text-base text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          No items yet.
        </p>
      ) : null}
      {values.map((value, index) => (
        <div key={`${index}-${value.slice(0, 24)}`} className="flex items-center gap-2">
          <span className="w-6 shrink-0 text-center text-xs font-semibold text-slate-400">
            {index + 1}
          </span>
          <input
            value={value}
            onChange={(event) => {
              const next = [...values];
              next[index] = event.target.value;
              onChange(next);
            }}
            aria-label={`${label} item ${index + 1}`}
            className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 outline-none transition focus:border-brand dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
          <button
            type="button"
            onClick={() => onChange(reorderItems(values, index, -1))}
            disabled={index === 0}
            aria-label={`Move ${label} item ${index + 1} up`}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onChange(reorderItems(values, index, 1))}
            disabled={index === values.length - 1}
            aria-label={`Move ${label} item ${index + 1} down`}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onChange(values.filter((_, itemIndex) => itemIndex !== index))}
            aria-label={`Remove ${label} item ${index + 1}`}
            className="rounded-lg p-2 text-rose-600 transition hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-500/10"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      {error ? <p className="text-base text-rose-600 dark:text-rose-300">{error}</p> : null}
    </fieldset>
  );
}

function fieldError(error?: { message?: string }): string | undefined {
  return error?.message;
}

function hasOption(options: readonly string[], value: string): boolean {
  return options.includes(value);
}

export default function CareerForm({
  mode,
  career,
  onClose,
  onSuccess,
}: CareerFormProps) {
  const [loading, setLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [slugEdited, setSlugEdited] = useState(mode === "edit");
  const [experienceYears, setExperienceYears] = useState("");
  const [experienceMonths, setExperienceMonths] = useState("0");
  const [legacyExperience, setLegacyExperience] = useState<string | null>(null);
  const {
    control,
    register,
    handleSubmit,
    watch,
    setError,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CareerFormValues>({
    resolver: zodResolver(careerSchema),
    defaultValues: toFormValues(career),
  });
  const hiringProcess = useFieldArray({ control, name: "hiringProcess" });
  const title = watch("title");
  const category = watch("category");
  const department = watch("department");
  const employmentType = watch("employmentType");
  const workMode = watch("workMode");
  const responsibilities = watch("responsibilities");
  const requirements = watch("requirements");
  const preferredQualifications = watch("preferredQualifications");

  useEffect(() => {
    const values = toFormValues(career);
    const parsedExperience = parseCareerExperience(values.experience);

    reset(values);
    setExperienceYears(parsedExperience ? String(parsedExperience.years) : "");
    setExperienceMonths(parsedExperience ? String(parsedExperience.months) : "0");
    setLegacyExperience(parsedExperience || !values.experience ? null : values.experience);
    setSlugEdited(mode === "edit");
    setSaveError(null);
  }, [career, mode, reset]);

  useEffect(() => {
    if (!slugEdited) {
      setValue("slug", slugify(title), { shouldValidate: true });
    }
  }, [slugEdited, setValue, title]);

  const setList = (name: ListName, values: string[]) => {
    setValue(name, values, { shouldDirty: true, shouldValidate: true });
  };

  const updateExperience = (years: string, months: string) => {
    setExperienceYears(years);
    setExperienceMonths(months);
    setLegacyExperience(null);

    if (!years) {
      setValue("experience", "", { shouldDirty: true, shouldValidate: true });
      return;
    }

    setValue(
      "experience",
      formatCareerExperience({ years: Number(years), months: Number(months) }),
      { shouldDirty: true, shouldValidate: true },
    );
  };

  const applyFieldErrors = (response: ApiError) => {
    const validFields = new Set<keyof CareerFormValues>([
      "title",
      "slug",
      "department",
      "category",
      "location",
      "employmentType",
      "workMode",
      "experience",
      "shortDescription",
      "overview",
      "responsibilitiesDescription",
      "responsibilities",
      "requirementsDescription",
      "requirements",
      "preferredQualifications",
      "hiringProcess",
      "featured",
      "displayOrder",
      "status",
    ]);

    for (const [field, messages] of Object.entries(response.fieldErrors ?? {})) {
      if (validFields.has(field as keyof CareerFormValues) && messages[0]) {
        setError(field as keyof CareerFormValues, { message: messages[0] });
      }
    }
  };

  const ensureCsrfToken = async (): Promise<string | undefined> => {
    let token = getClientCsrfToken();
    if (token) return token;

    await fetch("/api/auth/csrf", { credentials: "same-origin" });
    token = getClientCsrfToken();
    return token;
  };

  const submit = async (data: CareerFormValues) => {
    setLoading(true);
    setSaveError(null);

    try {
      const csrfToken = await ensureCsrfToken();
      if (!csrfToken) {
        setSaveError("Your session security token could not be created. Please try again.");
        return;
      }

      const response = await fetch(
        mode === "create"
          ? "/api/admin/careers"
          : `/api/admin/careers/${career?.id ?? ""}`,
        {
          method: mode === "create" ? "POST" : "PATCH",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": csrfToken,
          },
          credentials: "same-origin",
          body: JSON.stringify(data),
        }
      );

      const responseData: unknown = await response.json().catch(() => ({}));
      const apiError =
        typeof responseData === "object" && responseData !== null
          ? (responseData as ApiError)
          : {};

      if (!response.ok) {
        applyFieldErrors(apiError);
        setSaveError(apiError.error ?? "Unable to save this job right now.");
        return;
      }

      onSuccess?.();
      onClose();
    } catch {
      setSaveError("Unable to save this job right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-brand dark:border-slate-700 dark:bg-slate-800 dark:text-white";

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6" noValidate>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="text-base font-semibold text-slate-700 dark:text-white md:col-span-2">
          Job title
          <input {...register("title")} className={inputClass} autoFocus />
          {fieldError(errors.title) ? <span className="mt-1 block text-xs text-rose-600 dark:text-rose-300">{fieldError(errors.title)}</span> : null}
        </label>
        <label className="text-base font-semibold text-slate-700 dark:text-white">
          Slug
          <input
            {...register("slug", {
              onChange: () => setSlugEdited(true),
            })}
            className={inputClass}
          />
          {fieldError(errors.slug) ? <span className="mt-1 block text-xs text-rose-600 dark:text-rose-300">{fieldError(errors.slug)}</span> : null}
        </label>
        <label className="text-base font-semibold text-slate-700 dark:text-white">
          Category
          <select {...register("category")} className={inputClass}>
            <option value="" disabled>
              Select a category
            </option>
            {!hasOption(careerCategories, category) && category ? (
              <option value={category}>Current: {category}</option>
            ) : null}
            {careerCategories.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {fieldError(errors.category) ? <span className="mt-1 block text-xs text-rose-600 dark:text-rose-300">{fieldError(errors.category)}</span> : null}
        </label>
        <label className="text-base font-semibold text-slate-700 dark:text-white">
          Department
          <select {...register("department")} className={inputClass}>
            <option value="" disabled>
              Select a department
            </option>
            {!hasOption(careerDepartments, department) && department ? (
              <option value={department}>Current: {department}</option>
            ) : null}
            {careerDepartments.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {fieldError(errors.department) ? <span className="mt-1 block text-xs text-rose-600 dark:text-rose-300">{fieldError(errors.department)}</span> : null}
        </label>
        <label className="text-base font-semibold text-slate-700 dark:text-white">
          Location
          <input {...register("location")} className={inputClass} />
          {fieldError(errors.location) ? <span className="mt-1 block text-xs text-rose-600 dark:text-rose-300">{fieldError(errors.location)}</span> : null}
        </label>
        <label className="text-base font-semibold text-slate-700 dark:text-white">
          Employment type
          <select {...register("employmentType")} className={inputClass}>
            {!hasOption(careerEmploymentTypes, employmentType) && employmentType ? (
              <option value={employmentType}>Current: {employmentType}</option>
            ) : null}
            {careerEmploymentTypes.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {fieldError(errors.employmentType) ? <span className="mt-1 block text-xs text-rose-600 dark:text-rose-300">{fieldError(errors.employmentType)}</span> : null}
        </label>
        <label className="text-base font-semibold text-slate-700 dark:text-white">
          Work mode
          <select {...register("workMode")} className={inputClass}>
            <option value="" disabled>
              Select a work mode
            </option>
            {!hasOption(careerWorkModes, workMode) && workMode ? (
              <option value={workMode}>Current: {workMode}</option>
            ) : null}
            {careerWorkModes.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {fieldError(errors.workMode) ? <span className="mt-1 block text-xs text-rose-600 dark:text-rose-300">{fieldError(errors.workMode)}</span> : null}
        </label>
        <fieldset className="text-base font-semibold text-slate-700 dark:text-white">
          Experience
          <div className="mt-2 grid grid-cols-2 gap-3">
            <label>
              <span className="text-xs text-slate-500 dark:text-slate-400">Years</span>
              <select
                aria-label="Experience years"
                value={experienceYears}
                onChange={(event) => updateExperience(event.target.value, experienceMonths)}
                className={inputClass}
              >
                <option value="" disabled>
                  Select years
                </option>
                {careerExperienceYears.map((year) => (
                  <option key={year} value={year}>
                    {year} {year === 1 ? "year" : "years"}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="text-xs text-slate-500 dark:text-slate-400">Months</span>
              <select
                aria-label="Experience months"
                value={experienceMonths}
                onChange={(event) => updateExperience(experienceYears, event.target.value)}
                className={inputClass}
              >
                {careerExperienceMonths.map((month) => (
                  <option key={month} value={month}>
                    {month} {month === 1 ? "month" : "months"}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <input type="hidden" {...register("experience")} />
          {legacyExperience ? (
            <p className="mt-2 text-xs text-amber-700 dark:text-amber-300">
              Current experience: {legacyExperience}. Choose years or months to replace it.
            </p>
          ) : null}
          {fieldError(errors.experience) ? <span className="mt-1 block text-xs text-rose-600 dark:text-rose-300">{fieldError(errors.experience)}</span> : null}
        </fieldset>
        <label className="text-base font-semibold text-slate-700 dark:text-white">
          Display order
          <input
            type="number"
            min={0}
            {...register("displayOrder", { valueAsNumber: true })}
            className={inputClass}
          />
          {fieldError(errors.displayOrder) ? <span className="mt-1 block text-xs text-rose-600 dark:text-rose-300">{fieldError(errors.displayOrder)}</span> : null}
        </label>
      </div>

      <label className="block text-base font-semibold text-slate-700 dark:text-white">
        Card description
        <textarea {...register("shortDescription")} rows={3} className={inputClass} />
        {fieldError(errors.shortDescription) ? <span className="mt-1 block text-xs text-rose-600 dark:text-rose-300">{fieldError(errors.shortDescription)}</span> : null}
      </label>

      <fieldset className="grid gap-5 rounded-2xl border border-slate-200 p-4 md:grid-cols-[1fr_auto] md:items-end dark:border-slate-700">
        <label className="text-base font-semibold text-slate-700 dark:text-white">
          Status
          <select {...register("status")} className={inputClass}>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {careerStatusLabels[status]}
              </option>
            ))}
          </select>
        </label>
        <label className="flex min-h-[50px] items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-base font-semibold text-slate-700 dark:bg-slate-800 dark:text-white">
          <input type="checkbox" {...register("featured")} className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand" />
          Feature this job
        </label>
      </fieldset>

      <section className="space-y-4 rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Job description</h3>
        <label className="block text-base font-semibold text-slate-700 dark:text-white">
          Description paragraph
          <textarea {...register("overview")} rows={5} className={inputClass} />
          {fieldError(errors.overview) ? <span className="mt-1 block text-xs text-rose-600 dark:text-rose-300">{fieldError(errors.overview)}</span> : null}
        </label>
        <label className="block text-base font-semibold text-slate-700 dark:text-white">
          Supporting paragraph
          <textarea {...register("responsibilitiesDescription")} rows={3} className={inputClass} />
          {fieldError(errors.responsibilitiesDescription) ? <span className="mt-1 block text-xs text-rose-600 dark:text-rose-300">{fieldError(errors.responsibilitiesDescription)}</span> : null}
        </label>
        <RepeatableList
          label="Description bullet points"
          description="These appear below the job-description paragraphs."
          values={responsibilities}
          onChange={(values) => setList("responsibilities", values)}
          error={fieldError(errors.responsibilities)}
        />
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Job requirements</h3>
        <label className="block text-base font-semibold text-slate-700 dark:text-white">
          Requirements paragraph
          <textarea {...register("requirementsDescription")} rows={3} className={inputClass} />
          {fieldError(errors.requirementsDescription) ? <span className="mt-1 block text-xs text-rose-600 dark:text-rose-300">{fieldError(errors.requirementsDescription)}</span> : null}
        </label>
        <RepeatableList
          label="Requirement bullet points"
          description="Add, edit, remove, or reorder the existing requirement bullets."
          values={requirements}
          onChange={(values) => setList("requirements", values)}
          error={fieldError(errors.requirements)}
        />
        <RepeatableList
          label="Preferred qualification bullet points"
          description="These display only when at least one qualification is supplied."
          values={preferredQualifications}
          onChange={(values) => setList("preferredQualifications", values)}
          error={fieldError(errors.preferredQualifications)}
        />
      </section>

      <fieldset className="space-y-4 rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <legend className="text-base font-bold text-slate-900 dark:text-white">Our hiring process</legend>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Reorder steps to control their public sequence.</p>
          </div>
          <button
            type="button"
            onClick={() => hiringProcess.append({ title: "", description: "" })}
            className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-brand transition hover:bg-blue-50 dark:border-brand/30 dark:text-brand dark:hover:bg-brand/10"
          >
            <Plus className="h-3.5 w-3.5" />
            Add step
          </button>
        </div>
        {hiringProcess.fields.length === 0 ? (
          <p className="rounded-xl bg-slate-50 px-3 py-2 text-base text-slate-500 dark:bg-slate-800 dark:text-slate-400">No hiring process steps yet.</p>
        ) : null}
        {hiringProcess.fields.map((field, index) => (
          <div key={field.id} className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-base font-semibold text-slate-700 dark:text-white">Step {index + 1}</p>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => hiringProcess.move(index, index - 1)} disabled={index === 0} aria-label={`Move step ${index + 1} up`} className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 disabled:opacity-30 dark:text-slate-400 dark:hover:bg-slate-800"><ChevronUp className="h-4 w-4" /></button>
                <button type="button" onClick={() => hiringProcess.move(index, index + 1)} disabled={index === hiringProcess.fields.length - 1} aria-label={`Move step ${index + 1} down`} className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 disabled:opacity-30 dark:text-slate-400 dark:hover:bg-slate-800"><ChevronDown className="h-4 w-4" /></button>
                <button type="button" onClick={() => hiringProcess.remove(index)} aria-label={`Remove step ${index + 1}`} className="rounded-lg p-2 text-rose-600 transition hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-500/10"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="text-base font-semibold text-slate-700 dark:text-white">Title<input {...register(`hiringProcess.${index}.title`)} className={inputClass} /></label>
              <label className="text-base font-semibold text-slate-700 dark:text-white">Description<textarea {...register(`hiringProcess.${index}.description`)} rows={3} className={inputClass} /></label>
            </div>
          </div>
        ))}
        {fieldError(errors.hiringProcess) ? <p className="text-base text-rose-600 dark:text-rose-300">{fieldError(errors.hiringProcess)}</p> : null}
      </fieldset>

      {saveError ? <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-base text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300">{saveError}</p> : null}

      <div className="flex justify-end gap-3 border-t border-slate-200 pt-5 dark:border-slate-800">
        <button type="button" onClick={onClose} disabled={loading} className="rounded-xl border border-slate-300 px-5 py-3 text-base font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800">Cancel</button>
        <button type="submit" disabled={loading} className="rounded-xl bg-brand px-6 py-3 text-base font-semibold text-white transition hover:bg-brand disabled:cursor-wait disabled:opacity-50">{loading ? "Saving…" : mode === "create" ? "Create job" : "Save changes"}</button>
      </div>
    </form>
  );
}
