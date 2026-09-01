/**
 * Shared presentation tokens derived from the customer-facing cart dialog.
 * Keep public lead and application dialogs visually aligned without coupling
 * their distinct form behaviour.
 */
export const cartDialogStyles = {
  backdrop: "bg-[#020617]/80 backdrop-blur-[8px]",
  panel:
    "border border-[#414b62] bg-[linear-gradient(180deg,#222a40_0%,#131927_100%)] shadow-2xl",
  surface:
    "border-[#414b62] bg-[linear-gradient(180deg,#222a40_0%,#131927_100%)] shadow-[0_14px_36px_rgba(2,6,23,0.32)]",
  selectedSurface:
    "border-brand bg-[linear-gradient(180deg,rgba(54,88,255,0.32)_0%,#131927_100%)] shadow-[0_14px_36px_rgba(54,88,255,0.28)]",
  mutedSurface: "border-[#414b62] bg-[#111725]/65 shadow-[0_14px_36px_rgba(2,6,23,0.24)]",
  divider: "border-[#414b62]",
  title: "text-white",
  description: "text-[#c9d0e1]",
  fieldLabel: "text-[#c9d0e1]",
  optionalLabel: "text-slate-400",
  input:
    "w-full rounded-full bg-white dark:bg-[#232B3E] border border-slate-200 dark:border-[#2E3850] px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand dark:focus:border-slate-500 focus:ring-1 focus:ring-brand/40 dark:focus:ring-slate-500/40 hover:ring-1 hover:ring-slate-300 dark:hover:ring-slate-500/30 transition-all ease-in-out duration-300 sm:px-5 sm:py-3 sm:text-base",
  textarea:
    "w-full resize-y rounded-3xl bg-white dark:bg-[#232B3E] border border-slate-200 dark:border-[#2E3850] px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand dark:focus:border-slate-500 focus:ring-1 focus:ring-brand/40 dark:focus:ring-slate-500/40 hover:ring-1 hover:ring-slate-300 dark:hover:ring-slate-500/30 transition-all ease-in-out duration-300 sm:px-5 sm:text-base",
  closeButton:
    "grid h-9 w-9 place-items-center rounded-lg text-white transition hover:bg-white/[0.09] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300",
  primaryButton:
    "inline-flex items-center justify-center rounded-full bg-brand text-center text-lg font-semibold text-white shadow-[0_8px_20px_rgba(54,88,255,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand hover:shadow-[0_0_20px_rgba(54,88,255,0.4)] active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 disabled:cursor-not-allowed disabled:opacity-70",
  secondaryButton:
    "inline-flex items-center justify-center rounded-full border border-[#414b62] bg-[#1e2538] text-lg font-semibold text-[#c9d0e1] transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/[0.09] hover:text-white active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 disabled:cursor-not-allowed disabled:opacity-70",
} as const;
