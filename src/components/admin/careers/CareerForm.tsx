"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type CareerFormData = {
  title: string;
  slug: string;
  department: string;
  category: string;
  location: string;
  employmentType: string;
  workMode: string;
  experience: string;
  shortDescription: string;
  overview: string;
  status: string;
  featured: boolean;
};

type Props = {
  mode: "create" | "edit";
  career?: Partial<CareerFormData> & { id?: string };
  onClose: () => void;
  onSuccess?: () => void;
};

export default function CareerForm({
  mode,
  career,
  onClose,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);

  const {
  register,
  handleSubmit,
  watch,
  setValue,
  reset,
} = useForm<CareerFormData>({
  defaultValues: {
    title: "",
    slug: "",
    department: "",
    category: "",
    location: "",
    employmentType: "",
    workMode: "",
    experience: "",
    shortDescription: "",
    overview: "",
    status: "Draft",
    featured: false,
  },
});
useEffect(() => {
  if (career) {
    reset({
      title: career.title ?? "",
      slug: career.slug ?? "",
      department: career.department ?? "",
      category: career.category ?? "",
      location: career.location ?? "",
      employmentType: career.employmentType ?? "",
      workMode: career.workMode ?? "",
      experience: career.experience ?? "",
      shortDescription: career.shortDescription ?? "",
      overview: career.overview ?? "",
      status: career.status ?? "Draft",
      featured: career.featured ?? false,
    });
  }
}, [career, reset]);
useEffect(() => {
  if (career) {
    Object.entries(career).forEach(([key, value]) => {
      setValue(key as keyof CareerFormData, value as never);
    });
  }
}, [career, setValue]);

  const title = watch("title");

  useEffect(() => {
    if (mode === "create") {
      setValue(
        "slug",
        title
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
      );
    }
  }, [title, mode, setValue]);

  const onSubmit = async (data: CareerFormData) => {
    try {
      setLoading(true);

      const response = await fetch(
        mode === "create"
          ? "/api/admin/careers"
          : `/api/admin/careers/${career?.id}`,
        {
          method: mode === "create" ? "POST" : "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save career");
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Unable to save career.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : mode === "create"
            ? "Create Career"
            : "Update Career"}
        </button>
      </div>
    </form>
  );
}