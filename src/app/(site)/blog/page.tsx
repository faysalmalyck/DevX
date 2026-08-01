import React from "react";
import { articles } from "@/data/blog";
import { FeaturedPostsSection } from "@/app/(site)/blog/featured/page";
import { LatestArticlesSection } from "@/app/(site)/blog/latest/page";

export default function BlogPage() {
  return (
    <div className="bg-[#181d2b] text-slate-100 min-h-screen">
      <FeaturedPostsSection articles={articles} />
      <LatestArticlesSection articles={articles} />
    </div>
  );
}