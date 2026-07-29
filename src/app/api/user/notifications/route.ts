import { NextResponse } from "next/server";
import { prisma } from "@/lib/Prisma";
import { getActiveSession } from "@/lib/auth/session";

export async function GET() {
  try {
    const session = await getActiveSession();
    if (!session || session.userType !== "user") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notifications = await prisma.notification.findMany({
      where: {
        recipientId: session.id,
        recipientType: "user",
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ success: true, notifications });
  } catch (error) {
    console.error("User notifications fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getActiveSession();
    if (!session || session.userType !== "user") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, markAllRead } = await request.json();

    if (markAllRead) {
      await prisma.notification.updateMany({
        where: { recipientId: session.id, recipientType: "user", read: false },
        data: { read: true },
      });
      return NextResponse.json({ success: true, message: "All notifications marked as read." });
    }

    if (id) {
      await prisma.notification.updateMany({
        where: { id, recipientId: session.id },
        data: { read: true },
      });
      return NextResponse.json({ success: true, message: "Notification marked as read." });
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  } catch (error) {
    console.error("Mark notification read error:", error);
    return NextResponse.json({ error: "Failed to update notification" }, { status: 500 });
  }
}
