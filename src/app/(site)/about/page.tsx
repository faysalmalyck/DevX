import React from "react";
import HeroSub from "@/components/SharedComponent/HeroSub";
import { Metadata } from "next";
import CounterSection from '@/app/(site)/about/Count/Counter';
import TeamSection from "../Team/TeamPage";
import CoreValuesSection from "../Core Values/CoreValue";
import ReadyToStart from "@/components/Home/ReadytoContact/Ready";


export const metadata: Metadata = {
    title: "Services",
    description: "Explore DevX digital solution services across web, SaaS, AI, cloud, and product engineering.",
};

const page = () => {
  const breadcrumbLinks = [
    { href: "/", text: "Home" },
    { href: "/about", text: "About us" },
  ];
  return (
    <>
      <HeroSub
  title="About our|Company"
  description="We partner with businesses of all sizes to transform ideas into powerful digital experiences. Through innovation, collaboration, and technical excellence, we build reliable solutions that help organizations stay ahead in a competitive market."
  breadcrumbLinks={breadcrumbLinks}
/> 
      
<div className="mx-auto max-w-8xl pt-32 pb-24 px-2">
  <div className="grid grid-cols-1 gap-y-8 gap-x-12 md:grid-cols-2 items-start justify-items-center">
    <div className="w-full max-w-[500px]">
      <h2 className="text-3xl font-rote tracking-tight text-gray-900 sm:text-5xl dark:text-white mb-0 text-center md:text-left leading-snug">
  We started in 2019 as a small team of{" "}
  <span className="text-blue-600 dark:text-blue-500">passionate</span> developers
</h2>
    </div>
    <div className="w-full max-w-[575px]">
      <p className="mb-6 text-base leading-relaxed text-gray-600 dark:text-gray-300">
        Our journey has been defined by a passion for technology and a commitment to excellence. What started as a small development team has evolved into a trusted partner for businesses seeking innovative digital solutions.{" "}
      </p>
      <p className="mb-0 text-base leading-relaxed text-gray-600 dark:text-gray-300">
        Through the years, we’ve grown not just in size, but in capability, constantly adapting to new technologies and industry trends. Today, we stand as a testament to the power of dedication, integrity, and innovation{" "}
      </p>
    </div>
  </div>
 

<CounterSection/>
<TeamSection/>
<CoreValuesSection/>
<ReadyToStart/>

</div>
    </>
  );
};

export default page;