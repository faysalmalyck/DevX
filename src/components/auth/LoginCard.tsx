"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/contexts/SessionContext";
import { Eye, EyeOff, Lock, Mail, User, ShieldAlert, ArrowRight, Loader2, Sparkles, Shield, UserCheck } from "lucide-react";

export default function LoginCard() {
  const router = useRouter();
  const { login, signup } = useSession();
  const [role, setRole] = useState<"user" | "admin">("user");
  const [userMode, setUserMode] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);

  // User login state
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userRememberMe, setUserRememberMe] = useState(false);
  const [userLoginError, setUserLoginError] = useState("");
  const [userLoginLoading, setUserLoginLoading] = useState(false);

  // User signup state
  const [signupFullName, setSignupFullName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [signupError, setSignupError] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);

  // Admin login state
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminRememberMe, setAdminRememberMe] = useState(false);
  const [adminError, setAdminError] = useState("");
  const [adminLoading, setAdminLoading] = useState(false);

  // Handlers
  async function handleUserLogin(e: FormEvent) {
    e.preventDefault();
    setUserLoginError("");
    setUserLoginLoading(true);

    try {
      await login({
        email: userEmail,
        password: userPassword,
        role: "user",
        rememberMe: userRememberMe,
      });

      window.dispatchEvent(new Event("DevX-auth-change"));
      router.push("/dashboard");
    } catch (err: any) {
      setUserLoginError(err.message || "An unexpected error occurred");
    } finally {
      setUserLoginLoading(false);
    }
  }

  async function handleUserSignup(e: FormEvent) {
    e.preventDefault();
    setSignupError("");

    if (signupPassword !== signupConfirmPassword) {
      setSignupError("Passwords do not match");
      return;
    }

    if (signupPassword.length < 8) {
      setSignupError("Password must be at least 8 characters long");
      return;
    }

    setSignupLoading(true);

    try {
      await signup({
        fullName: signupFullName,
        email: signupEmail,
        password: signupPassword,
      });

      window.dispatchEvent(new Event("DevX-auth-change"));
      router.push("/dashboard");
    } catch (err: any) {
      setSignupError(err.message || "An unexpected error occurred");
    } finally {
      setSignupLoading(false);
    }
  }

  async function handleAdminLogin(e: FormEvent) {
    e.preventDefault();
    setAdminError("");
    setAdminLoading(true);

    try {
      await login({
        email: adminEmail,
        password: adminPassword,
        role: "admin",
        rememberMe: adminRememberMe,
      });

      window.dispatchEvent(new Event("DevX-auth-change"));
      router.push("/admin");
    } catch (err: any) {
      setAdminError(err.message || "Authentication failed");
    } finally {
      setAdminLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#181d2b] flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative mx-auto w-full max-w-md my-auto">
        {/* Header Section */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-700/50 bg-[#1f2535] px-3 py-1 text-xs font-medium text-slate-300 mb-4">
            <Sparkles className="h-3.5 w-3.5 text-blue-500" />
            <span>DevX Digital Platform</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {role === "admin"
              ? "Operator Terminal"
              : userMode === "login"
              ? "Welcome Back"
              : "Get Started"}
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            {role === "admin"
              ? "Secure credentials required for operator access"
              : "Secure portal for DevX Digital client solutions"}
          </p>
        </div>

        {/* Separate Compact Floating Role Switcher */}
        <div className="mb-4 flex justify-center">
          <div className="inline-flex items-center gap-1 rounded-full border border-slate-700/60 bg-[#1f2535] p-1 shadow-md">
            <button
              type="button"
              onClick={() => {
                setRole("user");
                setUserLoginError("");
                setAdminError("");
              }}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer ${
                role === "user"
                  ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)] font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <UserCheck className="h-3.5 w-3.5" />
              <span>User</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setRole("admin");
                setUserLoginError("");
                setAdminError("");
              }}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer ${
                role === "admin"
                  ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)] font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Shield className="h-3.5 w-3.5" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Main Card Container */}
        <div className="relative rounded-2xl border border-slate-700/50 bg-[#1f2535] p-6 sm:p-8 shadow-xl">
          {role === "user" ? (
            <>
              {/* User Sub-Toggle: Login vs Sign Up */}
              <div className="mb-6 flex border-b border-slate-700/50 text-sm">
                <button
                  onClick={() => {
                    setUserMode("login");
                    setUserLoginError("");
                    setSignupError("");
                  }}
                  type="button"
                  className={`pb-3 font-medium transition-all duration-200 pr-6 relative cursor-pointer ${
                    userMode === "login" ? "text-white font-semibold" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Login
                  {userMode === "login" && (
                    <span className="absolute bottom-0 left-0 h-0.5 w-10 bg-blue-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.8)]" />
                  )}
                </button>
                <button
                  onClick={() => {
                    setUserMode("signup");
                    setUserLoginError("");
                    setSignupError("");
                  }}
                  type="button"
                  className={`pb-3 font-medium transition-all duration-200 px-6 relative cursor-pointer ${
                    userMode === "signup" ? "text-white font-semibold" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Create Account
                  {userMode === "signup" && (
                    <span className="absolute bottom-0 left-6 h-0.5 w-24 bg-blue-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.8)]" />
                  )}
                </button>
              </div>

              {userMode === "login" ? (
                /* USER LOGIN FORM */
                <form onSubmit={handleUserLogin} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-300">
                      Email Address or Username
                    </label>
                    <div className="relative group">
                      <input
                        type="text"
                        required
                        placeholder="name@company.com"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        className="w-full rounded-full border border-slate-700/60 bg-[#252c3f] pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition duration-200 hover:border-slate-500 hover:shadow-[0_0_15px_rgba(148,163,184,0.15)] focus:border-blue-600 focus:shadow-[0_0_20px_rgba(37,99,235,0.25)]"
                      />
                      <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition duration-200 group-hover:text-slate-200 group-focus-within:text-blue-500" />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-300">
                      Password
                    </label>
                    <div className="relative group">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        value={userPassword}
                        onChange={(e) => setUserPassword(e.target.value)}
                        className="w-full rounded-full border border-slate-700/60 bg-[#252c3f] pl-11 pr-11 py-3 text-sm text-white placeholder-slate-500 outline-none transition duration-200 hover:border-slate-500 hover:shadow-[0_0_15px_rgba(148,163,184,0.15)] focus:border-blue-600 focus:shadow-[0_0_20px_rgba(37,99,235,0.25)]"
                      />
                      <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition duration-200 group-hover:text-slate-200 group-focus-within:text-blue-500" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {userLoginError && (
                    <div className="flex items-center gap-2.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-xs font-medium text-rose-400">
                      <ShieldAlert className="h-4 w-4 flex-shrink-0" />
                      <p>{userLoginError}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer hover:text-slate-200 select-none">
                      <input
                        type="checkbox"
                        checked={userRememberMe}
                        onChange={(e) => setUserRememberMe(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-700 bg-[#252c3f] text-blue-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                      />
                      Remember me
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-blue-500 hover:text-blue-400 font-medium transition"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <div className="flex justify-center pt-2">
                    <button
                      type="submit"
                      disabled={userLoginLoading}
                      className="w-3/4 rounded-full bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-blue-500 active:scale-[0.98] shadow-[0_0_20px_rgba(37,99,235,0.6)] hover:shadow-[0_0_25px_rgba(37,99,235,0.85)] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                    >
                      {userLoginLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Signing In...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                /* USER SIGNUP FORM */
                <form onSubmit={handleUserSignup} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-300">
                      Full Name
                    </label>
                    <div className="relative group">
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={signupFullName}
                        onChange={(e) => setSignupFullName(e.target.value)}
                        className="w-full rounded-full border border-slate-700/60 bg-[#252c3f] pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition duration-200 hover:border-slate-500 hover:shadow-[0_0_15px_rgba(148,163,184,0.15)] focus:border-blue-600 focus:shadow-[0_0_20px_rgba(37,99,235,0.25)]"
                      />
                      <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition duration-200 group-hover:text-slate-200 group-focus-within:text-blue-500" />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-300">
                      Email Address
                    </label>
                    <div className="relative group">
                      <input
                        type="email"
                        required
                        placeholder="name@company.com"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        className="w-full rounded-full border border-slate-700/60 bg-[#252c3f] pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition duration-200 hover:border-slate-500 hover:shadow-[0_0_15px_rgba(148,163,184,0.15)] focus:border-blue-600 focus:shadow-[0_0_20px_rgba(37,99,235,0.25)]"
                      />
                      <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition duration-200 group-hover:text-slate-200 group-focus-within:text-blue-500" />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-300">
                      Password
                    </label>
                    <div className="relative group">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="Minimum 8 characters"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        className="w-full rounded-full border border-slate-700/60 bg-[#252c3f] pl-11 pr-11 py-3 text-sm text-white placeholder-slate-500 outline-none transition duration-200 hover:border-slate-500 hover:shadow-[0_0_15px_rgba(148,163,184,0.15)] focus:border-blue-600 focus:shadow-[0_0_20px_rgba(37,99,235,0.25)]"
                      />
                      <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition duration-200 group-hover:text-slate-200 group-focus-within:text-blue-500" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-300">
                      Confirm Password
                    </label>
                    <div className="relative group">
                      <input
                        type="password"
                        required
                        placeholder="Re-enter password"
                        value={signupConfirmPassword}
                        onChange={(e) => setSignupConfirmPassword(e.target.value)}
                        className="w-full rounded-full border border-slate-700/60 bg-[#252c3f] pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition duration-200 hover:border-slate-500 hover:shadow-[0_0_15px_rgba(148,163,184,0.15)] focus:border-blue-600 focus:shadow-[0_0_20px_rgba(37,99,235,0.25)]"
                      />
                      <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition duration-200 group-hover:text-slate-200 group-focus-within:text-blue-500" />
                    </div>
                  </div>

                  {signupError && (
                    <div className="flex items-center gap-2.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-xs font-medium text-rose-400">
                      <ShieldAlert className="h-4 w-4 flex-shrink-0" />
                      <p>{signupError}</p>
                    </div>
                  )}

                  <div className="flex justify-center pt-2">
                    <button
                      type="submit"
                      disabled={signupLoading}
                      className="w-3/4 rounded-full bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-blue-500 active:scale-[0.98] shadow-[0_0_20px_rgba(37,99,235,0.6)] hover:shadow-[0_0_25px_rgba(37,99,235,0.85)] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                    >
                      {signupLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Creating Account...</span>
                        </>
                      ) : (
                        <>
                          <span>Create Account</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </>
          ) : (
            /* ADMINISTRATOR LOGIN FORM */
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="border-b border-slate-700/50 pb-3 mb-4">
                <h2 className="text-base font-semibold text-white tracking-tight">
                  Secure Operator Terminal
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Authorized credentials required for administrative systems.
                </p>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-300">
                  Admin Email or Username
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    required
                    placeholder="admin@DevX.digital"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full rounded-full border border-slate-700/60 bg-[#252c3f] pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition duration-200 hover:border-slate-500 hover:shadow-[0_0_15px_rgba(148,163,184,0.15)] focus:border-blue-600 focus:shadow-[0_0_20px_rgba(37,99,235,0.25)]"
                  />
                  <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition duration-200 group-hover:text-slate-200 group-focus-within:text-blue-500" />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-300">
                  Security Password
                </label>
                <div className="relative group">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full rounded-full border border-slate-700/60 bg-[#252c3f] pl-11 pr-11 py-3 text-sm text-white placeholder-slate-500 outline-none transition duration-200 hover:border-slate-500 hover:shadow-[0_0_15px_rgba(148,163,184,0.15)] focus:border-blue-600 focus:shadow-[0_0_20px_rgba(37,99,235,0.25)]"
                  />
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition duration-200 group-hover:text-slate-200 group-focus-within:text-blue-500" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {adminError && (
                <div className="flex items-center gap-2.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-xs font-medium text-rose-400">
                  <ShieldAlert className="h-4 w-4 flex-shrink-0" />
                  <p>{adminError}</p>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <label className="flex items-center gap-2 cursor-pointer hover:text-slate-200 select-none">
                  <input
                    type="checkbox"
                    checked={adminRememberMe}
                    onChange={(e) => setAdminRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-700 bg-[#252c3f] text-blue-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  Remember device
                </label>
                <div className="flex items-center gap-3">
                  <Link
                    href="/forgot-password"
                    className="text-blue-500 hover:text-blue-400 font-medium transition"
                  >
                    Forgot?
                  </Link>
                  <span className="text-slate-600">|</span>
                  <Link
                    href="/register/admin"
                    className="text-slate-300 hover:text-white transition font-medium"
                  >
                    Register
                  </Link>
                </div>
              </div>

              <div className="flex justify-center pt-2">
                <button
                  type="submit"
                  disabled={adminLoading}
                  className="w-3/4 rounded-full bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-blue-500 active:scale-[0.98] shadow-[0_0_20px_rgba(37,99,235,0.6)] hover:shadow-[0_0_25px_rgba(37,99,235,0.85)] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {adminLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Authenticate</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}