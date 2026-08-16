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
    <section className="relative bg-white px-4 pb-12 pt-20 text-center dark:bg-[#181d2c] sm:pb-16 sm:pt-36 md:pb-15 md:pt-44">
      <ScrollReveal preset="hero">
        <h1 className="mx-auto mt-8 sm:mt-0 max-w-4xl text-5xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
          <span className="text-gray-900 dark:text-white">{whiteTitle}</span>{' '}
          <span className="text-brand dark:text-brand">{blueTitle}</span>
        </h1>
      </ScrollReveal>

      <ScrollReveal delay={0.15} preset="copy">
        <p className="mx-auto mt-4 max-w-xl text-base text-gray-700 dark:text-white sm:text-lg">
          {description}
        </p>
      </ScrollReveal>
    </section>
  )
}

export default HeroSub