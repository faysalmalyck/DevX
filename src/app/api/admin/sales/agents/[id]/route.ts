import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { hasValidAdminCsrf } from "@/lib/auth/admin-authorization";
import { authorizeSalesGovernance } from "@/lib/auth/sales-governance";
import {
  reactivateSalesAccount,
  revokeSalesAccountSessions,
  SalesAccountLifecycleError,
  suspendSalesAccount,
} from "@/lib/sales/agent-lifecycle";

const idSchema = z.string().trim().min(1).max(128);
const mutationSchema = z
  .object({
    action: z.enum(["suspend", "reactivate", "revoke-sessions"]),
    reassignToAgentId: z.string().trim().min(1).max(128).optional(),
  })
  .strict();

type RouteContext = { params: Promise<{ id: string }> };

function noStoreJson(data: unknown, init?: ResponseInit): NextResponse {
  const headers = new Headers(init?.headers);
  headers.set("Cache-Control", "private, no-store, max-age=0");
  headers.set("Vary", "Cookie");
  return NextResponse.json(data, { ...init, headers });
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const authorization = await authorizeSalesGovernance();
  if (!authorization.ok) {
    return noStoreJson(
      { error: authorization.status === 401 ? "Authentication is required." : "Sales Management access is restricted." },
      { status: authorization.status }
    );
  }
  if (!hasValidAdminCsrf(request)) {
    return noStoreJson({ error: "Invalid request token." }, { status: 403 });
  }

  const { id: rawId } = await params;
  const id = idSchema.safeParse(rawId);
  if (!id.success) return noStoreJson({ error: "Sales account not found." }, { status: 404 });

  const body = await request.json().catch(() => null);
  const parsed = mutationSchema.safeParse(body);
  if (!parsed.success) return noStoreJson({ error: "Invalid Sales account action." }, { status: 400 });

  try {
    const result = parsed.data.action === "suspend"
      ? await suspendSalesAccount({
          actorId: authorization.session.id,
          accountId: id.data,
          reassignToAgentId: parsed.data.reassignToAgentId,
        })
      : parsed.data.action === "reactivate"
        ? await reactivateSalesAccount({
            actorId: authorization.session.id,
            accountId: id.data,
          })
        : await revokeSalesAccountSessions({
            actorId: authorization.session.id,
            accountId: id.data,
          });

    return noStoreJson({ success: true, result });
  } catch (error) {
    if (error instanceof SalesAccountLifecycleError) {
      return noStoreJson({ error: error.message }, { status: error.status });
    }

    console.error("Sales account lifecycle update failed", error);
    return noStoreJson({ error: "Unable to update this Sales account right now." }, { status: 500 });
  }
}
