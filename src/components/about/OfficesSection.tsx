import Image from "next/image";
import { Mail, Phone } from "lucide-react";

const offices = [
  {
    city: "San Francisco, CA",
    email: "sanfrancisco@dev.com",
    phone: "(415) 203-7468",
    phoneHref: "+14152037468",
  },
  {
    city: "New York, NY",
    email: "newyork@dev.com",
    phone: "(212) 336-7281",
    phoneHref: "+12123367281",
  },
  {
    city: "Los Angeles, CA",
    email: "losangeles@dev.com",
    phone: "(310) 203-7468",
    phoneHref: "+13102037468",
  },
  {
    city: "Chicago, IL",
    email: "chicago@dev.com",
    phone: "(773) 336-7281",
    phoneHref: "+17733367281",
  },
];

export default function OfficesSection() {
  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-white py-16 text-slate-900 transition-colors duration-300 dark:bg-[#181d2b] dark:text-white sm:py-20 lg:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:gap-12 sm:px-6 lg:grid-cols-[minmax(400px,0.8fr)_minmax(0,1.2fr)] lg:gap-16 lg:px-8 xl:gap-20">
        <div className="mx-auto w-full max-w-[560px] min-w-0 lg:mx-0">
          <h2 className="text-[28px] font-medium leading-[1.16] tracking-[-0.04em] text-slate-900 dark:text-white sm:text-[34px] lg:text-[42px] lg:leading-[1.18]">
            Come and <span className="text-brand">visit us</span> in one of
            our offices worldwide
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-9 sm:mt-12 sm:grid-cols-2 sm:gap-x-12 sm:gap-y-11 lg:mt-14">
            {offices.map((office) => (
              <article key={office.city} className="min-w-0">
                <h3 className="text-lg font-medium leading-tight tracking-[-0.02em] text-slate-900 dark:text-white sm:text-xl lg:text-[21px]">
                  {office.city}
                </h3>

                <div className="mt-3 space-y-2.5 text-[13px] text-slate-600 dark:text-white sm:text-[15px] lg:mt-4 lg:space-y-3 lg:leading-6">
                  <a
                    href={`mailto:${office.email}`}
                    className="group flex w-fit max-w-full items-center gap-2 break-words transition-colors hover:text-brand dark:hover:text-white"
                  >
                    <Mail className="size-4 shrink-0 text-slate-500 transition-colors group-hover:text-brand dark:text-slate-400 dark:group-hover:text-brand lg:size-[18px]" />
                    <span>{office.email}</span>
                  </a>
                  <a
                    href={`tel:${office.phoneHref}`}
                    className="group flex w-fit max-w-full items-center gap-2 transition-colors hover:text-brand dark:hover:text-white"
                  >
                    <Phone className="size-4 shrink-0 text-slate-500 transition-colors group-hover:text-brand dark:text-slate-400 dark:group-hover:text-brand lg:size-[18px]" />
                    <span>{office.phone}</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none relative mx-auto aspect-[1990/1956] w-full max-w-[36rem] sm:max-w-[45rem] lg:justify-self-end lg:max-w-[760px] lg:translate-x-4 xl:translate-x-8"
        >
          <div className="absolute inset-[8%] rounded-full bg-brand/[0.07] blur-3xl dark:bg-brand/[0.1]" />
          <Image
            src="https://cdn.prod.website-files.com/6217ab51d0be6929e3513ef6/623f5025b3c798dec3d11b40_image-offices-dev-webflow-template.png"
            alt=""
            fill
            sizes="(max-width: 639px) calc(100vw - 2rem), (max-width: 1023px) 640px, (max-width: 1279px) 52vw, 760px"
            className="object-contain opacity-90 transition-opacity duration-300 dark:opacity-100"
          />
        </div>
      </div>
    </section>
  );
}
