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
   <section className="relative bg-white px-4 pb-12 pt-28 text-center dark:bg-darkmode sm:pb-16 sm:pt-36 md:pb-20 md:pt-44">
  <ScrollReveal preset="hero">
    <h1 className="mb-2 max-w-xs sm:max-w-none mx-auto text-5xl font-medium tracking-tight sm:text-5xl md:text-7xl">
      <span className="text-gray-900 dark:text-white">{whiteTitle}</span>{' '}
      <span className="text-brand dark:text-brand">{blueTitle}</span>
    </h1>
  </ScrollReveal>

  <ScrollReveal delay={0.15} preset="copy">
    <p className="mt-8 mx-auto my-1 max-w-4xl text-lg text-gray-700 dark:text-white">
      {description}
    </p>
  </ScrollReveal>

</section>
  )
}

export default HeroSub
