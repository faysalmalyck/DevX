"use client";

type ProgressBarSize = "sm" | "md" | "lg";

interface ProgressBarProps {
  /** Progress value (0–100) */
  value: number;
  /** Optional label shown above the bar */
  label?: string;
  /** Custom bar color class (default uses primary gradient) */
  color?: string;
  /** Bar height preset */
  size?: ProgressBarSize;
  /** Show percentage text */
  showPercent?: boolean;
  /** Animate the bar fill on mount */
  animated?: boolean;
  /** Additional CSS class names */
  className?: string;
}

const heightMap: Record<ProgressBarSize, string> = {
  sm: "h-1.5",
  md: "h-2",
  lg: "h-3",
};

/**
 * Animated progress bar with optional label and percentage display.
 *
 * @example
 * <ProgressBar value={65} label="Project Progress" showPercent />
 * <ProgressBar value={100} color="bg-emerald-500" size="lg" />
 */
export default function ProgressBar({
  value,
  label,
  color = "bg-primary",
  size = "md",
  showPercent = true,
  animated = true,
  className = "",
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label row */}
      {(label || showPercent) && (
        <div className="flex items-center justify-between text-xs font-semibold">
          {label && <span className="text-zinc-500">{label}</span>}
          {showPercent && <span className="text-white">{clamped}%</span>}
        </div>
      )}

      {/* Track */}
      <div className={`w-full rounded-full bg-white/10 overflow-hidden ${heightMap[size]}`}>
        <div
          className={`${heightMap[size]} rounded-full ${color} ${animated ? "transition-all duration-700 ease-out" : ""}`}
          style={{ width: `${clamped}%` }}
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
