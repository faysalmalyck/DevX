import type { LeadCaptureSurface, LeadSource } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";
import {
  readReferralCookieCode,
  resolveReferralAttribution,
} from "@/lib/sales/referral";
import type { PublicLeadCaptureInput } from "@/lib/validations/lead";

const sourceByFormType: Record<
  PublicLeadCaptureInput["formType"],
  LeadSource
> = {
  CONTACT: "WEBSITE_CONTACT",
  CONSULTATION: "WEBSITE_CONSULTATION",
  PRICING: "WEBSITE_PRICING",
};

const surfaceByFormType: Record<
  PublicLeadCaptureInput["formType"],
  LeadCaptureSurface
> = {
  CONTACT: "CONTACT",
  CONSULTATION: "CONSULTATION",
  PRICING: "PRICING",
};

export async function capturePublicLead(input: PublicLeadCaptureInput) {
  const referralCode = await readReferralCookieCode();
  const referral = await resolveReferralAttribution(referralCode);
  const captureSurface = surfaceByFormType[input.formType];
  const source = referral ? "AGENT_REFERRAL" : sourceByFormType[input.formType];

  return prisma.$transaction(async (tx) => {
    const lead = await tx.lead.create({
      data: {
        fullName: input.fullName,
        email: input.email,
        phone: input.phone ?? null,
        company: input.company ?? null,
        message: input.message ?? null,
        budgetRange: input.budgetRange ?? null,
        source,
        captureSurface,
        assignedAgentId: referral?.assignedAgentId ?? null,
        referralAgentId: referral?.referralAgentId ?? null,
        referralAgentCode: referral?.referralAgentCode ?? null,
      },
      select: { id: true },
    });

    await tx.leadActivity.create({
      data: {
        leadId: lead.id,
        type: "CREATED",
        metadata: {
          captureSurface,
          source,
          referral: referral
            ? {
                code: referral.referralAgentCode,
                assignedToReferralAgent: Boolean(referral.assignedAgentId),
              }
            : null,
        },
      },
    });

    return lead;
  });
}
