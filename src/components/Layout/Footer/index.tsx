import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="w-full bg-[#181d2b] text-slate-300">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Top Section */}
        <div className="flex flex-col items-start py-4 justify-between gap-6 border-b border-slate-800 py-12 md:flex-row md:items-center">
          <div className="max-w-md space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src="images/logo/DevX.svg"
                alt="Dev X "
                width={240}
                height={80}
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-lg text-slate-500">
              Trusted by growing businesses to architect, develop, and scale secure, high performance software systems built for long term success. <span className="whitespace-nowrap"></span>
            </p>
          </div>

          <div className="flex w-full flex-col items-center gap-4 sm:flex-row md:w-auto">
            <Link
              href="/contact"
              className="w-full max-w-[280px] sm:w-auto sm:max-w-none text-center rounded-full bg-blue-600 px-6 sm:px-10 py-3.5 sm:py-6 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] active:scale-95"
            >
              Contact us
            </Link>
            <Link
              href="/services"
              className="w-full max-w-[280px] sm:w-auto sm:max-w-none text-center rounded-full border border-slate-300 bg-white px-6 sm:px-8 py-3.5 sm:py-6 text-sm sm:text-base font-medium text-gray-900 transition-colors duration-200 hover:bg-gray-200 dark:border-slate-800 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 active:scale-95"
            >
              Browse Services
            </Link>
          </div>
        </div>

        {/* Middle Section */}
        <div className="grid grid-cols-1 gap-8 py-12 md:grid-cols-3 lg:grid-cols-4">
          
          {/* Pages Links */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 text-lg font-bold text-white">Pages</h3>
            <div className="grid grid-cols-1 gap-4 text-base sm:grid-cols-3">
              <ul className="space-y-2">
                <li><Link href="/" className="transition hover:text-white">Home</Link></li>
                <li><Link href="/about" className="transition hover:text-white">About</Link></li>
                <li><Link href="/contact" className="transition hover:text-white">Contact</Link></li>
                <li><Link href="/services" className="transition hover:text-white">Services</Link></li>
                <li><Link href="/about/case-study" className="transition hover:text-white">Case Studies</Link></li>
              </ul>
              <ul className="space-y-2">
                <li><Link href="https://devtemplate.webflow.io/project/how-we-improved-facebooks-new-website-speed-by-78" className="transition hover:text-white">Case Study Single</Link></li>
                <li><Link href="/blog" className="transition hover:text-white">Blog</Link></li>
                <li><Link href="https://devtemplate.webflow.io/blog/code-refactoring-best-practices-when-its-time-and-when-its-not-to-do-it" className="transition hover:text-white">Blog Post</Link></li>
              </ul>
              <ul className="space-y-2">
                <li><Link href="/careers" className="transition hover:text-white">Careers</Link></li>
                <li><Link href="https://devtemplate.webflow.io/career/react-senior-frontend-developer" className="transition hover:text-white">Careers Single</Link></li>
                <li><Link href="/pricing" className="transition hover:text-white">Pricing</Link></li>
                <li><Link href="https://devtemplate.webflow.io/product/premium" className="transition hover:text-white">Pricing Single</Link></li>
              </ul>
            </div>
          </div>

          {/* Utility Pages */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-white">Utility pages</h3>
            <ul className="space-y-2 text-base">
              <li><Link href="/template-pages/start-here" className="transition hover:text-white">Start Here</Link></li>
              <li><Link href="/template-pages/style-guide" className="transition hover:text-white">Style Guide</Link></li>
            </ul>
          </div>

          {/* Newsletter Form */}
          <div className="max-w-sm">
            <h3 className="mb-2 text-lg font-bold text-white">Subscribe to our newsletter</h3>
            <p className="mb-4 text-base text-slate-400">
              To be updated with all the latest trends and product releases.
              <span className="whitespace-nowrap"></span>
            </p>
            <form className="flex flex-col items-center sm:items-stretch gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="w-full px-8 py-3.5 sm:py-5.5 rounded-full bg-white dark:bg-[#232B3E] border border-slate-200 dark:border-[#2E3850] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 dark:focus:border-slate-500 focus:ring-1 focus:ring-blue-500/40 dark:focus:ring-slate-500/40 hover:ring-1 hover:ring-slate-300 dark:hover:ring-slate-500/30 transition-all ease-in-out duration-300"
              />
              <button
                type="submit"
                className="w-full max-w-[280px] sm:w-auto sm:max-w-none text-center rounded-full bg-blue-600 px-6 sm:px-10 py-3.5 sm:py-6 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] active:scale-95"
              >
                Subscribe
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-800 py-8 text-center text-sm text-slate-400 md:flex-row md:text-left">
          <p>
            Copyright © 2026 Dev X | 
            - Powered by{' '}
            <a href="https://webflow.com/" target="_blank" rel="noreferrer" className="hover:text-white">
              Faysal Malick
            </a>
          </p>

          <div className="flex space-x-3">
            <a href="https://facebook.com/" target="_blank" rel="noreferrer" className="rounded bg-slate-800 p-3 text-lg text-slate-300 transition hover:bg-slate-700">
              FB
            </a>
            <a href="https://twitter.com/" target="_blank" rel="noreferrer" className="rounded bg-slate-800 p-3 text-lg text-slate-300 transition hover:bg-slate-700">
              TW
            </a>
            <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" className="rounded bg-slate-800 p-3 text-lg text-slate-300 transition hover:bg-slate-700">
              IG
            </a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" className="rounded bg-slate-800 p-3 text-lg text-slate-300 transition hover:bg-slate-700">
              LN
            </a>
            <a href="http://youtube.com/" target="_blank" rel="noreferrer" className="rounded bg-slate-800 p-3 text-lg text-slate-300 transition hover:bg-slate-700">
              YT
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}