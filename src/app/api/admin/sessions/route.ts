import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getActiveSession } from "@/lib/auth/session";
import { getClientIp } from "@/lib/auth/rate-limit";

export async function GET() {
  try {
    const session = await getActiveSession();

    if (!session || session.userType !== "admin") {
      return NextResponse.json(
        { error: "Access denied. Operator login required." },
        { status: 401 }
      );
    }

    const sessions = await prisma.adminSession.findMany({
      where: { adminId: session.id },
      orderBy: { loginAt: "desc" },
    });

    // Mark current active session
    const formatted = sessions.map((s) => ({
      id: s.id,
      device: s.device || "Desktop",
      browser: s.browser || "Unknown Browser",
      ipAddress: s.ipAddress || "127.0.0.1",
      location: s.location || "Unknown Location",
      loginAt: s.loginAt,
      expiresAt: s.expiresAt,
      isCurrent: s.id === session.sessionId,
    }));

    return NextResponse.json({
      success: true,
      sessions: formatted,
    });
  } catch (error) {
    console.error("Fetch admin sessions error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve active sessions" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const ip = getClientIp(request);
    const session = await getActiveSession();

    if (!session || session.userType !== "admin") {
      return NextResponse.json(
        { error: "Access denied. Operator login required." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const targetId = searchParams.get("id");
    const all = searchParams.get("all");

    if (all === "true") {
      // Revoke all OTHER sessions except the current active session
      await prisma.adminSession.deleteMany({
        where: {
          adminId: session.id,
          id: { not: session.sessionId },
        },
      });

      await prisma.adminActivity.create({
        data: {
          adminId: session.id,
          action: "REVOKE_OTHER_SESSIONS",
          module: "Security",
          description: `All other active operator sessions revoked from IP ${ip}`,
          ipAddress: ip,
        },
      });

      await prisma.auditLog.create({
        data: {
          actorId: session.id,
          action: "SESSIONS_REVOKED_ALL",
          entity: "Admin",
          entityId: session.id,
          metadata: { ip },
        },
      });

      return NextResponse.json({
        success: true,
        message: "All other sessions have been successfully terminated.",
      });
    }

    if (!targetId) {
      return NextResponse.json(
        { error: "Session identifier is required" },
        { status: 400 }
      );
    }

    // Load target session to check ownership
    const targetSession = await prisma.adminSession.findUnique({
      where: { id: targetId },
    });

    if (!targetSession) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    if (targetSession.adminId !== session.id) {
      return NextResponse.json(
        { error: "Access denied. You do not own this session." },
        { status: 403 }
      );
    }

    // Delete session
    await prisma.adminSession.delete({
      where: { id: targetId },
    });

    await prisma.adminActivity.create({
      data: {
        adminId: session.id,
        action: "REVOKE_SINGLE_SESSION",
        module: "Security",
        description: `Session record ${targetId} terminated from IP ${ip}`,
        ipAddress: ip,
      },
    });

    await prisma.auditLog.create({
      data: {
        actorId: session.id,
        action: "SESSION_REVOKED_SINGLE",
        entity: "Admin",
        entityId: session.id,
        metadata: { ip, revokedSessionId: targetId },
      },
    });

    return NextResponse.json({
      success: true,
      message: "The specified session has been terminated.",
    });
  } catch (error) {
    console.error("Revoke admin session error:", error);
    return NextResponse.json(
      { error: "Failed to terminate the specified session" },
      { status: 500 }
    );
  }
}
