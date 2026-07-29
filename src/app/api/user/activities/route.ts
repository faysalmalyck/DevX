import { NextResponse } from "next/server";
import { prisma } from "@/lib/Prisma";
import { getActiveSession } from "@/lib/auth/session";

export async function GET() {
  try {
    const session = await getActiveSession();
    if (!session || session.userType !== "user") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const activities = await prisma.plannedActivity.findMany({
      where: { userId: session.id },
      orderBy: { scheduledAt: "asc" },
    });

    return NextResponse.json({ success: true, activities });
  } catch (error) {
    console.error("User activities fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 });
  }
}
