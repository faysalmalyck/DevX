"use client";

import React, { useState, useEffect, type FormEvent } from "react";
import { useSession } from "@/contexts/SessionContext";
import { getClientCsrfToken } from "@/lib/auth/client-csrf";
import { User, Mail, Phone, Award, Briefcase, Globe, Clock, CheckCircle2, ShieldAlert, FileText, Camera } from "lucide-react";

export default function AdminProfileWorkspace() {
  const { user } = useSession();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [designation, setDesignation] = useState("");
  const [department, setDepartment] = useState("");
  const [bio, setBio] = useState("");
  const [timezone, setTimezone] = useState("UTC");
  const [language, setLanguage] = useState("en");
  const [avatar, setAvatar] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Sync profile details once user is loaded
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.email || "");
      setUsername(user.username || "");
      setPhone(user.phone || "");
      setDesignation(user.designation || "");
      setDepartment(user.department || "");
      setBio(user.bio || "");
      setLanguage(user.language || "en");
      setTimezone(user.timezone || "UTC");
      setAvatar(user.avatar || "");
    }
  }, [user]);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      let csrfToken = getClientCsrfToken();
      if (!csrfToken) {
        const csrfResponse = await fetch("/api/auth/csrf", { credentials: "same-origin" });
        if (!csrfResponse.ok) {
          throw new Error("Unable to verify this request. Please try again.");
        }
        csrfToken = getClientCsrfToken();
      }
      if (!csrfToken) {
        throw new Error("Unable to verify this request. Please try again.");
      }

      const res = await fetch("/api/admin/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfToken },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          username,
          phone: phone || null,
          designation: designation || null,
          department: department || null,
          bio: bio || null,
          timezone,
          language,
          avatar: avatar || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile settings.");
      }

      setSuccess("Profile settings saved successfully.");
      window.dispatchEvent(new Event("DevX-auth-change")); // reload profile details in context
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Profile Settings
        </h2>
        <p className="mt-2 text-zinc-400">
          Update your public designation, bio, contact details, and account preferences
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Profile Card Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-lg border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.01] p-6 shadow-xl backdrop-blur-md text-center">
            <div className="relative mx-auto w-24 h-24 mb-4">
              <div className="h-full w-full rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center font-bold text-3xl text-primary overflow-hidden">
                {avatar ? (
                  <img src={avatar} alt="avatar" className="h-full w-full object-cover" />
                ) : (
                  firstName ? firstName[0] : "O"
                )}
              </div>
              <label className="absolute bottom-0 right-0 p-1.5 rounded-full bg-primary border border-white/10 text-white cursor-pointer hover:brightness-110 transition shadow-lg">
                <Camera className="h-4 w-4" />
                <input
                  type="text"
                  placeholder="Avatar URL"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="hidden"
                />
              </label>
            </div>
            
            <h3 className="text-lg font-bold text-white tracking-tight truncate">
              {firstName} {lastName}
            </h3>
            <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mt-1">
              {designation || "Administrator"}
            </p>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs font-mono text-zinc-400">
              @{username}
            </div>

            {/* Avatar URL Input */}
            <div className="mt-6 text-left space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wide">Avatar Image Link</label>
              <input
                type="text"
                placeholder="https://example.com/avatar.jpg"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs text-white placeholder-zinc-600 outline-none focus:border-primary/50"
              />
            </div>
          </div>
        </div>

        {/* Profile Settings Form */}
        <div className="lg:col-span-8">
          <div className="rounded-lg border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.01] p-6 shadow-xl backdrop-blur-md">
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                {/* First Name */}
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    First Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-black/20 pl-11 pr-4 py-3 text-white placeholder-zinc-600 outline-none focus:border-primary/50"
                    />
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-600" />
                  </div>
                </div>

                {/* Last Name */}
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Last Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-black/20 pl-11 pr-4 py-3 text-white placeholder-zinc-600 outline-none focus:border-primary/50"
                    />
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-600" />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-black/20 pl-11 pr-4 py-3 text-white placeholder-zinc-600 outline-none focus:border-primary/50"
                    />
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-600" />
                  </div>
                </div>

                {/* Username */}
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Username
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-black/20 pl-11 pr-4 py-3 text-white placeholder-zinc-600 outline-none focus:border-primary/50"
                    />
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-600" />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full rounded-lg border border-white/10 bg-black/20 pl-11 pr-4 py-3 text-white placeholder-zinc-600 outline-none focus:border-primary/50"
                    />
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-600" />
                  </div>
                </div>

                {/* Job Title */}
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Designation
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      placeholder="Operator"
                      className="w-full rounded-lg border border-white/10 bg-black/20 pl-11 pr-4 py-3 text-white placeholder-zinc-600 outline-none focus:border-primary/50"
                    />
                    <Award className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-600" />
                  </div>
                </div>

                {/* Department */}
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Department
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="Infrastructure"
                      className="w-full rounded-lg border border-white/10 bg-black/20 pl-11 pr-4 py-3 text-white placeholder-zinc-600 outline-none focus:border-primary/50"
                    />
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-600" />
                  </div>
                </div>

                {/* Language */}
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Language
                  </label>
                  <div className="relative">
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-[#0c1222] pl-11 pr-4 py-3 text-zinc-300 outline-none focus:border-primary/50"
                    >
                      <option value="en">English (US)</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                    </select>
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-600" />
                  </div>
                </div>

                {/* Timezone */}
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Timezone
                  </label>
                  <div className="relative">
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-[#0c1222] pl-11 pr-4 py-3 text-zinc-300 outline-none focus:border-primary/50"
                    >
                      <option value="UTC">UTC (Coordinated Universal Time)</option>
                      <option value="EST">EST (Eastern Standard Time)</option>
                      <option value="CST">CST (Central Standard Time)</option>
                      <option value="PST">PST (Pacific Standard Time)</option>
                      <option value="GMT">GMT (Greenwich Mean Time)</option>
                      <option value="PKT">PKT (Pakistan Standard Time)</option>
                    </select>
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-600" />
                  </div>
                </div>

                {/* Bio */}
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Biography
                  </label>
                  <div className="relative">
                    <textarea
                      rows={4}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Brief personal summary..."
                      className="w-full rounded-lg border border-white/10 bg-black/20 pl-11 pr-4 py-3 text-white placeholder-zinc-600 outline-none focus:border-primary/50"
                    />
                    <FileText className="absolute left-4 top-4 h-5 w-5 text-zinc-600" />
                  </div>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2.5 rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-base font-semibold text-rose-500">
                  <ShieldAlert className="h-5 w-5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              {success && (
                <div className="flex items-center gap-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-base font-semibold text-emerald-400 animate-fade-in">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                  <p>{success}</p>
                </div>
              )}

              <div className="flex justify-end pt-4 border-t border-white/5">
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-primary px-6 py-3 font-semibold text-white hover:brightness-110 active:scale-[0.98] transition shadow-lg shadow-primary/20 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "Saving settings..." : "Save Settings"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
