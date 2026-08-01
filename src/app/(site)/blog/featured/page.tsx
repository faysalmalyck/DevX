"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Article } from "@/data/blog";

interface FeaturedPostsSectionProps {
  articles: Article[];
}

export function FeaturedPostsSection({ articles }: FeaturedPostsSectionProps) {
  const featuredMain = articles[0];
  const featuredList = articles.slice(1, 5);

  if (!featuredMain) return null;

  return (
    <section className="relative pt-16 pb-12 sm:pt-20 sm:pb-16 md:pt-28 md:pb-20 lg:pt-36 lg:pb-28 overflow-hidden bg-slate-50 dark:bg-[#181d2b] text-slate-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-16 w-full">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight">
            Articles <span className="text-blue-600 dark:text-blue-500">&amp;</span> Resources
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm max-w-md md:text-left">
            Discover the latest insights, developer toolkits, and best practices 
            engineered to help modern development teams scale faster.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-start">
          {/* Main Featured Article */}
          <div className="lg:col-span-7">
            <Link
              href={`/blog/${featuredMain.slug}`}
              className="group block p-5 sm:p-8 bg-white dark:bg-[#1e2436] border border-slate-200 dark:border-slate-800/80 rounded-2xl hover:border-slate-300 dark:hover:border-slate-700 shadow-sm dark:shadow-none transition-all duration-300"
            >
              <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden mb-6 sm:mb-8 bg-slate-200 dark:bg-slate-800">
                <Image
                  src={featuredMain.image}
                  alt={featuredMain.title}
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-normal mb-3 sm:mb-4 text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                  {featuredMain.title}
                </h2>
                <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed line-clamp-3">
                  {featuredMain.excerpt}
                </p>
              </div>
            </Link>
          </div>

          {/* Secondary Featured List */}
          <div className="lg:col-span-5 flex flex-col gap-4 sm:gap-6">
            {featuredList.map((article) => (
              <Link
                key={article.id}
                href={`/blog/${article.slug}`}
                className="group flex gap-4 sm:gap-5 p-4 sm:p-5 items-center bg-white dark:bg-[#1e2436] border border-slate-200 dark:border-slate-800/80 rounded-xl hover:border-slate-300 dark:hover:border-slate-700 shadow-sm dark:shadow-none transition-all duration-300"
              >
                <div className="relative w-28 h-20 sm:w-36 sm:h-28 flex-shrink-0 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-normal text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug line-clamp-2">
                    {article.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}