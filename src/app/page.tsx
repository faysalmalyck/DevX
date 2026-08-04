import React from 'react'
import { Metadata } from "next";
import Hero from '@/components/home/Hero';
import Development from '@/components/home/development/Development';
import Agile from '@/components/home/agile-dev/Agile';
import ProcessSection from '@/components/home/Process/ProcessSection';
import CaseStudiesSection from '@/components/home/case-study/CaseStudy';
import TechStackSection from '@/components/home/Techstack/techstack';
import TestimonialsSection from '@/components/home/testimonials/Testimonials';
import ReadytoContact from "@/components/home/ready-to-contact/Ready";
import ArticleSlider from '@/components/home/article-slider/ArticleSlider';
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
