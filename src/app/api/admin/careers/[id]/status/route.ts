import { CareerStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { authorizeAdmin, hasValidAdminCsrf } from "@/lib/auth/admin-authorization";
import { canTransitionCareerStatus } from "@/lib/careers/status";
import { prisma } from "@/lib/db/prisma";
import { careerStatusUpdateSchema } from "@/lib/validations/career";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const authorized = await authorizeAdmin("Careers", "PUBLISH");
  if (!authorized.ok) {
    return NextResponse.json({ error: "Access denied." }, { status: authorized.status });
  }

  if (!hasValidAdminCsrf(request)) {
    return NextResponse.json({ error: "Invalid request token." }, { status: 403 });
  }

  try {
    const body: unknown = await request.json();
    const parsed = careerStatusUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid job status." },
        { status: 400 }
      );
    }

    const { id } = await params;
    const current = await prisma.career.findUnique({ where: { id } });
    if (!current) {
      return NextResponse.json({ error: "Job not found." }, { status: 404 });
    }

    if (!canTransitionCareerStatus(current.status, parsed.data.status)) {
      return NextResponse.json(
        { error: "This job status cannot be changed that way." },
        { status: 409 }
      );
    }

    const career = await prisma.career.update({
      where: { id },
      data: {
        status: parsed.data.status,
        publishedAt:
          parsed.data.status === CareerStatus.PUBLISHED
            ? current.publishedAt ?? new Date()
            : parsed.data.status === CareerStatus.DRAFT
              ? null
              : current.publishedAt,
      },
    });

    await prisma.auditLog.create({
      data: {
        actorId: authorized.session.id,
        action: "CAREER_STATUS_UPDATED",
        entity: "Career",
        entityId: career.id,
        metadata: { status: career.status },
      },
    });

    revalidatePath("/careers");
    revalidatePath(`/careers/${career.slug}`);
    revalidatePath("/admin/careers");

    return NextResponse.json(career);
  } catch {
    return NextResponse.json(
      { error: "Unable to update this job status right now." },
      { status: 500 }
    );
  }
}
