import Image from "next/image";
import Link from "next/link";

export default function TeamSection() {
  const perks = [
    {
      text: "Deliver your MVP in 4 weeks ",
      noWrapText: "or less",
    },
    {
      text: "Efficient and scalable infrastructure",
      noWrapText: "",
    },
    {
      text: "Affordable cost ",
      noWrapText: "for startups",
    },
  ];

  return (
    <section className="w-full bg-white dark:bg-[#181d2b] transition-colors duration-200">
      <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-gray-900 dark:text-white">
        {/* Header */}
        <div className="max-w-md sm:max-w-2xl lg:max-w-3xl mx-auto mb-6 sm:mb-8 text-center">
          <h2 className="py-2 sm:py-4 text-2xl sm:text-5xl lg:text-5xl tracking-tight text-gray-900 dark:text-white leading-snug">
            We are an agile team of passionate{" "}
            <span className="text-blue-600 dark:text-blue-500">developers</span>
          </h2>
        </div>

        <div className="max-w-[1040px] mx-auto">
          {/* Perks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 py-4 sm:py-10 gap-4 sm:gap-6 lg:gap-10 mb-6 lg:mb-14">
            {perks.map((perk, index) => (
              <div key={index} className="group flex items-center space-x-3 justify-center md:justify-start">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white transition-all duration-300 group-hover:shadow-[0_0_12px_rgba(37,99,235,0.8)]">
                  <svg
                    className="w-3.5 h-3.5 stroke-[3]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-sm font-normal text-gray-700 dark:text-white">
                  {perk.text}
                  {perk.noWrapText && (
                    <span className="whitespace-nowrap">{perk.noWrapText}</span>
                  )}
                </p>
              </div>
            ))}
          </div>

          {/* Feature Image */}
          <div className="relative w-full rounded-2xl py-2 sm:py-10 overflow-hidden shadow-lg mb-8 sm:mb-16">
            <Image
              src="/images/hero/agile.png"
              alt="Passionate Developers - Dev X Webflow Template"
              width={1220}
              height={686}
              className="w-full h-auto object-cover rounded-2xl"
              priority
            />
          </div>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 py-6 sm:py-12 md:py-20">
            <Link
              href="/contact"
              className="w-full max-w-[280px] sm:w-auto sm:max-w-none text-center rounded-full bg-blue-600 px-6 sm:px-10 py-3.5 sm:py-5 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] active:scale-95"
            >
              Contact us
            </Link>
            <Link
              href="/about/team"
              className="w-full max-w-[280px] sm:w-auto sm:max-w-none text-center rounded-full border border-slate-300 bg-white px-6 sm:px-10 py-3.5 sm:py-5 text-sm font-medium text-slate-700 transition-all duration-200 hover:border-slate-400 hover:bg-slate-100 dark:border-slate-800 dark:bg-[#121623] dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-[#1a2032] dark:hover:text-white active:scale-95"
            >
              Meet Our Team
            </Link>
          </div>
        </div>

        <div className="my-6 sm:my-12 h-px w-full bg-gradient-to-r from-transparent via-gray-300 dark:via-slate-600 to-transparent opacity-60" />
      </div>
    </section>
  );
}