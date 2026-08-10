import React from "react";
import Image from "next/image";
import { Blog } from "@/types/blog";
import { format } from "date-fns";
import Link from "next/link";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import { getImgPath } from "@/utils/image";

const BlogCard = ({ blog }: { blog: Blog }) => {
    const { title, coverImage, excerpt, date, slug } = blog;
    const postTitle = title ?? "DevX insight";
    const postSlug = slug ?? "#!";
    const postImage = coverImage ?? "";
    const postDate = date ? new Date(date) : new Date();
    return (
        <article className="glass-card group relative h-full overflow-hidden rounded-[1.75rem] p-3 transition-all duration-500 hover:-translate-y-2 hover:border-primary/30 hover:shadow-[0_30px_90px_rgba(47,115,242,0.16)]">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-slate-900">
                    <Link href={`/blog/${postSlug}`} aria-label="blog cover" className="block h-full">
                        <Image
                            src={getImgPath(`/${postImage}`)}
                            alt={postTitle}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            width={408}
                            height={272}
                            quality={100}
                        />
                    </Link>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70" />
                    <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-white backdrop-blur-xl">
                        Insight
                    </span>
                </div>
                <div className="p-4">
                    <div className="mb-4 flex items-center gap-2 text-base font-semibold text-secondary dark:text-white/50">
                        <CalendarDays className="h-4 w-4 text-primary" />
                        {format(postDate, "dd MMM yyyy")}
                    </div>
                    <h3>
                        <Link
                            href={`/blog/${postSlug}`}
                            className="mb-4 inline-block text-[22px] font-black leading-tight text-midnight_text transition-colors duration-300 hover:text-primary dark:text-white dark:hover:text-primary"
                        >
                            {postTitle}
                        </Link>
                    </h3>
                    <p className="line-clamp-3 text-base leading-7 text-secondary dark:text-white/55">{excerpt}</p>
                    <Link href={`/blog/${postSlug}`} className="mt-6 inline-flex items-center gap-2 text-base font-bold text-primary">
                        Read more
                        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </Link>
                </div>
            </article>
    );
};

export default BlogCard;
