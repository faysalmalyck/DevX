import Image from 'next/image';
import Link from 'next/link';

export default function CaseStudiesSection() {
  const caseStudies = [
    {
      id: 1,
      slug: '/case-studies/how-we-improved-application-new-website-speed-by-78',
      title: 'How we improved Application new website speed by 78%',
      logo: 'https://cdn.prod.website-files.com/6217ab51d0be6980f1513f21/65525409dc8fde0a0419d014_application-logo-case-study-dev-x-webflow-template.svg',
      alt: 'Application Logo',
    },
    {
      id: 2,
      slug: '/case-studies/how-we-helped-business-launch-new-rooms-in-less-than-6-months',
      title: 'How we helped Business launch new rooms in less than 6 months',
      logo: 'https://cdn.prod.website-files.com/6217ab51d0be6980f1513f21/6552543446647bfe309272e1_business-logo-case-study-dev-x-webflow-template.svg',
      alt: 'Business Logo',
    },
  ];

  return (
    <section className="relative py-6 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden bg-transparent transition-colors duration-300">
      {/* Header Container */}
      <div className="max-w-2xl mx-auto text-center pt-8 pb-12 mb-10">
        <h2 className="text-3xl md:text-5xl tracking-tight text-gray-900 dark:text-white leading-tight ">
          Discover how we had helped{' '}
          <br className="hidden md:inline" />
          <span className="text-blue-600 dark:text-blue-500">world class companies</span>{' '}
          <span className="whitespace-nowrap">in the past</span>
        </h2>
      </div>

      {/* Grid Container */}
      <div className="relative">
        <div className="grid grid-cols-1 py-10 md:grid-cols-2 gap-4 relative z-10">
          {caseStudies.map((study) => (
            <Link
              key={study.id}
              href={study.slug}
              className="group relative bg-gray-100/80 dark:bg-[#252d41] rounded-lg border border-gray-200/80 dark:border-slate-700/80 py-20 px-14 md:py-16 md:px-12 min-h-[350px] shadow-sm hover:shadow-xl dark:shadow-none dark:hover:shadow-2xl transition-all duration-200 ease-in-out flex flex-col justify-between hover:scale-[0.99] hover:opacity-60"
            >
              <div>
                <div className="mb-8 h-10 relative w-48 dark:brightness-100 brightness-0">
                  <Image
                    src={study.logo}
                    alt={study.alt}
                    fill
                    className="object-contain object-left"
                  />
                </div>
                <h3 className="text-xl md:text-2xl text-gray-900 dark:text-white mb-8 font-semibold">
                  {study.title}
                </h3>
              </div>

              <div className="flex items-center gap-2 text-gray-900 dark:text-white font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 mt-auto">
                <span>Read case study</span>
                <span className="text-xl transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Decorative Background Glows */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-2xl blur-3xl -z-10 pointer-events-none" />
      </div>

      {/* Action Buttons Container */}
      <div className="mt-16 text-center">
        <div className="flex flex-col sm:flex-row py-16 items-center justify-center gap-4">
          <Link
            href="/contact"
            className="w-full max-w-[280px] sm:w-auto sm:max-w-none text-center rounded-full bg-blue-600 px-6 sm:px-10 py-5 sm:py-6 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] active:scale-95"
          >
            Contact us
          </Link>
          <Link
            href="/case-studies"
            className="w-full max-w-[280px] sm:w-auto sm:max-w-none text-center rounded-full border border-slate-300 bg-white px-6 sm:px-10 py-5 sm:py-6 text-sm font-medium text-slate-700 transition-all duration-200 hover:border-slate-400 hover:bg-slate-100 dark:border-slate-800 dark:bg-[#121623] dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-[#1a2032] dark:hover:text-white active:scale-95"
          >
            Browse Case Studies
          </Link>
        </div>
        <div className="my-12 h-px w-full bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent" />
      </div>
    </section>
  );
}