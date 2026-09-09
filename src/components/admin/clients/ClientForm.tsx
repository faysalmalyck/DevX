"use client";

import { useState, type FormEvent } from "react";
import type { ClientRecord } from "@/lib/validation/client";
import { slugify, validateClient } from "@/lib/validation/client";
import ClientLogoUploader from "./ClientLogoUploader";
import ClientPreview from "./ClientPreview";

export default function ClientForm({
  client,
  clients,
  onClose,
  onSave,
}: {
  client: ClientRecord;
  clients: ClientRecord[];
  onClose: () => void;
  onSave: (client: ClientRecord) => void;
}) {
  const [value, setValue] = useState(client);
  const [errors, setErrors] = useState<Partial<Record<keyof ClientRecord, string>>>({});

  const field = (key: keyof ClientRecord, label: string, type = "text") => (
    <label className="block text-sm font-semibold text-slate-700 dark:text-[#c9d0e1]">
      {label}
      <input
        type={type}
        value={String(value[key] ?? "")}
        onChange={(e) =>
          setValue({
            ...value,
            [key]: type === "number" ? Number(e.target.value) : e.target.value,
            ...(key === "companyName" ? { slug: slugify(e.target.value) } : {}),
          })
        }
        className="mt-1.5 consultation-input"
      />
      {errors[key] && <span className="mt-1 block text-xs text-rose-500">{errors[key]}</span>}
    </label>
  );

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const next = { ...value, updatedAt: new Date().toISOString() };
    const nextErrors = validateClient(next, clients);
    setErrors(nextErrors);
    if (!Object.keys(nextErrors).length) onSave(next);
  };

  return (
    <div className="fixed inset-0 z-[70] flex justify-end bg-slate-950/50 backdrop-blur-sm">
      <form
        onSubmit={submit}
        className="cart-skin-box h-full w-full max-w-4xl overflow-y-auto border-l p-6 shadow-2xl transition-colors duration-300 sm:p-8"
      >
        <div className="mb-7 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              {clients.some((item) => item.id === value.id) ? "Edit client" : "Add client"}
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-[#c9d0e1]">
              Changes appear on the public Work page.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="consultation-secondary-btn px-4 py-2 text-sm"
          >
            Close
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_250px]">
          <div className="grid gap-5 sm:grid-cols-2">
            {field("companyName", "Company name *")}
            {field("website", "Website URL *", "url")}
            <div className="sm:col-span-2">
              <ClientLogoUploader
                value={value.logo}
                onChange={(logo) => setValue({ ...value, logo })}
                error={errors.logo}
              />
            </div>
            <label className="sm:col-span-2 text-sm font-semibold text-slate-700 dark:text-[#c9d0e1]">
              Short description
              <textarea
                value={value.description}
                onChange={(e) => setValue({ ...value, description: e.target.value })}
                rows={3}
                className="mt-1.5 consultation-textarea"
              />
            </label>
            {field("industry", "Industry")}
            {field("country", "Country")}
            {field("displayOrder", "Display order", "number")}
            <label className="block text-sm font-semibold text-slate-700 dark:text-[#c9d0e1]">
              Status
              <select
                value={value.status}
                onChange={(e) =>
                  setValue({ ...value, status: e.target.value as ClientRecord["status"] })
                }
                className="mt-1.5 consultation-select"
              >
                <option value="ACTIVE">Active</option>
                <option value="HIDDEN">Hidden</option>
              </select>
            </label>
            <label className="flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-[#c9d0e1]">
              <input
                type="checkbox"
                checked={value.featured}
                onChange={(e) => setValue({ ...value, featured: e.target.checked })}
                className="h-4 w-4 rounded accent-brand"
              />
              Featured client
            </label>
            <label className="flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-[#c9d0e1]">
              <input
                type="checkbox"
                checked={value.openInNewTab}
                onChange={(e) => setValue({ ...value, openInNewTab: e.target.checked })}
                className="h-4 w-4 rounded accent-brand"
              />
              Open website in new tab
            </label>
          </div>

          <ClientPreview client={value} />
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="consultation-secondary-btn px-6 py-2.5 text-sm"
          >
            Cancel
          </button>
          <button type="submit" className="consultation-primary-btn px-7 py-2.5 text-sm">
            Save client
          </button>
        </div>
      </form>
    </div>
  );
}
