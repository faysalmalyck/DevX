"use client"

import React from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionItemProps {
  id: string;
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

export default function AccordionItem({
  id,
  question,
  answer,
  isOpen,
  onToggle,
}: AccordionItemProps) {
  return (
    <div className="border border-slate-200 dark:border-[#273046] rounded-md bg-slate-50 dark:bg-[#252d40]/40 overflow-hidden transition-colors hover:border-brand/50 dark:hover:border-blue-400/50">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-10 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 rounded-3xl"
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${id}`}
        id={`faq-question-${id}`}
      >
        <span className="text-lg font-medium text-slate-900 dark:text-white pr-8">
          {question}
        </span>
        <div
          className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-full border transition-all duration-300 ${
            isOpen
              ? 'bg-brand/10 border-brand/30 text-brand'
              : 'bg-slate-100 dark:bg-[#2a3449] border-slate-200 dark:border-[#323d56] text-slate-500 dark:text-slate-400'
          }`}
        >
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-300 ${
              isOpen ? 'rotate-360' : 'rotate-270'
            }`}
            strokeWidth={2.5}
          />
        </div>
      </button>

      <div
        id={`faq-answer-${id}`}
        role="region"
        aria-labelledby={`faq-question-${id}`}
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-6 pt-2 text-slate-600 dark:text-slate-400 text-base leading-relaxed">
            {answer}
          </div>
        </div>
      </div>
    </div>
  );
}
