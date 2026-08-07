import { CareerStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { authorizeAdmin, hasValidAdminCsrf } from "@/lib/auth/admin-authorization";
import { getCareerManagementData } from "@/lib/careers/admin-queries";
import { prisma } from "@/lib/db/prisma";
import { careerSchema } from "@/lib/validations/career";

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

export async function GET(request: NextRequest) {
  const authorized = await authorizeAdmin("Careers", "VIEW");
  if (!authorized.ok) {
    return NextResponse.json({ error: "Access denied." }, { status: authorized.status });
  }

  try {
    const data = await getCareerManagementData(
      Object.fromEntries(request.nextUrl.searchParams.entries())
    );
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Unable to load careers." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authorized = await authorizeAdmin("Careers", "CREATE");
  if (!authorized.ok) {
    return NextResponse.json({ error: "Access denied." }, { status: authorized.status });
  }

  if (!hasValidAdminCsrf(request)) {
    return NextResponse.json({ error: "Invalid request token." }, { status: 403 });
  }

  try {
    const body: unknown = await request.json();
    const parsed = careerSchema.safeParse(body);
    if (!parsed.success) return validationErrorResponse(parsed.error.issues);

    if (parsed.data.status === CareerStatus.PUBLISHED) {
      const canPublish = await authorizeAdmin("Careers", "PUBLISH");
      if (!canPublish.ok) {
        return NextResponse.json({ error: "Access denied." }, { status: canPublish.status });
      }
    }

    const existing = await prisma.career.findUnique({
      where: { slug: parsed.data.slug },
      select: { id: true },
    });
    if (existing) {
      return NextResponse.json(
        {
          error: "A job with this slug already exists.",
          code: "SLUG_CONFLICT",
          fieldErrors: { slug: ["This slug is already in use."] },
        },
        { status: 409 }
      );
    }

    const now = new Date();
    const career = await prisma.career.create({
      data: {
        ...parsed.data,
        hiringProcess: parsed.data.hiringProcess.map((step, index) => ({
          ...step,
          step: index + 1,
        })),
        publishedAt:
          parsed.data.status === CareerStatus.PUBLISHED ? now : null,
      },
    });

    await prisma.auditLog.create({
      data: {
        actorId: authorized.session.id,
        action: "CAREER_CREATED",
        entity: "Career",
        entityId: career.id,
        metadata: { slug: career.slug, status: career.status },
      },
    });

    revalidatePath("/careers");
    revalidatePath(`/careers/${career.slug}`);
    revalidatePath("/admin/careers");

    return NextResponse.json(career, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Unable to create this job right now." },
      { status: 500 }
    );
  }
}
