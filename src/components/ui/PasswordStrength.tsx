"use client";

import { useMemo } from "react";

interface PasswordStrengthProps {
  /** The current password string to evaluate */
  password: string;
  /** Additional CSS class names */
  className?: string;
}

interface StrengthResult {
  score: number;       // 0–4
  label: string;
  color: string;
  barColor: string;
}

function evaluate(password: string): StrengthResult {
  if (!password) return { score: 0, label: "", color: "text-zinc-600", barColor: "bg-zinc-700" };

  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password) && /[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const levels: StrengthResult[] = [
    { score: 0, label: "Too short", color: "text-zinc-500", barColor: "bg-zinc-600" },
    { score: 1, label: "Weak", color: "text-rose-400", barColor: "bg-rose-500" },
    { score: 2, label: "Fair", color: "text-amber-400", barColor: "bg-amber-500" },
    { score: 3, label: "Strong", color: "text-primary", barColor: "bg-primary" },
    { score: 4, label: "Very Strong", color: "text-emerald-400", barColor: "bg-emerald-500" },
  ];

  return levels[score];
}

/**
 * Visual password strength indicator with 4-bar meter and label.
 *
 * @example
 * <PasswordStrength password={passwordValue} />
 */
export default function PasswordStrength({ password, className = "" }: PasswordStrengthProps) {
  const strength = useMemo(() => evaluate(password), [password]);

  if (!password) return null;

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Bars */}
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map((bar) => (
          <div
            key={bar}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              bar <= strength.score ? strength.barColor : "bg-white/10"
            }`}
          />
        ))}
      </div>

      {/* Label */}
      <div className="flex items-center justify-between">
        <p className={`text-xs font-semibold transition-colors duration-200 ${strength.color}`}>
          {strength.label}
        </p>
        <p className="text-[10px] text-zinc-600">
          {password.length < 8
            ? `${8 - password.length} more character${8 - password.length === 1 ? "" : "s"} needed`
            : "8+ characters ✓"}
        </p>
      </div>
    </div>
  );
}
