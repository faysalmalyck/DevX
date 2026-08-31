import React, { FC } from 'react'
import { ScrollReveal } from '@/components/motion'

interface HeroSubProps {
  title: string
  description: string
}

const HeroSub: FC<HeroSubProps> = ({
  title,
  description,
}) => {
  const [whiteTitle, blueTitle] = title.split('|')

  return (
    <section className="relative bg-white px-4 pb-18 pt-20 text-center dark:bg-[#181d2c] sm:pb-16 sm:pt-36 md:pb-43 md:pt-49">
      <ScrollReveal preset="hero">
        <h1 className="mx-auto mt-10 sm:mt-0 max-w-4xl text-6xl font-semibold tracking-leading sm:text-5xl md:text-7xl">
          <span className="text-gray-900 dark:text-white">{whiteTitle}</span>{' '}
          <span className="text-brand dark:text-brand">{blueTitle}</span>
        </h1>
      </ScrollReveal>
<svg
  className="pointer-events-none absolute top-30 left-0 hidden rotate-280 h-[300px] w-[300px] sm:block"
  viewBox="0 0 420 420"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <defs>
    {/* Gradient */}
    <linearGradient
      id="bottomRightLGradient"
      x1="40"
      y1="350"
      x2="350"
      y2="80"
      gradientUnits="userSpaceOnUse"
    >
      <stop offset="0%" stopColor="#3154d8" stopOpacity="0" />
      <stop offset="20%" stopColor="#3154d8" stopOpacity="0.25" />
      <stop offset="50%" stopColor="#4f6df5" stopOpacity="1" />
      <stop offset="80%" stopColor="#3154d8" stopOpacity="0.25" />
      <stop offset="100%" stopColor="#3154d8" stopOpacity="0" />
    </linearGradient>

    {/* Soft Glow */}
    <filter
      id="bottomRightLGlow"
      x="-30%"
      y="-30%"
      width="160%"
      height="160%"
    >
      <feGaussianBlur stdDeviation="2" result="blur" />

      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
  <path
    d="
      M 40 350
      H 320
      Q 370 350 370 300
      V 40
    "
    stroke="url(#bottomRightLGradient)"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    fill="none"
    filter="url(#bottomRightLGlow)"
    className="animate-[pulse_5s_ease-in-out_infinite]"
  />
</svg>

<svg
  className="pointer-events-none absolute -right-40 top-30 rotate-[100deg] hidden h-[380px] w-[380px] sm:block"
  viewBox="0 0 480 480"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <defs>
    <linearGradient
      id="diagonalGlowGradient"
      x1="400"
      y1="80"
      x2="80"
      y2="400"
      gradientUnits="userSpaceOnUse"
    >
      <stop offset="0%" stopColor="#4f6df5" stopOpacity="0" />
      <stop offset="25%" stopColor="#4f6df5" stopOpacity="0.3" />
      <stop offset="50%" stopColor="#4360cbff" stopOpacity="0.9" />
      <stop offset="75%" stopColor="#4f6df5" stopOpacity="0.4" />
      <stop offset="100%" stopColor="#4360cbff" stopOpacity="0" />
    </linearGradient>

    <filter
      id="diagonalGlowFilter"
      x="-30%"
      y="-30%"
      width="160%"
      height="160%"
    >
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <path
    d="
      M 400 80
      A 200 200 0 0 1 80 400
    "
    stroke="url(#diagonalGlowGradient)"
    strokeWidth="3"
    strokeLinecap="round"
    fill="none"
    filter="url(#diagonalGlowFilter)"
    className="animate-[pulse_6s_ease-in-out_infinite]"
  />
</svg>

      <ScrollReveal delay={0.15} preset="copy">
        <p className="mx-auto mt-5 max-w-3xl text-base text-gray-700 dark:text-white sm:text-lg">
          {description}
        </p>
      </ScrollReveal>
    </section>
  )
}

export default HeroSub