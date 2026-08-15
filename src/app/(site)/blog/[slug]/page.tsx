import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articles, ContentBlock } from "@/data/blog";
import {
  HoverCard,
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/motion";

interface BlogPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for build-time static generation (SSG)
export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

// Dynamic metadata generation for SEO
export async function generateMetadata({ params }: BlogPageProps) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    return {
      title: "Article Not Found",
    };
  }

  return {
    title: `${article.title} | Blog`,
    description: article.excerpt,
  };
}

// Component to render individual content blocks with dark mode support
function RenderContentBlock({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "h2":
      return (
        <h2 className="text-2xl sm:text-3xl lg:text-4xl text-gray-900 dark:text-gray-100 mt-10 mb-4 tracking-tight">
          {block.text}
        </h2>
      );
    case "h3":
      return (
        <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-200 mt-8 mb-3 tracking-tight">
          {block.text}
        </h3>
      );
    case "h4":
      return (
        <h4 className="text-lg sm:text-xl text-gray-900 dark:text-gray-200 mt-6 mb-2">
          {block.text}
        </h4>
      );
    case "h5":
      return (
        <h5 className="text-base sm:text-lg text-gray-800 dark:text-gray-300 mt-5 mb-2">
          {block.text}
        </h5>
      );
    case "h6":
      return (
        <h6 className="px-2 sm:px-6 text-base uppercase tracking-wider text-gray-600 dark:text-gray-400 mt-4 mb-2">
          {block.text}
        </h6>
      );
    case "paragraph":
      return (
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base mb-4 pl-1 sm:pl-3">
          {block.text}
        </p>
      );
    case "ordered-list":
      return (
        <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300 text-base mb-6 pl-2">
          {block.items?.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {item}
            </li>
          ))}
        </ol>
      );
    case "unordered-list":
      return (
        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 text-base mb-6 pl-2">
          {block.items?.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {item}
            </li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote className="border-l-4 border-brand dark:border-blue-400 pl-4 py-3 my-6 italic text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-slate-800/50 rounded-r-lg text-base">
          {block.text}
        </blockquote>
      );
    default:
      return null;
  }
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  // Get related articles (excluding the current one)
  const relatedArticles = articles
    .filter((a) => a.id !== article.id)
    .slice(0, 2);

  return (
    <article className="min-h-screen bg-white dark:bg-[#181d2b] text-slate-900 dark:text-white transition-colors duration-300 py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <ScrollReveal className="mt-4 mb-8 sm:mt-8" preset="left">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-base font-semibold text-slate-700 dark:text-white transition-all duration-300 hover:-translate-x-1 hover:text-brand dark:hover:text-brand"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all articles
          </Link>
        </ScrollReveal>

        {/* Article Header */}
        <header className="py-8 sm:py-12 lg:py-16 text-center">
          <ScrollReveal preset="copy">
            <div className="flex items-center justify-center space-x-3 text-xs sm:text-base text-slate-500 dark:text-slate-400 mb-4">
              <span className="inline-block px-3 py-1 bg-slate-200 dark:bg-[#3b4251] text-slate-800 dark:text-white rounded-full border border-slate-300 dark:border-slate-800 font-semibold text-xs uppercase tracking-wider">
                {article.category}
              </span>
              <span>~</span>
              <time>{article.date}</time>
            </div>
          </ScrollReveal>

          <ScrollReveal preset="hero" delay={0.1}>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-medium text-slate-900 dark:text-white tracking-tight leading-tight mb-6 sm:mb-8 text-center px-2 sm:px-8 lg:px-16">
              {article.title}
            </h1>
          </ScrollReveal>

          <ScrollReveal preset="copy" delay={0.2}>
            <p className="text-base sm:text-lg text-slate-600 dark:text-white leading-relaxed text-center max-w-3xl mx-auto">
              {article.excerpt}
            </p>
          </ScrollReveal>
        </header>

        {/* Hero Image */}
        <ScrollReveal
          className="relative w-full mb-12 sm:mb-16 rounded-lg overflow-hidden shadow-sm dark:shadow-none bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800"
          preset="image"
          delay={0.28}
        >
          <Image
            src={article.image}
            alt={article.title}
            width={1200}
            height={675}
            priority
            className="w-full h-auto object-cover"
          />
        </ScrollReveal>

        {/* Main Content Body */}
        <StaggerContainer className="max-w-4xl mx-auto px-2 sm:px-6">
          {article.content.map((block, index) => (
            <StaggerItem
              key={index}
              preset={block.type === "h2" || block.type === "h3" ? "heading" : "copy"}
            >
              <RenderContentBlock block={block} />
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Divider */}
        <hr className="my-12 sm:my-16 border-slate-200 dark:border-slate-800" />

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <section className="w-full">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <ScrollReveal preset="heading">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl text-slate-900 dark:text-white">
                  More articles
                </h2>
              </ScrollReveal>

              <ScrollReveal preset="copy" delay={0.1}>
                <Link
                  href="/blog"
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#121623] px-6 sm:px-8 py-3 text-lg font-semibold text-slate-700 dark:text-white transition-all duration-200 hover:border-slate-400 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-[#1a2032] active:scale-95"
                >
                  Browse All Posts
                </Link>
              </ScrollReveal>
            </div>

            {/* Full-width 2-column layout */}
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 w-full">
              {relatedArticles.map((relArticle, idx) => (
                <StaggerItem key={`${relArticle.id}-${idx}`} className="w-full">
                  <HoverCard className="h-full rounded-lg">
                    <Link
                      href={`/blog/${relArticle.slug}`}
                      className="group flex flex-col h-full bg-white dark:bg-[#1e2436] border border-slate-200 dark:border-slate-800/80 rounded-lg overflow-hidden hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 shadow-sm dark:shadow-none"
                    >
                      {/* Image */}
                      <ScrollReveal
                        preset="image"
                        className="relative aspect-[16/10.5] w-full bg-slate-200 dark:bg-slate-800 overflow-hidden"
                      >
                        <Image
                          src={relArticle.image}
                          alt={relArticle.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          unoptimized
                        />
                      </ScrollReveal>

                      {/* Content */}
                      <div className="p-6 sm:p-8 flex flex-col flex-grow">
                        <h3 className="text-lg sm:text-xl font-medium mb-3 line-clamp-2 text-slate-900 dark:text-white group-hover:text-brand dark:group-hover:text-brand transition-colors">
                          {relArticle.title}
                        </h3>

                        <p className="text-slate-600 dark:text-white text-base mb-6 font-normal line-clamp-3">
                          {relArticle.excerpt}
                        </p>

                        <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-2">
                          <span className="px-3 sm:px-5 py-2 text-xs font-semibold bg-slate-100 dark:bg-[#3b4251] text-slate-800 dark:text-white rounded-full border border-slate-200 dark:border-slate-800">
                            {relArticle.category}
                          </span>

                          <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                            {relArticle.date}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </HoverCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </section>
        )}
      </div>
    </article>
  );
}
