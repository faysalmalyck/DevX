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
<section className="pt-10 pb-30 bg-[#181d2b] text-white overflow-hidden w-full">      {/* Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-xl">
            <h2 className="text-3xl sm:text-5xl font-normal tracking-tight">
              Browse our latest{" "}
              <span className="text-blue-500">articles</span> and{" "}
              <span className="text-blue-500">resources</span>
            </h2>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              aria-label="Previous slide"
              className="p-3 rounded-full border border-slate-700/60 bg-[#1e2436] text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next slide"
              className="p-3 rounded-full border border-slate-700/60 bg-[#1e2436] text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Full-Width Carousel Container (Edge-to-Edge) */}
      <div className=" w-full overflow-hidden">
        <div
          onTransitionEnd={handleTransitionEnd}
          className={`flex gap-10 px-4 sm:px-6 lg:px-8 ${
            isTransitioning ? "transition-transform duration-500 ease-in-out" : "transition-none"
          }`}
          style={{ transform: `translateX(-${currentIndex * 44}%)` }}
        >
          {extendedArticles.map((article, idx) => (
            <div
              key={`${article.id}-${idx}`}
              className="w-[70vw] sm:w-[calc(63%-12px)] lg:w-[calc(44%-12px)] flex-shrink-0"
            >
              <Link
                href={`/blog/${article.slug}`}
                className="group flex flex-col h-full bg-[#1e2436] border border-slate-800/80 rounded-lg overflow-hidden hover:border-slate-700 transition-all duration-300"
              >
                {/* Image Wrapper (Adjusted Aspect Ratio for Height) */}
                <div className="relative aspect-[16/10.5] w-full bg-slate-800 overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                </div>

                {/* Content (Increased Vertical Padding) */}
                <div className="py-14 px-12   flex flex-col flex-grow">
                  <h3 className="text-xl sm:text-2xl font-normal mb-3 line-clamp-2 text-white group-hover:text-blue-400 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-white text-sm mb-6 font-normal line-clamp-3">
                    {article.excerpt}
                  </p>
                    
                  {/* Footer / Meta */}

                  
                  <div className="mt-auto pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    
                    <span className="px-7 py-4 text-xs font-semibold bg-[#3b4251] text-white rounded-full border border-slate-800">
                      {article.category}
                    </span>
                    <span className="text-xs font-normal text-slate-500">
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
                activeIndex === idx ? "w-6 bg-blue-500" : "w-2 bg-slate-700"
              }`}
            />
          );
        })}
      </div>
    </section>
  );
}