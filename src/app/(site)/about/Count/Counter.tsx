"use client";

import React, { useState, useEffect, useRef } from 'react';

interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

interface StatCardProps {
  targetValue: number;
  suffix: string;
  label: string;
  duration?: number;
}

const statsData: StatItem[] = [
  { value: 99, suffix: '%', label: 'Customer satisfaction' },
  { value: 575, suffix: '+', label: 'Successful Projects' },
  { value: 32, suffix: 'M', label: 'Revenue Generated' },
  { value: 260, suffix: '%', label: 'Company growth' },
];

function StatCard({ targetValue, suffix, label, duration = 3500 }: StatCardProps) {
  const [count, setCount] = useState<number>(0);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let startTimestamp: number | null = null;
    let animationFrameId: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      const easeOutQuad = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOutQuad * targetValue));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(targetValue);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animationFrameId = requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, [targetValue, duration]);

  return (
    <div ref={cardRef} className="flex flex-col mt-12 py-[4.6875rem] items-center justify-center text-center">
      <div className="text-5xl font-normal lg:text-8xl text-gray-900 dark:text-white mb-4">
        {count}
        <span className="text-blue-600 dark:text-blue-500">{suffix}</span>
      </div>
      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 m-0">
        {label}
      </h3>
    </div>
  );
}

export default function StatsSection() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-7xl mx-auto px-4 py-12">
      {statsData.map((stat, index) => (
        <StatCard
          key={index}
          targetValue={stat.value}
          suffix={stat.suffix}
          label={stat.label}
          duration={3500}
        />
      ))}
    </div>
  );
}