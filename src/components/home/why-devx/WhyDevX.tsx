"use client";

import Image from "next/image";
import { whyDevxData } from "@/data/whydevx";
import {
  HoverCard,
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/motion";

export default function WhyDevX() {
  return (
    <section className="relative overflow-hidden bg-white py-8 text-slate-900 transition-colors duration-200 dark:bg-[#181d2b] dark:text-white sm:py-12 md:py-20 lg:py-24">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[250px] w-[350px] rounded-full border border-brand/20 opacity-40 blur-2xl dark:border-brand/10 dark:opacity-30 sm:h-[600px] sm:w-[900px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal
          className="mb-8 text-center sm:mb-14 md:mb-16"
          preset="heading"
        >
          <h2 className="text-4xl sm:text-4xl md:text-5xl tracking-tight text-midnight_text dark:text-white leading-snug sm:leading-tight">
              Why Growing Businesses Choose <span className="text-brand">DevX</span>.
            </h2>
        </ScrollReveal>

        <StaggerContainer className="grid items-stretch grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
          {whyDevxData.map((card) => (
            <StaggerItem key={card.id} className="h-full" preset="card">
              <HoverCard className="h-full">
                <article className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-[border-color,box-shadow] duration-300 hover:border-brand/40 hover:shadow-[0_12px_30px_rgba(54,88,255,0.16)] dark:border-slate-700/80 dark:bg-gradient-to-b dark:from-[#2A3147] dark:via-[#232B40] dark:to-[#1B2235] dark:shadow-none dark:hover:border-blue-400/50">
                  <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-t-xl bg-slate-100/50 dark:bg-transparent">
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 opacity-[0.05] dark:opacity-[0.03]"
                      style={{
                        backgroundImage:
                          "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
                        backgroundSize: "28px 28px",
                      }}
                    />

                    <div className="absolute inset-0 bg-gradient-to-br from-brand/10 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-100 dark:from-brand/5" />

                    <ScrollReveal className="absolute inset-0" preset="image">
                      <div className="relative h-full w-full transition-transform duration-500 ease-out group-hover:scale-105">
                        <Image
                          src={card.image.src}
                          alt={card.image.alt}
                          fill
                          className="object-cover object-center"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                    </ScrollReveal>

                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-300/80 to-transparent blur-[1px] transition-colors duration-300 group-hover:via-brand/70 dark:via-slate-600/80 dark:group-hover:via-brand/70"
                    />
                  </div>

                  <div className="flex flex-1 flex-col px-5 pb-6 pt-5 sm:px-6 sm:pt-6 md:px-8">
                    <h3 className="text-lg font-bold tracking-tight text-slate-900 transition-colors duration-300 group-hover:text-brand dark:text-white dark:group-hover:text-brand sm:text-xl">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-base leading-6 text-slate-600 dark:text-white sm:text-base sm:leading-7">
                      {card.description}
                    </p>
                  </div>
                </article>
              </HoverCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>

      <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-slate-600 to-transparent opacity-60 sm:my-12" />
    </section>
  );
}
