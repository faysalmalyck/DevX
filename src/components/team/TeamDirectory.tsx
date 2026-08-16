"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { teamMembers, TeamMember } from "@/data/team";
import { HoverCard } from "@/components/motion";

export default function TeamDirectory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");

  const roles = ["All", ...Array.from(new Set(teamMembers.map((member: TeamMember) => member.role)))];

  const filteredMembers = teamMembers.filter((member: TeamMember) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.bio.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "All" || member.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="w-full">
      {/* Controls */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          placeholder="Search team members..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-xs rounded-lg border border-gray-300 px-4 py-2 text-base dark:border-gray-700 dark:bg-[#242D40] dark:text-white"
        />
        <div className="flex flex-wrap gap-2">
          {roles.map((role: string) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                selectedRole === role
                  ? "bg-brand text-white"
                  : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredMembers.map((member: TeamMember) => (
          <HoverCard key={member.id} className="h-full">
            <article className="group relative flex h-full flex-col justify-between rounded-lg border border-gray-300 bg-gray-50/50 p-6 transition-all duration-400 ease-out dark:border-[#2f384f] dark:bg-gradient-to-b dark:from-[#252E41] dark:via-[#242D40] dark:to-[#1D2336]">
              <div>
                <div className="relative mb-4 h-48 w-full overflow-hidden rounded-lg">
                  <Image
                    src={member.imageUrl}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {member.name}
                </h3>
                <p className="text-base text-brand font-medium">{member.role}</p>
                <p className="mt-2 text-base text-gray-600 dark:text-gray-300">
                  {member.bio}
                </p>
              </div>
              <Link
                href={`/team/${member.slug}`}
                className="mt-4 inline-flex items-center gap-1.5 text-base font-medium text-brand dark:text-brand no-underline"
              >
                <span>View Profile</span>
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
              </Link>
            </article>
          </HoverCard>
        ))}
      </div>
    </div>
  );
}