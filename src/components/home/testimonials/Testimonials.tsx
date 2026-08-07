import Image from 'next/image';
import Link from 'next/link';
import { testimonials } from '@/data/testimonialsData';
import HomeSectionMotion from '@/components/home/HomeSectionMotion';

export default function TestimonialsSection() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <HomeSectionMotion className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl md:max-w-none">
          {/* Header Section */}
          <div className="mb-10 flex flex-col py-6 sm:py-10 items-center md:items-center justify-between gap-6 md:flex-row text-center md:text-left">
            {/* Heading resized for mobile */}
            <h2 className="text-4xl sm:text-4xl md:text-5xl tracking-tight text-midnight_text dark:text-white leading-snug sm:leading-tight">
              What our great <span className="text-blue-600">customers</span> say
            </h2>
        
            {/* Button centered and resized on mobile */}
            <Link
              href="/contact"
              className="w-full max-w-[280px] sm:w-auto sm:max-w-none text-center rounded-full bg-blue-600 px-6 sm:px-10 py-5 sm:py-6 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] active:scale-95 self-center"
            >
              Contact us
            </Link>
          </div>

          {/* Testimonials Grid */}
          <div className="relative">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((column, colIndex) => (
                <div key={colIndex} className="flex flex-col gap-6">
                  {column.map((testimonial, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="rounded-lg border border-slate-700 bg-slate-800 p-6 shadow-sm transition-shadow hover:shadow-md"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative h-16 w-16 overflow-hidden rounded-md">
                            <Image
                              src={testimonial.image}
                              alt={testimonial.name}
                              fill
                              sizes="64px"
                              className="object-cover"
                              priority
                            />
                          </div>
                          <div>
                            <div className="text-lg font-bold text-white">
                              {testimonial.name}
                            </div>
                            <div className="text-sm text-slate-400">
                              {testimonial.handle}
                            </div>
                          </div>
                        </div>
                        {/* Twitter / Social Icon */}
                        <div className="text-slate-400">
                          <svg
                            className="h-5 w-5 fill-current"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                          </svg>
                        </div>
                      </div>
                      <div className="mt-6">
                        <p className="text-slate-300">{testimonial.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Bottom Gradient Overlay */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent dark:from-slate-900" />
          </div>
        </div>
      </HomeSectionMotion>
      <div style={{ height: "180px" }}></div>
      <div className="my-12 h-px w-full bg-gradient-to-r from-transparent via-gray-300 dark:via-slate-600 to-transparent" />
    </section>
  );
}
