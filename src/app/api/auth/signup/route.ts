import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { hashPassword } from "@/lib/auth/hash";
import { signupSchema } from "@/lib/auth/validation";
import { createSession } from "@/lib/auth/session";
import { checkRegistrationRateLimit, getClientIp } from "@/lib/auth/rate-limit";

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
    const rateLimit = checkRegistrationRateLimit(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `Too many registration attempts. Please try again in ${Math.ceil(rateLimit.retryAfterMs / 60000)} minute(s).` },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { fullName, email, password } = body;

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: "Full name, email, and password are required" },
        { status: 400 }
      );
    }

    // Split full name into firstName and lastName
    const nameParts = fullName.trim().split(/\s+/);
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "";

    // Validate using Zod schema
    const validationResult = signupSchema.safeParse({
      firstName,
      lastName: lastName || "User", // fallback if no last name provided to satisfy validation
      email,
      username: email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "").slice(0, 15),
      password,
    });

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues[0]?.message || "Invalid input data" },
        { status: 400 }
      );
    }

    const { username } = validationResult.data;

    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: "An account with this email address already exists" },
        { status: 409 }
      );
    }

    // Generate unique username
    let uniqueUsername = username;
    let count = 0;
    while (true) {
      const existingUser = await prisma.user.findUnique({
        where: { username: count ? `${username}${count}` : username },
      });
      if (!existingUser) {
        if (count) uniqueUsername = `${username}${count}`;
        break;
      }
      count++;
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        username: uniqueUsername,
        password: hashedPassword,
        role: "Client",
        status: "ACTIVE",
      },
    });

    // Auto-login session creation
    const ua = request.headers.get("user-agent") || "";
    const { browser, device } = parseUserAgent(ua);

    const session = await createSession({
      userId: user.id,
      email: user.email,
      role: user.role,
      userType: "user",
      rememberMe: false,
      device,
      browser,
      ipAddress: ip,
    });

    // Logging Activity
    await prisma.userActivity.create({
      data: {
        userId: user.id,
        action: "SIGNUP",
        module: "Security",
        ipAddress: ip,
        browser,
      },
    });

    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: "SIGNUP_SUCCESS",
        entity: "User",
        entityId: user.id,
        metadata: { ip, browser, device, sessionId: session.sessionId },
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Signup API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during registration" },
      { status: 500 }
    );
  }
}