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
    <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 w-full">
    <h1 className="text-4xl md:text-6xl font-normal tracking-tight">
      Articles <span className="text-blue-500">&amp;</span> Resources
    </h1>
    <p className="text-white text-sm max-w-md md:text-left">
      Discover the latest insights, developer toolkits, and best practices 
      engineered to help modern development teams scale faster.
    </p>
  </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Featured Article (Top space added, non-bold heading) */}
          <div className="lg:col-span-7">
            <Link
              href={`/blog/${featuredMain.slug}`}
              className="group block  p-6 sm:p-8 shadow-lg"
            >
              <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden mb-8">
                <Image
                  src={featuredMain.image}
                  alt={featuredMain.title}
                  fill
                  priority
                  className="object-cover group-hover:scale-103 transition duration-500"
                />
              </div>
              <div>
                <h2 className="text-3xl sm:text-4xl font-normal mb-4 group-hover:text-blue-500 transition leading-tight">
                  {featuredMain.title}
                </h2>
                <p className="text-slate-300 text-base sm:text-base leading-relaxed line-clamp-3">
                  {featuredMain.excerpt}
                </p>
              </div>
            </Link>
          </div>

          {/* Secondary Featured List (Non-bold item titles) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {featuredList.map((article) => (
              <Link
                key={article.id}
                href={`/blog/${article.slug}`}
                className="group flex gap-5 p-5 sm:p-6  items-center shadow-md"
              >
                <div className="relative w-32 h-24 sm:w-36 sm:h-28 flex-shrink-0 rounded-lg overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-normal text-slate-100 group-hover:text-blue-500 transition leading-snug line-clamp-2">
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