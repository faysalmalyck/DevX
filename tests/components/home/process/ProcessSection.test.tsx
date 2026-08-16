import { render } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import ProcessSection from '@/components/home/Process/ProcessSection';

type MotionWrapperProps = {
  children: ReactNode;
  className?: string;
};

vi.mock('@/components/motion', () => ({
  HoverCard: ({ children, className }: MotionWrapperProps) => (
    <div className={className}>{children}</div>
  ),
  ScrollReveal: ({ children, className }: MotionWrapperProps) => (
    <div className={className}>{children}</div>
  ),
  StaggerContainer: ({ children, className }: MotionWrapperProps) => (
    <div data-testid="process-steps" className={className}>
      {children}
    </div>
  ),
  StaggerItem: ({ children, className }: MotionWrapperProps) => (
    <div className={className}>{children}</div>
  ),
}));

vi.mock('next/image', () => ({
  default: ({ alt, src }: { alt: string; src: string }) => (
    <img alt={alt} src={src} />
  ),
}));

describe('Process staircase', () => {
  it('applies equal index-based desktop offsets and reserves room below', () => {
    const { container, getByTestId } = render(<ProcessSection />);
    const grid = getByTestId('process-steps');
    const steps = Array.from(
      container.querySelectorAll<HTMLElement>('[data-process-step]'),
    );

    expect(grid.className).toContain('items-start');
    expect(grid.className).toContain('lg:grid-cols-3');
    expect(grid.className).toContain('lg:pb-16');
    expect(grid.className).not.toContain('overflow-hidden');
    expect(steps).toHaveLength(3);
    expect(
      steps.map((step) => step.style.getPropertyValue('--process-step-offset')),
    ).toEqual(['0px', '75px', '150px']);

    steps.forEach((step) => {
      expect(step.className).toContain('[transform:translateY(0)]');
      expect(step.className).toContain(
        'xl:[transform:translateY(var(--process-step-offset))]',
      );
      expect(step.className).not.toContain('mt-');
    });
  });
});
