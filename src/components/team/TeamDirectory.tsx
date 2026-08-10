"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { teamMembers, TeamMember } from "@/data/team";

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
          className="w-full max-w-xs rounded-lg border border-gray-300 px-4 py-2 text-sm dark:border-gray-700 dark:bg-[#242D40] dark:text-white"
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
          <div
            key={member.id}
            className="flex flex-col justify-between rounded-lg border border-gray-300 bg-gray-50/50 p-6 dark:border-[#2f384f] dark:bg-[#242D40]"
          >
            <div>
              <div className="relative mb-4 h-48 w-full overflow-hidden rounded-lg">
                <Image
                  src={member.imageUrl}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {member.name}
              </h3>
              <p className="text-sm text-brand font-medium">{member.role}</p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {member.bio}
              </p>
            </div>
            <Link
              href={`/team/${member.slug}`}
              className="mt-4 inline-block text-sm font-medium text-brand hover:underline dark:text-brand no-underline"
            >
              View Profile &rarr;
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}