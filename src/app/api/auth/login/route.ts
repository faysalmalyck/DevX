import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { verifyPassword, hashPassword } from "@/lib/auth/hash";
import { createSession } from "@/lib/auth/session";
import { checkLoginRateLimit, getClientIp } from "@/lib/auth/rate-limit";

function getBootstrapAdminConfiguration(): {
  email: string;
  username: string;
  password: string;
} | null {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return null;
  }

  const configuredUsername = process.env.ADMIN_USERNAME?.trim().toLowerCase();
  const derivedUsername = email
    .split("@", 1)[0]
    .replace(/[^a-z0-9._-]/g, "")
    .slice(0, 80);
  const username = configuredUsername || derivedUsername;

  return username ? { email, username, password } : null;
}

async function ensureBootstrapAdmin() {
  const bootstrapAdmin = getBootstrapAdminConfiguration();
  if (!bootstrapAdmin) return;

  try {
    let ceoRole = await prisma.role.findUnique({
      where: { name: "CEO" },
    });

    if (!ceoRole) {
      ceoRole = await prisma.role.create({
        data: {
          name: "CEO",
          slug: "ceo",
          description: "CEO & Founder - Super Admin",
          isSuperAdmin: true,
          isSystem: true,
        },
      });
    }

    const existingAdmin = await prisma.admin.findFirst({
      where: {
        OR: [
          { email: bootstrapAdmin.email },
          { username: bootstrapAdmin.username },
        ],
      },
    });

    if (existingAdmin) return;

    await prisma.admin.create({
      data: {
        firstName: process.env.ADMIN_FIRST_NAME?.trim() || "System",
        lastName: process.env.ADMIN_LAST_NAME?.trim() || "Administrator",
        email: bootstrapAdmin.email,
        username: bootstrapAdmin.username,
        password: await hashPassword(bootstrapAdmin.password),
        roleId: ceoRole.id,
        status: "ACTIVE",
        twoFactorEnabled: false,
        requirePasswordChange: true,
      },
    });
  } catch {
    // A bootstrap race or unavailable database must not disclose configuration details.
  }
}

function parseUserAgent(ua: string) {
  let browser = "Unknown";
  let device = "Desktop";

  if (/mobile/i.test(ua)) device = "Mobile";
  else if (/tablet/i.test(ua)) device = "Tablet";

  if (/chrome|crios/i.test(ua)) browser = "Chrome";
  else if (/firefox|fxios/i.test(ua)) browser = "Firefox";
  else if (/safari/i.test(ua) && !/chrome|crios/i.test(ua)) browser = "Safari";
  else if (/edge|edg/i.test(ua)) browser = "Edge";

  return { browser, device };
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkLoginRateLimit(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `Too many login attempts. Please try again in ${Math.ceil(rateLimit.retryAfterMs / 1000)} seconds.` },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, password, role, rememberMe } = body;

    if (!email || !password || !role) {
      return NextResponse.json(
        { error: "Email/username, password, and portal role are required" },
        { status: 400 }
      );
    }

    const cleanIdentifier = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    const ua = request.headers.get("user-agent") || "";
    const { browser, device } = parseUserAgent(ua);

    if (role === "admin") {
      await ensureBootstrapAdmin();

      const admin = await prisma.admin.findFirst({
        where: {
          OR: [
            { email: cleanIdentifier },
            { username: cleanIdentifier },
          ],
          deletedAt: null,
        },
        include: {
          role: true,
        },
      });

      if (!admin) {
        return NextResponse.json(
          { error: "Invalid email/username or password" },
          { status: 401 }
        );
      }

      // Check if locked
      if (admin.lockedUntil && admin.lockedUntil > new Date()) {
        const mins = Math.ceil((admin.lockedUntil.getTime() - Date.now()) / 60000);
        return NextResponse.json(
          { error: `This account is temporarily locked due to multiple failed login attempts. Try again in ${mins} minute(s).` },
          { status: 403 }
        );
      }

      if (admin.status === "SUSPENDED") {
        return NextResponse.json(
          { error: "This administrator account is suspended" },
          { status: 403 }
        );
      }

      const isValidPassword = await verifyPassword(cleanPassword, admin.password);
      if (!isValidPassword) {
        const newAttempts = admin.failedLoginAttempts + 1;
        const shouldLock = newAttempts >= 5;
        const lockedUntil = shouldLock ? new Date(Date.now() + 15 * 60 * 1000) : null;

        await prisma.admin.update({
          where: { id: admin.id },
          data: {
            failedLoginAttempts: newAttempts,
            lockedUntil,
          },
        });

        await prisma.auditLog.create({
          data: {
            actorId: admin.id,
            action: "LOGIN_FAILED",
            entity: "Admin",
            entityId: admin.id,
            metadata: { ip, browser, device, reason: "Invalid password" },
          },
        });

        return NextResponse.json(
          { error: "Invalid email/username or password" },
          { status: 401 }
        );
      }

      // Reset lockout and failed attempts
      await prisma.admin.update({
        where: { id: admin.id },
        data: {
          failedLoginAttempts: 0,
          lockedUntil: null,
          lastLogin: new Date(),
        },
      });

      // Create Session
      const session = await createSession({
        userId: admin.id,
        email: admin.email,
        role: admin.role.name,
        userType: "admin",
        rememberMe: !!rememberMe,
        device,
        browser,
        ipAddress: ip,
      });

      // Audit Logs
      await prisma.adminActivity.create({
        data: {
          adminId: admin.id,
          action: "LOGIN",
          module: "Security",
          description: `Successful admin login from ${ip} (${browser}/${device})`,
          ipAddress: ip,
          browser,
        },
      });

      await prisma.auditLog.create({
        data: {
          actorId: admin.id,
          action: "LOGIN_SUCCESS",
          entity: "Admin",
          entityId: admin.id,
          metadata: { ip, browser, device, sessionId: session.sessionId },
        },
      });

      return NextResponse.json({
        success: true,
        user: {
          email: admin.email,
          username: admin.username,
          firstName: admin.firstName,
          lastName: admin.lastName,
          role: admin.role.name,
        },
      });
    } else if (role === "user") {
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { email: cleanIdentifier },
            { username: cleanIdentifier },
          ],
          deletedAt: null,
        },
      });

      if (!user) {
        return NextResponse.json(
          { error: "Invalid email/username or password" },
          { status: 401 }
        );
      }

      if (user.status === "SUSPENDED") {
        return NextResponse.json(
          { error: "This account is suspended" },
          { status: 403 }
        );
      }

      const isValidPassword = await verifyPassword(cleanPassword, user.password);
      if (!isValidPassword) {
        await prisma.auditLog.create({
          data: {
            actorId: user.id,
            action: "LOGIN_FAILED",
            entity: "User",
            entityId: user.id,
            metadata: { ip, browser, device, reason: "Invalid password" },
          },
        });

        return NextResponse.json(
          { error: "Invalid email/username or password" },
          { status: 401 }
        );
      }

      await prisma.user.update({
        where: { id: user.id },
        data: {
          lastLogin: new Date(),
        },
      });

      const session = await createSession({
        userId: user.id,
        email: user.email,
        role: user.role,
        userType: "user",
        rememberMe: !!rememberMe,
        device,
        browser,
        ipAddress: ip,
      });

      await prisma.userActivity.create({
        data: {
          userId: user.id,
          action: "LOGIN",
          module: "Security",
          ipAddress: ip,
          browser,
        },
      });

      await prisma.auditLog.create({
        data: {
          actorId: user.id,
          action: "LOGIN_SUCCESS",
          entity: "User",
          entityId: user.id,
          metadata: { ip, browser, device, sessionId: session.sessionId },
        },
      });

      return NextResponse.json({
        success: true,
        user: {
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      });
    } else {
      return NextResponse.json(
        { error: "Invalid portal role specified" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during authentication" },
      { status: 500 }
    );
  }
}
