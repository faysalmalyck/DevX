"use client";

import { CountUp, StaggerContainer, StaggerItem } from "@/components/motion";

interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

interface StatCardProps {
  targetValue: number;
  suffix: string;
  label: string;
}

const statsData: StatItem[] = [
  { value: 99, suffix: '%', label: 'Customer satisfaction' },
  { value: 575, suffix: '+', label: 'Successful Projects' },
  { value: 32, suffix: 'M', label: 'Revenue Generated' },
  { value: 260, suffix: '%', label: 'Company growth' },
];

function StatCard({ targetValue, suffix, label }: StatCardProps) {
  return (
    <StaggerItem className="flex flex-col mt-12 py-[4.6875rem] items-center justify-center text-center">
      <div className="text-5xl font-normal lg:text-8xl text-gray-900 dark:text-white mb-4">
        <CountUp value={targetValue} />
        <span className="text-blue-600 dark:text-blue-500">{suffix}</span>
      </div>
      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 m-0">
        {label}
      </h3>
    </StaggerItem>
  );
}

export default function StatsSection() {
  return (
    <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-7xl mx-auto px-4 py-12">
      {statsData.map((stat, index) => (
        <StatCard
          key={index}
          targetValue={stat.value}
          suffix={stat.suffix}
          label={stat.label}
        />
      ))}
    </StaggerContainer>
  );
}
