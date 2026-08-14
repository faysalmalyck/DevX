"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { whyDevxData } from "@/data/whydevx";
import {
  HoverCard,
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/motion";

export default function WhyDevX() {
  const trackRef = useRef<HTMLDivElement>(null);

  // The middle set is exposed to assistive technology; the adjacent copies
  // create the continuous-scroll buffer without repeating the content aloud.
  const infiniteCards = Array.from({ length: 3 }, (_, setIndex) =>
    whyDevxData.map((card) => ({ card, setIndex })),
  ).flat();

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const handleInitialPosition = () => {
      const singleSetWidth = track.scrollWidth / 3;
      track.scrollLeft = singleSetWidth;
    };

    handleInitialPosition();

    const handleScroll = () => {
      const singleSetWidth = track.scrollWidth / 3;

      if (track.scrollLeft <= 40) {
        track.scrollLeft += singleSetWidth;
      } else if (track.scrollLeft >= singleSetWidth * 2 - 40) {
        track.scrollLeft -= singleSetWidth;
      }
    };

    track.addEventListener("scroll", handleScroll, { passive: true });
    return () => track.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-card]");
    const delta = (card?.offsetWidth ?? track.clientWidth * 0.85) + 16;
    track.scrollBy({ left: delta * direction, behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-white py-8 text-slate-900 transition-colors duration-200 dark:bg-[#181d2b] dark:text-white sm:py-12 md:py-16 lg:py-24">
      {/* Background glow scaled across viewports */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[220px] w-[280px] rounded-full border border-brand/20 opacity-40 blur-2xl dark:border-brand/10 dark:opacity-30 sm:h-[450px] sm:w-[650px] md:h-[600px] md:w-[900px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal
          className="mb-6 flex flex-col items-center justify-between gap-4 text-center sm:mb-10 sm:flex-row sm:text-left md:mb-14"
          preset="heading"
        >
          <h2 className="text-4xl tracking-tight text-midnight_text leading-snug dark:text-white sm:text-4xl sm:leading-tight md:text-5xl">
            Why Growing Businesses Choose <span className="text-brand">DevX</span>.
          </h2>

          {/* Navigation controls visible across viewports */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <button
              type="button"
              aria-label="Previous reason"
              onClick={() => scrollByCard(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-colors duration-200 hover:border-brand/40 hover:text-brand dark:border-slate-700 dark:text-slate-300 dark:hover:border-blue-400/50"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next reason"
              onClick={() => scrollByCard(1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-colors duration-200 hover:border-brand/40 hover:text-brand dark:border-slate-700 dark:text-slate-300 dark:hover:border-blue-400/50"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </ScrollReveal>
      </div>

      {/* Full-bleed track with breakpoint scaling */}
      <div data-testid="why-devx-carousel" className="relative w-full">
        <StaggerContainer
          containerRef={trackRef}
          className="flex w-full gap-4 overflow-x-auto px-4 pb-4 transition-all duration-300 sm:gap-6 sm:px-6 lg:gap-8 lg:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {infiniteCards.map(({ card, setIndex }, index) => (
            <StaggerItem
              key={`${card.id}-${index}`}
              className="h-full w-[88vw] flex-none sm:w-[48vw] md:w-[40vw] lg:w-[31vw] xl:w-[24vw]"
              preset="card"
            >
              <div data-card aria-hidden={setIndex !== 1} className="h-full">
                <HoverCard className="h-full">
                  <article className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-[border-color,box-shadow] duration-300 hover:border-brand/40 hover:shadow-[0_12px_30px_rgba(54,88,255,0.16)] dark:border-slate-700/80 dark:bg-gradient-to-b dark:from-[#2A3147] dark:via-[#232B40] dark:to-[#1B2235] dark:shadow-none dark:hover:border-blue-400/50">
                    <div className="relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden rounded-t-xl bg-slate-100/50 dark:bg-transparent sm:aspect-square">
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
                            alt={setIndex === 1 ? card.image.alt : ""}
                            fill
                            className="object-cover object-center"
                            sizes="(max-width: 639px) 88vw, (max-width: 767px) 48vw, (max-width: 1023px) 40vw, (max-width: 1279px) 31vw, 24vw"
                          />
                        </div>
                      </ScrollReveal>

                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-300/80 to-transparent blur-[1px] transition-colors duration-300 group-hover:via-brand/70 dark:via-slate-600/80 dark:group-hover:via-brand/70"
                      />
                    </div>

                    <div className="flex flex-1 flex-col p-4 sm:p-6 md:p-8">
                      <h3 className="text-lg font-bold tracking-tight text-slate-900 transition-colors duration-300 group-hover:text-brand dark:text-white dark:group-hover:text-brand sm:text-xl">
                        {card.title}
                      </h3>
                      <p className="mt-2 text-base leading-normal text-slate-600 dark:text-white sm:leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                  </article>
                </HoverCard>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>

    </section>
  );
}
