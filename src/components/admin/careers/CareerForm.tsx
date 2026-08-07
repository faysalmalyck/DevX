"use client";

import { useForm } from "react-hook-form";

export default function CareerForm() {
  const { register } = useForm();

  return (
    <form className="space-y-6">
      <div>
        <label className="mb-2 block text-sm font-medium">
          Job Title
        </label>

        <input
          {...register("title")}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Slug
        </label>

        <input
          {...register("slug")}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Department
          </label>

          <input
            {...register("department")}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Category
          </label>

          <input
            {...register("category")}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
          />
        </div>
      </div>

      <button
        type="submit"
        className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
      >
        Save Career
      </button>
    </form>
  );
}
