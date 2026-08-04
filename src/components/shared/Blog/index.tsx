import React from 'react'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import BlogCard from './blogCard'
import { getAllPosts } from '@/utils/markdown'

const Blog: React.FC = () => {
  const posts = getAllPosts([
    'title',
    'date',
    'excerpt',
    'coverImage',
    'slug',
  ]).slice(0, 3)

  return (
    <section
      className='premium-shell flex flex-wrap justify-center dark:bg-darkmode'
      id='blog'>
      <div className='container mx-auto max-w-6xl px-4'>
        <div className='flex items-baseline justify-between flex-wrap'>
          <h2
            className='premium-heading sm:mb-11 mb-3'
            data-aos='fade-right'
            data-aos-delay='200'
            data-aos-duration='1000'>
            Latest blog & news
          </h2>
          <Link
            href='#'
            className='flex items-center gap-3 rounded-full border border-slate-200/80 bg-white/70 px-5 py-3 text-sm font-bold text-midnight_text shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:text-primary dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:text-primary sm:pb-3'
            data-aos='fade-left'
            data-aos-delay='200'
            data-aos-duration='1000'>
            View More
            <span>
              <Icon icon='solar:arrow-right-outline' width='30' height='30' />
            </span>
          </Link>
        </div>
        <div className='grid grid-cols-12 gap-7'>
          {posts.map((blog, i) => (
            <div
              key={i}
              className='w-full md:col-span-4 sm:col-span-6 col-span-12'
              data-aos='fade-up'
              data-aos-delay={`${i * 200}`}
              data-aos-duration='1000'>
              <BlogCard blog={blog} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Blog
