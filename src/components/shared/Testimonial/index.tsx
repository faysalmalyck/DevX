import React from 'react'
import { Quote, Star } from 'lucide-react'

const Testimonial = () => {
  const reviews = [
    {
      quote:
        'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip exea commodo consequat.',
      name: 'Jonathan Diesel',
      role: 'Happy Customer, Triology inc',
    },
    {
      quote:
        'DevX helped us turn a complex product idea into a clean, scalable platform with the kind of polish investors immediately understood.',
      name: 'Sarah Mitchell',
      role: 'Founder, SaaS Studio',
    },
    {
      quote:
        'The team combined sharp engineering with strong product thinking. Every milestone felt structured, transparent, and fast.',
      name: 'Ahmed Khan',
      role: 'Operations Lead, Fintech',
    },
  ]

  return (
    <section
      className='scroll-mt-24 relative overflow-hidden bg-section dark:bg-darklight border-none'
      id='testimonials'>
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(60,210,120,0.12),transparent_32rem)]' />
      <div className='container mx-auto max-w-6xl px-4'>
        <div className='relative text-center'>
          <h2 className='premium-heading mx-auto max-w-3xl'>Trusted by teams that care about execution.</h2>
          <div className='mt-12 grid grid-cols-1 gap-6 md:grid-cols-3'>
            {reviews.map((review, index) => (
              <article
                key={review.name}
                className='glass-card group flex h-full flex-col rounded-[1.75rem] p-7 text-left transition-all duration-500 hover:-translate-y-2 hover:border-primary/30'
                data-aos='fade-up'
                data-aos-delay={index * 120}
              >
                <div className='mb-6 flex items-center justify-between'>
                  <div className='flex gap-1 text-amber-400'>
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <Star key={starIndex} className='h-4 w-4 fill-current' />
                    ))}
                  </div>
                  <Quote className='h-8 w-8 text-primary/40 transition-transform duration-500 group-hover:scale-110' />
                </div>
                <p className='flex-1 text-base leading-8 text-secondary dark:text-white/65'>{review.quote}</p>
                <div className='mt-8 border-t border-slate-200/70 pt-5 dark:border-white/10'>
                  <strong className='text-lg font-black text-midnight_text dark:text-white'>{review.name}</strong>
                  <p className='mt-1 text-base text-gray dark:text-white/50'>{review.role}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonial
