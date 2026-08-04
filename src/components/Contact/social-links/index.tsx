"use client"

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { socialPlatforms } from './data';

export default function SocialLinks() {
  return (
    <section className="w-full py-20 px-4 md:px-8 bg-[#181d2b] dark:bg-[#181d2b]">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="space-y-8 max-w-lg mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-rote tracking-tight text-white">
            Follow us for <span className='text-blue-500'>{" "}great content{" "}</span> about coding & development
          </h2>
          
        </div>

        {/* Social Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {socialPlatforms.map((platform) => {
            const Icon = platform.icon;
            return (
              <a
                key={platform.id}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative flex flex-col p-8 rounded-lg bg-[#232c3e]/40 dark:bg-[#232c3e]/40 border border-[#273046] transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-900/50 ${platform.colorHex} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                aria-label={`Visit our ${platform.name} page`}
              >
                {/* Header with Icon and Arrow */}
                <div className="flex items-start mb-8">
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#2a3449] border border-[#323d56] text-slate-300 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                    <Icon className="w-6 h-6" strokeWidth={1.5} />
                  </div>
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-transparent text-slate-500 group-hover:bg-white group-hover:text-[#181d2b] transition-all duration-300 -translate-y-1 translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0">
                    <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2 mt-auto">
                  <h3 className="text-xl font-medium text-white">
                    {platform.name}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {platform.description}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </div>
      
    </section>
  );
}