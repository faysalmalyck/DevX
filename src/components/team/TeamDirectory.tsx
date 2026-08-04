"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Code2, LinkIcon, Mail, Sparkles } from "lucide-react";
import { defaultTeamMembers, TEAM_STORAGE_KEY, type TeamMember } from "@/data/team";
import { getImgPath } from "@/utils/image";

function MemberCard({ member, leadership }: { member: TeamMember; leadership?: boolean }) {
  return (
    <article className={`glass-card group relative h-full overflow-hidden rounded-[2rem] p-4 transition-all duration-500 hover:-translate-y-2 ${leadership ? "md:flex md:items-center md:gap-8 md:p-6" : ""}`}>
      <div className={`relative overflow-hidden rounded-[1.5rem] bg-[#181d2b] ${leadership ? "aspect-[4/4.5] shrink-0 md:w-72" : "aspect-[4/4.6]"}`}>
        <Image src={getImgPath(member.image)} alt={`${member.name}, ${member.role}`} width={700} height={800} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" quality={100} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#181d2b]/92 via-[#181d2b]/18 to-transparent" />
        {!leadership && <div className="absolute bottom-5 left-5 right-5"><span className="mb-3 inline-flex rounded-full border border-white/15 bg-white/12 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-Sky-blue-mist backdrop-blur-xl">{member.role}</span><h2 className="text-2xl font-black text-white">{member.name}</h2></div>}
      </div>
      <div className={leadership ? "py-2" : "px-2 pb-2 pt-6"}>
        {leadership && <><span className="mb-3 inline-flex rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-amber-500">{member.role}</span><h2 className="text-3xl font-black tracking-tight text-white md:text-4xl">{member.name}</h2></>}
        <p className="mt-4 text-base leading-7 text-secondary dark:text-white/65">{member.description}</p>
        <div className="mt-6 flex items-center gap-3">
          {[LinkIcon, Code2, Mail].map((Icon, index) => <span key={index} className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-950/10 bg-white/60 text-secondary dark:border-white/10 dark:bg-white/[0.06] dark:text-white/65"><Icon className="h-4 w-4" /></span>)}
        </div>
      </div>
    </article>
  );
}

export default function TeamDirectory() {
  const [members, setMembers] = useState(defaultTeamMembers);

  useEffect(() => {
    const stored = window.localStorage.getItem(TEAM_STORAGE_KEY);
    if (!stored) return;
    try { setMembers(JSON.parse(stored)); } catch { window.localStorage.removeItem(TEAM_STORAGE_KEY); }
  }, []);

  const visibleMembers = members.filter((member) => member.visible);
  const leadership = visibleMembers.filter((member) => member.department === "Leadership");
  const groups = ["Engineering", "Sales & Growth"] as const;

  return <main>
    <section className="premium-shell premium-mesh relative pb-16 pt-32 md:pb-24 md:pt-44"><div className="container relative z-10 mx-auto max-w-6xl px-4 text-center"><div className="premium-badge mx-auto mb-6 w-fit"><span className="h-2 w-2 rounded-full bg-success" />DevX studio</div><h1 className="premium-heading mx-auto mt-7 max-w-4xl">Meet the Professionals Behind DevX</h1><p className="premium-copy mx-auto mt-6 max-w-3xl">A focused team building modern digital products for growing businesses.</p></div></section>
    <section className="relative overflow-hidden bg-section py-20 dark:bg-darkmode"><div className="container relative mx-auto max-w-5xl px-4">
      {leadership.map((member) => <div key={member.id} className="mb-20 flex justify-center"><div className="w-full max-w-3xl relative"><div className="absolute right-8 top-8 z-20 hidden items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold tracking-wide text-amber-500 sm:flex"><Sparkles className="h-3.5 w-3.5" />Leadership</div><MemberCard member={member} leadership /></div></div>)}
      {groups.map((group) => { const groupMembers = visibleMembers.filter((member) => member.department === group); return groupMembers.length ? <div key={group}><div className="relative mb-12 flex items-center justify-center"><div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" /><span className="absolute bg-[#181d2b] px-4 text-xs font-semibold tracking-widest text-white/30 uppercase">{group} Division</span></div><div className="mb-24 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mx-auto lg:max-w-4xl">{groupMembers.map((member) => <MemberCard key={member.id} member={member} />)}</div></div> : null; })}
    </div></section>
  </main>;
}
