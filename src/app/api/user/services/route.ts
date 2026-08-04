import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getActiveSession } from "@/lib/auth/session";

export async function GET() {
  try {
    const session = await getActiveSession();
    if (!session || session.userType !== "user") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const services = await prisma.serviceRequest.findMany({
      where: { userId: session.id },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ success: true, services });
  } catch (error) {
    console.error("User services fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getActiveSession();
    if (!session || session.userType !== "user") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { serviceName, notes } = body;

    if (!serviceName) {
      return NextResponse.json({ error: "Service name is required" }, { status: 400 });
    }

    const service = await prisma.serviceRequest.create({
      data: {
        userId: session.id,
        serviceName,
        notes: notes || null,
        status: "PENDING",
        progress: 0,
      },
    });

    return NextResponse.json({ success: true, service }, { status: 201 });
  } catch (error) {
    console.error("Create service request error:", error);
    return NextResponse.json({ error: "Failed to create service request" }, { status: 500 });
  }
}
