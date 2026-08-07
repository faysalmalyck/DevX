import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { authorizeAdmin, hasValidAdminCsrf } from "@/lib/auth/admin-authorization";
import { prisma } from "@/lib/db/prisma";
import { careerOrderUpdateSchema } from "@/lib/validations/career";

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
    const parsed = careerOrderUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid display order." }, { status: 400 });
    }

    const { id } = await params;
    const career = await prisma.career.update({
      where: { id },
      data: { displayOrder: parsed.data.displayOrder },
    });

    await prisma.auditLog.create({
      data: {
        actorId: authorized.session.id,
        action: "CAREER_REORDERED",
        entity: "Career",
        entityId: career.id,
        metadata: { displayOrder: career.displayOrder },
      },
    });

    revalidatePath("/careers");
    revalidatePath(`/careers/${career.slug}`);
    revalidatePath("/admin/careers");
    return NextResponse.json(career);
  } catch {
    return NextResponse.json(
      { error: "Unable to reorder this job right now." },
      { status: 500 }
    );
  }
}
