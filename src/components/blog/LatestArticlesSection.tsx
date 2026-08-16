"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Article } from "@/data/blog";
import {
  HoverCard,
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/motion";

interface LatestArticlesSectionProps {
  articles: Article[];
}

export function LatestArticlesSection({ articles }: LatestArticlesSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(articles.map((item) => item.category))
    );
    return ["All", ...uniqueCategories];
  }, [articles]);

  const filteredArticles =
    selectedCategory === "All"
      ? articles
      : articles.filter((article) => article.category === selectedCategory);

  return (
    <section className="py-12 sm:py-16 border-t border-slate-200 dark:border-slate-800/60 bg-slate-50 dark:bg-[#181d2b] text-slate-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 sm:mb-12">
          <ScrollReveal preset="heading">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight">
              Latest articles
            </h2>
          </ScrollReveal>

          {/* Responsive Category Filters */}
          <ScrollReveal preset="copy" delay={0.1}>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const isActive = selectedCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-base font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-brand text-white shadow-sm"
                        : "bg-white dark:bg-[#1e2436] text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </ScrollReveal>
        </div>

        {/* Updated Grid & Card Layout */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 w-full">
          {filteredArticles.map((article) => (
            <StaggerItem key={article.id} className="w-full">
              <HoverCard className="h-full rounded-lg">
                <Link
                  href={`/blog/${article.slug}`}
                  className="group relative flex flex-col h-full bg-gray-50/50 dark:bg-gradient-to-b dark:from-[#252E41] dark:via-[#242D40] dark:to-[#1D2336] border border-gray-300 dark:border-[#2f384f] rounded-lg overflow-hidden transition-all duration-400 ease-out"
                >
                  {/* Image */}
                  <ScrollReveal
                    preset="image"
                    className="relative aspect-[16/10.5] w-full bg-slate-200 dark:bg-slate-800 overflow-hidden"
                  >
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                  </ScrollReveal>

                  {/* Content */}
                  <div className="p-6 sm:p-8 flex flex-col flex-grow">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-medium mb-3 line-clamp-2 text-slate-900 dark:text-white group-hover:text-brand dark:group-hover:text-brand transition-colors">
                      {article.title}
                    </h3>

                    <p className="text-slate-600 dark:text-white text-base mb-6 font-normal line-clamp-3">
                      {article.excerpt}
                    </p>

                    <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-2">
                      <span className="px-3 sm:px-5 py-2 text-xs font-semibold bg-slate-100 dark:bg-[#3b4251] text-slate-800 dark:text-white rounded-full border border-slate-200 dark:border-slate-800">
                        {article.category}
                      </span>

                      <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                        {article.date}
                      </span>
                    </div>
                  </div>
                </Link>
              </HoverCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
