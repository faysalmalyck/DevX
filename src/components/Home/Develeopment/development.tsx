"use client";

import Image from "next/image";
import Link from "next/link";

interface ServiceCard {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
}

const servicesData: ServiceCard[] = [
  {
    title: "Website/App Development",
    description: "/images/services/website.png",
    imageSrc: "https://cdn.prod.website-files.com/6217ab51d0be6929e3513ef6/623f4c033a9f2ec475bdb200_image-frontend-development-services-dev-webflow-template.png",
    imageAlt: "Frontend Development - Dev X Webflow Template",
  },
  {
    title: "Backend Development",
    description: "Powering your digital infrastructure with scalable backend solutions built with modern technologies.",
    imageSrc: "/images/services/backend.png",
    imageAlt: "Backend Development - Dev X Webflow Template",
  },
  {
    title: "Mobile App Development",
    description: "Seamless & high-performance mobile applications for iOS and Android that keep your users engaged.",
    imageSrc: "/images/services/mobileapp.png",
    imageAlt: "Mobile App Development - Dev X Webflow Template",
  },
  {
    title: "AI & Machine Learning",
    description: "Transform data into intelligence with custom AI/ML solutions from predictive analytics to intelligent automation systems.",
    imageSrc: "/images/services/ai:ml.png",
    imageAlt: "AI & Machine Learning - Dev X Webflow Template",
  },
  {
    title: "Databases & Data Science",
    description: "Designing secure databases and transforming data into actionable intelligence for business growth.",
    imageSrc: "/images/services/database.png",
    imageAlt: "Databases & Data Science - Dev X Webflow Template",
  },
  {
    title: "Servers & Cloud Infrastructure",
    description: "End to end cloud infrastructure services with secure deployments, automated scaling, and continuous monitoring.",
    imageSrc: "/images/services/cloud.png",
    imageAlt: "Servers & Cloud Infrastructure - Dev X Webflow Template",
  },
];

export default function Development() {
  return (
    <section className="relative overflow-hidden bg-white text-slate-900 transition-colors duration-200 dark:bg-[#181d2b] dark:text-white py-8 sm:py-12 md:py-20 lg:py-24">
      {/* Background Decorative Arc */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[250px] w-[350px] sm:h-[600px] sm:w-[900px] rounded-full border border-blue-500/20 opacity-40 blur-2xl dark:border-blue-500/10 dark:opacity-30"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div
          className="mb-8 sm:mb-14 md:mb-16 text-center animate-fade-up-slow"
          style={{ animationDelay: "100ms" }}
        >
          <h2 className="mx-auto max-w-4xl text-2xl sm:text-4xl md:text-5xl py-4 sm:py-10 md:py-16 tracking-tight text-slate-900 dark:text-white leading-tight sm:leading-snug">
            We are development experts on all{" "}
            <span className="text-blue-600 dark:text-blue-500">technologies</span> &amp;{" "}
            <span className="text-blue-600 dark:text-blue-500">platforms</span>
          </h2>
        </div>

        {/* Cards Grid Section */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
          {servicesData.map((service, index) => (
            <div
              key={index}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:border-slate-700/80 dark:bg-gradient-to-b dark:from-[#2A3147] dark:via-[#232B40] dark:to-[#1B2235] dark:shadow-none dark:hover:border-slate-600 animate-fade-up-slow"
              style={{ animationDelay: `${(index + 1) * 150}ms` }}
            >
              {/* Graphic Section */}
              <div className="relative flex h-52 sm:h-56 md:h-64 w-full items-center justify-center overflow-hidden rounded-t-xl bg-slate-100/50 p-4 sm:p-2 dark:bg-transparent">
                <div
                  className="absolute inset-0 opacity-[0.05] dark:opacity-[0.03]"
                  style={{
                    backgroundImage:
                      "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent dark:from-blue-500/5 opacity-60 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative h-full w-full transition-transform duration-500 ease-out group-hover:scale-105">
                  <Image
                    src={service.imageSrc}
                    alt={service.imageAlt}
                    fill
                    priority={index < 3}
                    className="object-contain object-center sm:object-top"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="mb-4 sm:mb-6 h-px bg-slate-200 dark:bg-slate-700/80 transition-colors duration-300 group-hover:bg-blue-500/40" />

              {/* Content */}
              <div className="flex flex-1 flex-col px-5 sm:px-6 md:px-8 pb-6">
                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {service.title}
                </h3>

                <p className="mt-2 text-sm sm:text-base leading-6 sm:leading-7 text-slate-600 dark:text-slate-300">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons Section */}
        <div
          className="mt-8 sm:mt-14 py-4 sm:py-12 md:py-16 flex items-center justify-center animate-fade-up-slow"
          style={{ animationDelay: "1100ms" }}
        >
          <Link
            href="/pricing"
            className="w-full sm:w-auto max-w-[280px] sm:max-w-none text-center rounded-full bg-blue-600 px-6 sm:px-10 py-3.5 sm:py-5 text-sm font-medium text-white transition-all duration-300 hover:bg-blue-500 hover:shadow-[0_0_25px_rgba(37,99,235,0.45)] hover:-translate-y-0.5 active:scale-95"
          >
            Get Pricing
          </Link>
        </div>
      </div>

      <div className="my-6 sm:my-12 h-px w-full bg-gradient-to-r from-transparent via-slate-600 to-transparent opacity-60" />
    </section>
  );
}