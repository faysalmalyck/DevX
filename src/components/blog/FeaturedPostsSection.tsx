"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Article } from "@/data/blog";
import {
  HoverCard,
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/motion";

interface FeaturedPostsSectionProps {
  articles: Article[];
}

export function FeaturedPostsSection({ articles }: FeaturedPostsSectionProps) {
  const featuredMain = articles[0];
  const featuredList = articles.slice(1, 5);

  if (!featuredMain) return null;

  return (
<section className="relative pt-20 pb-16 sm:pt-28 sm:pb-20 md:pt-36 md:pb-28 overflow-hidden bg-white text-gray-900 dark:bg-[#181d2b]
 dark:text-gray-100">      
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16 w-full">
          <ScrollReveal preset="hero">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-slate-900 dark:text-white text-center sm:text-left">
              Articles <span className="text-brand">&amp;</span> Resources
            </h1>
          </ScrollReveal>
          <ScrollReveal preset="copy" delay={0.12}>
            <p className="text-slate-600 dark:text-slate-300 text-sm max-w-md md:text-left">
              Discover the latest insights, developer toolkits, and best practices
              engineered to help modern development teams scale faster.
            </p>
          </ScrollReveal>
        </div>

        <StaggerContainer className="grid grid-cols-1 lg:grid-cols-16 gap-6 lg:gap-10 items-start">
          {/* Main Featured Article */}
          <StaggerItem className="lg:col-span-10 w-full">
            <HoverCard className="h-full rounded-lg">
              <Link
                className="group flex flex-col h-full overflow-hidden hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 shadow-sm dark:shadow-none"
                href={`/blog/${featuredMain.slug}`}
              >
                <ScrollReveal
                  preset="image"
                  className="w-[95%] mx-auto flex-shrink-0 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800"
                >
                  <Image
                    alt={featuredMain.title}
                    src={featuredMain.image}
                    width={1600}
                    height={1050}
                    priority
                    className="w-full h-auto object-contain group-hover:scale-102 transition-transform duration-500"
                  />
                </ScrollReveal>
                <div className="p-6 sm:p-8 flex flex-col flex-grow">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-medium mb-3 line-clamp-2 text-slate-900 dark:text-white group-hover:text-brand dark:group-hover:text-brand transition-colors">
                    {featuredMain.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm mb-6 font-normal line-clamp-3">
                    {featuredMain.excerpt}
                  </p>
                  <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-2">
                    <span className="px-3 sm:px-5 py-2 text-xs font-semibold bg-slate-100 dark:bg-[#3b4251] text-slate-800 dark:text-white rounded-full border border-slate-200 dark:border-slate-800">
                      {featuredMain.category || "News"}
                    </span>
                    <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                      {featuredMain.date}
                    </span>
                  </div>
                </div>
              </Link>
            </HoverCard>
          </StaggerItem>

          {/* Secondary Featured List */}
          <StaggerContainer className="lg:col-span-6 flex flex-col gap-1 sm:gap-2 w-full">
            {featuredList.map((article) => (
              <StaggerItem key={article.id} preset="right">
                <HoverCard className="rounded-xl">
                  <Link
                key={article.id}
                href={`/blog/${article.slug}`}
                    className="group flex flex-col sm:flex-row gap-4 sm:gap-5 py-2 px-2 sm:p-2 items-start rounded-xl transition-all duration-300"
                  >
                    <ScrollReveal
                      preset="image"
                      className="relative w-full sm:w-32 lg:w-36 flex-shrink-0 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800"
                    >
                      <Image
                        src={article.image}
                        alt={article.title}
                        width={560}
                        height={325}
                        className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Dark overlay on hover */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300 pointer-events-none" />
                    </ScrollReveal>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl lg:text-lg font-semibold text-slate-900 dark:text-slate-100 group-hover:text-brand dark:group-hover:text-brand transition-colors leading-normal sm:leading-snug">
                        {article.title}
                      </h3>
                    </div>
                  </Link>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </StaggerContainer>
      </div>
    </section>
  );
}
