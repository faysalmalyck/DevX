"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/contexts/SessionContext";
import AdminBrandLogo from "@/components/admin/AdminBrandLogo";
import { Eye, EyeOff, Lock, Mail, User, ShieldAlert, ArrowRight, Loader2, Sparkles, Shield, UserCheck } from "lucide-react";

type LoginCardProps = {
  initialRole?: "user" | "admin";
  initialPortal?: "admin" | "sales";
  returnTo?: string;
};

export default function LoginCard({
  initialRole = "user",
  initialPortal,
  returnTo,
}: LoginCardProps) {
  const router = useRouter();
  const { login, signup } = useSession();
  const [role, setRole] = useState<"user" | "admin">(initialRole);
  const [portal, setPortal] = useState<"admin" | "sales">(
    initialPortal ?? "admin",
  );
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
      const result = await login({
        email: userEmail,
        password: userPassword,
        role: "user",
        rememberMe: userRememberMe,
        returnTo,
      });

      window.dispatchEvent(new Event("DevX-auth-change"));
      router.replace(result.redirectTo || "/dashboard");
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
      const result = await login({
        email: adminEmail,
        password: adminPassword,
        role: "admin",
        portal,
        rememberMe: adminRememberMe,
        returnTo,
      });

      window.dispatchEvent(new Event("DevX-auth-change"));
      router.replace(result.redirectTo || "/admin");
    } catch (err: any) {
      setAdminError(err.message || "Authentication failed");
    } finally {
      setAdminLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 h-screen w-screen overflow-y-auto bg-[#181d2b] px-4 py-8 text-white sm:px-6 lg:flex lg:items-center lg:justify-center lg:py-10">
      <div className="relative mx-auto my-auto w-full max-w-md lg:max-w-6xl">
        <aside className="mb-10 hidden max-w-md lg:absolute lg:right-4 lg:top-1/2 lg:block lg:-translate-y-1/2">
          <div className="mb-8 inline-flex rounded-2xl border border-slate-700/60 bg-[#1f2535] p-5 shadow-xl shadow-black/20">
            <AdminBrandLogo surface="dark" className="h-12 w-auto" />
          </div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-brand">DevX Digital Platform</p>
          <h2 className="text-4xl font-semibold leading-tight tracking-tight text-white xl:text-5xl">
            Build what moves your business forward.
          </h2>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-slate-400">
            Sign in to manage your workspace, access your sales portal, and keep every important project moving from one secure place.
          </p>
        </aside>
        {/* Header Section */}
        <div className="mb-6 text-center lg:hidden">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-700/50 bg-[#1f2535] px-3 py-1 text-xs font-medium text-white">
            <Sparkles className="h-3.5 w-3.5 text-brand" />
            <span>DevX Digital Platform</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            {role === "admin"
              ? portal === "sales"
                ? "Sales access"
                : "Operator Terminal"
              : userMode === "login"
              ? "Welcome Back"
              : "Get Started"}
          </h1>
          <p className="mt-2 text-base text-slate-400">
            {role === "admin"
              ? portal === "sales"
                ? "Sign in with your existing DevX administrator credentials."
                : "Secure credentials required for operator access"
              : "Secure portal for DevX Digital client solutions"}
          </p>
        </div>

        <div className="mb-4 flex justify-center lg:w-[520px]">
          <div className="inline-flex items-center gap-1 rounded-full border border-slate-700/60 bg-[#1f2535] p-1 shadow-md">
            <button
              type="button"
              aria-pressed={role === "user"}
              onClick={() => {
                setRole("user");
                setPortal("admin");
                setUserLoginError("");
                setAdminError("");
              }}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer ${
                role === "user"
                  ? "bg-brand text-white shadow-[0_0_15px_rgba(54,88,255,0.5)] font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <UserCheck className="h-3.5 w-3.5" />
              <span>User</span>
            </button>
            <button
              type="button"
              aria-pressed={role === "admin"}
              onClick={() => {
                setRole("admin");
                setPortal("admin");
                setUserLoginError("");
                setAdminError("");
              }}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer ${
                role === "admin"
                  ? "bg-brand text-white shadow-[0_0_15px_rgba(54,88,255,0.5)] font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Shield className="h-3.5 w-3.5" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Main Card Container */}
        <div className="relative rounded-2xl border border-slate-700/50 bg-[#1f2535] p-6 shadow-xl sm:p-8 lg:w-[520px]">
          {role === "user" ? (
            <>
              {/* User Sub-Toggle: Login vs Sign Up */}
              <div className="mb-6 flex border-b border-slate-700/50 text-base">
                <button
                  onClick={() => {
                    setUserMode("login");
                    setUserLoginError("");
                    setSignupError("");
                  }}
                  type="button"
                  className={`pb-3 font-medium transition-all duration-200 pr-6 relative cursor-pointer ${
                    userMode === "login" ? "text-white font-semibold" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Login
                  {userMode === "login" && (
                    <span className="absolute bottom-0 left-0 h-0.5 w-10 bg-brand rounded-full shadow-[0_0_8px_rgba(54,88,255,0.8)]" />
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
                    userMode === "signup" ? "text-white font-semibold" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Create Account
                  {userMode === "signup" && (
                    <span className="absolute bottom-0 left-6 h-0.5 w-24 bg-brand rounded-full shadow-[0_0_8px_rgba(54,88,255,0.8)]" />
                  )}
                </button>
              </div>

              {userMode === "login" ? (
                /* USER LOGIN FORM */
                <form onSubmit={handleUserLogin} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-white">
                      Email Address or Username
                    </label>
                    <div className="relative group">
                      <input
                        type="text"
                        required
                        placeholder="name@company.com"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        className="w-full rounded-full border border-slate-700/60 bg-[#252c3f] pl-11 pr-4 py-3 text-base text-white placeholder-slate-500 outline-none transition duration-200 hover:border-slate-500 hover:shadow-[0_0_15px_rgba(148,163,184,0.15)] focus:border-brand focus:shadow-[0_0_20px_rgba(54,88,255,0.25)]"
                      />
                      <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition duration-200 group-hover:text-white group-focus-within:text-brand" />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-white">
                      Password
                    </label>
                    <div className="relative group">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        value={userPassword}
                        onChange={(e) => setUserPassword(e.target.value)}
                        className="w-full rounded-full border border-slate-700/60 bg-[#252c3f] pl-11 pr-11 py-3 text-base text-white placeholder-slate-500 outline-none transition duration-200 hover:border-slate-500 hover:shadow-[0_0_15px_rgba(148,163,184,0.15)] focus:border-brand focus:shadow-[0_0_20px_rgba(54,88,255,0.25)]"
                      />
                      <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition duration-200 group-hover:text-white group-focus-within:text-brand" />
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
                    <label className="flex items-center gap-2 cursor-pointer hover:text-white select-none">
                      <input
                        type="checkbox"
                        checked={userRememberMe}
                        onChange={(e) => setUserRememberMe(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-700 bg-[#252c3f] text-brand focus:ring-0 focus:ring-offset-0 cursor-pointer"
                      />
                      Remember me
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-brand hover:text-brand font-medium transition"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <div className="flex justify-center pt-2">
                    <button
                      type="submit"
                      disabled={userLoginLoading}
                      className="w-3/4 rounded-full bg-brand px-6 py-3.5 text-lg font-semibold text-white transition-all duration-200 hover:bg-brand active:scale-[0.98] shadow-[0_0_20px_rgba(54,88,255,0.6)] hover:shadow-[0_0_25px_rgba(54,88,255,0.85)] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
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
                    <label className="mb-1.5 block text-xs font-medium text-white">
                      Full Name
                    </label>
                    <div className="relative group">
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={signupFullName}
                        onChange={(e) => setSignupFullName(e.target.value)}
                        className="w-full rounded-full border border-slate-700/60 bg-[#252c3f] pl-11 pr-4 py-3 text-base text-white placeholder-slate-500 outline-none transition duration-200 hover:border-slate-500 hover:shadow-[0_0_15px_rgba(148,163,184,0.15)] focus:border-brand focus:shadow-[0_0_20px_rgba(54,88,255,0.25)]"
                      />
                      <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition duration-200 group-hover:text-white group-focus-within:text-brand" />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-white">
                      Email Address
                    </label>
                    <div className="relative group">
                      <input
                        type="email"
                        required
                        placeholder="name@company.com"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        className="w-full rounded-full border border-slate-700/60 bg-[#252c3f] pl-11 pr-4 py-3 text-base text-white placeholder-slate-500 outline-none transition duration-200 hover:border-slate-500 hover:shadow-[0_0_15px_rgba(148,163,184,0.15)] focus:border-brand focus:shadow-[0_0_20px_rgba(54,88,255,0.25)]"
                      />
                      <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition duration-200 group-hover:text-white group-focus-within:text-brand" />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-white">
                      Password
                    </label>
                    <div className="relative group">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="Minimum 8 characters"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        className="w-full rounded-full border border-slate-700/60 bg-[#252c3f] pl-11 pr-11 py-3 text-base text-white placeholder-slate-500 outline-none transition duration-200 hover:border-slate-500 hover:shadow-[0_0_15px_rgba(148,163,184,0.15)] focus:border-brand focus:shadow-[0_0_20px_rgba(54,88,255,0.25)]"
                      />
                      <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition duration-200 group-hover:text-white group-focus-within:text-brand" />
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
                    <label className="mb-1.5 block text-xs font-medium text-white">
                      Confirm Password
                    </label>
                    <div className="relative group">
                      <input
                        type="password"
                        required
                        placeholder="Re-enter password"
                        value={signupConfirmPassword}
                        onChange={(e) => setSignupConfirmPassword(e.target.value)}
                        className="w-full rounded-full border border-slate-700/60 bg-[#252c3f] pl-11 pr-4 py-3 text-base text-white placeholder-slate-500 outline-none transition duration-200 hover:border-slate-500 hover:shadow-[0_0_15px_rgba(148,163,184,0.15)] focus:border-brand focus:shadow-[0_0_20px_rgba(54,88,255,0.25)]"
                      />
                      <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition duration-200 group-hover:text-white group-focus-within:text-brand" />
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
                      className="w-3/4 rounded-full bg-brand px-6 py-3.5 text-lg font-semibold text-white transition-all duration-200 hover:bg-brand active:scale-[0.98] shadow-[0_0_20px_rgba(54,88,255,0.6)] hover:shadow-[0_0_25px_rgba(54,88,255,0.85)] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
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
            <form
              id="admin-login-panel"
              role="tabpanel"
              aria-labelledby={portal === "sales" ? "sales-login-tab" : "admin-login-tab"}
              onSubmit={handleAdminLogin}
              className="space-y-4"
            >
              <div role="tablist" aria-label="Administrator login type" className="-mt-1 flex border-b border-slate-700/50 text-lg">
                <button
                  id="admin-login-tab"
                  role="tab"
                  type="button"
                  aria-selected={portal === "admin"}
                  aria-controls="admin-login-panel"
                  tabIndex={portal === "admin" ? 0 : -1}
                  onClick={() => {
                    setPortal("admin");
                    setAdminError("");
                  }}
                  className={`relative pb-3 pr-6 font-medium transition-all duration-200 ${
                    portal === "admin" ? "font-semibold text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Admin Login
                  {portal === "admin" ? <span className="absolute bottom-0 left-0 h-0.5 w-20 rounded-full bg-brand shadow-[0_0_8px_rgba(54,88,255,0.8)]" /> : null}
                </button>
                <button
                  id="sales-login-tab"
                  role="tab"
                  type="button"
                  aria-selected={portal === "sales"}
                  aria-controls="admin-login-panel"
                  tabIndex={portal === "sales" ? 0 : -1}
                  onClick={() => {
                    setPortal("sales");
                    setAdminError("");
                  }}
                  className={`relative px-6 pb-3 font-medium transition-all duration-200 ${
                    portal === "sales" ? "font-semibold text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Sales Login
                  {portal === "sales" ? <span className="absolute bottom-0 left-6 h-0.5 w-20 rounded-full bg-brand shadow-[0_0_8px_rgba(54,88,255,0.8)]" /> : null}
                </button>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-white">
                  Admin Email or Username
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    required
                    placeholder="admin@DevX.digital"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full rounded-full border border-slate-700/60 bg-[#252c3f] pl-11 pr-4 py-3 text-base text-white placeholder-slate-500 outline-none transition duration-200 hover:border-slate-500 hover:shadow-[0_0_15px_rgba(148,163,184,0.15)] focus:border-brand focus:shadow-[0_0_20px_rgba(54,88,255,0.25)]"
                  />
                  <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition duration-200 group-hover:text-white group-focus-within:text-brand" />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-white">
                  Security Password
                </label>
                <div className="relative group">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full rounded-full border border-slate-700/60 bg-[#252c3f] pl-11 pr-11 py-3 text-base text-white placeholder-slate-500 outline-none transition duration-200 hover:border-slate-500 hover:shadow-[0_0_15px_rgba(148,163,184,0.15)] focus:border-brand focus:shadow-[0_0_20px_rgba(54,88,255,0.25)]"
                  />
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition duration-200 group-hover:text-white group-focus-within:text-brand" />
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
                <label className="flex items-center gap-2 cursor-pointer hover:text-white select-none">
                  <input
                    type="checkbox"
                    checked={adminRememberMe}
                    onChange={(e) => setAdminRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-700 bg-[#252c3f] text-brand focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  Remember device
                </label>
                <div className="flex items-center gap-3">
                  <Link
                    href="/forgot-password"
                    className="text-brand hover:text-brand font-medium transition"
                  >
                    Forgot?
                  </Link>
                  {portal !== "sales" ? <>
                    <span className="text-slate-600">|</span>
                    <Link
                      href="/register/admin"
                      className="text-white hover:text-white transition font-medium"
                    >
                      Register
                    </Link>
                  </> : null}
                </div>
              </div>

              <div className="flex justify-center pt-2">
                <button
                  type="submit"
                  disabled={adminLoading}
                  className="w-3/4 rounded-full bg-brand px-6 py-3.5 text-lg font-semibold text-white transition-all duration-200 hover:bg-brand active:scale-[0.98] shadow-[0_0_20px_rgba(54,88,255,0.6)] hover:shadow-[0_0_25px_rgba(54,88,255,0.85)] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
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
