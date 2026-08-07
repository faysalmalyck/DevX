import { CareerStatus, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { authorizeAdmin, hasValidAdminCsrf } from "@/lib/auth/admin-authorization";
import { prisma } from "@/lib/db/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

async function getAvailableCopySlug(slug: string): Promise<string> {
  const base = `${slug}-copy`.slice(0, 154);
  let candidate = base;
  let suffix = 2;

  while (await prisma.career.findUnique({ where: { slug: candidate } })) {
    candidate = `${base.slice(0, 160 - String(suffix).length - 1)}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  const authorized = await authorizeAdmin("Careers", "CREATE");
  if (!authorized.ok) {
    return NextResponse.json({ error: "Access denied." }, { status: authorized.status });
  }

  if (!hasValidAdminCsrf(request)) {
    return NextResponse.json({ error: "Invalid request token." }, { status: 403 });
  }

  try {
    const { id } = await params;
    const source = await prisma.career.findUnique({ where: { id } });
    if (!source) {
      return NextResponse.json({ error: "Job not found." }, { status: 404 });
    }

    const [slug, highestOrder] = await Promise.all([
      getAvailableCopySlug(source.slug),
      prisma.career.aggregate({ _max: { displayOrder: true } }),
    ]);

    const career = await prisma.career.create({
      data: {
        title: `${source.title} (Copy)`,
        slug,
        department: source.department,
        category: source.category,
        location: source.location,
        employmentType: source.employmentType,
        workMode: source.workMode,
        experience: source.experience,
        shortDescription: source.shortDescription,
        overview: source.overview,
        responsibilitiesDescription: source.responsibilitiesDescription,
        responsibilities: source.responsibilities as Prisma.InputJsonValue,
        requirementsDescription: source.requirementsDescription,
        requirements: source.requirements as Prisma.InputJsonValue,
        preferredQualifications:
          source.preferredQualifications as Prisma.InputJsonValue,
        hiringProcess: source.hiringProcess as Prisma.InputJsonValue,
        featured: false,
        displayOrder: (highestOrder._max.displayOrder ?? 0) + 1,
        status: CareerStatus.DRAFT,
        publishedAt: null,
      },
    });

    await prisma.auditLog.create({
      data: {
        actorId: authorized.session.id,
        action: "CAREER_DUPLICATED",
        entity: "Career",
        entityId: career.id,
        metadata: { sourceCareerId: source.id, slug: career.slug },
      },
    });

    revalidatePath("/admin/careers");
    return NextResponse.json(career, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Unable to duplicate this job right now." },
      { status: 500 }
    );
  }
}
