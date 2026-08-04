import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getActiveSession } from "@/lib/auth/session";

// GET /api/user/support — list tickets for logged-in user
export async function GET() {
  try {
    const session = await getActiveSession();
    if (!session || session.userType !== "user") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tickets = await prisma.supportTicket.findMany({
      where: { userId: session.id },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          take: 1, // only last/first message for preview
        },
        _count: { select: { messages: true } },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ success: true, tickets });
  } catch (error) {
    console.error("Fetch tickets error:", error);
    return NextResponse.json({ error: "Failed to fetch support tickets" }, { status: 500 });
  }
}

// POST /api/user/support — create new ticket
export async function POST(request: Request) {
  try {
    const session = await getActiveSession();
    if (!session || session.userType !== "user") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { subject, category, priority, message } = body;

    if (!subject || !message) {
      return NextResponse.json({ error: "Subject and message are required." }, { status: 400 });
    }

    const ticket = await prisma.supportTicket.create({
      data: {
        userId: session.id,
        subject,
        category: category || "General",
        priority: priority || "MEDIUM",
        status: "OPEN",
        messages: {
          create: {
            senderId: session.id,
            senderType: "user",
            senderName: `${session.firstName} ${session.lastName}`,
            content: message,
          },
        },
      },
      include: { messages: true },
    });

    // Notify the admin team
    const superAdmins = await prisma.admin.findMany({
      where: { role: { name: "CEO" }, deletedAt: null },
      take: 1,
    });
    if (superAdmins.length > 0) {
      await prisma.notification.create({
        data: {
          recipientId: superAdmins[0].id,
          recipientType: "admin",
          type: "SUPPORT_TICKET",
          title: `New Support Ticket: ${subject}`,
          message: `Client ${session.firstName} ${session.lastName} opened a ${priority || "MEDIUM"} priority ticket.`,
          link: `/admin/administration/sessions`,
        },
      });
    }

    return NextResponse.json({ success: true, ticket }, { status: 201 });
  } catch (error) {
    console.error("Create ticket error:", error);
    return NextResponse.json({ error: "Failed to create support ticket" }, { status: 500 });
  }
}
