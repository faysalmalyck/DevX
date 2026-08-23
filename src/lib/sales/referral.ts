import { cookies } from "next/headers";

import { findSalesOwnerByCode, isValidAgentCode } from "@/lib/sales/agents";

export const REFERRAL_COOKIE_NAME = "devx_ref";
export const REFERRAL_COOKIE_MAX_AGE_SECONDS = 60 * 24 * 60 * 60;

const allowedDestinationPrefixes = [
  "/",
  "/about",
  "/contact",
  "/pricing",
  "/services",
  "/case-studies",
] as const;

export type ReferralAttribution = {
  referralAgentId: string;
  referralAgentCode: string;
  assignedAgentId: string | null;
};

/**
 * Accepts only same-origin public destinations and removes all query/hash data
 * from a referral redirect. The canonical share link only needs the path.
 */
export function safeReferralDestination(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return "/contact";
  }

  const parsed = new URL(value, "https://devx.invalid");
  const path = parsed.pathname;
  const allowed = allowedDestinationPrefixes.some(
    (prefix) => path === prefix || (prefix !== "/" && path.startsWith(`${prefix}/`))
  );

  return allowed ? path : "/contact";
}

export async function readReferralCookieCode(): Promise<string | null> {
  const cookieStore = await cookies();
  const code = cookieStore.get(REFERRAL_COOKIE_NAME)?.value;
  return isValidAgentCode(code) ? code : null;
}

/**
 * A former agent remains a valid first-touch attribution record, but cannot
 * receive newly assigned work once suspended or soft-deleted.
 */
export async function resolveReferralAttribution(
  code: string | null | undefined
): Promise<ReferralAttribution | null> {
  if (!isValidAgentCode(code)) return null;

  const agent = await findSalesOwnerByCode(code);
  if (!agent) return null;

  return {
    referralAgentId: agent.id,
    referralAgentCode: code,
    assignedAgentId:
      agent.status === "ACTIVE" && !agent.deletedAt ? agent.id : null,
  };
}

/**
 * Do not replace a valid historical first touch, even when that agent has
 * since been suspended. Invalid or forged cookies never block a valid link.
 */
export async function hasValidFirstTouchReferral(
  code: string | null | undefined
): Promise<boolean> {
  return Boolean(await resolveReferralAttribution(code));
}

export const referralCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: REFERRAL_COOKIE_MAX_AGE_SECONDS,
};
