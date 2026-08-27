"use client";

import React, { useState, useEffect, type FormEvent } from "react";
import { Lock, Eye, EyeOff, ShieldAlert, CheckCircle2, Trash2, KeyRound, Monitor, Globe, Compass, Shield } from "lucide-react";
import { getClientCsrfToken } from "@/lib/auth/client-csrf";

interface UserSession {
  id: string;
  device: string;
  browser: string;
  ipAddress: string;
  location: string;
  loginAt: string;
  expiresAt: string;
  isCurrent: boolean;
}

export default function AdminSecurityWorkspace() {
  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // Sessions state
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [sessionsError, setSessionsError] = useState("");
  const [sessionsSuccess, setSessionsSuccess] = useState("");

  // 2FA state
  const [twoFactor, setTwoFactor] = useState(false);
  const [twoFactorLoading, setTwoFactorLoading] = useState(false);

  // Load active sessions
  async function loadSessions() {
    try {
      const res = await fetch("/api/admin/sessions");
      if (!res.ok) throw new Error("Failed to load sessions");
      const data = await res.json();
      setSessions(data.sessions || []);
    } catch (err: any) {
      setSessionsError(err.message || "Failed to load active login sessions.");
    } finally {
      setSessionsLoading(false);
    }
  }

  // Load user profile for 2FA state
  async function loadProfile() {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setTwoFactor(data.user.twoFactorEnabled || false);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function ensureCsrfToken(): Promise<string> {
    let token = getClientCsrfToken();
    if (token) return token;

    const response = await fetch("/api/auth/csrf", {
      credentials: "same-origin",
    });
    if (!response.ok) {
      throw new Error("Unable to verify this request. Please try again.");
    }

    token = getClientCsrfToken();
    if (!token) {
      throw new Error("Unable to verify this request. Please try again.");
    }

    return token;
  }

  useEffect(() => {
    loadSessions();
    loadProfile();
  }, []);

  async function handlePasswordChange(e: FormEvent) {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setPasswordLoading(true);

    try {
      const csrfToken = await ensureCsrfToken();
      const res = await fetch("/api/admin/security/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update security credentials.");
      }

      setPasswordSuccess(data.message || "Credentials updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      loadSessions(); // password change invalidates other sessions, let's refresh
    } catch (err: any) {
      setPasswordError(err.message || "An unexpected error occurred.");
    } finally {
      setPasswordLoading(false);
    }
  }

  async function handleRevokeSession(sessionId: string) {
    setSessionsSuccess("");
    try {
      const csrfToken = await ensureCsrfToken();
      const res = await fetch(`/api/admin/sessions?id=${sessionId}`, {
        method: "DELETE",
        headers: { "X-CSRF-Token": csrfToken },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to terminate session.");

      setSessionsSuccess("Session terminated successfully.");
      setSessions(sessions.filter((s) => s.id !== sessionId));
    } catch (err: any) {
      setSessionsError(err.message || "Failed to terminate the specified session.");
    }
  }

  async function handleRevokeAllOthers() {
    if (!confirm("Are you sure you want to terminate all other operator connections?")) return;
    setSessionsSuccess("");
    try {
      const csrfToken = await ensureCsrfToken();
      const res = await fetch("/api/admin/sessions?all=true", {
        method: "DELETE",
        headers: { "X-CSRF-Token": csrfToken },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to terminate sessions.");

      setSessionsSuccess("All other sessions have been terminated.");
      setSessions(sessions.filter((s) => s.isCurrent));
    } catch (err: any) {
      setSessionsError(err.message || "Failed to terminate other sessions.");
    }
  }

  async function handleToggle2FA() {
    setTwoFactorLoading(true);
    try {
      // Toggle 2FA status in the database via the profile update API
      const csrfToken = await ensureCsrfToken();
      const res = await fetch("/api/admin/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({ twoFactorEnabled: !twoFactor }),
      });
      if (res.ok) {
        setTwoFactor(!twoFactor);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTwoFactorLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Security Settings
        </h2>
        <p className="mt-2 text-zinc-400">
          Manage system password, setup multi-factor authentication, and monitor operator sessions
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Side: Change Password & Multi Factor */}
        <div className="lg:col-span-5 space-y-8">
          {/* Change Password Card */}
          <div className="rounded-lg border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.01] p-6 shadow-xl backdrop-blur-md">
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2 mb-6">
              <KeyRound className="h-5 w-5 text-primary" />
              Credentials Update
            </h3>
            
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-primary/50"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/20 pl-4 pr-11 py-3 text-white outline-none focus:border-primary/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-primary/50"
                />
              </div>

              {passwordError && (
                <div className="flex items-center gap-2.5 rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-base font-semibold text-rose-500">
                  <ShieldAlert className="h-5 w-5 flex-shrink-0" />
                  <p>{passwordError}</p>
                </div>
              )}

              {passwordSuccess && (
                <div className="flex items-center gap-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-base font-semibold text-emerald-400 animate-fade-in">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                  <p>{passwordSuccess}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={passwordLoading}
                className="w-full rounded-lg bg-primary py-3 font-semibold text-white hover:brightness-110 active:scale-[0.98] transition shadow-lg shadow-primary/20 disabled:opacity-50 cursor-pointer"
              >
                {passwordLoading ? "Updating credentials..." : "Change Password"}
              </button>
            </form>
          </div>

          {/* MFA Panel */}
          <div className="rounded-lg border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.01] p-6 shadow-xl backdrop-blur-md">
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <Shield className="h-5 w-5 text-emerald-400" />
                  Operator Security Factor
                </h3>
                <p className="text-xs text-zinc-500">
                  Enforce two-factor verification on credentials authentications.
                </p>
              </div>
              <button
                onClick={handleToggle2FA}
                disabled={twoFactorLoading}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  twoFactor ? "bg-primary" : "bg-zinc-800"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    twoFactor ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Active Sessions Auditor */}
        <div className="lg:col-span-7">
          <div className="rounded-lg border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.01] p-6 shadow-xl backdrop-blur-md space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <Monitor className="h-5 w-5 text-primary" />
                Active Sessions
              </h3>
              {sessions.length > 1 && (
                <button
                  onClick={handleRevokeAllOthers}
                  className="rounded-lg border border-rose-500/20 bg-rose-500/5 px-3 py-1.5 text-xs font-semibold text-rose-400 hover:bg-rose-500 hover:text-white transition cursor-pointer"
                >
                  Terminate Others
                </button>
              )}
            </div>

            {sessionsError && (
              <div className="flex items-center gap-2.5 rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-base font-semibold text-rose-500">
                <ShieldAlert className="h-5 w-5 flex-shrink-0" />
                <p>{sessionsError}</p>
              </div>
            )}

            {sessionsSuccess && (
              <div className="flex items-center gap-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-base font-semibold text-emerald-400 animate-fade-in">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                <p>{sessionsSuccess}</p>
              </div>
            )}

            <div className="space-y-4">
              {sessionsLoading ? (
                <div className="space-y-3 animate-pulse">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-16 bg-white/5 rounded-lg border border-white/5"></div>
                  ))}
                </div>
              ) : sessions.length > 0 ? (
                sessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex justify-between items-center rounded-lg border border-white/5 bg-black/20 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1 rounded-lg bg-primary/10 border border-primary/20 p-2 text-primary">
                        <Monitor className="h-4 w-4" />
                      </div>
                      <div className="space-y-1 text-base">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-white">{session.browser}</p>
                          <span className="text-zinc-500">•</span>
                          <p className="text-zinc-400">{session.device}</p>
                          {session.isCurrent && (
                            <span className="rounded bg-primary/15 border border-primary/25 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                              Current
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-zinc-500 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Globe className="h-3 w-3" /> {session.ipAddress}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Compass className="h-3 w-3" /> {session.location}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-600">
                          Connected: {new Date(session.loginAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    {!session.isCurrent && (
                      <button
                        onClick={() => handleRevokeSession(session.id)}
                        className="rounded-lg p-2 text-rose-500 hover:bg-rose-500/10 transition cursor-pointer"
                        title="Revoke session connection"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-base text-zinc-500 text-center py-6">No login sessions audit found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
