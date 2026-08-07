"use client";

const CSRF_COOKIE_NAME = "DevX-csrf-token";

export function getClientCsrfToken(): string | undefined {
  if (typeof document === "undefined") return undefined;

  const cookie = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${CSRF_COOKIE_NAME}=`));

  if (!cookie) return undefined;

  return decodeURIComponent(cookie.slice(CSRF_COOKIE_NAME.length + 1));
}
