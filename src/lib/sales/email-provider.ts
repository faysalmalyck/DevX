export type EmailProviderStatus = {
  configured: boolean;
  provider: string | null;
  reason: string | null;
};

/**
 * Outbound mail is deliberately opt-in. The portal can draft and queue
 * records without ever attempting network delivery when no provider is set.
 */
export function getEmailProviderStatus(): EmailProviderStatus {
  const provider = process.env.SALES_EMAIL_PROVIDER?.trim().toLowerCase() || null;
  if (!provider) return { configured: false, provider: null, reason: "No outbound email provider is configured." };
  if (provider === "resend" && process.env.RESEND_API_KEY) return { configured: true, provider, reason: null };
  return { configured: false, provider, reason: "The selected outbound email provider is not fully configured." };
}

export function assertEmailProviderConfigured(): EmailProviderStatus {
  const status = getEmailProviderStatus();
  if (!status.configured) throw new Error(status.reason ?? "Outbound email is unavailable.");
  return status;
}
