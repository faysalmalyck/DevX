import React from "react";
import HeroSub from "@/components/shared/HeroSub";
import { Metadata } from "next";
import Development from "@/components/home/development/Development";

export const metadata: Metadata = {
    title: "Services",
    description: "Explore DevX digital solution services across web, SaaS, AI, cloud, and product engineering.",
};

const page = () => {
  return (
    <>
      <HeroSub
  title="Our|Services"
  description="Empowering businesses with innovative digital solutions that accelerate growth, enhance efficiency, and create lasting competitive advantage."
/> 
      
      <div className="">
        <Development />
      
      </div>
    </>
  );
};

export default page;
