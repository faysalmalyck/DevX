import { NextResponse } from "next/server";
import { generateCsrfToken } from "@/lib/auth/csrf";
import { setCsrfCookie } from "@/lib/auth/cookies";

export async function GET() {
  await setCsrfCookie(generateCsrfToken());
  return NextResponse.json({ success: true });
}
