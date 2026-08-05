import React, { FC } from 'react'
import Breadcrumb from '@/components/breadcrumb'
import { BreadcrumbLink } from '@/types/breadcrumb'

interface HeroSubProps {
  title: string
  description: string
  breadcrumbLinks: BreadcrumbLink[]
}

const HeroSub: FC<HeroSubProps> = ({
  title,
  description,
  breadcrumbLinks,
}) => {
  const [whiteTitle, blueTitle] = title.split('|')

  return (
   <section className="relative bg-white px-4 pt-28 pb-2 text-center sm:pt-36 sm:pb-4 md:pt-44 md:pb-6 dark:bg-[#181d2b]">
  <h1 className="mb-2 max-w-xs sm:max-w-none mx-auto text-5xl font-normal tracking-tight sm:text-5xl md:text-7xl">
    <span className="text-gray-900 dark:text-white">{whiteTitle}</span>{' '}
    <span className="text-blue-600 dark:text-blue-500">{blueTitle}</span>
  </h1>

  <p className="mt-5 mx-auto my-1 max-w-4xl text-sm sm:text-base text-gray-700 dark:text-white">
    {description}
  </p>

  <Breadcrumb links={breadcrumbLinks} />
</section>
  )
}

export default HeroSub