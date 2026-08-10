"use client";

import Link from "next/link";
import {
  Archive,
  Copy,
  Eye,
  Pencil,
  RotateCcw,
  Send,
  Star,
  Trash2,
  XCircle,
} from "lucide-react";
import type { CareerStatus } from "@prisma/client";
import type { CareerContent } from "@/lib/careers/types";
import StatusBadge from "./StatusBadge";
import FeaturedBadge from "./FeaturedBadge";

type CareerTableProps = {
  careers: CareerContent[];
  busyId?: string | null;
  onEdit: (career: CareerContent) => void;
  onDelete: (career: CareerContent) => void;
  onDuplicate: (career: CareerContent) => void;
  onStatus: (career: CareerContent, status: CareerStatus) => void;
  onFeature: (career: CareerContent) => void;
  onOrder: (career: CareerContent, displayOrder: number) => void;
};

function ActionButton({
  label,
  onClick,
  disabled,
  children,
  tone = "default",
}: {
  label: string;
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
  tone?: "default" | "danger" | "primary";
}) {
  const color =
    tone === "danger"
      ? "text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-300 dark:hover:bg-rose-500/10"
      : tone === "primary"
        ? "text-brand hover:bg-blue-50 hover:text-brand dark:text-brand dark:hover:bg-brand/10"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={`rounded-lg p-2 transition disabled:cursor-wait disabled:opacity-45 ${color}`}
    >
      {children}
    </button>
  );
}

function StatusActions({
  career,
  disabled,
  onStatus,
}: {
  career: CareerContent;
  disabled: boolean;
  onStatus: (status: CareerStatus) => void;
}) {
  switch (career.status) {
    case "DRAFT":
      return (
        <>
          <ActionButton label="Publish job" onClick={() => onStatus("PUBLISHED")} disabled={disabled} tone="primary"><Send className="h-4 w-4" /></ActionButton>
          <ActionButton label="Archive job" onClick={() => onStatus("ARCHIVED")} disabled={disabled}><Archive className="h-4 w-4" /></ActionButton>
        </>
      );
    case "PUBLISHED":
      return (
        <>
          <ActionButton label="Return job to draft" onClick={() => onStatus("DRAFT")} disabled={disabled}><RotateCcw className="h-4 w-4" /></ActionButton>
          <ActionButton label="Mark job as closed" onClick={() => onStatus("CLOSED")} disabled={disabled} tone="danger"><XCircle className="h-4 w-4" /></ActionButton>
          <ActionButton label="Archive job" onClick={() => onStatus("ARCHIVED")} disabled={disabled}><Archive className="h-4 w-4" /></ActionButton>
        </>
      );
    case "CLOSED":
      return (
        <>
          <ActionButton label="Return job to draft" onClick={() => onStatus("DRAFT")} disabled={disabled}><RotateCcw className="h-4 w-4" /></ActionButton>
          <ActionButton label="Archive job" onClick={() => onStatus("ARCHIVED")} disabled={disabled}><Archive className="h-4 w-4" /></ActionButton>
        </>
      );
    case "ARCHIVED":
      return <ActionButton label="Return job to draft" onClick={() => onStatus("DRAFT")} disabled={disabled}><RotateCcw className="h-4 w-4" /></ActionButton>;
  }
}

export default function CareerTable({
  careers,
  busyId,
  onEdit,
  onDelete,
  onDuplicate,
  onStatus,
  onFeature,
  onOrder,
}: CareerTableProps) {
  if (careers.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">No jobs found</h3>
        <p className="mt-2 text-slate-500 dark:text-slate-400">Adjust your filters or add a new job.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">Position</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Category</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Location</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Experience</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
              <th className="px-6 py-4 text-center text-sm font-semibold">Featured</th>
              <th className="px-6 py-4 text-center text-sm font-semibold">Order</th>
              <th className="px-6 py-4 text-right text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {careers.map((career) => {
              const busy = busyId === career.id;
              return (
                <tr key={career.id} className="border-t border-slate-200 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900 dark:text-white">{career.title}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{career.category}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{career.location}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{career.experience}</td>
                  <td className="px-6 py-4"><StatusBadge status={career.status} /></td>
                  <td className="px-6 py-4 text-center"><FeaturedBadge featured={career.featured} /></td>
                  <td className="px-6 py-4 text-center">
                    <input
                      type="number"
                      min={0}
                      defaultValue={career.displayOrder}
                      disabled={busy}
                      aria-label={`Display order for ${career.title}`}
                      onBlur={(event) => {
                        const nextOrder = Number(event.target.value);
                        if (Number.isInteger(nextOrder) && nextOrder >= 0 && nextOrder !== career.displayOrder) {
                          onOrder(career, nextOrder);
                        } else {
                          event.target.value = String(career.displayOrder);
                        }
                      }}
                      className="w-16 rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-center text-sm outline-none focus:border-brand disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex min-w-max justify-end gap-1">
                      <Link href={`/admin/careers/${career.id}/preview`} title="Preview job" aria-label={`Preview ${career.title}`} className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"><Eye className="h-4 w-4" /></Link>
                      <ActionButton label="Edit job" onClick={() => onEdit(career)} disabled={busy} tone="primary"><Pencil className="h-4 w-4" /></ActionButton>
                      <ActionButton label={career.featured ? "Unfeature job" : "Feature job"} onClick={() => onFeature(career)} disabled={busy} tone="primary"><Star className={`h-4 w-4 ${career.featured ? "fill-current" : ""}`} /></ActionButton>
                      <ActionButton label="Duplicate job" onClick={() => onDuplicate(career)} disabled={busy}><Copy className="h-4 w-4" /></ActionButton>
                      <StatusActions career={career} disabled={busy} onStatus={(status) => onStatus(career, status)} />
                      <ActionButton label="Delete job" onClick={() => onDelete(career)} disabled={busy} tone="danger"><Trash2 className="h-4 w-4" /></ActionButton>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
