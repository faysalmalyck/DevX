import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, CircleDot } from "lucide-react";
import {
  HoverCard,
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/motion";
import {
  getServiceSolutionBySlug,
  type ServiceSolution,
} from "@/data/service-solutions";
import { servicesData } from "@/data/services";
import ServiceCardLink from "@/components/shared/ServiceCardLink";
import SolutionIcon from "./SolutionIcon";
import SolutionLeadCTA from "./SolutionLeadCTA";

type SolutionDetailProps = Readonly<{
  solution: ServiceSolution;
}>;

const relatedServiceCardIds: Partial<
  Record<ServiceSolution["slug"], string>
> = {
  "custom-software": "custom-software",
  "web-applications": "website-app-development",
  "mobile-applications": "mobile-app-development",
  "crm-erp": "crm-erp",
  "business-automation": "business-automation",
  "ai-solutions": "ai-machine-learning",
  "system-integration": "system-integration",
  "legacy-modernization": "legacy-modernization",
  "saas": "saas",
  "databases-data-science": "databases-data-science",
};

function SolutionSystemVisual({ solution }: SolutionDetailProps) {
  if (solution.heroImage) {
    return (
      <div
        data-testid="solution-hero-visual"
        className="relative aspect-[3/2] w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-800 dark:shadow-none"
      >
        <Image
          src={solution.heroImage.src}
          alt={solution.heroImage.alt}
          fill
          loading="eager"
          sizes="(max-width: 1280px) calc(100vw - 2rem), 80rem"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      data-testid="solution-hero-visual"
      className="relative min-h-[22rem] w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow-sm dark:border-slate-800 dark:bg-slate-800 dark:shadow-none sm:min-h-[28rem] lg:min-h-[32rem]"
    >
      <div
        className="absolute inset-0 opacity-[0.08] dark:opacity-[0.09]"
        style={{
          backgroundImage:
            "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-brand),transparent_58%)] opacity-[0.12] dark:opacity-20" />

      <div className="absolute left-1/2 top-1/2 h-px w-[65%] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-brand/50 to-transparent" />
      <div className="absolute left-1/2 top-1/2 h-[62%] w-px -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-transparent via-brand/50 to-transparent" />

      <div className="absolute left-1/2 top-1/2 grid h-28 w-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[2rem] border border-brand/30 bg-white text-brand shadow-[0_20px_60px_rgba(54,88,255,0.24)] dark:bg-[#1d2537] sm:h-32 sm:w-32">
        <SolutionIcon icon={solution.icon} className="h-11 w-11 sm:h-12 sm:w-12" />
      </div>

      {solution.capabilities.slice(0, 4).map((capability, index) => {
        const positions = [
          "left-4 top-5 sm:left-8 sm:top-8",
          "right-4 top-5 sm:right-8 sm:top-8",
          "bottom-5 left-4 sm:bottom-8 sm:left-8",
          "bottom-5 right-4 sm:bottom-8 sm:right-8",
        ];

        return (
          <div
            key={capability.title}
            className={`absolute max-w-[calc(50%-1.5rem)] break-words rounded-xl border border-slate-200 bg-white/90 px-3 py-2.5 text-xs font-medium leading-4 text-slate-700 shadow-sm backdrop-blur dark:border-white/10 dark:bg-[#20283a]/90 dark:text-slate-200 sm:max-w-[11rem] sm:px-4 sm:py-3 sm:text-sm ${positions[index]}`}
          >
            {capability.title}
          </div>
        );
      })}
    </div>
  );
}

function RelatedSolutions({ solution }: SolutionDetailProps) {
  const relatedSolutions = solution.related
    .map((slug) => getServiceSolutionBySlug(slug))
    .filter((related): related is ServiceSolution => Boolean(related));
  const relatedCards = relatedSolutions.map((related) => {
    const href = `/services/${related.slug}`;
    const existingCardId = relatedServiceCardIds[related.slug];
    const existingCard = servicesData.find(
      (service) => service.id === existingCardId,
    );

    if (existingCard) {
      return existingCard;
    }

    if (!related.heroImage) {
      throw new Error(`Missing service-card image for ${related.slug}`);
    }

    return {
      id: related.slug,
      title: related.title,
      description: related.summary,
      icon: related.heroImage,
      href,
      status: "draft" as const,
    };
  });

  return (
    <section className="border-t border-slate-200 bg-transparent px-4 py-16 dark:border-slate-800 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal
          className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
          preset="heading"
        >
          <h2 className="text-balance text-2xl font-medium tracking-tight text-slate-900 dark:text-white sm:text-3xl lg:text-4xl">
            Related solutions
          </h2>
          <Link
            href="/services"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-700 transition-all duration-200 hover:border-brand hover:bg-slate-100 hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand dark:border-slate-800 dark:bg-[#121623] dark:text-white dark:hover:border-blue-400 dark:hover:bg-[#1a2032] dark:hover:text-blue-400 sm:px-8"
          >
            View all services
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </ScrollReveal>

        <StaggerContainer className="mt-10 grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
          {relatedCards.map((related) => (
            <StaggerItem key={related.id} className="h-full" preset="card">
              <ServiceCardLink
                id={`related-${related.id}`}
                title={related.title}
                description={related.description}
                image={related.icon}
                href={related.href}
                testId="related-service-card"
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

export default function SolutionDetail({ solution }: SolutionDetailProps) {
  return (
    <main
      data-testid="solution-article-shell"
      className="min-h-screen overflow-hidden bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-darkmode dark:text-white"
    >
      <section className="relative overflow-hidden px-4 pb-12 pt-28 sm:px-6 sm:pb-16 sm:pt-32 lg:px-8 lg:pt-36">
        <div className="pointer-events-none absolute -right-52 top-10 h-[34rem] w-[34rem] rounded-full bg-brand/10 blur-3xl dark:bg-brand/15" />
        <div className="relative mx-auto max-w-7xl">
          <ScrollReveal className="mb-8" preset="left">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-base font-semibold text-slate-700 transition-all duration-300 hover:-translate-x-1 hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand dark:text-white dark:hover:text-brand"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to all services
            </Link>
          </ScrollReveal>

          <header className="py-8 text-center sm:py-12 lg:py-16">
            <ScrollReveal delay={0.08} preset="hero">
              <h1 className="mx-auto mb-6 max-w-5xl px-2 text-balance text-center text-3xl font-medium leading-tight tracking-tight text-slate-900 dark:text-white sm:mb-8 sm:px-8 sm:text-5xl lg:px-16 lg:text-6xl">
                {solution.title}
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.16} preset="copy">
              <p className="mx-auto max-w-3xl text-center text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
                {solution.heroStatement}
              </p>
            </ScrollReveal>
          </header>

          <ScrollReveal
            className="relative mx-auto mb-12 w-full max-w-5xl sm:mb-16"
            delay={0.24}
            preset="image"
          >
            <SolutionSystemVisual solution={solution} />
          </ScrollReveal>
        </div>
      </section>

      <section className="bg-transparent px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-4xl sm:px-6">
          <ScrollReveal preset="heading">
            <h2 className="text-balance text-2xl font-medium tracking-tight text-slate-900 dark:text-white sm:text-3xl lg:text-4xl">
              {solution.challenge.title}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
              {solution.challenge.description}
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section
        id="capabilities"
        className="scroll-mt-28 bg-transparent px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20"
      >
        <div className="mx-auto max-w-4xl sm:px-6">
          <ScrollReveal className="max-w-3xl" preset="heading">
            <h2 className="text-balance text-2xl font-medium tracking-tight text-slate-900 dark:text-white sm:text-3xl lg:text-4xl">
              Capabilities shaped around the outcome
            </h2>
            <p className="mt-5 text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
              {solution.summary}
            </p>
          </ScrollReveal>

          <StaggerContainer className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {solution.capabilities.map((capability, index) => (
              <StaggerItem key={capability.title} className="h-full" preset="card">
                <HoverCard className="h-full">
                  <article
                    data-testid="solution-capability-card"
                    className="flex h-full gap-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-brand/40 hover:shadow-[0_12px_30px_rgba(54,88,255,0.16)] dark:border-slate-700/80 dark:bg-[#1d2436] dark:hover:border-blue-400/50 sm:p-7"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand text-sm font-semibold text-white">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                        {capability.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base sm:leading-7">
                        {capability.description}
                      </p>
                    </div>
                  </article>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="bg-transparent px-4 py-12 text-slate-900 dark:text-white sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-4xl sm:px-6">
          <ScrollReveal className="max-w-3xl" preset="heading">
            <h2 className="text-balance text-2xl font-medium tracking-tight text-slate-900 dark:text-white sm:text-3xl lg:text-4xl">
              Improvement people can feel in the work
            </h2>
          </ScrollReveal>

          <StaggerContainer className="mt-10 grid grid-cols-1 items-stretch gap-5 md:grid-cols-3">
            {solution.outcomes.map((outcome) => (
              <StaggerItem key={outcome.title} className="h-full" preset="card">
                <HoverCard className="h-full">
                  <article
                    data-testid="solution-outcome-card"
                    className="h-full rounded-xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:border-brand/40 hover:shadow-[0_12px_30px_rgba(54,88,255,0.16)] dark:border-slate-700/80 dark:bg-[#1d2436] dark:hover:border-blue-400/50 sm:p-8"
                  >
                    <span className="grid h-10 w-10 place-items-center rounded-full border border-brand/40 bg-brand/10 text-brand">
                      <Check className="h-5 w-5" strokeWidth={2} />
                    </span>
                    <h3 className="mt-6 text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                      {outcome.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base sm:leading-7">
                      {outcome.description}
                    </p>
                  </article>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="bg-transparent px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-4xl sm:px-6">
          <ScrollReveal className="max-w-3xl" preset="heading">
            <h2 className="text-balance text-2xl font-medium tracking-tight text-slate-900 dark:text-white sm:text-3xl lg:text-4xl">
              A focused path from problem to progress
            </h2>
          </ScrollReveal>

          <StaggerContainer className="relative mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-10">
            <div className="pointer-events-none absolute left-[16.67%] right-[16.67%] top-5 hidden h-px bg-gradient-to-r from-brand/20 via-brand to-brand/20 lg:block" />
            {solution.delivery.map((step, index) => (
              <StaggerItem key={step.title} className="relative" preset="card">
                <article>
                  <span className="relative z-10 grid h-10 w-10 place-items-center rounded-full border-4 border-white bg-brand text-sm font-semibold text-white shadow-[0_8px_24px_rgba(54,88,255,0.28)] dark:border-darkmode">
                    {index + 1}
                  </span>
                  <h3 className="mt-6 text-xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-300">
                    {step.description}
                  </p>
                </article>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <ScrollReveal
            className="mt-12 flex items-center gap-3 rounded-lg border border-brand/20 bg-brand/5 px-5 py-4 text-sm leading-6 text-slate-700 dark:text-slate-200 sm:px-6 sm:text-base"
            preset="copy"
          >
            <CircleDot className="h-5 w-5 shrink-0 text-brand" strokeWidth={1.5} />
            Every engagement is shaped around the existing system, delivery risk,
            and the people responsible for the outcome.
          </ScrollReveal>
        </div>
      </section>

      <RelatedSolutions solution={solution} />
      <SolutionLeadCTA solutionTitle={solution.title} />
    </main>
  );
}
