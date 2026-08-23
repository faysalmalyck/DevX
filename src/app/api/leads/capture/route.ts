import { NextRequest, NextResponse } from "next/server";

import {
  checkLeadCaptureRateLimit,
  getClientIp,
} from "@/lib/auth/rate-limit";
import { capturePublicLead } from "@/lib/leads/capture";
import { publicLeadCaptureSchema } from "@/lib/validations/lead";

function publicJson(data: unknown, init?: ResponseInit): NextResponse {
  const headers = new Headers(init?.headers);
  headers.set("Cache-Control", "no-store, max-age=0");

  return NextResponse.json(data, { ...init, headers });
}

function rateLimitResponse(retryAfterMs: number) {
  const retryAfterSeconds = Math.max(1, Math.ceil(retryAfterMs / 1000));
  return publicJson(
    { error: "Too many submissions. Please try again later." },
    {
      status: 429,
      headers: { "Retry-After": String(retryAfterSeconds) },
    }
  );
}

export async function POST(request: NextRequest) {
  const body: unknown = await request.json().catch(() => null);
  const parsed = publicLeadCaptureSchema.safeParse(body);

  if (!parsed.success) {
    return publicJson({ error: "Please check the submitted information." }, { status: 400 });
  }

  try {
    const ipLimit = await checkLeadCaptureRateLimit("ip", getClientIp(request));
    if (!ipLimit.allowed) return rateLimitResponse(ipLimit.retryAfterMs);

    const emailLimit = await checkLeadCaptureRateLimit("email", parsed.data.email);
    if (!emailLimit.allowed) return rateLimitResponse(emailLimit.retryAfterMs);

    await capturePublicLead(parsed.data);
    return publicJson({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Lead capture failed", error);
    return publicJson(
      { error: "We could not submit your enquiry right now. Please try again." },
      { status: 500 }
    );
  }
}
