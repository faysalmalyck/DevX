"use client";

import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/components/motion";
import { addToCartCardSkin } from "@/components/shared/addToCartCardStyles";

type ServiceCardLinkProps = Readonly<{
  id: string;
  title: string;
  description: string;
  image: Readonly<{
    src: string;
    alt: string;
  }>;
  href: string;
  priority?: boolean;
  testId?: string;
  skin?: "service" | "add-to-cart";
}>;

export default function ServiceCardLink({
  id,
  title,
  description,
  image,
  href,
  priority = false,
  testId,
  skin = "service",
}: ServiceCardLinkProps) {
  return (
    <div className="h-full">
      <Link
        href={href}
        data-service-card-link={id}
        data-testid={testId}
        className={skin === "add-to-cart" ? `
  group relative flex h-full flex-col overflow-hidden
  ${addToCartCardSkin}
  focus-visible:outline-2
  focus-visible:outline-offset-4
  focus-visible:outline-brand
` : `
  group relative flex h-full flex-col overflow-hidden rounded-lg
  border border-slate-200 bg-slate-50 shadow-xl
  transition-all duration-300 ease-out
  hover:scale-[0.99]
  hover:opacity-80
  hover:border-transparent
  focus-visible:outline-2
  focus-visible:outline-offset-4
  focus-visible:outline-brand
  dark:border-slate-700
  dark:bg-[linear-gradient(to_bottom,#262d43,#1a2031)]
  dark:shadow-2xl
  dark:hover:border-transparent
`}
      >
        <div className="relative flex h-52 w-full items-center justify-center overflow-hidden rounded-t-xl bg-slate-100/50 dark:bg-transparent sm:h-56 md:h-64">
          <div
            className="absolute inset-0 opacity-[0.05] dark:opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-br from-brand/10 via-transparent to-transparent opacity-60 dark:from-brand/5" />

          <ScrollReveal className="absolute inset-0" preset="image">
            <div className="relative h-full w-full">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority={priority}
                className="object-cover object-center"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
          </ScrollReveal>
        </div>

        <div
          className="mb-6 h-[2px] w-full sm:mb-6"
          style={{
            backgroundImage:
              "linear-gradient(to right, #1e2539 0%, #191f31 100%)",
          }}
        />

        <div className="flex flex-1 flex-col px-5 pt-3 pb-12 sm:px-6 md:px-8">
          <h3 className="text-[1.3rem] font-extrabold leading-tight tracking-tight text-slate-900 transition-colors duration-300 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-600">
            {title}
          </h3>

          <p className="mt-2 text-lg font-medium leading-6 text-slate-600 dark:text-white sm:leading-7">
            {description}
          </p>
        </div>
      </Link>
    </div>
  );
}
