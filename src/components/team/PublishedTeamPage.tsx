"use client";

import { LinkIcon, Sparkles } from "lucide-react";
import type { PublicTeamMember } from "@/lib/team/types";
import { getImgPath } from "@/utils/image";

type SocialLink = { label: string; href: string };

function fallbackImage() {
  return getImgPath("/images/hero/hero.png");
}

function safeExternalUrl(value: string | null) {
  if (!value) return null;

  try {
    const { protocol } = new URL(value);
    return protocol === "https:" || protocol === "http:" ? value : null;
  } catch {
    return null;
  }
}

function teamImageSource(image: string | null) {
  if (!image) return fallbackImage();
  if (image.startsWith("/") && !image.startsWith("//")) return getImgPath(image);

  return safeExternalUrl(image) ?? fallbackImage();
}

function getSocialLinks(member: PublicTeamMember): SocialLink[] {
  return [
    { label: "LinkedIn", href: safeExternalUrl(member.linkedinUrl) },
    { label: "Facebook", href: safeExternalUrl(member.facebookUrl) },
    { label: "X", href: safeExternalUrl(member.twitterUrl) },
    { label: "GitHub", href: safeExternalUrl(member.githubUrl) },
  ].filter((link): link is SocialLink => link.href !== null);
}

function ProfileImage({ member, className }: { member: PublicTeamMember; className: string }) {
  return (
    <img
      src={teamImageSource(member.image)}
      alt={`${member.name}, ${member.role}`}
      onError={(event) => { event.currentTarget.src = fallbackImage(); }}
      className={className}
    />
  );
}

function SocialLinks({ member, className }: { member: PublicTeamMember; className: string }) {
  const links = getSocialLinks(member);
  if (links.length === 0) return null;

  return (
    <div className={className}>
      {links.map(({ label, href }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={`${member.name}'s ${label}`}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-950/10 bg-white/60 text-secondary transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-primary hover:text-white dark:border-white/10 dark:bg-white/[0.06] dark:text-white/65"
        >
          <LinkIcon className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">{label}</span>
        </a>
      ))}
    </div>
  );
}

function TeamMemberCard({ member, index }: { member: PublicTeamMember; index: number }) {
  return (
    <article
      className="glass-card group relative h-full overflow-hidden rounded-[2rem] p-4 transition-all duration-500 hover:-translate-y-2 hover:border-Sky-blue-mist/30 hover:shadow-[0_30px_90px_rgba(139,92,246,0.18)]"
      data-aos="fade-up"
      data-aos-delay={index * 120}
    >
      {member.featured ? (
        <span className="absolute right-7 top-7 z-10 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-500 backdrop-blur-md">
          Featured
        </span>
      ) : null}
      <div className="relative aspect-[4/4.6] overflow-hidden rounded-[1.5rem] bg-[#070A12]">
        <ProfileImage member={member} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070A12]/92 via-[#070A12]/18 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/18 via-transparent to-Sky-blue-mist/14 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="absolute bottom-5 left-5 right-5">
          <span className="mb-3 inline-flex rounded-full border border-white/15 bg-white/12 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-Sky-blue-mist backdrop-blur-xl">
            {member.role}
          </span>
          <h2 className="text-2xl font-black text-white">{member.name}</h2>
        </div>
      </div>

      <div className="px-2 pb-2 pt-6">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-primary">{member.department}</p>
        <p className="mt-3 text-base leading-7 text-secondary dark:text-white/65">{member.bio}</p>
        <SocialLinks member={member} className="mt-6 flex items-center gap-3" />
      </div>
    </article>
  );
}

export default function PublishedTeamPage({ members }: { members: PublicTeamMember[] }) {
  const spotlight = members.find((member) => member.featured) ?? members[0] ?? null;
  const groups = members
    .filter((member) => member.id !== spotlight?.id)
    .reduce<Array<{ department: string; members: PublicTeamMember[] }>>((result, member) => {
      const group = result.find(({ department }) => department === member.department);
      if (group) {
        group.members.push(member);
      } else {
        result.push({ department: member.department, members: [member] });
      }
      return result;
    }, []);

  return (
    <main>
      <section className="premium-shell premium-mesh relative pb-16 pt-32 md:pb-24 md:pt-44">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
        <div className="container relative z-10 mx-auto max-w-6xl px-4 text-center">
          <div className="premium-badge mx-auto mb-6 w-fit">
            <span className="h-2 w-2 rounded-full bg-success" />
            Vertex studio
          </div>
          <h1 className="premium-heading mx-auto mt-7 max-w-4xl">Meet the Professionals Behind Vertex</h1>
          <p className="premium-copy mx-auto mt-6 max-w-3xl">A focused team building modern digital products for growing businesses.</p>
        </div>
      </section>

      <section className="relative overflow-hidden bg-section py-20 dark:bg-darkmode">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(139,92,246,0.15),transparent_40rem),radial-gradient(circle_at_85%_60%,rgba(34,211,238,0.10),transparent_26rem)]" />
        <div className="container relative mx-auto max-w-5xl px-4">
          {spotlight ? (
            <div className="mb-20 flex justify-center">
              <article className="glass-card group relative w-full max-w-3xl overflow-hidden rounded-[2.5rem] p-6 transition-all duration-500 hover:-translate-y-2 hover:border-amber-500/30 hover:shadow-[0_30px_90px_rgba(245,158,11,0.15)]" data-aos="fade-up">
                <div className="absolute right-8 top-8 z-20 hidden items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold tracking-wide text-amber-500 backdrop-blur-md sm:flex">
                  <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                  {spotlight.featured ? "Featured" : "Team spotlight"}
                </div>
                <div className="flex flex-col gap-8 md:flex-row md:items-center">
                  <div className="relative aspect-[4/4.5] w-full shrink-0 overflow-hidden rounded-[2rem] bg-[#070A12] md:w-72">
                    <ProfileImage member={spotlight} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070A12]/92 via-[#070A12]/18 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-primary/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </div>
                  <div className="flex flex-col justify-between py-2">
                    <div>
                      <span className="mb-3 inline-flex rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-amber-500 backdrop-blur-xl">{spotlight.role}</span>
                      <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl">{spotlight.name}</h2>
                      <p className="mt-2 text-sm font-semibold uppercase tracking-[0.12em] text-primary">{spotlight.department}</p>
                      <p className="mt-4 text-base leading-relaxed text-secondary dark:text-white/70">{spotlight.bio}</p>
                    </div>
                    <SocialLinks member={spotlight} className="mt-8 flex items-center gap-3" />
                  </div>
                </div>
              </article>
            </div>
          ) : (
            <p className="py-16 text-center text-secondary dark:text-white/65">Our team profiles will be available soon.</p>
          )}

          {groups.map((group, groupIndex) => (
            <section key={group.department} className={groupIndex < groups.length - 1 ? "mb-24" : ""}>
              <div className="relative mb-12 flex items-center justify-center">
                <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-950/15 to-transparent dark:via-white/10" />
                <span className="absolute rounded-full border border-slate-950/10 bg-white/80 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-slate-700 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[#070A12]/80 dark:text-white/60">
                  {group.department}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mx-auto lg:max-w-4xl">
                {group.members.map((member, index) => <TeamMemberCard key={member.id} member={member} index={index} />)}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
