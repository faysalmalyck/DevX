import { NextResponse } from "next/server";

import { authorizeSalesGovernance } from "@/lib/auth/sales-governance";
import { listSalesTeamAccounts } from "@/lib/sales/agent-lifecycle";

function noStoreJson(data: unknown, init?: ResponseInit): NextResponse {
  const headers = new Headers(init?.headers);
  headers.set("Cache-Control", "private, no-store, max-age=0");
  headers.set("Vary", "Cookie");
  return NextResponse.json(data, { ...init, headers });
}

export async function GET() {
  const authorization = await authorizeSalesGovernance();
  if (!authorization.ok) {
    return noStoreJson(
      { error: authorization.status === 401 ? "Authentication is required." : "Sales Management access is restricted." },
      { status: authorization.status }
    );
  }

  try {
    const accounts = await listSalesTeamAccounts();
    return noStoreJson({
      accounts: accounts.map((account) => ({
        ...account,
        lastLogin: account.lastLogin?.toISOString() ?? null,
        createdAt: account.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Sales team list failed", error);
    return noStoreJson({ error: "Unable to load Sales Team right now." }, { status: 500 });
  }
}
