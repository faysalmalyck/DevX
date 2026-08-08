"use client"

import React, { useState } from 'react';
import { faqData } from './data';
import AccordionItem from './AccordionItem';
import { HoverCard, ScrollReveal, StaggerContainer, StaggerItem } from "@/components/motion";

export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setOpenId((prevId) => (prevId === id ? null : id));
  };

  return (
    <section className="w-full py-20 px-4 md:px-8 bg-white dark:bg-[#181d2b]">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Section Header */}
        <ScrollReveal preset="heading" className="space-y-4 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-rote tracking-tight text-slate-900 dark:text-white">
            Have questions? <span className='text-blue-500'>{" "}We have answers{" "}</span> .
          </h2>
          <p className='text-slate-600 dark:text-gray-500'> 
            Here are answers to some common questions about our services, process, and how we work with clients. If you don't find what you're looking for, feel free to reach out directly.
          </p>
        </ScrollReveal>

        {/* FAQ Accordion List */}
        <StaggerContainer className="space-y-4 px-14">
          {faqData.map((faq) => (
            <StaggerItem key={faq.id} preset="card">
              <HoverCard>
                <AccordionItem
                  id={faq.id}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openId === faq.id}
                  onToggle={() => handleToggle(faq.id)}
                />
              </HoverCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
