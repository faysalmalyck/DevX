import { timingSafeEqual } from "node:crypto";

import { NextRequest, NextResponse } from "next/server";

import { pruneApplicationRateLimits } from "@/lib/auth/rate-limit";
import { processCareerResumeCleanups } from "@/lib/storage/career-resume-cleanup";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function hasValidCronAuthorization(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");
  if (!secret || !authorization) return false;

  const expected = Buffer.from(`Bearer ${secret}`);
  const received = Buffer.from(authorization);
  return (
    expected.length === received.length &&
    timingSafeEqual(expected, received)
  );
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  if (!hasValidCronAuthorization(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const [result, expiredRateLimits] = await Promise.all([
      processCareerResumeCleanups(),
      pruneApplicationRateLimits(),
    ]);
    return NextResponse.json({ success: true, ...result, expiredRateLimits });
  } catch {
    return NextResponse.json(
      { error: "Resume cleanup could not run." },
      { status: 500 }
    );
  }
}
