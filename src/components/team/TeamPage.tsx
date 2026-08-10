"use client";

import Link from "next/link";
import { HoverCard, ScrollReveal, StaggerContainer, StaggerItem } from "@/components/motion";
import type { PublicTeamMember } from "@/lib/team/types";
import { getImgPath } from "@/utils/image";

type SocialNetwork = "Facebook" | "X" | "GitHub" | "LinkedIn";

function fallbackImage() {
  return getImgPath("/images/hero/hero.png");
}

function teamImageSource(image: string | null) {
  if (!image) return fallbackImage();
  if (image.startsWith("/") && !image.startsWith("//")) return getImgPath(image);

  return safeExternalUrl(image) ?? fallbackImage();
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

function SocialIcon({ network }: { network: SocialNetwork }) {
  if (network === "Facebook") {
    return <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>;
  }

  if (network === "X") {
    return <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>;
  }

  if (network === "GitHub") {
    return <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>;
  }

  return <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.451 20.451h-3.554v-5.569c0-1.328-.027-3.037-1.849-3.037-1.849 0-2.132 1.445-2.132 2.94v5.666H9.362V8.999h3.413v1.561h.049c.476-.9 1.637-1.849 3.37-1.849 3.602 0 4.267 2.37 4.267 5.455v6.285zM5.337 7.433a2.062 2.062 0 110-4.124 2.062 2.062 0 010 4.124zM7.119 20.451H3.555V8.999h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.771 24h20.451C23.2 24 24 23.226 24 22.271V1.729C24 .774 23.2 0 22.225 0z" /></svg>;
}

function TeamMemberCard({ member }: { member: PublicTeamMember }) {
  const socialLinks = [
    { label: "Facebook", href: safeExternalUrl(member.facebookUrl), network: "Facebook" as const },
    { label: "X", href: safeExternalUrl(member.twitterUrl), network: "X" as const },
    { label: "GitHub", href: safeExternalUrl(member.githubUrl), network: "GitHub" as const },
    { label: "LinkedIn", href: safeExternalUrl(member.linkedinUrl), network: "LinkedIn" as const },
  ].filter((link): link is { label: string; href: string; network: SocialNetwork } => link.href !== null);

  return (
    <StaggerItem className="w-full max-w-[596px]" preset="card">
      <HoverCard className="h-full">
        <article className="relative flex h-full w-full flex-col justify-between rounded-lg border border-gray-300 bg-gray-50/50 p-8 transition-all duration-400 ease-out dark:border-[#2f384f] dark:bg-gradient-to-b dark:from-[#252E41] dark:via-[#242D40] dark:to-[#1D2336] sm:p-10 lg:p-12">
          {member.featured ? (
            <span className="absolute right-5 top-5 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-brand dark:bg-brand/15 dark:text-brand">
              Featured
            </span>
          ) : null}

          <div className="flex items-start justify-between gap-3 sm:gap-4">
            <div className="flex min-w-0 items-center space-x-3 sm:space-x-4">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg sm:h-16 sm:w-16">
                <ScrollReveal className="h-full w-full" preset="image">
                  <img
                    src={teamImageSource(member.image)}
                    alt={member.name}
                    onError={(event) => { event.currentTarget.src = fallbackImage(); }}
                    className="h-full w-full object-cover"
                  />
                </ScrollReveal>
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold tracking-tight text-gray-900 dark:text-white" style={{ fontSize: "clamp(0.875rem, 2.5vw, 1.25rem)", lineHeight: "1.2" }}>
                  {member.name}
                </h2>
                <p className="mt-0.5 font-normal text-gray-500 dark:text-slate-400" style={{ fontSize: "clamp(0.7rem, 2vw, 1rem)", lineHeight: "1.2" }}>
                  {member.role}
                </p>
                <p className="mt-1 text-xs font-medium text-brand dark:text-brand">{member.department}</p>
              </div>
            </div>

            {socialLinks.length > 0 ? (
              <div className="flex shrink-0 flex-wrap justify-end gap-2 text-gray-400 dark:text-white sm:gap-3">
                {socialLinks.map(({ label, href, network }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="transition hover:opacity-80 no-underline"
                    aria-label={`${member.name}'s ${label}`}
                  >
                    <SocialIcon network={network} />
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          <p className="mt-4 text-sm font-normal leading-relaxed text-gray-600 dark:text-slate-300 sm:mt-6 sm:text-base">
            {member.bio}
          </p>
        </article>
      </HoverCard>
    </StaggerItem>
  );
}

export default function TeamSection({ members }: { members: PublicTeamMember[] }) {
  return (
    <section className="relative overflow-hidden bg-white pb-4 pt-36 dark:bg-[#181d2b] sm:pb-16 sm:pt-40 lg:pb-24 lg:pt-48">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-8 max-w-[650px] text-center sm:mb-12">
          <ScrollReveal preset="hero">
            <h1 className="text-4xl font-medium tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
              Meet the <span className="text-brand">amazing team</span> behind <span className="whitespace-nowrap">our company</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal className="mt-4" delay={0.12} preset="copy">
            <p className="text-sm font-normal text-gray-600 dark:text-gray-400 sm:text-base lg:text-lg">
              The talented professionals behind our company combining creativity, technical expertise, and innovation to deliver exceptional digital solutions.
            </p>
          </ScrollReveal>
        </div>

        {members.length > 0 ? (
          <div className="mx-auto w-full max-w-[1220px]">
            <StaggerContainer className="grid grid-cols-1 justify-items-center gap-6 lg:grid-cols-2">
              {members.map((member) => <TeamMemberCard key={member.id} member={member} />)}
            </StaggerContainer>
          </div>
        ) : (
          <p className="py-12 text-center text-gray-600 dark:text-gray-400">Our team profiles will be available soon.</p>
        )}

        <ScrollReveal className="mt-8 flex justify-center py-16" delay={0.16} preset="copy">
          <Link href="/careers" className="w-full max-w-[280px] rounded-full bg-brand px-6 py-5 text-center text-sm font-medium text-white no-underline transition-all duration-200 hover:bg-brand hover:shadow-[0_0_20px_rgba(54,88,255,0.4)] active:scale-95 sm:w-auto sm:max-w-none sm:px-10 sm:py-6">
            Join Our Team
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
