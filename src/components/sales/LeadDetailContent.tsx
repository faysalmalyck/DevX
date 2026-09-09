import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import LeadActivityActions from "@/components/sales/LeadActivityActions";
import { authorizeLead, leadScopeWhere } from "@/lib/auth/lead-authorization";
import { prisma } from "@/lib/db/prisma";

type LeadDetailContentProps = {
  params: Promise<{ id: string }>;
  basePath: string;
};

function label(value: string | null) {
  return value ? value.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()) : "—";
}

function money(value: { toString(): string } | null) {
  return value ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(value.toString())) : "—";
}

/** Shared server-rendered lead detail used by Sales operations and Super Admin oversight. */
export default async function LeadDetailContent({ params, basePath }: LeadDetailContentProps) {
  const { id } = await params;
  const authorization = await authorizeLead("VIEW", id);
  if (!authorization.ok) {
    if (authorization.status === 404) notFound();
    const isSalesWorkspace = basePath === "/sales";
    const returnTo = `${basePath}/leads/${id}`;
    redirect(
      authorization.status === 401
        ? `/login?portal=${isSalesWorkspace ? "sales" : "admin"}&returnTo=${encodeURIComponent(returnTo)}`
        : basePath,
    );
  }

  const lead = await prisma.lead.findFirst({
    where: { id, ...leadScopeWhere(authorization.scope, authorization.session.id) },
    include: {
      assignedAgent: { select: { firstName: true, lastName: true, agentCode: true } },
      referralAgent: { select: { firstName: true, lastName: true, agentCode: true } },
      activities: {
        orderBy: { createdAt: "desc" },
        include: { actor: { select: { firstName: true, lastName: true } } },
      },
      followUps: { where: { deletedAt: null }, orderBy: { dueAt: "asc" } },
    },
  });
  if (!lead) notFound();

  const canManage = authorization.scope === "ALL";

  return <div className="space-y-6"><Link href={`${basePath}/leads`} className="inline-flex text-sm font-bold text-brand hover:underline dark:text-cyan-200">← Back to leads</Link><section className="cart-skin-box rounded-xl p-5 sm:p-6"><div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-brand dark:text-cyan-200/70">{label(lead.source)}</p><h2 className="mt-1 text-3xl font-black tracking-tight text-slate-900 dark:text-white">{lead.fullName}</h2><p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{lead.company || "No company supplied"} · {lead.email}{lead.phone ? ` · ${lead.phone}` : ""}</p></div><span className="rounded-full bg-brand/15 px-3 py-1.5 text-sm font-bold text-brand dark:text-cyan-100">{label(lead.status)}</span></div><div className="mt-6 grid gap-4 border-t border-slate-200 pt-5 dark:border-slate-700/60 sm:grid-cols-2 xl:grid-cols-4"><Detail label="Pipeline value" value={money(lead.estimatedValue)} /><Detail label="Owner" value={lead.assignedAgent ? `${lead.assignedAgent.firstName} ${lead.assignedAgent.lastName}` : "Unassigned"} /><Detail label="Capture surface" value={label(lead.captureSurface)} /><Detail label="Created" value={lead.createdAt.toLocaleString()} /></div>{lead.message ? <div className="mt-6 rounded-lg bg-slate-100 p-4 dark:bg-black/20"><p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Enquiry</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700 dark:text-slate-300">{lead.message}</p></div> : null}{lead.referralAgentCode ? <div className="mt-4 rounded-lg border border-violet-300/15 bg-violet-400/[0.06] p-4 text-sm"><span className="font-bold text-violet-600 dark:text-violet-200">Referral attribution:</span> {lead.referralAgent ? `${lead.referralAgent.firstName} ${lead.referralAgent.lastName}` : "Historical agent"} ({lead.referralAgentCode})</div> : null}{lead.lostReason ? <div className="mt-4 rounded-lg border border-rose-300/15 bg-rose-400/[0.06] p-4 text-sm text-rose-700 dark:text-rose-100"><span className="font-bold">Lost reason:</span> {lead.lostReason}</div> : null}</section><LeadActivityActions leadId={lead.id} currentStatus={lead.status} canManage={canManage} hasAssignee={Boolean(lead.assignedAgent)} /><section className="grid gap-6 xl:grid-cols-2"><div className="cart-skin-box rounded-xl p-5"><h3 className="text-lg font-bold text-slate-900 dark:text-white">Activity timeline</h3>{lead.activities.length ? <ol className="mt-4 space-y-4 border-l border-slate-200 pl-4 dark:border-slate-700/60">{lead.activities.map((activity) => <li key={activity.id} className="relative"><span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-cyan-400" /><p className="text-sm font-bold text-slate-900 dark:text-white">{label(activity.type)}</p>{activity.note ? <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{activity.note}</p> : null}<p className="mt-1 text-xs text-slate-500">{activity.actor ? `${activity.actor.firstName} ${activity.actor.lastName}` : "System"} · {activity.createdAt.toLocaleString()}</p></li>)}</ol> : <p className="mt-4 text-sm text-slate-500">No activity recorded.</p>}</div><div className="cart-skin-box rounded-xl p-5"><h3 className="text-lg font-bold text-slate-900 dark:text-white">Follow-ups</h3>{lead.followUps.length ? <ul className="mt-4 space-y-3">{lead.followUps.map((followUp) => <li key={followUp.id} className="rounded-lg bg-slate-100 p-3 dark:bg-black/20"><p className="text-sm font-bold text-slate-900 dark:text-white">{followUp.status === "PENDING" ? "Due" : label(followUp.status)} {followUp.dueAt.toLocaleString()}</p>{followUp.note ? <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{followUp.note}</p> : null}</li>)}</ul> : <p className="mt-4 text-sm text-slate-500">No follow-ups scheduled.</p>}</div></section></div>;
}

function Detail({ label: itemLabel, value }: { label: string; value: string }) {
  return <div><p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">{itemLabel}</p><p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-200">{value}</p></div>;
}
