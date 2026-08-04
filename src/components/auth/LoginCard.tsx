"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/contexts/SessionContext";
import { Eye, EyeOff, Lock, Mail, User, ShieldAlert } from "lucide-react";

export default function LoginCard() {
  const router = useRouter();
  const { login, signup } = useSession();
  const [role, setRole] = useState<"user" | "admin" >("user");
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
    <div className="mx-auto w-full max-w-lg px-4">
      {/* Header Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          {role === "admin"
            ? "Operator Terminal"
            : userMode === "login"
            ? "Welcome Back"
            : "Get Started"}
        </h1>
        <p className="mt-3 text-base text-zinc-400">
          {role === "admin"
            ? "Secure credentials required for operator access"
            : "Secure portal for DevX Digital client solutions"}
        </p>
      </div>

      {/* Main Glassmorphic Card Container */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-b from-white/10 to-white/[0.02] p-8 shadow-2xl backdrop-blur-xl">
        {/* Role Segmented Controller */}
        <div className="mb-8 flex rounded-xl bg-black/30 p-1 ring-1 ring-white/5">
          <button
            onClick={() => {
              setRole("user");
              setUserLoginError("");
              setAdminError("");
            }}
            type="button"
            className={`flex-1 rounded-lg py-2.5 text-sm font-medium tracking-wide transition-all duration-300 cursor-pointer ${
              role === "user"
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            User Portal
          </button>
          <button
            onClick={() => {
              setRole("admin");
              setUserLoginError("");
              setAdminError("");
            }}
            type="button"
            className={`flex-1 rounded-lg py-2.5 text-sm font-medium tracking-wide transition-all duration-300 cursor-pointer ${
              role === "admin"
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Administrator
          </button>
        </div>

        {role === "user" ? (
          <>
            {/* User Sub-Toggle: Login vs Sign Up */}
            <div className="mb-8 flex border-b border-white/5 text-sm">
              <button
                onClick={() => {
                  setUserMode("login");
                  setUserLoginError("");
                  setSignupError("");
                }}
                type="button"
                className={`pb-3 font-semibold transition-all duration-200 pr-6 relative cursor-pointer ${
                  userMode === "login" ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                Login
                {userMode === "login" && (
                  <span className="absolute bottom-0 left-0 h-[2px] w-10 bg-primary rounded-full" />
                )}
              </button>
              <button
                onClick={() => {
                  setUserMode("signup");
                  setUserLoginError("");
                  setSignupError("");
                }}
                type="button"
                className={`pb-3 font-semibold transition-all duration-200 px-6 relative cursor-pointer ${
                  userMode === "signup" ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                Create Account
                {userMode === "signup" && (
                  <span className="absolute bottom-0 left-6 h-[2px] w-24 bg-primary rounded-full" />
                )}
              </button>
            </div>

            {userMode === "login" ? (
              /* USER LOGIN FORM */
              <form onSubmit={handleUserLogin} className="space-y-6">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Email Address / Username
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="name@company.com"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-black/20 pl-11 pr-4 py-3.5 text-white placeholder-zinc-600 outline-none transition duration-200 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                    />
                    <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-600" />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={userPassword}
                      onChange={(e) => setUserPassword(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-black/20 pl-11 pr-11 py-3.5 text-white placeholder-zinc-600 outline-none transition duration-200 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                    />
                    <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-600" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {userLoginError && (
                  <div className="flex items-center gap-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-sm font-semibold text-rose-500">
                    <ShieldAlert className="h-5 w-5 flex-shrink-0" />
                    <p>{userLoginError}</p>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-zinc-400">
                  <label className="flex items-center gap-2.5 cursor-pointer hover:text-white select-none">
                    <input
                      type="checkbox"
                      checked={userRememberMe}
                      onChange={(e) => setUserRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-white/10 bg-black/20 text-primary focus:ring-0 focus:ring-offset-0"
                    />
                    Remember me
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-primary hover:text-primary/80 font-medium transition"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={userLoginLoading}
                  className="w-full rounded-xl bg-primary py-3.5 font-semibold text-white transition-all duration-200 hover:brightness-110 active:scale-[0.99] shadow-lg shadow-primary/20 disabled:opacity-50 cursor-pointer"
                >
                  {userLoginLoading ? "Signing In..." : "Sign In"}
                </button>
              </form>
            ) : (
              /* USER SIGNUP FORM */
              <form onSubmit={handleUserSignup} className="space-y-5">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={signupFullName}
                      onChange={(e) => setSignupFullName(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-black/20 pl-11 pr-4 py-3.5 text-white placeholder-zinc-600 outline-none transition duration-200 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                    />
                    <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-600" />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-black/20 pl-11 pr-4 py-3.5 text-white placeholder-zinc-600 outline-none transition duration-200 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                    />
                    <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-600" />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Minimum 8 characters"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-black/20 pl-11 pr-11 py-3.5 text-white placeholder-zinc-600 outline-none transition duration-200 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                    />
                    <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-600" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      placeholder="Re-enter password"
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-black/20 pl-11 pr-4 py-3.5 text-white placeholder-zinc-600 outline-none transition duration-200 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                    />
                    <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-600" />
                  </div>
                </div>

                {signupError && (
                  <div className="flex items-center gap-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-sm font-semibold text-rose-500">
                    <ShieldAlert className="h-5 w-5 flex-shrink-0" />
                    <p>{signupError}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={signupLoading}
                  className="w-full rounded-xl bg-primary py-3.5 font-semibold text-white transition-all duration-200 hover:brightness-110 active:scale-[0.99] shadow-lg shadow-primary/20 mt-2 disabled:opacity-50 cursor-pointer"
                >
                  {signupLoading ? "Creating Account..." : "Create Account"}
                </button>
              </form>
            )}
          </>
        ) : (
          /* ADMINISTRATOR LOGIN FORM */
          <form onSubmit={handleAdminLogin} className="space-y-6">
            <div className="border-b border-white/5 pb-4">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Secure Operator Terminal
              </h2>
              <p className="text-xs text-zinc-500 mt-1">
                Authorized credentials required for administrative systems.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Admin Email / Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="admin@DevX.digital"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 pl-11 pr-4 py-3.5 text-white placeholder-zinc-600 outline-none transition duration-200 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                />
                <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-600" />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Security Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 pl-11 pr-11 py-3.5 text-white placeholder-zinc-600 outline-none transition duration-200 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                />
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-600" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {adminError && (
              <div className="flex items-center gap-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-sm font-semibold text-rose-500">
                <ShieldAlert className="h-5 w-5 flex-shrink-0" />
                <p>{adminError}</p>
              </div>
            )}

            <div className="flex items-center justify-between text-sm text-zinc-400">
              <label className="flex items-center gap-2.5 cursor-pointer hover:text-white select-none">
                <input
                  type="checkbox"
                  checked={adminRememberMe}
                  onChange={(e) => setAdminRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-white/10 bg-black/20 text-primary focus:ring-0 focus:ring-offset-0"
                />
                Remember device
              </label>
              <div className="flex gap-4">
                <Link
                  href="/forgot-password"
                  className="text-primary hover:text-primary/80 font-medium transition"
                >
                  Forgot?
                </Link>
                <span className="text-zinc-600">|</span>
                <Link
                  href="/register/admin"
                  className="text-zinc-300 hover:text-white transition font-medium"
                >
                  Register Admin
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={adminLoading}
              className="w-full rounded-xl bg-primary py-3.5 font-semibold text-white transition-all duration-200 hover:brightness-110 active:scale-[0.99] shadow-lg shadow-primary/20 disabled:opacity-50 cursor-pointer"
            >
              {adminLoading ? "Authenticating..." : "Authenticate"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}