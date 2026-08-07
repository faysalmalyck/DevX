"use client";

import { getClientCsrfToken } from "@/lib/auth/client-csrf";

export async function getAdminCsrfHeaders(): Promise<{
  "X-CSRF-Token": string;
}> {
  let token = getClientCsrfToken();

  if (!token) {
    const response = await fetch("/api/auth/csrf", {
      cache: "no-store",
      credentials: "same-origin",
    });

    if (!response.ok) {
      throw new Error("Unable to verify this request. Please try again.");
    }

    token = getClientCsrfToken();
  }

  if (!token) {
    throw new Error("Unable to verify this request. Please try again.");
  }

  return { "X-CSRF-Token": token };
}
