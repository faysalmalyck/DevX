/**
 * Shared visual tokens drawn from the public team-member cards.
 * They let interactive service surfaces use the same light/dark card language
 * while keeping each surface's selection and semantic state intact.
 */
export const teamCardStyles = {
  surface:
    "border-gray-300 bg-gray-50/50 transition-all duration-400 ease-out dark:border-[#2f384f] dark:bg-gradient-to-b dark:from-[#252E41] dark:via-[#242D40] dark:to-[#1D2336]",
  selectedSurface:
    "border-brand bg-brand/[0.05] shadow-[0_14px_36px_rgba(54,88,255,0.12)] transition-all duration-400 ease-out dark:border-blue-400/70 dark:bg-gradient-to-b dark:from-[#252E41] dark:via-[#242D40] dark:to-[#1D2336] dark:shadow-[0_14px_36px_rgba(54,88,255,0.12)]",
  hover:
    "hover:-translate-y-1.5 hover:scale-[1.015] hover:shadow-[0_16px_36px_rgba(59,130,246,0.18)] motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100",
  divider: "border-gray-300 dark:border-[#2f384f]",
  mutedSurface: "border-gray-300 bg-gray-100/70 dark:border-[#2f384f] dark:bg-[#1D2336]",
  title: "text-gray-900 dark:text-white",
  description: "text-gray-600 dark:text-gray-300",
  subduedDescription: "text-gray-500 dark:text-slate-400",
  icon: "bg-brand/10 text-brand dark:bg-white/[0.07]",
  manualSurface:
    "bg-rose-50/60 dark:bg-[linear-gradient(180deg,rgba(244,63,94,0.12)_0%,#1D2336_100%)]",
  automatedSurface:
    "bg-emerald-50/60 dark:bg-[linear-gradient(180deg,rgba(52,211,153,0.12)_0%,#1D2336_100%)]",
} as const;
