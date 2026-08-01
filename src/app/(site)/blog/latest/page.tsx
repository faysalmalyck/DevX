"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Article } from "@/data/blog";

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
    <section className="py-16 border-t border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <h2 className="text-4xl">Latest articles</h2>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-7 gap-4 py-4 rounded-4xl text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "bg-slate-700 text-white  hover:text-white hover:bg-slate-800 border border-slate-700"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Updated Grid & Card Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 w-full">
          {filteredArticles.map((article) => (
            <div key={article.id} className="w-full">
              <Link
                href={`/blog/${article.slug}`}
                className="group flex flex-col h-full bg-[#1e2436] border border-slate-800/80 rounded-xl overflow-hidden hover:border-slate-700 transition-all duration-300 shadow-md"
              >
                {/* Image */}
                <div className="relative aspect-[16/10.5] w-full bg-slate-800 overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                </div>

                {/* Content */}
                <div className="py-8 px-6 sm:px-8 flex flex-col flex-grow">
                  <h3 className="text-xl sm:text-2xl font-normal mb-3 line-clamp-2 text-white group-hover:text-blue-400 transition-colors">
                    {article.title}
                  </h3>

                  <p className="text-slate-300 text-sm mb-6 font-normal line-clamp-3">
                    {article.excerpt}
                  </p>

                  <div className="mt-auto pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="px-5 py-2 text-xs font-semibold bg-[#3b4251] text-white rounded-full border border-slate-800">
                      {article.category}
                    </span>

                    <span className="text-xs font-normal text-slate-400">
                      {article.date}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}