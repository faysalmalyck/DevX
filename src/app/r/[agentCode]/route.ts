import { NextRequest, NextResponse } from "next/server";

import { findSalesOwnerByCode, isValidAgentCode } from "@/lib/sales/agents";
import {
  hasValidFirstTouchReferral,
  referralCookieOptions,
  safeReferralDestination,
  REFERRAL_COOKIE_NAME,
} from "@/lib/sales/referral";

type RouteContext = {
  params: Promise<{ agentCode: string }>;
};

export async function GET(request: NextRequest, { params }: RouteContext) {
  const { agentCode } = await params;
  const destination = safeReferralDestination(
    request.nextUrl.searchParams.get("next")
  );
  const response = NextResponse.redirect(new URL(destination, request.url));
  response.headers.set("Cache-Control", "private, no-store, max-age=0");

  if (!isValidAgentCode(agentCode)) return response;

  const agent = await findSalesOwnerByCode(agentCode);
  if (!agent || agent.status !== "ACTIVE" || agent.deletedAt) {
    return response;
  }

  const existingCode = request.cookies.get(REFERRAL_COOKIE_NAME)?.value;
  if (await hasValidFirstTouchReferral(existingCode)) {
    return response;
  }

  response.cookies.set(REFERRAL_COOKIE_NAME, agentCode, referralCookieOptions);
  return response;
}
