"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { IconType } from "react-icons";
import {
  FaFacebookF,
  FaGithub,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";
import { cartDialogStyles } from "@/components/shared/cartDialogStyles";
import type { PublicTeamMember } from "@/lib/team/types";
import { getImgPath } from "@/utils/image";

type SocialLink = {
  label: string;
  href: string;
  Icon: IconType;
};

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

function profileText(value: string | null) {
  const trimmed = value?.trim();
  return trimmed || null;
}

function socialLinks(member: PublicTeamMember): SocialLink[] {
  return [
    { label: "LinkedIn", href: safeExternalUrl(member.linkedinUrl), Icon: FaLinkedinIn },
    { label: "Facebook", href: safeExternalUrl(member.facebookUrl), Icon: FaFacebookF },
    { label: "X", href: safeExternalUrl(member.twitterUrl), Icon: FaXTwitter },
    { label: "GitHub", href: safeExternalUrl(member.githubUrl), Icon: FaGithub },
  ].filter((link): link is SocialLink => link.href !== null);
}

function DecorativeCurve() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute -left-32 top-36 hidden h-[440px] w-[440px] -rotate-12 opacity-75 lg:block"
      viewBox="0 0 480 480"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="teamProfileCurveGradient"
          x1="400"
          y1="80"
          x2="80"
          y2="400"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#4f6df5" stopOpacity="0" />
          <stop offset="25%" stopColor="#4f6df5" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#4360cb" stopOpacity="0.85" />
          <stop offset="75%" stopColor="#4f6df5" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#4360cb" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M 400 80 A 200 200 0 0 1 80 400"
        stroke="url(#teamProfileCurveGradient)"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function TeamMemberProfile({ member }: { member: PublicTeamMember }) {
  const about = profileText(member.about) ?? member.bio;
  const aboutParagraph2 = profileText(member.aboutParagraph2);
  const highlights = member.highlights
    .map((highlight) => highlight.trim())
    .filter(Boolean);
  const experience = profileText(member.experience);
  const links = socialLinks(member);

  return (
    <main className="relative min-h-screen overflow-hidden bg-white pb-24 pt-28 text-slate-900 dark:bg-[#181d2b] dark:text-white sm:pb-32 sm:pt-24 lg:pt-28">
      <DecorativeCurve />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/team"
          className="mt-12 mb-10 inline-flex items-center gap-2 text-base font-semibold text-slate-700 no-underline transition-all duration-300 hover:-translate-x-1 hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand dark:text-white dark:hover:text-brand sm:mt-20 sm:mb-20"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to team
        </Link>

        <div className="mx-auto max-w-5xl px-0 sm:px-10 lg:px-16">
          <article
            aria-labelledby="team-member-name"
            data-testid="team-member-profile-card"
            className={`mx-auto max-w-5xl rounded-xl border px-6 py-8 text-white ${cartDialogStyles.panel} sm:px-16 sm:py-14 lg:px-24 lg:py-20`}
          >
            {/* On mobile: centered column layout. On sm+: original row layout */}
            <header className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-center sm:gap-10 sm:text-left lg:gap-14">
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-[#414b62] bg-[#131927] sm:h-32 sm:w-32">
                <img
                  src={teamImageSource(member.image)}
                  alt={`${member.name}, ${member.role}`}
                  onError={(event) => { event.currentTarget.src = fallbackImage(); }}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <h1 id="team-member-name" className="mt-2 text-2xl font-bold tracking-tight text-white sm:mt-4 sm:text-3xl">
                  {member.name}
                </h1>
                <p className="mt-1 text-xl font-semibold text-[#c9d0e1] sm:text-2xl">
                  {member.role}
                </p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-blue-600 sm:text-sm">
                  {member.department}
                </p>
              </div>

              {links.length > 0 ? (
                <div className="flex flex-wrap justify-center gap-3 text-[#c9d0e1] sm:justify-end">
                  {links.map(({ label, href, Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${member.name}'s ${label}`}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#414b62] bg-white/[0.06] transition-all duration-300 hover:-translate-y-1 hover:border-brand hover:text-white"
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </a>
                  ))}
                </div>
              ) : null}
            </header>

            {/* Combined Single Section */}
            <section aria-labelledby="team-member-details" className="mt-8 space-y-6 sm:mt-10">
              <h2 id="team-member-details" className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                About {member.name}
              </h2>

              {/* About Paragraph 1 */}
              {about ? (
                <p className="text-base leading-7 text-slate-200 sm:text-xl sm:leading-9">
                  {about}
                </p>
              ) : null}

              {/* About Paragraph 2 */}
              {aboutParagraph2 ? (
                <p className="text-base leading-7 text-slate-200 sm:text-xl sm:leading-9">
                  {aboutParagraph2}
                </p>
              ) : null}

              {/* Highlights List with white dots shifted further right */}
              {highlights.length > 0 ? (
                <ul className="list-disc space-y-3 pl-10 text-base leading-4 text-slate-200 marker:text-white sm:text-lg sm:leading-9">
                  {highlights.map((highlight, index) => (
                    <li key={`${highlight}-${index}`}>{highlight}</li>
                  ))}
                </ul>
              ) : null}

              {/* Experience Subheading + Paragraph */}
              {experience ? (
                <div className="pt-6">
                  <h3 className="text-lg font-extrabold tracking-tight text-white sm:text-xl">
                    {member.name}&rsquo;s Experience
                  </h3>
                  <p className="mt-8 whitespace-pre-line text-base leading-7 text-slate-200 sm:text-xl sm:leading-9">
                    {experience}
                  </p>
                </div>
              ) : null}
            </section>
          </article>
        </div>
      </div>
    </main>
  );
}