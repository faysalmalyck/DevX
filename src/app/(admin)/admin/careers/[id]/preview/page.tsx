import { notFound, redirect } from "next/navigation";
import CareerHero from "@/components/careers/CareerHero";
import CareerOverview from "@/components/careers/CareerOverview";
import CareerDetails from "@/components/careers/Careerrequirement";
import HiringTimeline from "@/components/careers/HiringTimeline";
import { authorizeAdmin } from "@/lib/auth/admin-authorization";
import { toPublicCareer } from "@/lib/careers/types";
import { prisma } from "@/lib/db/prisma";

type PreviewPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CareerPreviewPage({ params }: PreviewPageProps) {
  const authorized = await authorizeAdmin("Careers", "VIEW");
  if (!authorized.ok) {
    redirect("/login?portal=admin&redirect=/admin/careers");
  }

  const { id } = await params;
  const career = await prisma.career.findUnique({ where: { id } });
  if (!career) notFound();

  const previewCareer = toPublicCareer(career);

  return (
    <div className="-m-4 min-h-full bg-white dark:bg-[#181d2b] sm:-m-6 lg:-m-8">
      <CareerHero career={previewCareer} />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-8">
          <div className="space-y-16 lg:col-span-8">
            <CareerOverview career={previewCareer} />
            <CareerDetails career={previewCareer} />
            <HiringTimeline career={previewCareer} />
          </div>
        </div>
      </div>
    </div>
  );
}
