"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { HoverCard, ScrollReveal } from "@/components/motion";

type ServiceCardLinkProps = Readonly<{
  id: string;
  title: string;
  description: string;
  image: Readonly<{
    src: string;
    alt: string;
  }>;
  href: string;
  priority?: boolean;
  testId?: string;
}>;

export default function ServiceCardLink({
  id,
  title,
  description,
  image,
  href,
  priority = false,
  testId,
}: ServiceCardLinkProps) {
  return (
    <HoverCard className="h-full">
      <Link
        href={href}
        data-service-card-link={id}
        data-testid={testId}
        className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-[0_12px_30px_#1c2b47] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand dark:border-slate-700/80 dark:bg-[#1d2436]"
      >
        <div className="relative flex h-52 w-full items-center justify-center overflow-hidden rounded-t-xl bg-slate-100/50 dark:bg-transparent sm:h-56 md:h-64">
          <div
            className="absolute inset-0 opacity-[0.05] dark:opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-br from-brand/10 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-100 dark:from-brand/5" />

          <ScrollReveal className="absolute inset-0" preset="image">
            <div className="relative h-full w-full">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority={priority}
                className="object-cover object-center"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
          </ScrollReveal>
        </div>

        <div className="mb-4 h-px bg-slate-200 transition-colors duration-300 group-hover:bg-brand/40 dark:bg-slate-700/80 sm:mb-6" />

        <div className="flex flex-1 flex-col px-5 pb-6 sm:px-6 md:px-8">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-lg font-bold tracking-tight text-slate-900 transition-colors duration-300 group-hover:text-brand dark:text-white dark:group-hover:text-brand sm:text-xl">
              {title}
            </h3>
            <ArrowUpRight
              aria-hidden="true"
              className="mt-1 h-4 w-4 shrink-0 text-brand transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </div>

          <p className="mt-2 text-base leading-6 text-slate-600 dark:text-white sm:leading-7">
            {description}
          </p>
        </div>
      </Link>
    </HoverCard>
  );
}