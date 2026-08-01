import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articles, ContentBlock } from "@/data/blog";

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
        <h2 className="text-3xl sm:text-4xl text-gray-900 dark:text-gray-100 mt-10 mb-4 tracking-tight">
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
        <h6 className="px-6 text-sm uppercase tracking-wider text-gray-600 dark:text-gray-400 mt-4 mb-2">
          {block.text}
        </h6>
      );
    case "paragraph":
      return (
        <p className="text-gray-700 py-2 dark:text-gray-300 leading-relaxed text-base sm:text-base mb-4 pl-3 sm:pl-5">
          {block.text}
        </p>
      );
    case "ordered-list":
      return (
        <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300 text-base sm:text-base mb-6 pl-2">
          {block.items?.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {item}
            </li>
          ))}
        </ol>
      );
    case "unordered-list":
      return (
        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 text-base sm:text-base mb-6 pl-2">
          {block.items?.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {item}
            </li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote className="border-l-4 border-indigo-600 dark:border-indigo-400 pl-4 py-2 my-4 italic text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-slate-800/50 rounded-r-lg text-base">
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
    <article className="min-h-screen bg-white dark:bg-[#181d2b] transition-colors duration-200 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/blog"
          className="mt-12 mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition-all duration-300 hover:-translate-x-1 hover:text-blue-500 dark:text-slate-200 dark:hover:text-blue-500"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all articles
        </Link>

        {/* Article Header */}
        <header className="py-16 text-center">
          <div className="flex items-center justify-center space-x-3 text-sm text-gray-500 dark:text-white mb-4">
            <span className="inline-block px-3 py-1 text-white dark:text-white font-semibold text-xs uppercase tracking-wider">
              {article.category}
            </span>
            <span>~</span>
            <time>{article.date}</time>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl text-gray-900 dark:text-white tracking-tight leading-tight mb-8 text-center px-4 sm:px-8 lg:px-16">
            {article.title}
          </h1>

          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed text-center max-w-3xl mx-auto">
            {article.excerpt}
          </p>
        </header>

        {/* Hero Image */}
        <div className="relative w-full mb-16 rounded-2xl overflow-hidden shadow-xl bg-gray-100 dark:bg-slate-800">
          <Image
            src={article.image}
            alt={article.title}
            width={1200}
            height={675}
            priority
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Main Content Body */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {article.content.map((block, index) => (
            <RenderContentBlock key={index} block={block} />
          ))}
        </div>

        {/* Divider */}
        <hr className="my-12 border-gray-200 dark:border-gray-800" />

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <section className="w-full">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-4xl text-gray-900 dark:text-white">
                More articles
              </h2>

              <Link
                href="/blog"
                className="rounded-full border border-slate-300 bg-white px-10 py-6 text-sm font-medium text-slate-700 transition-all duration-200 hover:border-slate-400 hover:bg-slate-100 dark:border-slate-800 dark:bg-[#121623] dark:text-white dark:hover:border-slate-700 dark:hover:bg-[#1a2032] dark:hover:text-white active:scale-95"
              >
                Browse All Posts
              </Link>
            </div>

            {/* Full-width 2-column layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 w-full">
              {relatedArticles.map((relArticle, idx) => (
                <div key={`${relArticle.id}-${idx}`} className="w-full">
                  <Link
                    href={`/blog/${relArticle.slug}`}
                    className="group flex flex-col h-full bg-[#1e2436] border border-slate-800/80 rounded-xl overflow-hidden hover:border-slate-700 transition-all duration-300 shadow-md"
                  >
                    {/* Image */}
                    <div className="relative aspect-[16/10.5] w-full bg-slate-800 overflow-hidden">
                      <Image
                        src={relArticle.image}
                        alt={relArticle.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                    </div>

                    {/* Content */}
                    <div className="py-8 px-6 sm:px-8 flex flex-col flex-grow">
                      <h3 className="text-xl sm:text-2xl font-normal mb-3 line-clamp-2 text-white group-hover:text-blue-400 transition-colors">
                        {relArticle.title}
                      </h3>

                      <p className="text-slate-300 text-sm mb-6 font-normal line-clamp-3">
                        {relArticle.excerpt}
                      </p>

                      <div className="mt-auto pt-4 border-t border-slate-800/80 flex items-center justify-between">
                        <span className="px-5 py-2 text-xs font-semibold bg-[#3b4251] text-white rounded-full border border-slate-800">
                          {relArticle.category}
                        </span>

                        <span className="text-xs font-normal text-slate-400">
                          {relArticle.date}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}