import React from "react";
import { articles } from "@/data/blog";
import { FeaturedPostsSection } from "@/components/blog/FeaturedPostsSection";
import { LatestArticlesSection } from "@/components/blog/LatestArticlesSection";

export default function BlogPage() {
  return (
    <div className="bg-[#181d2b] text-slate-100 min-h-screen">
      <FeaturedPostsSection articles={articles} />
      <LatestArticlesSection articles={articles} />
    </div>
  );
}