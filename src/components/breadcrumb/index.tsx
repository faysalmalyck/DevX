import React, { FC } from 'react'
import Link from 'next/link'

interface BreadcrumbProps {
  links: { href: string; text: string }[]
}

const Breadcrumb: FC<BreadcrumbProps> = ({ links }) => {
  const lastIndex = links.length - 1
  return (
    <div className='mx-auto my-[0.5375rem] inline-flex flex-wrap items-center justify-center px-4 py-4'>
      {links.map((link, index) => (
        <React.Fragment key={index}>
          {index !== lastIndex ? (
            <Link
  href={link.href}
  className="no-underline flex items-center font-semibold text-midnight_text dark:text-white/70 text-sm hover:text-blue-600 dark:hover:text-blue-500 after:relative after:content-[''] after:ml-2.5 after:mr-[0.8125rem] after:my-0 after:inline-block after:top-[0.0625rem] after:w-2 after:h-2 after:border-r-2 after:border-solid after:border-b-2 after:border-midnight_text dark:after:border-white after:-rotate-45"
>
  {link.text}
</Link>
) : (
<span className='dark:text-white text-blue-600 font-semibold mx-2.5'>
  {link.text}
</span>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

export default Breadcrumb
