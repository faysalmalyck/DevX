"use client";

import Image from "next/image";
import Link from "next/link";
import { useInView } from "@/hooks/useInView";
import { teamMembers, TeamMember } from "@/data/team";

function TeamMemberCard({ member, index }: { member: TeamMember; index: number }) {
  const { ref, isInView } = useInView({ threshold: 0.1, triggerOnce: true, rootMargin: "-50px" });

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${index * 100}ms` }}
      className={`flex w-full max-w-[596px] flex-col justify-between rounded-lg border border-gray-300 bg-gray-50/50 p-8 transition-all duration-400 ease-out dark:border-[#2f384f] dark:bg-gradient-to-b dark:from-[#252E41] dark:via-[#242D40] dark:to-[#1D2336] sm:p-10 lg:p-12 hover:scale-[1.02] ${
        isInView ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
    >
      {/* Header: Avatar, Name & Social Icons */}
      <div className="flex items-center justify-between gap-3 sm:gap-4">
        <Link
          href={`/team/${member.slug}`}
          className="group flex min-w-0 items-center space-x-3 sm:space-x-4 no-underline"
        >
          <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg sm:h-16 sm:w-16">
            <Image
              src={member.imageUrl}
              alt={member.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 48px, 64px"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h3
              className="font-semibold tracking-tight text-gray-900 dark:text-white"
              style={{ fontSize: "clamp(0.875rem, 2.5vw, 1.25rem)", lineHeight: "1.2" }}
            >
              {member.name}
            </h3>
            <div
              className="mt-0.5 font-normal text-gray-500 dark:text-slate-400"
              style={{ fontSize: "clamp(0.7rem, 2vw, 1rem)", lineHeight: "1.2" }}
            >
              {member.role}
            </div>
          </div>
        </Link>

        {/* Social Media Links */}
        <div className="flex flex-shrink-0 items-center space-x-2 text-gray-400 dark:text-white sm:space-x-4">
          {member.socials?.facebook && (
            <a
              href={member.socials.facebook}
              target="_blank"
              rel="noreferrer"
              className="transition hover:opacity-80 no-underline"
              aria-label={`${member.name}'s Facebook`}
            >
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
          )}
          {member.socials?.twitter && (
            <a
              href={member.socials.twitter}
              target="_blank"
              rel="noreferrer"
              className="transition hover:opacity-80 no-underline"
              aria-label={`${member.name}'s Twitter`}
            >
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          )}
          {member.socials?.github && (
            <a
              href={member.socials.github}
              target="_blank"
              rel="noreferrer"
              className="transition hover:opacity-80 no-underline"
              aria-label={`${member.name}'s GitHub`}
            >
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
            </a>
          )}
        </div>
      </div>

      {/* Description Paragraph */}
      <Link href={`/team/${member.slug}`} className="no-underline">
        <p className="mt-4 text-sm font-normal leading-relaxed text-gray-600 dark:text-slate-300 sm:mt-6 sm:text-base">
          {member.bio}
        </p>
      </Link>
    </div>
  );
}

export default function TeamSection() {
  return (
    <section className="relative overflow-hidden bg-white pt-36 pb-4 dark:bg-[#181d2b] sm:pt-40 sm:pb-16 lg:pt-48 lg:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mx-auto mb-8 max-w-[650px] text-center sm:mb-12">
          <h2 className="text-4xl font-normal tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
            Meet the <span className="text-blue-500">amazing team</span> behind{" "}
            <span className="whitespace-nowrap">our company</span>
          </h2>
          <p className="mt-4 text-sm font-normal text-gray-600 dark:text-gray-400 sm:text-base lg:text-lg">
            The talented professionals behind our company combining creativity technical expertise and innovation to deliver exceptional digital solutions.
          </p>
        </div>

        {/* Team Grid Container */}
        <div className="mx-auto w-full max-w-[1220px]">
          <div className="grid grid-cols-1 justify-items-center gap-6 lg:grid-cols-2">
            {teamMembers.map((member, index) => (
              <TeamMemberCard key={member.id} member={member} index={index} />
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-center py-16">
          <Link
            href="/careers"
            className="w-full max-w-[280px] sm:w-auto sm:max-w-none text-center rounded-full bg-blue-600 px-6 sm:px-10 py-5 sm:py-6 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] active:scale-95 no-underline"
          >
            Join Our Team
          </Link>
        </div>
      </div>
    </section>
  );
}