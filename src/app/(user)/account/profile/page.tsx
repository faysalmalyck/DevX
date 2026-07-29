"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useSession } from "@/app/context/SessionContext";
import { User, Mail, Phone, Camera, Eye, EyeOff, CheckCircle2, ShieldAlert, KeyRound } from "lucide-react";

export default function UserProfilePage() {
  const { user } = useSession();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setPhone(user.phone || "");
      setAvatar(user.avatar || "");
    }
  }, [user]);

  async function handleProfileSave(e: FormEvent) {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");
    setProfileLoading(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, phone, avatar }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile.");
      setProfileSuccess("Profile updated successfully.");
      window.dispatchEvent(new Event("DevX-auth-change"));
    } catch (err: any) {
      setProfileError(err.message);
    } finally {
      setProfileLoading(false);
    }
  }

  async function handlePasswordChange(e: FormEvent) {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }
    setPasswordLoading(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to change password.");
      setPasswordSuccess(data.message || "Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setPasswordError(err.message);
    } finally {
      setPasswordLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-white">My Profile</h2>
        <p className="mt-1 text-zinc-400">Manage your account details and security settings.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Avatar & Identity summary */}
        <div className="lg:col-span-4">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.01] p-6 shadow-xl text-center">
            <div className="relative mx-auto mb-4 h-24 w-24">
              <div className="h-full w-full rounded-full border border-emerald-500/30 bg-emerald-500/20 flex items-center justify-center font-black text-3xl text-emerald-400 overflow-hidden">
                {avatar ? (
                  <img src={avatar} alt="avatar" className="h-full w-full object-cover" />
                ) : (
                  firstName ? firstName[0] : "C"
                )}
              </div>
              <div className="absolute bottom-0 right-0 rounded-full bg-primary border border-white/10 p-1.5">
                <Camera className="h-3.5 w-3.5 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-black text-white">{firstName} {lastName}</h3>
            <p className="mt-1 text-xs font-semibold text-zinc-500 uppercase tracking-wider">{user?.role}</p>
            <p className="mt-2 text-xs text-zinc-600 font-mono">{user?.email}</p>
            <div className="mt-5 text-left">
              <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wide mb-1.5">Avatar URL</label>
              <input
                type="text"
                placeholder="https://..."
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-white placeholder-zinc-600 outline-none focus:border-primary/50"
              />
            </div>
          </div>
        </div>

        {/* Profile form + Password */}
        <div className="lg:col-span-8 space-y-6">
          {/* Profile info */}
          <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.01] p-6 shadow-xl">
            <h3 className="mb-5 text-base font-bold text-white flex items-center gap-2">
              <User className="h-4 w-4 text-primary" /> Personal Information
            </h3>
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-400">First Name *</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-black/20 pl-11 pr-4 py-3 text-white outline-none focus:border-primary/50"
                    />
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-400">Last Name *</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-black/20 pl-11 pr-4 py-3 text-white outline-none focus:border-primary/50"
                    />
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-400">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full rounded-xl border border-white/5 bg-black/10 pl-11 pr-4 py-3 text-zinc-500 cursor-not-allowed"
                  />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-700" />
                </div>
                <p className="mt-1 text-[11px] text-zinc-600">Contact support to change your email address.</p>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-400">Phone Number</label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full rounded-xl border border-white/10 bg-black/20 pl-11 pr-4 py-3 text-white placeholder-zinc-600 outline-none focus:border-primary/50"
                  />
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                </div>
              </div>

              {profileError && (
                <div className="flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-sm font-semibold text-rose-500">
                  <ShieldAlert className="h-4 w-4" /> {profileError}
                </div>
              )}
              {profileSuccess && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm font-semibold text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" /> {profileSuccess}
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white hover:brightness-110 active:scale-[0.98] transition shadow-lg shadow-primary/20 disabled:opacity-50 cursor-pointer"
                >
                  {profileLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>

          {/* Change password */}
          <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.01] p-6 shadow-xl">
            <h3 className="mb-5 text-base font-bold text-white flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-amber-400" /> Change Password
            </h3>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-400">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-primary/50"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-400">New Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-black/20 pl-4 pr-11 py-3 text-white outline-none focus:border-primary/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-400">Confirm Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-primary/50"
                  />
                </div>
              </div>

              {passwordError && (
                <div className="flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-sm font-semibold text-rose-500">
                  <ShieldAlert className="h-4 w-4" /> {passwordError}
                </div>
              )}
              {passwordSuccess && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm font-semibold text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" /> {passwordSuccess}
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-white hover:brightness-110 active:scale-[0.98] transition shadow-lg shadow-amber-500/20 disabled:opacity-50 cursor-pointer"
                >
                  {passwordLoading ? "Changing..." : "Change Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
