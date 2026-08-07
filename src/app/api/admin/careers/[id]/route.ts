import { CareerStatus, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { authorizeAdmin, hasValidAdminCsrf } from "@/lib/auth/admin-authorization";
import { canTransitionCareerStatus } from "@/lib/careers/status";
import { prisma } from "@/lib/db/prisma";
import { careerSchema } from "@/lib/validations/career";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function validationErrorResponse(
  issues: { path: PropertyKey[]; message: string }[]
) {
  const fieldErrors: Record<string, string[]> = {};

  for (const issue of issues) {
    const field = String(issue.path[0] ?? "form");
    fieldErrors[field] = [...(fieldErrors[field] ?? []), issue.message];
  }

  return NextResponse.json(
    {
      error: "Please correct the highlighted fields.",
      code: "VALIDATION_ERROR",
      fieldErrors,
    },
    { status: 400 }
  );
}

function revalidateCareer(slug: string, previousSlug?: string) {
  revalidatePath("/careers");
  revalidatePath(`/careers/${slug}`);
  if (previousSlug && previousSlug !== slug) {
    revalidatePath(`/careers/${previousSlug}`);
  }
  revalidatePath("/admin/careers");
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const authorized = await authorizeAdmin("Careers", "EDIT");
  if (!authorized.ok) {
    return NextResponse.json({ error: "Access denied." }, { status: authorized.status });
  }

  if (!hasValidAdminCsrf(request)) {
    return NextResponse.json({ error: "Invalid request token." }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body: unknown = await request.json();
    const parsed = careerSchema.safeParse(body);
    if (!parsed.success) return validationErrorResponse(parsed.error.issues);

    const existing = await prisma.career.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Job not found." }, { status: 404 });
    }

    if (!canTransitionCareerStatus(existing.status, parsed.data.status)) {
      return NextResponse.json(
        { error: "This job status cannot be changed that way." },
        { status: 409 }
      );
    }

    if (existing.status !== parsed.data.status) {
      const canPublish = await authorizeAdmin("Careers", "PUBLISH");
      if (!canPublish.ok) {
        return NextResponse.json({ error: "Access denied." }, { status: canPublish.status });
      }
    }

    const slugOwner = await prisma.career.findUnique({
      where: { slug: parsed.data.slug },
      select: { id: true },
    });
    if (slugOwner && slugOwner.id !== id) {
      return NextResponse.json(
        {
          error: "A job with this slug already exists.",
          code: "SLUG_CONFLICT",
          fieldErrors: { slug: ["This slug is already in use."] },
        },
        { status: 409 }
      );
    }

    const statusChangedToPublished =
      existing.status !== CareerStatus.PUBLISHED &&
      parsed.data.status === CareerStatus.PUBLISHED;
    const statusChangedToDraft = parsed.data.status === CareerStatus.DRAFT;

    const career = await prisma.career.update({
      where: { id },
      data: {
        ...parsed.data,
        hiringProcess: parsed.data.hiringProcess.map((step, index) => ({
          ...step,
          step: index + 1,
        })),
        publishedAt: statusChangedToPublished
          ? new Date()
          : statusChangedToDraft
            ? null
            : existing.publishedAt,
      },
    });

    await prisma.auditLog.create({
      data: {
        actorId: authorized.session.id,
        action: "CAREER_UPDATED",
        entity: "Career",
        entityId: career.id,
        metadata: { slug: career.slug, status: career.status },
      },
    });

    revalidateCareer(career.slug, existing.slug);
    return NextResponse.json(career);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        {
          error: "A job with this slug already exists.",
          code: "SLUG_CONFLICT",
          fieldErrors: { slug: ["This slug is already in use."] },
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Unable to update this job right now." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const authorized = await authorizeAdmin("Careers", "DELETE");
  if (!authorized.ok) {
    return NextResponse.json({ error: "Access denied." }, { status: authorized.status });
  }

  if (!hasValidAdminCsrf(request)) {
    return NextResponse.json({ error: "Invalid request token." }, { status: 403 });
  }

  try {
    const { id } = await params;
    const career = await prisma.career.findUnique({
      where: { id },
      include: { _count: { select: { applications: true } } },
    });
    if (!career) {
      return NextResponse.json({ error: "Job not found." }, { status: 404 });
    }

    if (career._count.applications > 0) {
      return NextResponse.json(
        {
          error:
            "Remove this job’s applications before permanently deleting the job.",
          code: "CAREER_HAS_APPLICATIONS",
        },
        { status: 409 }
      );
    }

    await prisma.career.delete({ where: { id } });
    await prisma.auditLog.create({
      data: {
        actorId: authorized.session.id,
        action: "CAREER_DELETED",
        entity: "Career",
        entityId: id,
        metadata: { slug: career.slug },
      },
    });

    revalidateCareer(career.slug);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Unable to delete this job right now." },
      { status: 500 }
    );
  }
}
