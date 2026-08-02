export interface CaseStudy {
  id: number;
  slug: string;
  title: string;
  logo: string;
  alt: string;
  client: string;
  industry: string;
  services: string[];
  techStack: string[];
  completionDate: string;
  featuredImage: string;
  overview: {
    title: string;
    description: string[];
  };
  execution: {
    title: string;
    description: string[];
    bullets: string[];
  };
  resultImage: string;
  result: {
    description: string[];
  };
}

export const caseStudiesData: CaseStudy[] = [
  {
    id: 1,
    slug: "how-we-improved-application-new-website-speed-by-78",
    title: "How we improved Application new website speed by 78%",
    logo: "https://cdn.prod.website-files.com/6217ab51d0be6980f1513f21/65525409dc8fde0a0419d014_application-logo-case-study-dev-x-webflow-template.svg",
    alt: "Application Logo",
    client: "Application Inc.",
    industry: "Web and Mobile",
    services: ["Frontend Development"],
    techStack: ["Web and Mobile"],
    completionDate: "October 2022",
    featuredImage: "/images/case studies/feature-image.png",
    overview: {
      title: 'Project Overview',
      description: [
        'Application Inc.s legacy website suffered from slow load times, poor Core Web Vitals, and a sluggish user experience. We rebuilt the frontend with a modern architecture, optimized assets, and improved page rendering to deliver a faster, more responsive website.',
        'The redesign also established a scalable foundation for future growth. Performance best practices, efficient resource loading, and responsive optimization ensured a consistent experience across all devices while improving long-term maintainability.'
      ]
    },
    execution: {
      title: "Execution",
      description: [
        'We started with a performance audit to identify large assets, render-blocking resources, and unnecessary JavaScript. The frontend was then restructured to improve loading efficiency.',
        'Next we optimized images fonts and caching while implementing lazy loading and server-side rendering Continuous testing ensured stable performance across devices.'
      ],
      bullets: [
        "Conducted a comprehensive website performance and speed audit.",
        "Optimized JavaScript bundles using efficient code splitting.",
        "Compressed images and optimized web font delivery.",
        "Implemented caching, lazy loading, and server rendering.",
      ],
    },
    resultImage: "/images/case studies/result-image.png",
    result: {
      description: [
        'The new website achieved a 78% improvement in loading speed, delivering faster page loads and better Core Web Vitals. Users experienced smoother navigation, lower waiting times, and improved responsiveness. The optimized architecture also provides a strong foundation for future updates and growth.',
        'The streamlined execution improved collaboration across teams and ensured a smooth launch without compromising quality. The completed project provides a scalable foundation for future expansion while enhancing the overall guest experience and business growth.'
      ]
    }
  },
  {
    id: 2,
    slug: 'how-we-helped-business-launch-new-rooms-in-less-than-6-months',
    title: 'How we helped Business launch new rooms in less than 6 months',
    logo: 'https://cdn.prod.website-files.com/6217ab51d0be6980f1513f21/6552543446647bfe309272e1_business-logo-case-study-dev-x-webflow-template.svg',
    alt: 'Business Logo',
    client: 'Business Co.',
    industry: 'Hospitality Tech',
    services: ['Servers & Cloud'],
    techStack: ['Hospitality'],
    completionDate: 'August 2023',
    featuredImage: 'https://cdn.prod.website-files.com/6217ab51d0be6980f1513f21/623f52716c2cfb39de7ca600_image-project-dev-webflow-template.png',
    overview: {
      title: 'Project Overview',
      description: [
        "Business planned to expand its hospitality offerings by launching a new set of premium rooms within a tight six-month timeline. We partnered with their team to streamline planning, development, and deployment, ensuring every milestone was delivered on schedule.",
        "From design coordination to technical implementation, we focused on building an efficient workflow that minimized delays and maintained high quality. The result was a successful room launch completed in under six months, enabling the business to start generating revenue sooner."
      ]
    },
    execution: {
      title: "Execution",
      description: [
        'The project began with detailed planning, requirement gathering, and timeline management. Teams collaborated closely to accelerate design approvals and construction milestones while reducing project risks.',
        'We then managed implementation, quality assurance, and final deployment through continuous progress tracking. Every phase was completed with a focus on speed, quality, and operational readiness.'
      ],
      bullets: [
        'Defined clear project scope and delivery milestones.',
        'Coordinated design approvals and construction phases.',
        'Managed implementation and quality assurance processes.',
        'Ensured on-time deployment within the six-month window.',
      ],
    },
    resultImage: 'https://cdn.prod.website-files.com/6217ab51d0be6980f1513f21/623f52771b058e8d0ad359cc_image-results-project-dev-webflow-template.png',
    result: {
      description: [
        'The new rooms were successfully launched in less than six months, allowing the business to welcome guests ahead of schedule. The accelerated delivery reduced time to market, improved operational efficiency, and created new revenue opportunities while maintaining high standards of quality.',
        'Coordinated execution improved team collaboration and ensured a smooth launch without compromising quality. The completed project provides a scalable foundation for future expansion while enhancing the overall guest experience and business growth.'
      ]
    }
  },
  {
    id: 3,
    slug: 'how-we-improved-enterprise-seo-performance-in-over-a-week',
    title: 'How we improve enterprise SEO performance in over a week',
    logo: 'https://cdn.prod.website-files.com/6217ab51d0be6980f1513f21/65525464b7647c851fd0fa52_enterpise-logo-case-study-dev-x-webflow-template.svg',
    alt: 'Enterprise Logo',
    client: 'Enterprise',
    industry: 'B2B Services',
    services: ['Backend Development'],
    techStack: ['B2B Services'],
    completionDate: 'December 2023',
    featuredImage: 'https://cdn.prod.website-files.com/6217ab51d0be6980f1513f21/623f52716c2cfb39de7ca600_image-project-dev-webflow-template.png',
    overview: {
      title: 'Project Overview',
      description: [
        'The client faced declining organic visibility, inconsistent search rankings, and underperforming technical SEO across their enterprise website. We conducted a comprehensive SEO audit and implemented high-impact optimizations to improve search performance within a single week.',
        'Our strategy focused on technical SEO, on-page optimization, and content improvements while preserving the existing website structure. The rapid implementation delivered measurable gains in visibility, crawlability, and overall search performance.'
      ]
    },
    execution: {
      title: "Execution",
      description: [
        'We began with a detailed SEO audit to identify technical issues, indexing problems, and content gaps affecting search performance. High-priority fixes were implemented immediately to maximize impact.',
        'Then optimized metadata page structure, internal linking, and website performance while improving crawl efficiency. Continuous monitoring ensured all changes were properly indexed and delivered measurable improvements.'
      ],
      bullets: [
        'Conducted a complete enterprise SEO performance audit.',
        'Optimized metadata, headings, and internal linking.',
        'Enhanced content relevance and user experience.',
        'Implemented performance improvements for faster loading.',
      ],
    },
    resultImage: 'https://cdn.prod.website-files.com/6217ab51d0be6980f1513f21/623f52771b058e8d0ad359cc_image-results-project-dev-webflow-template.png',
    result: {
      description: [
        'Within just one week the website experienced noticeable improvements in search visibility, keyword rankings, and indexing performance. Technical enhancements also strengthened Core Web Vitals and overall site health.',
        'The optimized SEO foundation improved organic traffic potential while making the website easier for search engines to crawl and index. These improvements positioned the business for sustainable long-term search growth.'
      ]
    }
  },
  {
    id: 4,
    slug: 'how-we-helped-institute-launch-tables-less-then-4-months',
    title: 'How we helped instiute launch tables less then 4 months',
    logo: 'https://cdn.prod.website-files.com/6217ab51d0be6980f1513f21/65525485aeddfb5463266e52_institute-logo-case-study-dev-x-webflow-template.svg',
    alt: 'Institute Logo',
    client: 'Global Institute',
    industry: 'Education Tech',
    services: ['Databases & DS'],
    techStack: ['Education Tech'],
    completionDate: 'May 2023',
    featuredImage: 'https://cdn.prod.website-files.com/6217ab51d0be6980f1513f21/623f52716c2cfb39de7ca600_image-project-dev-webflow-template.png',
    overview: {
      title: 'Project Overview',
      description: [
        'Institute set out to launch a new digital table management system within a strict four-month timeline. We collaborated with stakeholders to streamline planning, development, and deployment while ensuring the solution met operational requirements.',
        'Our team focused on efficient execution, seamless integration, and rigorous testing to accelerate delivery. The project was completed in under four months, providing a reliable and scalable solution ready for daily operations.'
      ]
    },
    execution: {
      title: "Execution",
      description: [
        'The project started with requirement analysis, workflow planning, and solution design. Development was carried out in iterative phases to maintain quality while meeting the aggressive schedule.',
        'After implementation, we performed system testing, user validation, and deployment. Continuous monitoring ensured a smooth rollout with minimal disruption to existing operations.',
      ],
      bullets: [
        'Defined project scope and implementation roadmap.',
        'Developed core features through agile iterations.',
        'Performed comprehensive testing before deployment.',
        'Delivered solution within the planned timeline.',
      ],
    },
    resultImage: 'https://cdn.prod.website-files.com/6217ab51d0be6980f1513f21/623f52771b058e8d0ad359cc_image-results-project-dev-webflow-template.png',
    result: {
      description: [
        'The new table management solution was successfully launched in less than four months, enabling the institute to improve operational efficiency and streamline day-to-day workflows. The timely delivery allowed staff to adopt the new system without disrupting ongoing activities.',
        'Scalable implementation provides a strong foundation for future enhancements while improving reliability, usability, and overall process management across the institute.'
      ]
    }
  },
  {
    id: 5,
    slug: 'how-we-improved-startup-dashboard-speed-by-56-in-just-a-month',
    title: 'How we improve startup dashboard speed by 56% in just a Month',
    logo: 'https://cdn.prod.website-files.com/6217ab51d0be6980f1513f21/65525497dd8946ca68a59927_startup-logo-case-study-dev-x-webflow-template.svg',
    alt: 'Startup Logo',
    client: 'FinTech Startup',
    industry: 'Financial Technology',
    services: ['AI & ML'],
    techStack: ['Financial Technology'],
    completionDate: 'January 2024',
    featuredImage: 'https://cdn.prod.website-files.com/6217ab51d0be6980f1513f21/623f52716c2cfb39de7ca600_image-project-dev-webflow-template.png',
    overview: {
      title: 'Project Overview',
      description: [
        'Startup analytics dashboard suffered from slow loading times and delayed data rendering, impacting productivity and user experience. We optimized the frontend architecture, API communication, and data handling to significantly improve overall performance.',
        'Within just one month we delivered a faster and more responsive dashboard that achieved a 56% improvement in speed. The optimized solution provides a scalable foundation for future features while ensuring a smooth experience across desktop and mobile devices.'
      ]
    },
    execution: {
      title: "Execution",
      description: [
        'We began by profiling the application to identify slow queries, heavy components, and rendering bottlenecks. Based on the findings, we optimized the frontend architecture and streamlined API interactions.',
        'Then we improved data loading strategies, reduced unnecessary re-renders, and optimized caching mechanisms. Continuous performance testing ensured stable improvements throughout the development cycle.'
      ],
      bullets: [
        'Identified dashboard performance and rendering bottlenecks.',
        'Optimized API requests and data fetching.',
        'Reduced component re-renders across application pages.',
        'Implemented caching and lazy loading strategies.',
      ],
    },
    resultImage: 'https://cdn.prod.website-files.com/6217ab51d0be6980f1513f21/623f52771b058e8d0ad359cc_image-results-project-dev-webflow-template.png',
    result: {
      description: [
        'The optimized dashboard achieved a 56% improvement in loading speed within one month, providing a noticeably faster and more responsive experience. Users benefited from quicker navigation, smoother interactions, and reduced waiting times when accessing business data.',
        'The performance improvements also enhanced application stability and scalability, enabling the startup to support future growth while delivering a more efficient experience for daily users.'
      ]
    }
  },
  {
    id: 6,
    slug: 'how-we-helped-studio-improve-its-search-engine-speed',
    title: 'How we helped Studio improve its search engine speed',
    logo: 'https://cdn.prod.website-files.com/6217ab51d0be6980f1513f21/655254af3aab038419206632_studio-logo-case-study-dev-x-webflow-template.svg',
    alt: 'Studio Logo',
    client: 'Creative Studio',
    industry: 'Creative Agency',
    services: ['AI & ML'],
    techStack: ['Creative Agency'],
    completionDate: 'January 2024',
    featuredImage: 'https://cdn.prod.website-files.com/6217ab51d0be6980f1513f21/623f52716c2cfb39de7ca600_image-project-dev-webflow-template.png',
    overview: {
      title: 'Project Overview',
      description: [
        'Studio website experienced slow page loading and weak search performance, limiting its online visibility and user engagement. We optimized the website technical SEO, page speed, and frontend performance to create a faster, search-friendly experience.',
        'Our improvements focused on performance, crawlability, and usability without changing the core website structure. The optimized platform now delivers faster page loads and stronger search engine performance across all devices.'
      ]
    },
    execution: {
      title: "Execution",
      description: [
        'We started with a technical audit to identify speed bottlenecks, indexing issues, and inefficient resource loading. High-impact optimizations were prioritized to deliver quick performance gains.',
        'Then optimized images, JavaScript, CSS, metadata, and caching while improving Core Web Vitals. Continuous testing ensured the website remained stable and responsive after deployment.',
      ],
      bullets: [
        'Audited technical SEO and website performance.',
        'Optimized images, scripts, and style resources.',
        'Improved Core Web Vitals and page loading.',
        'Enhanced indexing and crawl efficiency.',
      ],
    },
    resultImage: 'https://cdn.prod.website-files.com/6217ab51d0be6980f1513f21/623f52771b058e8d0ad359cc_image-results-project-dev-webflow-template.png',
    result: {
      description: [
        'The optimized website delivered significantly faster page speeds, creating a smoother browsing experience for visitors and improving overall website responsiveness. Better technical performance also strengthened search engine visibility and website health.',
        'Improvements enhanced crawlability, reduced loading delays, and established a scalable foundation for future SEO growth. The studio now benefits from improved user engagement, stronger search performance, and a more reliable digital presence.'
      ]
    }
  },
];

export const getCaseStudyBySlug = (slug: string): CaseStudy | undefined => {
  if (!slug) return undefined;

  const cleanSlug = decodeURIComponent(slug)
    .replace(/^\/case-studies\//, '')
    .replace(/^\/project\//, '')
    .replace(/^\//, '')
    .toLowerCase()
    .trim();

  return caseStudiesData.find(
    (study) => study.slug.toLowerCase().trim() === cleanSlug
  );
};

export const getRelatedCaseStudies = (currentId: number): CaseStudy[] => {
  return caseStudiesData.filter((study) => study.id !== currentId).slice(0, 2);
};