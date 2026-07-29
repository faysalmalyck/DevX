"use client";

import React, { useRef } from "react";
import Slider from "react-slick";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { portfolioinfo } from "@/data/siteData";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const PortfolioCard = () => {
  const sliderRef = useRef<Slider | null>(null);

  const settings = {
    autoplay: true,
    autoplaySpeed: 2300,
    dots: false,
    arrows: false,
    infinite: true,
    speed: 800,
    slidesToShow: 4,
    slidesToScroll: 1,
    pauseOnHover: true,
    swipeToSlide: true,
    cssEase: "ease-in-out",
    responsive: [
      {
        breakpoint: 1320,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 1100,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 560,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
      <div className="relative mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-12">
        <div className="relative">
          <button
            type="button"
            onClick={() => sliderRef.current?.slickPrev()}
            aria-label="Previous portfolio slide"
            className="absolute left-0 top-1/2 z-20 hidden h-13 w-13 -translate-x-4 -translate-y-1/2 items-center justify-center rounded-full border border-slate-950/10 bg-white/90 text-slate-900 shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-Sky-blue-mist/40 hover:bg-gradient-to-r hover:from-primary hover:to-Sky-blue-mist hover:text-white dark:border-white/[0.12] dark:bg-white/[0.08] dark:text-white lg:flex"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={() => sliderRef.current?.slickNext()}
            aria-label="Next portfolio slide"
            className="absolute right-0 top-1/2 z-20 hidden h-13 w-13 translate-x-4 -translate-y-1/2 items-center justify-center rounded-full border border-slate-950/10 bg-white/90 text-slate-900 shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-Sky-blue-mist/40 hover:bg-gradient-to-r hover:from-primary hover:to-Sky-blue-mist hover:text-white dark:border-white/[0.12] dark:bg-white/[0.08] dark:text-white lg:flex"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div className="portfolio-slider -mx-3">
            <Slider ref={sliderRef} {...settings}>
              {portfolioinfo.map((item, index) => (
                <div key={index} className="px-3 pb-6">
                  <Link
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block"
                  >
                    <article className="relative h-[460px] overflow-hidden rounded-[28px] bg-[#181d2b] shadow-[0_18px_50px_rgba(15,23,42,0.18)] transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_30px_90px_rgba(139,92,246,0.28)]">
                      <Image
                        src={item.image}
                        alt={item.alt}
                        width={1200}
                        height={900}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-[#181d2b]/95 via-[#181d2b]/55 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/24 via-transparent to-Sky-blue-mist/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                      <div className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/12 text-white shadow-lg backdrop-blur-md transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-Sky-blue-mist group-hover:text-white">
                        <ArrowUpRight className="h-5 w-5" />
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <span className="mb-4 inline-flex rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md">
                          {item.slug}
                        </span>

                        <h4 className="line-clamp-2 text-2xl font-black leading-tight text-white">
                          {item.title}
                        </h4>

                        <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/75">
                          {item.info}
                        </p>

                        <div className="mt-5 flex items-center gap-2 text-sm font-bold text-white">
                          <span>View project</span>
                          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </div>
                      </div>
                    </article>
                  </Link>
                </div>
              ))}
            </Slider>
          </div>

          <div className="mt-6 flex justify-center gap-3 lg:hidden">
            <button
              type="button"
              onClick={() => sliderRef.current?.slickPrev()}
              aria-label="Previous portfolio slide"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 shadow-md transition-all duration-300 hover:bg-gradient-to-r hover:from-primary hover:to-Sky-blue-mist hover:text-white dark:border-white/10 dark:bg-white/10 dark:text-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => sliderRef.current?.slickNext()}
              aria-label="Next portfolio slide"
              className="premium-gradient-button flex h-11 w-11 items-center justify-center rounded-full shadow-md"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
  );
};

export default PortfolioCard;
