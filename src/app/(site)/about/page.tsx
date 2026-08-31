import React from "react";
import HeroSub from "@/components/shared/HeroSub";
import { Metadata } from "next";
import CounterSection from '@/components/about/Counter';
import OfficesSection from "@/components/about/OfficesSection";
import TeamSection from "@/components/team/TeamPage";
import { getPublishedTeamMembers } from "@/lib/team/queries";
import CoreValues from "@/components/core-values/CoreValue";
import ReadyToStart from "@/components/home/ready-to-contact/Ready";
import { ScrollReveal } from "@/components/motion";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "About Us | DevX",
    description: "Explore DevX digital solution services across web, SaaS, AI, cloud, and product engineering.",
};

const page = async () => {
  const team = await getPublishedTeamMembers();
  return (
    <>
      <HeroSub
  title="About our|agency"
  description="We turn business ideas into reliable digital solutions that drive growth, efficiency, and competitive advantage."
/> 
      
<div className="mx-auto max-w-8xl pt-32 pb-24 px-2">
  <div className="grid grid-cols-1 gap-y-8 gap-x-12 md:grid-cols-2 items-start justify-items-center">
    <ScrollReveal preset="heading" className="w-full max-w-[500px]">
      <h2 className="text-3xl font-rote tracking-tight text-gray-900 sm:text-5xl dark:text-white mb-0 text-center md:text-left leading-snug">
  We started in 2019 as a small team of{" "}
  <span className="text-brand dark:text-brand">passionate</span> developers
</h2>
    </ScrollReveal>
    <ScrollReveal preset="copy" delay={0.1} className="w-full max-w-[575px]">
      <p className="mb-6 text-base leading-relaxed text-gray-600 dark:text-gray-300">
        Our journey has been defined by a passion for technology and a commitment to excellence. What started as a small development team has evolved into a trusted partner for businesses seeking innovative digital solutions.{" "}
      </p>
      <p className="mb-0 text-base leading-relaxed text-gray-600 dark:text-gray-300">
        Through the years, we’ve grown not just in size, but in capability, constantly adapting to new technologies and industry trends. Today, we stand as a testament to the power of dedication, integrity, and innovation{" "}
      </p>
    </ScrollReveal>
  </div>
 
<svg
  className="pointer-events-none absolute -left-40 -bottom-140 rotate-[270deg] hidden h-[380px] w-[380px] sm:block"
  viewBox="0 0 480 480"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <defs>
    <linearGradient
      id="diagonalGlowGradient"
      x1="400"
      y1="80"
      x2="80"
      y2="400"
      gradientUnits="userSpaceOnUse"
    >
      <stop offset="0%" stopColor="#4f6df5" stopOpacity="0" />
      <stop offset="25%" stopColor="#4f6df5" stopOpacity="0.3" />
      <stop offset="50%" stopColor="#4360cbff" stopOpacity="0.9" />
      <stop offset="75%" stopColor="#4f6df5" stopOpacity="0.4" />
      <stop offset="100%" stopColor="#4360cbff" stopOpacity="0" />
    </linearGradient>

    <filter
      id="diagonalGlowFilter"
      x="-30%"
      y="-30%"
      width="160%"
      height="160%"
    >
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <path
    d="
      M 400 80
      A 200 200 0 0 1 80 400
    "
    stroke="url(#diagonalGlowGradient)"
    strokeWidth="3"
    strokeLinecap="round"
    fill="none"
    filter="url(#diagonalGlowFilter)"
    className="animate-[pulse_6s_ease-in-out_infinite]"
  />
</svg>

<CounterSection/>
<TeamSection team={team}/>
<CoreValues/>
<OfficesSection/>
<ReadyToStart/>

</div>
    </>
  );
};

export default page;
