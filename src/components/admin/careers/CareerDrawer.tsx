"use client";

import { X } from "lucide-react";
import CareerForm from "./CareerForm";

type CareerDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export default function CareerDrawer({
  open,
  onClose,
}: CareerDrawerProps) {
  if (!open) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
      />

      <div className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-2xl flex-col bg-white shadow-2xl transition-all dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-800">
          <div>
            <h2 className="text-2xl font-bold">
              Create Career
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add a new job opening.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <CareerForm />
        </div>
      </div>
    </>
  );
}