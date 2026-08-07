"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import CareerDrawer from "./CareerDrawer";
import CareerFilters from "./CareerFilters";
import CareerStats from "./CareerStats";
import CareerTable from "./CareerTable";

type Career = {
  id: string;
  title: string;
  slug?: string;
  department: string;
  category?: string;
  location: string;
  employmentType?: string;
  workMode?: string;
  experience: string;
  shortDescription?: string;
  overview?: string;
  status: string;
  featured: boolean;
};

type Props = {
  careers: Career[];
};

export default function CareerManagement({ careers }: Props) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);

  const published = careers.filter(
    (career) => career.status === "Published"
  ).length;

  const draft = careers.filter(
    (career) => career.status === "Draft"
  ).length;

  const featured = careers.filter(
    (career) => career.featured
  ).length;

  const handleCreate = () => {
    setSelectedCareer(null);
    setOpen(true);
  };

  const handleEdit = (career: Career) => {
    setSelectedCareer(career);
    setOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Career Management</h1>

          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Manage all career opportunities from one place.
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
        >
          Add Career
        </button>
      </div>

      <CareerStats
        total={careers.length}
        published={published}
        draft={draft}
        featured={featured}
      />

      <CareerFilters />

      <CareerTable
  careers={careers}
  onEdit={handleEdit}
/>

      <CareerDrawer
        open={open}
        mode={selectedCareer ? "edit" : "create"}
        career={selectedCareer}
        onClose={() => setOpen(false)}
        onSuccess={() => {
          router.refresh();
        }}
      />
    </div>
  );
}