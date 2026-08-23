"use client";

import { CalendarPlus, CircleCheck, FilePenLine, PhoneCall, RefreshCw } from "lucide-react";
import { type FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { getClientCsrfToken } from "@/lib/auth/client-csrf";

type LeadActivityActionsProps = {
  leadId: string;
  currentStatus: string;
  canManage: boolean;
  hasAssignee: boolean;
};

const forwardTransitions: Record<string, string[]> = {
  NEW: ["CONTACTED", "QUALIFIED", "LOST"],
  CONTACTED: ["QUALIFIED", "LOST"],
  QUALIFIED: ["PROPOSAL_SENT", "NEGOTIATION", "LOST"],
  PROPOSAL_SENT: ["NEGOTIATION", "WON", "LOST"],
  NEGOTIATION: ["WON", "LOST"],
};
const reopenTransitions = ["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL_SENT", "NEGOTIATION"];
const closedStatuses = new Set(["WON", "LOST", "DUPLICATE"]);

function label(value: string) {
  return value.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

async function csrfHeaders(): Promise<HeadersInit> {
  let token = getClientCsrfToken();
  if (!token) {
    const response = await fetch("/api/auth/csrf", { credentials: "same-origin" });
    if (!response.ok) throw new Error("Unable to verify this request. Please try again.");
    token = getClientCsrfToken();
  }
  if (!token) throw new Error("Unable to verify this request. Please try again.");
  return { "Content-Type": "application/json", "X-CSRF-Token": token };
}

export default function LeadActivityActions({
  leadId,
  currentStatus,
  canManage,
  hasAssignee,
}: LeadActivityActionsProps) {
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [reason, setReason] = useState("");
  const [duplicateOfId, setDuplicateOfId] = useState("");
  const [note, setNote] = useState("");
  const [followUpAt, setFollowUpAt] = useState("");
  const [followUpNote, setFollowUpNote] = useState("");
  const [busy, setBusy] = useState<"status" | "note" | "contact" | "follow-up" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const allowedStatuses = useMemo(() => {
    if (closedStatuses.has(currentStatus)) {
      return canManage ? reopenTransitions : [];
    }
    return [
      ...(forwardTransitions[currentStatus] ?? []),
      ...(canManage ? ["DUPLICATE"] : []),
    ];
  }, [canManage, currentStatus]);

  const submitJson = async (url: string, body: unknown) => {
    const response = await fetch(url, {
      method: "POST",
      credentials: "same-origin",
      headers: await csrfHeaders(),
      body: JSON.stringify(body),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(typeof payload?.error === "string" ? payload.error : "Unable to save this change.");
    return payload;
  };

  const updateStatus = async (event: FormEvent) => {
    event.preventDefault();
    if (!status) return;
    setBusy("status");
    setError(null);
    setNotice(null);
    try {
      const response = await fetch(`/api/admin/leads/${encodeURIComponent(leadId)}`, {
        method: "PATCH",
        credentials: "same-origin",
        headers: await csrfHeaders(),
        body: JSON.stringify({
          status,
          ...(status === "LOST" ? { lostReason: reason } : {}),
          ...(closedStatuses.has(currentStatus) ? { reopenReason: reason } : {}),
          ...(status === "DUPLICATE" ? { duplicateOfId } : {}),
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(typeof payload?.error === "string" ? payload.error : "Unable to update the lead status.");
      setStatus("");
      setReason("");
      setDuplicateOfId("");
      setNotice("Lead status updated.");
      router.refresh();
    } catch (statusError) {
      setError(statusError instanceof Error ? statusError.message : "Unable to update the lead status.");
    } finally {
      setBusy(null);
    }
  };

  const addActivity = async (type: "NOTE" | "CONTACT_ATTEMPT") => {
    if (!note.trim()) {
      setError(type === "NOTE" ? "Write a note before saving it." : "Add a short contact outcome before recording it.");
      return;
    }
    setBusy(type === "NOTE" ? "note" : "contact");
    setError(null);
    setNotice(null);
    try {
      await submitJson(`/api/admin/leads/${encodeURIComponent(leadId)}/activities`, { type, note });
      setNote("");
      setNotice(type === "NOTE" ? "Note added to the timeline." : "Contact attempt recorded.");
      router.refresh();
    } catch (activityError) {
      setError(activityError instanceof Error ? activityError.message : "Unable to add this activity.");
    } finally {
      setBusy(null);
    }
  };

  const scheduleFollowUp = async (event: FormEvent) => {
    event.preventDefault();
    if (!followUpAt) {
      setError("Choose when this follow-up is due.");
      return;
    }
    setBusy("follow-up");
    setError(null);
    setNotice(null);
    try {
      await submitJson(`/api/admin/leads/${encodeURIComponent(leadId)}/follow-ups`, {
        dueAt: new Date(followUpAt).toISOString(),
        ...(followUpNote.trim() ? { note: followUpNote } : {}),
      });
      setFollowUpAt("");
      setFollowUpNote("");
      setNotice("Follow-up scheduled.");
      router.refresh();
    } catch (followUpError) {
      setError(followUpError instanceof Error ? followUpError.message : "Unable to schedule this follow-up.");
    } finally {
      setBusy(null);
    }
  };

  const needsReason = status === "LOST" || closedStatuses.has(currentStatus);
  const reasonLabel = status === "LOST" ? "Lost reason" : "Reason for reopening";

  return (
    <section className="rounded-lg border border-white/[0.08] bg-[#111a2d] p-5 sm:p-6">
      <div className="flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/15 text-cyan-200"><CircleCheck className="h-5 w-5" /></span><div><p className="text-xs font-bold uppercase tracking-[0.15em] text-cyan-200/70">Next action</p><h3 className="mt-1 text-lg font-black">Move the conversation forward</h3><p className="mt-1 text-sm text-slate-400">Every update is recorded in the lead timeline and audit log.</p></div></div>
      {error ? <p role="alert" className="mt-4 rounded-lg border border-rose-300/20 bg-rose-500/10 px-3 py-2.5 text-sm text-rose-100">{error}</p> : null}
      {notice ? <p role="status" className="mt-4 rounded-lg border border-emerald-300/20 bg-emerald-500/10 px-3 py-2.5 text-sm text-emerald-100">{notice}</p> : null}

      {allowedStatuses.length > 0 ? <form onSubmit={updateStatus} className="mt-5 rounded-lg border border-white/[0.08] bg-black/10 p-4"><label className="block text-sm font-bold">Pipeline status<select value={status} onChange={(event) => setStatus(event.target.value)} className="mt-1.5 w-full rounded-lg border border-white/[0.1] bg-[#0B1120] px-3 py-2.5 text-sm outline-none focus:border-cyan-300/50"><option value="">Choose next stage</option>{allowedStatuses.map((nextStatus) => <option key={nextStatus} value={nextStatus}>{label(nextStatus)}</option>)}</select></label>{needsReason ? <label className="mt-3 block text-sm font-bold">{reasonLabel}<textarea value={reason} onChange={(event) => setReason(event.target.value)} required rows={3} className="mt-1.5 w-full rounded-lg border border-white/[0.1] bg-[#0B1120] px-3 py-2.5 text-sm outline-none focus:border-cyan-300/50" /></label> : null}{status === "DUPLICATE" ? <label className="mt-3 block text-sm font-bold">Canonical lead ID<input value={duplicateOfId} onChange={(event) => setDuplicateOfId(event.target.value)} required className="mt-1.5 w-full rounded-lg border border-white/[0.1] bg-[#0B1120] px-3 py-2.5 text-sm outline-none focus:border-cyan-300/50" placeholder="Paste the canonical lead ID" /></label> : null}<button type="submit" disabled={busy !== null || !status} className="mt-3 inline-flex items-center gap-2 rounded-lg bg-brand px-3.5 py-2.5 text-sm font-bold text-white disabled:opacity-50">{busy === "status" ? <RefreshCw className="h-4 w-4 animate-spin" /> : <CircleCheck className="h-4 w-4" />}Update status</button></form> : <p className="mt-5 rounded-lg border border-white/[0.08] bg-black/10 px-4 py-3 text-sm text-slate-400">{closedStatuses.has(currentStatus) ? "Only a Sales Manager can reopen this closed lead." : "This lead is already at the final stage available to your role."}</p>}

      <div className="mt-5 grid gap-4 xl:grid-cols-2"><div className="rounded-lg border border-white/[0.08] bg-black/10 p-4"><div className="flex items-center gap-2"><FilePenLine className="h-4 w-4 text-cyan-200" /><h4 className="text-sm font-black">Add timeline activity</h4></div><textarea value={note} onChange={(event) => setNote(event.target.value)} rows={4} maxLength={5000} placeholder="Capture context, a decision, or the outcome of a call…" className="mt-3 w-full rounded-lg border border-white/[0.1] bg-[#0B1120] px-3 py-2.5 text-sm outline-none placeholder:text-slate-600 focus:border-cyan-300/50" /><div className="mt-3 flex flex-wrap gap-2"><button type="button" onClick={() => void addActivity("NOTE")} disabled={busy !== null} className="rounded-lg border border-white/[0.1] px-3 py-2 text-xs font-bold text-slate-200 hover:bg-white/[0.08] disabled:opacity-50">{busy === "note" ? "Saving…" : "Add note"}</button><button type="button" onClick={() => void addActivity("CONTACT_ATTEMPT")} disabled={busy !== null} className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-xs font-bold text-cyan-100 hover:bg-cyan-300/15 disabled:opacity-50"><PhoneCall className="h-3.5 w-3.5" />{busy === "contact" ? "Saving…" : "Log contact attempt"}</button></div></div><form onSubmit={scheduleFollowUp} className="rounded-lg border border-white/[0.08] bg-black/10 p-4"><div className="flex items-center gap-2"><CalendarPlus className="h-4 w-4 text-violet-200" /><h4 className="text-sm font-black">Schedule follow-up</h4></div>{!hasAssignee ? <p className="mt-3 rounded-md bg-amber-400/10 px-3 py-2 text-xs leading-5 text-amber-100">Assign this lead to an active Sales Agent before scheduling a follow-up.</p> : null}<label className="mt-3 block text-sm font-bold">Due date and time<input type="datetime-local" value={followUpAt} onChange={(event) => setFollowUpAt(event.target.value)} required disabled={!hasAssignee || busy !== null} className="mt-1.5 w-full rounded-lg border border-white/[0.1] bg-[#0B1120] px-3 py-2.5 text-sm outline-none focus:border-violet-300/50 disabled:opacity-50" /></label><label className="mt-3 block text-sm font-bold">Context <span className="font-normal text-slate-500">(optional)</span><textarea value={followUpNote} onChange={(event) => setFollowUpNote(event.target.value)} rows={2} disabled={!hasAssignee || busy !== null} className="mt-1.5 w-full rounded-lg border border-white/[0.1] bg-[#0B1120] px-3 py-2.5 text-sm outline-none focus:border-violet-300/50 disabled:opacity-50" /></label><button type="submit" disabled={!hasAssignee || busy !== null} className="mt-3 inline-flex items-center gap-2 rounded-lg bg-violet-500 px-3.5 py-2.5 text-sm font-bold text-white hover:bg-violet-400 disabled:opacity-50">{busy === "follow-up" ? <RefreshCw className="h-4 w-4 animate-spin" /> : <CalendarPlus className="h-4 w-4" />}Schedule follow-up</button></form></div>
    </section>
  );
}
