import { Check, CircleDot, Wrench } from "lucide-react";
import {
  HoverCard,
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/motion";
import {
  getServiceTechnologyById,
  technologyCategories,
} from "@/data/service-technologies";
import type { ServiceSolution } from "@/data/service-solutions";
import { businessProblems } from "@/data/services-experience";
import TechnologyIcon from "./TechnologyIcon";
import { addToCartCardSkin } from "@/components/shared/addToCartCardStyles";

type SolutionDetailExpansionsProps = Readonly<{
  solution: ServiceSolution;
}>;

const cardClassName =
  `h-full p-6 sm:p-7 ${addToCartCardSkin}`;

function SectionHeading({
  title,
  description,
}: Readonly<{
  title: string;
  description: string;
}>) {
  return (
    <ScrollReveal className="max-w-3xl" preset="heading">
      <h2 className="text-balance text-2xl font-medium tracking-tight text-slate-900 dark:text-white sm:text-3xl lg:text-4xl">
        {title}
      </h2>
      <p className="mt-5 text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
        {description}
      </p>
    </ScrollReveal>
  );
}

export function ProblemSolutionsSection({ solution }: SolutionDetailExpansionsProps) {
  const problems = solution.problemSolutions.flatMap((entry) => {
    const problem = businessProblems.find((item) => item.id === entry.problemId);
    return problem ? [{ ...entry, problem }] : [];
  });

  return (
    <section className="bg-transparent px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-4xl sm:px-6">
        <SectionHeading
          title="Business problems we solve"
          description="We start with the friction affecting your people, customers, or operations, then shape the solution around a practical next step."
        />
        <StaggerContainer className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {problems.map(({ problem, solution: response }) => (
            <StaggerItem key={problem.id} className="h-full" preset="card">
              <HoverCard className="h-full">
                <article data-testid="solution-problem-card" className={cardClassName}>
                  <span className="grid h-10 w-10 place-items-center rounded-full border border-brand/40 bg-brand/10 text-brand">
                    <CircleDot className="h-5 w-5" strokeWidth={1.6} aria-hidden="true" />
                  </span>
                  <h3 className="mt-6 text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                    {problem.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base sm:leading-7">
                    {problem.description}
                  </p>
                  <p className="mt-5 border-t border-slate-200 pt-5 text-sm font-medium leading-6 text-slate-700 dark:border-white/10 dark:text-slate-200">
                    <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-brand dark:text-cyan-200">
                      Our response
                    </span>
                    <span className="mt-2 block">{response}</span>
                  </p>
                </article>
              </HoverCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

export function ServiceUseCasesSection({ solution }: SolutionDetailExpansionsProps) {
  return (
    <section className="bg-transparent px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-4xl sm:px-6">
        <SectionHeading
          title="Where this service creates value"
          description="These are common ways we turn the service into a focused, usable capability for your business."
        />
        <StaggerContainer className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {solution.useCases.map((useCase) => (
            <StaggerItem key={useCase.title} className="h-full" preset="card">
              <HoverCard className="h-full">
                <article data-testid="solution-use-case-card" className={cardClassName}>
                  <Check className="h-5 w-5 text-brand" strokeWidth={2} aria-hidden="true" />
                  <h3 className="mt-5 text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                    {useCase.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base sm:leading-7">
                    {useCase.description}
                  </p>
                </article>
              </HoverCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

export function TechnologyOptionsSection({ solution }: SolutionDetailExpansionsProps) {
  const groupedOptions = technologyCategories.flatMap((category) => {
    const technologies = solution.technologyOptions.flatMap((option) => {
      const technology = getServiceTechnologyById(option.technologyId);
      return technology?.category === category ? [{ technology, fit: option.fit }] : [];
    });

    return technologies.length ? [{ category, technologies }] : [];
  });

  return (
    <section className="bg-transparent px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-4xl sm:px-6">
        <SectionHeading
          title="Technology and platform options"
          description="We select the platform and engineering approach around your product, existing systems, delivery pace, and long-term operating needs."
        />
        <div className="mt-10 space-y-10">
          {groupedOptions.map(({ category, technologies }) => (
            <div key={category} aria-labelledby={`technology-category-${category}`}>
              <h3
                id={`technology-category-${category}`}
                className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400"
              >
                {category}
              </h3>
              <StaggerContainer className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {technologies.map(({ technology }) => (
                  <StaggerItem key={technology.id} className="h-full" preset="card">
                    <HoverCard className="h-full">
                      <article
                        data-testid="solution-technology-card"
                        className={`flex h-full gap-4 p-5 sm:p-6 ${addToCartCardSkin}`}
                      >
                        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-transparent text-brand dark:text-cyan-200 sm:h-14 sm:w-14">
                          <TechnologyIcon icon={technology.icon} />
                        </span>
                        <div className="min-w-0">
                          <h4 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                            {technology.name}
                          </h4>
                          <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
                            {technology.description}
                          </p>
                        </div>
                      </article>
                    </HoverCard>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ImplementationOptionsSection({ solution }: SolutionDetailExpansionsProps) {
  return (
    <section className="bg-transparent px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-4xl sm:px-6">
        <SectionHeading
          title="Implementation options shaped around your requirements"
          description="The right delivery path depends on your current systems, delivery risk, product goals, and the level of flexibility you need."
        />
        <StaggerContainer className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
          {solution.implementationOptions.map((option) => (
            <StaggerItem key={option.title} className="h-full" preset="card">
              <HoverCard className="h-full">
                <article data-testid="solution-implementation-option" className={cardClassName}>
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand text-white">
                    <Wrench className="h-5 w-5" strokeWidth={1.7} aria-hidden="true" />
                  </span>
                  <h3 className="mt-6 text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                    {option.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base sm:leading-7">
                    {option.description}
                  </p>
                  <p className="mt-5 border-l-2 border-brand/50 pl-4 text-sm leading-6 text-slate-700 dark:text-slate-200">
                    <span className="font-semibold text-slate-900 dark:text-white">Best for: </span>
                    {option.bestFor}
                  </p>
                  <ul className="mt-6 flex flex-wrap gap-2" aria-label={`${option.title} technologies`}>
                    {option.technologyIds.map((technologyId) => {
                      const technology = getServiceTechnologyById(technologyId);
                      if (!technology) return null;

                      return (
                        <li
                          key={technology.id}
                          className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-white/[0.06] dark:text-slate-200"
                        >
                          <TechnologyIcon icon={technology.icon} className="h-3.5 w-3.5" />
                          {technology.name}
                        </li>
                      );
                    })}
                  </ul>
                </article>
              </HoverCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
