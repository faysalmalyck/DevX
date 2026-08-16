"use client";

import Link from "next/link";
import {
  ArrowDown,
  ArrowLeftRight,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BellRing,
  Blocks,
  Bot,
  Braces,
  Check,
  CircleDollarSign,
  Cloud,
  CreditCard,
  Database,
  FileSpreadsheet,
  Gauge,
  Globe2,
  History,
  Landmark,
  LineChart,
  RefreshCw,
  Scale,
  Smartphone,
  Unplug,
  UsersRound,
  Waypoints,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import {
  type KeyboardEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { cva } from "class-variance-authority";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/motion";
import LeadCaptureDialog, {
  type LeadIntent,
  type LeadRequest,
} from "@/components/home/final-cta/LeadCaptureDialog";
import {
  automationOptions,
  businessProblems,
  integrations,
  modernizationCapabilities,
  type SelectableServiceItem,
  type ServiceExperienceIcon,
} from "@/data/services-experience";

// ---------------------------------------------------------------------------
// NOTE ON ASSUMPTIONS
// ---------------------------------------------------------------------------
// 1. `cn` replaces the old naive `classNames` joiner. clsx handles conditional
//    composition; twMerge resolves same-scale Tailwind class collisions
//    (e.g. two `border-` colors landing in the same string) deterministically
//    instead of leaving DOM-order to decide the winner.
// 2. `automationOptions` items are assumed to optionally carry an
//    `automatedTitle?: string` field (see AutomationSection below). If your
//    `data/services-experience.ts` doesn't have it yet, add:
//        automatedTitle?: string;
//    to the automation option type. Falls back to a generic string if absent
//    so this compiles either way — but the fallback reproduces the original
//    "every option converges to the same headline" issue, so add the field
//    when you can.
// ---------------------------------------------------------------------------

function cn(...classes: ClassValue[]) {
  return twMerge(clsx(classes));
}

const experienceIconMap: Record<ServiceExperienceIcon, LucideIcon> = {
  workflow: Workflow,
  history: History,
  unplug: Unplug,
  sheet: FileSpreadsheet,
  report: BarChart3,
  automation: Bot,
  scale: Scale,
  cost: CircleDollarSign,
  gauge: Gauge,
  api: Braces,
  crm: UsersRound,
  erp: Blocks,
  database: Database,
  cloud: Cloud,
  refresh: RefreshCw,
  bell: BellRing,
  sync: ArrowLeftRight,
  website: Globe2,
  mobile: Smartphone,
  payment: CreditCard,
  accounting: Landmark,
  analytics: LineChart,
};

const integrationPositions = [
  "md:col-start-1 md:row-start-1",
  "md:col-start-2 md:row-start-1",
  "md:col-start-3 md:row-start-1",
  "md:col-start-1 md:row-start-2",
  "md:col-start-3 md:row-start-2",
  "md:col-start-1 md:row-start-3",
  "md:col-start-2 md:row-start-3",
  "md:col-start-3 md:row-start-3",
] as const;

const integrationCoordinates = [
  [16.7, 16.7],
  [50, 16.7],
  [83.3, 16.7],
  [16.7, 50],
  [83.3, 50],
  [16.7, 83.3],
  [50, 83.3],
  [83.3, 83.3],
] as const;

// Single source of truth for the 4-step flow: drives anchor scrolling,
// the step indicator, and section ordering. Labels are placeholders —
// swap for whatever funnel copy already exists elsewhere on the site.
const sectionMeta = [
  { id: "business-problems", label: "Identify" },
  { id: "modernization", label: "Improve" },
  { id: "automation", label: "Automate" },
  { id: "integration", label: "Connect" },
] as const;

const servicesSectionIds = new Set<string>(sectionMeta.map((s) => s.id));

function toggleTitle(current: readonly string[], title: string): string[] {
  return current.includes(title)
    ? current.filter((item) => item !== title)
    : [...current, title];
}

// ---------------------------------------------------------------------------
// Aggregated selection state
// ---------------------------------------------------------------------------
// Previously each section maintained independent useState and submitted only
// its own selections on enquiry, silently discarding whatever the user had
// selected in other sections. This centralizes all four slices and every
// `onEnquire` call now submits the full aggregate.

type SelectionState = {
  problems: string[];
  modernization: string[];
  automationId: string;
  integrations: string[];
};

function buildLeadTopics(state: SelectionState): string[] {
  const automated = automationOptions.find((o) => o.id === state.automationId);
  return Array.from(
    new Set([
      ...state.problems,
      ...state.modernization,
      ...(automated ? [automated.title] : []),
      ...state.integrations,
    ]),
  );
}

// ---------------------------------------------------------------------------
// Anchor scroll sync (unchanged behavior, reuses sectionMeta ids)
// ---------------------------------------------------------------------------

function useServicesAnchorSync() {
  useEffect(() => {
    const scrollToCurrentSection = () => {
      const hash = window.location.hash.slice(1);
      if (!servicesSectionIds.has(hash)) return;

      const target = document.getElementById(hash);
      if (!target) return;

      const root = document.documentElement;
      const previousScrollBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";
      target.scrollIntoView({ block: "start", behavior: "auto" });
      root.style.scrollBehavior = previousScrollBehavior;
    };

    let nestedFrame = 0;
    const initialFrame = window.requestAnimationFrame(() => {
      nestedFrame = window.requestAnimationFrame(scrollToCurrentSection);
    });

    window.addEventListener("hashchange", scrollToCurrentSection);
    window.addEventListener("popstate", scrollToCurrentSection);

    return () => {
      window.cancelAnimationFrame(initialFrame);
      window.cancelAnimationFrame(nestedFrame);
      window.removeEventListener("hashchange", scrollToCurrentSection);
      window.removeEventListener("popstate", scrollToCurrentSection);
    };
  }, []);
}

// ---------------------------------------------------------------------------
// Scroll-spy step indicator (desktop only — see rationale in review)
// ---------------------------------------------------------------------------

function useActiveSection(ids: readonly string[]) {
  const [activeId, setActiveId] = useState<string>(ids[0]);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        // Closest-to-center wins — avoids flicker when two sections both
        // partially intersect the observed band simultaneously.
        const closest = visible.reduce((a, b) =>
          Math.abs(a.boundingClientRect.top) < Math.abs(b.boundingClientRect.top)
            ? a
            : b,
        );
        setActiveId(closest.target.id);
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- ids is a stable literal array
  }, []);

  return activeId;
}

// Signature element. The whole page is a sequence of before/after states —
// manual→automated, disconnected→connected — the same shape as a diff. The
// rail renders as a module graph: square marks (not dots — diff hunks and
// commit graphs use marks, not circles), filled in as you pass each one,
// labeled like the modules they represent rather than decorative numerals.
function ProgressRail() {
  const activeId = useActiveSection(sectionMeta.map((s) => s.id));
  const activeIndex = sectionMeta.findIndex((s) => s.id === activeId);

  return (
    <nav
      aria-label="Page section progress"
      className="fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
    >
      <div className="relative flex flex-col items-start gap-8 pl-0.5">
        <div
          aria-hidden="true"
          className="absolute bottom-2 left-[3px] top-2 w-px bg-slate-200 dark:bg-white/10"
        />
        <div
          aria-hidden="true"
          className="absolute left-[3px] top-2 w-px bg-emerald-500 transition-[height] duration-500 ease-out dark:bg-emerald-400"
          style={{
            height:
              activeIndex <= 0
                ? "0px"
                : `${(activeIndex / (sectionMeta.length - 1)) * 100}%`,
          }}
        />
        {sectionMeta.map((section, index) => {
          const isActive = section.id === activeId;
          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              aria-current={isActive ? "true" : undefined}
              className="group relative flex items-center gap-3"
            >
              <span
                aria-hidden="true"
                className={cn(
                  "relative z-10 h-[7px] w-[7px] shrink-0 transition-all duration-300",
                  isActive
                    ? "scale-125 bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.18)] dark:bg-emerald-400"
                    : "bg-slate-300 group-hover:bg-emerald-500/60 dark:bg-slate-600 dark:group-hover:bg-emerald-400/60",
                )}
              />
              <span
                className={cn(
                  "font-mono text-[11px] tracking-wide text-slate-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:text-slate-500",
                  isActive && "text-emerald-600 opacity-100 dark:text-emerald-400",
                )}
              >
                0{index + 1}-{section.label.toLowerCase()}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}

// ---------------------------------------------------------------------------
// Shared visual primitives
// ---------------------------------------------------------------------------

// Single source of truth for the "selected surface" look, previously
// duplicated near-verbatim across SelectableCard and the integration node.
const selectableSurface = cva(
  "relative overflow-hidden rounded-lg border shadow-sm transition-[transform,border-color,box-shadow,background-color] duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand dark:focus-visible:outline-blue-400",
  {
    variants: {
      selected: {
        true: "border-brand bg-brand/[0.05] shadow-[0_14px_36px_rgba(54,88,255,0.12)] dark:border-blue-400/70 dark:bg-blue-400/[0.08] dark:shadow-[0_14px_36px_rgba(54,88,255,0.12)]",
        false:
          "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-[0_12px_30px_rgba(54,88,255,0.16)] dark:border-slate-700/80 dark:bg-[#202638] dark:shadow-none dark:hover:border-blue-400/50",
      },
    },
    defaultVariants: { selected: false },
  },
);

function SectionHeading({
  eyebrow,
  title,
  accent,
  description,
  align = "center",
}: Readonly<{
  eyebrow?: { index: number; label: string };
  title: string;
  accent?: string;
  description: string;
  align?: "left" | "center";
}>) {
  return (
    <ScrollReveal
      className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}
      preset="heading"
    >
      {eyebrow ? (
        <p
          className={cn(
            "mb-4 flex items-center gap-2 font-mono text-xs tracking-[0.14em] text-slate-400 dark:text-slate-500",
            align === "center" && "mx-auto justify-center",
          )}
        >
          <span aria-hidden="true" className="h-1.5 w-1.5 bg-emerald-500 dark:bg-emerald-400" />
          0{eyebrow.index}-{eyebrow.label.toLowerCase()}
        </p>
      ) : null}
      {/* Fixed dead breakpoint: base and sm previously both resolved to
          text-4xl, giving mobile the same heading size as tablet with no
          intermediate step before the md jump to 5xl. */}
      <h2 className="text-balance text-3xl font-medium leading-snug tracking-tight text-slate-900 dark:text-white sm:text-4xl sm:leading-tight md:text-5xl">
        {title}
        {accent ? (
          <>
            {" "}
            <span className="text-brand">{accent}</span>
          </>
        ) : null}
      </h2>
      <p
        className={cn(
          "mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg",
          align === "center" && "mx-auto",
        )}
      >
        {description}
      </p>
    </ScrollReveal>
  );
}

// The signature: selecting a card behaves like staging a diff hunk — a
// solid gutter bar down the left edge, the same visual grammar as a
// git diff's added-line marker. Replaces relying on tint/shadow alone,
// and reads immediately to a technical audience without needing a legend.
function DiffGutter({ selected }: Readonly<{ selected: boolean }>) {
  if (!selected) return null;
  return (
    <span
      aria-hidden="true"
      className="absolute inset-y-0 left-0 w-[3px] bg-emerald-500 dark:bg-emerald-400"
    />
  );
}

function SelectionMark({ selected }: Readonly<{ selected: boolean }>) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors",
        selected
          ? "border-emerald-500 bg-emerald-500 text-white dark:border-emerald-400 dark:bg-emerald-400 dark:text-slate-900"
          : "border-slate-300 text-transparent group-hover:border-emerald-500/60 dark:border-white/20",
      )}
    >
      <Check className="h-4 w-4" strokeWidth={2.5} />
    </span>
  );
}

function SelectableCard({
  item,
  selected,
  onToggle,
  compact = false,
  testId,
}: Readonly<{
  item: SelectableServiceItem;
  selected: boolean;
  onToggle: () => void;
  compact?: boolean;
  testId?: string;
}>) {
  const Icon = experienceIconMap[item.icon];

  return (
    <button
      type="button"
      aria-pressed={selected}
      data-testid={testId}
      onClick={onToggle}
      className={cn(
        selectableSurface({ selected }),
        "group flex h-full w-full text-left",
        compact ? "items-center gap-4 px-4 py-4 sm:px-5" : "flex-col p-5 sm:p-6",
      )}
    >
      <DiffGutter selected={selected} />
      <div
        className={cn(
          "flex w-full",
          compact ? "items-center gap-4" : "items-start justify-between",
        )}
      >
        <span
          className={cn(
            "flex shrink-0 items-center justify-center rounded-lg",
            compact ? "h-10 w-10" : "h-12 w-12",
            selected
              ? "bg-emerald-500 text-white dark:bg-emerald-400 dark:text-slate-900"
              : "bg-brand/10 text-brand dark:bg-white/[0.07]",
          )}
        >
          <Icon className={compact ? "h-5 w-5" : "h-6 w-6"} strokeWidth={1.7} />
        </span>
        {compact ? (
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold tracking-tight text-slate-900 dark:text-white">
              {item.title}
            </h3>
            <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
              {item.description}
            </p>
          </div>
        ) : (
          <SelectionMark selected={selected} />
        )}
      </div>

      {!compact ? (
        <div className="mt-7">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
            {item.title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {item.description}
          </p>
        </div>
      ) : (
        <SelectionMark selected={selected} />
      )}
    </button>
  );
}

// SelectionAction now branches copy by mode instead of faking a count for
// single-select contexts (see AutomationSection — previously hardcoded
// `selectedCount={1}` and reused multi-select "priority selected" copy,
// which read as nonsensical for a tab-driven single choice).
function SelectionAction({
  mode = "multi",
  selectedCount,
  activeLabel,
  buttonLabel,
  emptyLabel,
  onClick,
}: Readonly<{
  mode?: "multi" | "single";
  selectedCount: number;
  activeLabel?: string;
  buttonLabel: string;
  emptyLabel: string;
  onClick: () => void;
}>) {
  const copy =
    mode === "single"
      ? activeLabel ?? ""
      : selectedCount > 0
        ? `${selectedCount} ${selectedCount === 1 ? "priority" : "priorities"} selected — we’ll include ${selectedCount === 1 ? "it" : "them"} in your enquiry.`
        : emptyLabel;

  return (
    <ScrollReveal
      className="mt-10 flex flex-col items-center justify-between gap-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700/80 dark:bg-[#171c2a] dark:shadow-none sm:flex-row sm:px-7"
      preset="copy"
    >
      <p className="text-center text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-left">
        {copy}
      </p>
      <button
        type="button"
        onClick={onClick}
        className="group inline-flex w-full max-w-[280px] shrink-0 items-center justify-center rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(54,88,255,0.25)] transition duration-200 hover:-translate-y-0.5 hover:bg-brand/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand sm:w-auto sm:max-w-none"
      >
        {buttonLabel}
        <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </button>
    </ScrollReveal>
  );
}

// ---------------------------------------------------------------------------
// Sections
// ---------------------------------------------------------------------------

function BusinessProblemsSection({
  selected,
  onToggle,
  onEnquire,
}: Readonly<{
  selected: readonly string[];
  onToggle: (title: string) => void;
  onEnquire: () => void;
}>) {
  return (
    <section
      id="business-problems"
      data-services-section="business-problems"
      className="scroll-mt-28 overflow-hidden border-t border-slate-200/70 bg-white py-20 text-slate-900 dark:border-white/10 dark:bg-darkmode dark:text-white md:scroll-mt-32 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={{ index: 1, label: sectionMeta[0].label }}
          title="Is Your Software Slowing"
          accent="Your Business Down?"
          description="Select the problems that feel familiar. We’ll carry that context into the conversation so you do not have to start from a blank page."
        />

        <StaggerContainer className="mt-12 grid items-stretch grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {businessProblems.map((problem) => (
            <StaggerItem key={problem.id} className="h-full" preset="card">
              <SelectableCard
                item={problem}
                selected={selected.includes(problem.title)}
                onToggle={() => onToggle(problem.title)}
                testId="business-problem-card"
              />
            </StaggerItem>
          ))}
        </StaggerContainer>

        <SelectionAction
          selectedCount={selected.length}
          emptyLabel="Choose any relevant problems, or open the form and describe something different."
          buttonLabel="Let’s Fix Your Process"
          onClick={onEnquire}
        />
      </div>
    </section>
  );
}

function ModernizationSection({
  selected,
  onToggle,
  onEnquire,
}: Readonly<{
  selected: readonly string[];
  onToggle: (title: string) => void;
  onEnquire: () => void;
}>) {
  return (
    <section
      id="modernization"
      data-services-section="modernization"
      // Alternating tint (2nd of 4 sections) so consecutive sections don't
      // visually merge into one continuous block on scroll.
      className="scroll-mt-28 overflow-hidden border-t border-slate-200/70 bg-white py-20 text-slate-900 dark:border-white/10 dark:bg-darkmode dark:text-white md:scroll-mt-32 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-16">
          <div className="lg:sticky lg:top-32">
            <SectionHeading
              align="left"
              eyebrow={{ index: 2, label: sectionMeta[1].label }}
              title="Already Using Software?"
              accent="We Can Make It Better."
              description="Modernization can be focused and incremental. Select the improvements that matter now, while protecting useful workflows and business knowledge."
            />
            <div className="mt-8 hidden rounded-lg border border-brand/20 bg-brand/[0.06] p-6 dark:bg-brand/10 lg:block">
              <Gauge className="h-7 w-7 text-brand" />
              <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
                We begin with the current system, its users, and its constraints—then prioritize changes around business value and delivery risk.
              </p>
            </div>
          </div>

          <StaggerContainer className="grid items-stretch grid-cols-1 gap-4 sm:grid-cols-2">
            {modernizationCapabilities.map((capability) => (
              <StaggerItem key={capability.id} className="h-full" preset="card">
                <SelectableCard
                  item={capability}
                  selected={selected.includes(capability.title)}
                  onToggle={() => onToggle(capability.title)}
                  compact
                  testId="modernization-card"
                />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>

        <SelectionAction
          selectedCount={selected.length}
          emptyLabel="Select the areas you want to improve, or tell us about the system in your own words."
          buttonLabel="Improve My Software"
          onClick={onEnquire}
        />
      </div>
    </section>
  );
}

function AutomationSection({
  activeId,
  onSelect,
  onEnquire,
}: Readonly<{
  activeId: string;
  onSelect: (id: string) => void;
  onEnquire: () => void;
}>) {
  const activeOption =
    automationOptions.find((option) => option.id === activeId) ??
    automationOptions[0];

  // Falls back to a generic label if the data hasn't been extended with
  // `automatedTitle` yet — see the assumptions note at the top of this file.
  const automatedTitle =
    (activeOption as { automatedTitle?: string }).automatedTitle ??
    "A connected flow";

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const keys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"];
    if (!keys.includes(event.key)) return;

    event.preventDefault();
    const lastIndex = automationOptions.length - 1;
    let nextIndex = index;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = index === lastIndex ? 0 : index + 1;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = index === 0 ? lastIndex : index - 1;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = lastIndex;
    }

    const nextOption = automationOptions[nextIndex];
    onSelect(nextOption.id);
    document.getElementById(`automation-tab-${nextOption.id}`)?.focus();
  }

  return (
    <section
      id="automation"
      data-services-section="automation"
      className="scroll-mt-28 overflow-hidden border-t border-slate-200/70 bg-white py-20 text-slate-900 dark:border-white/10 dark:bg-darkmode dark:text-white md:scroll-mt-32 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={{ index: 3, label: sectionMeta[2].label }}
          title="From Manual Process"
          accent="to Automated Flow"
          description="Choose a workflow to see how thoughtful automation can replace repeated coordination while keeping people in control of the decisions that matter."
        />

        <div
          role="tablist"
          aria-label="Automation capabilities"
          className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          {automationOptions.map((option, index) => {
            const Icon = experienceIconMap[option.icon];
            const isActive = activeOption.id === option.id;

            return (
              <button
                key={option.id}
                id={`automation-tab-${option.id}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls="automation-comparison"
                tabIndex={isActive ? 0 : -1}
                data-testid="automation-option"
                onClick={() => onSelect(option.id)}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
                className={cn(
                  "flex items-center gap-3 rounded-lg border px-4 py-3.5 text-left text-sm font-semibold shadow-sm transition-[border-color,box-shadow,background-color] duration-300 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-brand dark:focus-visible:outline-blue-400",
                  isActive
                    ? "border-brand bg-brand text-white shadow-[0_10px_24px_rgba(54,88,255,0.2)] dark:border-blue-400/70 dark:shadow-[0_10px_24px_rgba(54,88,255,0.2)]"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:border-brand/40 hover:shadow-[0_12px_30px_rgba(54,88,255,0.16)] dark:border-slate-700/80 dark:bg-[#202638] dark:text-slate-200 dark:shadow-none dark:hover:border-blue-400/50",
                )}
              >
                <Icon className="h-5 w-5 shrink-0" strokeWidth={1.8} />
                {option.title}
              </button>
            );
          })}
        </div>

        <ScrollReveal className="mx-auto mt-10 max-w-5xl" preset="card">
          {/* Styled as an actual diff hunk rather than two generic
              rounded cards: gutter-bar + prefix glyph on each side, the same
              grammar a developer reads dozens of times a day. The active
              tab's brand-blue border ties this panel back to the selection
              above it; brand stays reserved for that interactive link only —
              the removed/added semantics run on rose/emerald exclusively. */}
          <div
            id="automation-comparison"
            role="tabpanel"
            aria-labelledby={`automation-tab-${activeOption.id}`}
            tabIndex={0}
            data-testid="automation-comparison-card"
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700/80 dark:bg-[#151a27] dark:shadow-none"
          >
            <div className="grid divide-y divide-slate-200 dark:divide-white/10 md:grid-cols-2 md:divide-x md:divide-y-0">
              <div
                data-testid="manual-process-card"
                className="relative bg-rose-50/60 p-6 dark:bg-rose-500/[0.06] sm:p-7"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-[3px] bg-rose-500 dark:bg-rose-400"
                />
                <p className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-rose-700 dark:text-rose-300">
                  <span aria-hidden="true">−</span> Manual Process
                </p>
                <h3 className="mt-4 text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                  {activeOption.title}
                </h3>
                <p data-testid="manual-process" className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {activeOption.manual}
                </p>
              </div>

              <div
                data-testid="automated-process-card"
                className="relative bg-emerald-50/60 p-6 dark:bg-emerald-400/[0.06] sm:p-7"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-[3px] bg-emerald-500 dark:bg-emerald-400"
                />
                <p className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-300">
                  <span aria-hidden="true">+</span> Automated Process
                </p>
                <h3 className="mt-4 text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                  {automatedTitle}
                </h3>
                <p data-testid="automated-process" className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {activeOption.automated}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 border-t border-slate-200 bg-slate-50 py-2.5 font-mono text-xs text-slate-400 dark:border-white/10 dark:bg-white/[0.02] dark:text-slate-500">
              <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
              <span>applies to your process</span>
            </div>
          </div>
        </ScrollReveal>

        {/* mode="single": this is a tab-driven choice, not a multi-select
            tally, so it gets copy that matches instead of a faked count. */}
        <SelectionAction
          mode="single"
          selectedCount={1}
          activeLabel={`Viewing how automation transforms “${activeOption.title}.”`}
          emptyLabel=""
          buttonLabel="Automate My Business"
          onClick={onEnquire}
        />
      </div>
    </section>
  );
}

function IntegrationSection({
  selected,
  onToggle,
  onEnquire,
}: Readonly<{
  selected: readonly string[];
  onToggle: (title: string) => void;
  onEnquire: () => void;
}>) {
  const selectedSet = useMemo(() => new Set(selected), [selected]);

  return (
    <section
      id="integration"
      data-services-section="integration"
      // Alternating tint (4th of 4 sections) — matches ModernizationSection.
      className="scroll-mt-28 overflow-hidden border-t border-slate-200/70 bg-white py-20 text-slate-900 dark:border-white/10 dark:bg-darkmode dark:text-white md:scroll-mt-32 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={{ index: 4, label: sectionMeta[3].label }}
          title="Make Your Software"
          accent="Talk to Each Other"
          description="Select the systems that need to share information. The visual builds your integration map while the enquiry carries those choices into our first conversation."
        />

        {/* MOBILE (< md): vertical hub-and-spoke stack. The desktop SVG
            connector lines don't translate to narrow viewports, so this is
            a genuinely different layout, not a scaled-down version — hiding
            the whole diagram below md (the old behavior) broke the section's
            core promise ("the visual builds your map") for mobile users. */}
        <div className="relative mx-auto mt-10 max-w-sm md:hidden">
          <div className="flex flex-col items-center gap-2 rounded-lg border border-brand/30 bg-brand px-5 py-5 text-center text-white shadow-[0_18px_50px_rgba(54,88,255,0.28)]">
            <Waypoints className="h-6 w-6" strokeWidth={1.8} />
            <p className="text-base font-semibold">Connected Business</p>
          </div>
          <div
            aria-hidden="true"
            className="mx-auto mt-3 h-6 w-px border-l border-dashed border-slate-300 dark:border-white/20"
          />
          <div className="grid grid-cols-2 gap-3">
            {integrations.map((integration) => {
              const Icon = experienceIconMap[integration.icon];
              const isSelected = selectedSet.has(integration.title);

              return (
                <button
                  key={integration.id}
                  type="button"
                  aria-pressed={isSelected}
                  data-testid="integration-node-mobile"
                  onClick={() => onToggle(integration.title)}
                  className={cn(
                    selectableSurface({ selected: isSelected }),
                    "flex flex-col items-center gap-2 px-3 py-4 text-center text-sm font-semibold",
                  )}
                >
                  <DiffGutter selected={isSelected} />
                  <span
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full",
                      isSelected
                        ? "bg-emerald-500 text-white dark:bg-emerald-400 dark:text-slate-900"
                        : "bg-brand/10 text-brand dark:bg-white/[0.07]",
                    )}
                  >
                    <Icon className="h-4.5 w-4.5" strokeWidth={1.8} />
                  </span>
                  {integration.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* DESKTOP (>= md): original radial diagram with connector lines. */}
        <ScrollReveal className="relative mx-auto mt-12 hidden max-w-5xl md:block" preset="card">
          <svg
            aria-hidden="true"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 z-0 h-full w-full text-slate-300 dark:text-white/15"
          >
            {integrations.map((integration, index) => {
              const [x, y] = integrationCoordinates[index];
              return (
                <line
                  key={integration.id}
                  x1="50"
                  y1="50"
                  x2={x}
                  y2={y}
                  vectorEffect="non-scaling-stroke"
                  className={cn(
                    "transition-colors duration-200",
                    selectedSet.has(integration.title)
                      ? "stroke-emerald-500 dark:stroke-emerald-400"
                      : "stroke-current",
                  )}
                  strokeWidth={selectedSet.has(integration.title) ? 2 : 1}
                  strokeDasharray={selectedSet.has(integration.title) ? undefined : "4 5"}
                />
              );
            })}
          </svg>

          <div className="relative z-10 grid grid-cols-3 grid-rows-3 gap-6">
            <div className="col-span-1 col-start-2 row-start-2 flex min-h-32 flex-col items-center justify-center rounded-lg border border-brand/30 bg-brand px-5 py-6 text-center text-white shadow-[0_18px_50px_rgba(54,88,255,0.28)]">
              <Waypoints className="h-7 w-7" strokeWidth={1.8} />
              <p className="mt-3 text-lg font-semibold">Connected Business</p>
              <p className="mt-1 text-xs leading-5 text-white/80">One dependable flow of information</p>
            </div>

            {integrations.map((integration, index) => {
              const Icon = experienceIconMap[integration.icon];
              const isSelected = selectedSet.has(integration.title);

              return (
                <button
                  key={integration.id}
                  type="button"
                  aria-pressed={isSelected}
                  data-testid="integration-node"
                  onClick={() => onToggle(integration.title)}
                  className={cn(
                    selectableSurface({ selected: isSelected }),
                    "group flex min-h-32 flex-col items-center justify-center px-3 py-5 text-center",
                    integrationPositions[index],
                  )}
                >
                  <DiffGutter selected={isSelected} />
                  <span
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full",
                      isSelected
                        ? "bg-emerald-500 text-white dark:bg-emerald-400 dark:text-slate-900"
                        : "bg-brand/10 text-brand dark:bg-white/[0.07]",
                    )}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                  </span>
                  <span className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
                    {integration.title}
                  </span>
                  {/* Previously `hidden sm:block` — description now always
                      renders on the desktop diagram; the mobile stack above
                      has its own compact layout instead of hiding this text
                      outright. */}
                  <span className="mt-1 text-xs leading-4 text-slate-500 dark:text-slate-400">
                    {integration.description}
                  </span>
                </button>
              );
            })}
          </div>
        </ScrollReveal>

        <div className="mt-7 flex justify-center">
          <Link
            href="/services/system-integration"
            className="inline-flex items-center gap-2 rounded-full border border-brand/30 px-5 py-2.5 text-sm font-semibold text-brand transition-colors hover:border-brand hover:bg-brand/[0.06] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand dark:bg-brand/[0.05]"
          >
            Explore System Integration
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <SelectionAction
          selectedCount={selected.length}
          emptyLabel="Choose two or more systems to sketch the connection you need, or describe it in the form."
          buttonLabel="Discuss an Integration"
          onClick={onEnquire}
        />
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

export default function ServicesExperience() {
  useServicesAnchorSync();

  const [selection, setSelection] = useState<SelectionState>({
    problems: [],
    modernization: [],
    automationId: automationOptions[0].id,
    integrations: [],
  });
  const [leadRequest, setLeadRequest] = useState<LeadRequest>(null);

  const enquire = (intent: LeadIntent) =>
    setLeadRequest({ intent, topics: buildLeadTopics(selection) });

  return (
    <>
      <ProgressRail />

      <BusinessProblemsSection
        selected={selection.problems}
        onToggle={(title) =>
          setSelection((s) => ({ ...s, problems: toggleTitle(s.problems, title) }))
        }
        onEnquire={() => enquire("process")}
      />

      <ModernizationSection
        selected={selection.modernization}
        onToggle={(title) =>
          setSelection((s) => ({
            ...s,
            modernization: toggleTitle(s.modernization, title),
          }))
        }
        onEnquire={() => enquire("software-improvement")}
      />

      <AutomationSection
        activeId={selection.automationId}
        onSelect={(id) => setSelection((s) => ({ ...s, automationId: id }))}
        onEnquire={() => enquire("automation")}
      />

      <IntegrationSection
        selected={selection.integrations}
        onToggle={(title) =>
          setSelection((s) => ({
            ...s,
            integrations: toggleTitle(s.integrations, title),
          }))
        }
        onEnquire={() => enquire("integration")}
      />

      <LeadCaptureDialog request={leadRequest} onClose={() => setLeadRequest(null)} />
    </>
  );
}