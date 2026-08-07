import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { authorizeAdmin, hasValidAdminCsrf } from "@/lib/auth/admin-authorization";
import { prisma } from "@/lib/db/prisma";
import { careerFeatureUpdateSchema } from "@/lib/validations/career";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const authorized = await authorizeAdmin("Careers", "EDIT");
  if (!authorized.ok) {
    return NextResponse.json({ error: "Access denied." }, { status: authorized.status });
  }

  if (!hasValidAdminCsrf(request)) {
    return NextResponse.json({ error: "Invalid request token." }, { status: 403 });
  }

  try {
    const body: unknown = await request.json();
    const parsed = careerFeatureUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid featured value." }, { status: 400 });
    }

    const { id } = await params;
    const career = await prisma.career.update({
      where: { id },
      data: { featured: parsed.data.featured },
    });

    await prisma.auditLog.create({
      data: {
        actorId: authorized.session.id,
        action: "CAREER_FEATURE_UPDATED",
        entity: "Career",
        entityId: career.id,
        metadata: { featured: career.featured },
      },
    });

    revalidatePath("/careers");
    revalidatePath(`/careers/${career.slug}`);
    revalidatePath("/admin/careers");
    return NextResponse.json(career);
  } catch {
    return NextResponse.json(
      { error: "Unable to update this job right now." },
      { status: 500 }
    );
  }
}
