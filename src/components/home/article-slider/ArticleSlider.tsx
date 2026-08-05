"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { articles } from "@/data/blog";

// Double the array to guarantee seamless looping across wide viewports
const baseArticles = [...articles, ...articles];
const extendedArticles = [
  baseArticles[baseArticles.length - 1],
  ...baseArticles,
  baseArticles[0],
];

export default function ArticleSlider() {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const isJumping = useRef(false);

  const handlePrev = () => {
    if (isJumping.current) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (isJumping.current) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  // Handle transition end to seamlessly reset position when at boundaries
  const handleTransitionEnd = () => {
    if (currentIndex === 0) {
      isJumping.current = true;
      setIsTransitioning(false);
      setCurrentIndex(baseArticles.length);
    } else if (currentIndex === extendedArticles.length - 1) {
      isJumping.current = true;
      setIsTransitioning(false);
      setCurrentIndex(1);
    }
  };

  useEffect(() => {
    if (!isTransitioning) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          isJumping.current = false;
        });
      });
    }
  }, [isTransitioning]);

  return (
    <section className="pt-10 pb-16 md:pb-24 lg:pb-30 bg-slate-50 dark:bg-[#181d2b] text-slate-900 dark:text-white overflow-hidden w-full transition-colors duration-300">
      {/* Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-xl">
            <h2 className="text-4xl sm:text-4xl lg:text-5xl font-normal tracking-tight">
              Browse our latest{" "}
              <span className="text-blue-600 dark:text-blue-500">articles</span> and{" "}
              <span className="text-blue-600 dark:text-blue-500">resources</span>
            </h2>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              aria-label="Previous slide"
              className="p-3 rounded-full border border-slate-300 dark:border-slate-700/60 bg-white dark:bg-[#1e2436] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next slide"
              className="p-3 rounded-full border border-slate-300 dark:border-slate-700/60 bg-white dark:bg-[#1e2436] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Full-Width Carousel Container (Edge-to-Edge) */}
      <div className="w-full overflow-hidden">
        <div
          onTransitionEnd={handleTransitionEnd}
          className={`flex gap-4 sm:gap-6 lg:gap-10 px-4 sm:px-6 lg:px-8 ${
            isTransitioning ? "transition-transform duration-500 ease-in-out" : "transition-none"
          }`}
          style={{
            transform: `translateX(calc(-${currentIndex} * (85vw + 16px)))`,
          }}
        >
          <style jsx>{`
            @media (min-width: 640px) {
              div[style] {
                transform: translateX(calc(-${currentIndex} * (63vw + 24px))) !important;
              }
            }
            @media (min-width: 1024px) {
              div[style] {
                transform: translateX(calc(-${currentIndex} * (44vw + 40px))) !important;
              }
            }
          `}</style>
          {extendedArticles.map((article, idx) => (
            <div
              key={`${article.id}-${idx}`}
              className="w-[85vw] sm:w-[calc(63%-12px)] lg:w-[calc(44%-12px)] flex-shrink-0"
            >
              <Link
                href={`/blog/${article.slug}`}
                className="group flex flex-col h-full bg-white dark:bg-[#1e2436] border border-slate-200 dark:border-slate-800/80 rounded-lg overflow-hidden hover:border-slate-300 dark:hover:border-slate-700 shadow-sm dark:shadow-none transition-all duration-300"
              >
                {/* Image Wrapper (Adjusted Aspect Ratio for Height) */}
                <div className="relative aspect-[16/10.5] w-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8 lg:p-12 flex flex-col flex-grow">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-normal mb-3 line-clamp-2 text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm mb-6 font-normal line-clamp-3">
                    {article.excerpt}
                  </p>
                    
                  {/* Footer / Meta */}
                  <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-2">
                    <span className="px-3 sm:px-5 py-2 sm:py-3 text-xs font-semibold bg-slate-100 dark:bg-[#3b4251] text-slate-800 dark:text-white rounded-full border border-slate-200 dark:border-slate-800">
                      {article.category}
                    </span>
                    <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                      {article.date}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Dots (Mobile) */}
      <div className="flex justify-center gap-2 mt-8 md:hidden">
        {articles.map((_, idx) => {
          const activeIndex =
            currentIndex === 0
              ? articles.length - 1
              : currentIndex === extendedArticles.length - 1
              ? 0
              : (currentIndex - 1) % articles.length;

          return (
            <button
              key={idx}
              onClick={() => {
                setIsTransitioning(true);
                setCurrentIndex(idx + 1);
              }}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeIndex === idx
                  ? "w-6 bg-blue-600 dark:bg-blue-500"
                  : "w-2 bg-slate-300 dark:bg-slate-700"
              }`}
            />
          );
        })}
      </div>
    </section>
  );
}