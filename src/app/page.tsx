import React from 'react'
import { Metadata } from "next";
import Hero from '@/components/Home/Hero';
import Development from '@/components/Home/Develeopment/development';
import Agile from '@/components/Home/AgileDev/agile';
import ProcessSection from '@/components/Home/Process/ProcessSection';
import CaseStudiesSection from '@/components/Home/CaseStudy/casestudy';
import TechStackSection from '@/components/Home/Techstack/techstack';
import TestimonialsSection from '@/components/Home/Testimonals/testimonals';
import ReadytoContact from "@/components/Home/ReadytoContact/Ready";
import ArticleSlider from '@/components/Home/Artical slider/page';
export const metadata: Metadata = {
  title: {
    absolute: "DevX | Transforming Ideas Into Digital Products",
  },
  description:
    "DevX partners with ambitious brands to build premium websites, intelligent SaaS platforms, AI integrations, and scalable digital experiences.",
};

export default function Home() {
  return (
    <main>
      <Hero />
      <Development />
      <Agile/>
      <ProcessSection/>
      <CaseStudiesSection/>
      <TechStackSection/>
      <TestimonialsSection/>
      <ArticleSlider />
      <ReadytoContact/>
      
      
      
    </main>
  )
}
