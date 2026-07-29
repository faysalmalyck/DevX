'use client';

import { useState } from 'react';
import Link from 'next/link';
import { careersData as positions } from '@/data/careers';

const categories = [
  { id: 'all', label: 'All' },
  { id: 'frontend', label: 'Frontend' },
  { id: 'backend', label: 'Backend' },
  { id: 'Sales', label: 'Sales' },
  { id: 'other', label: 'Other' },
] as const;

export default function OpenPositions() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredPositions = selectedCategory === 'all'
    ? positions
    : positions.filter((pos) => pos.category === selectedCategory);

  return (
    <section id="open-positions" className="py-20 bg-white dark:bg-[#181d2b] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-slate-900 dark:text-white mb-4">
            Browse our available <span className="text-blue-600 dark:text-blue-400">positions</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-8">
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur sint occaecat cupidatat non.
          </p>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 dark:bg-blue-500'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Positions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPositions.map((position) => (
            <Link
              key={position.id}
              href={`/careers/${position.slug}`}
              className="group flex flex-col justify-between p-8 sm:p-10 min-h-[260px] bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 rounded-md transition-all duration-200 hover:border-blue-500/50 hover:shadow-lg dark:hover:border-blue-400/50"
            >
              <div>
                <div className="flex items-center text-xs font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400 mb-4 space-x-2">
                  <span>{position.location}</span>
                  <span className="inline-block w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                  <span>{position.type}</span>
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-normal text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-3">
                  {position.title}
                </h3>
              </div>
              
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                {position.description}
              </p>
            </Link>
          ))}
        </div>

        {filteredPositions.length === 0 && (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            No open positions available for this category right now.
          </div>
        )}

      </div>
      <div className="mt-36 h-px w-full bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>    
    </section>

    
  );
}