export interface Career {
  id: string;
  title: string;
  category: 'frontend' | 'backend' | 'Sales' | 'other';
  location: string;
  type: string;
  slug: string;
  description: string;
  department: string;
  experience: string;
  workMode: string;
  overview: string;
  responsibilities: string[];
  requirements: string[];
  preferredQualifications: string[];
  benefits: string[];
  hiringProcess: { step: number; title: string; description: string }[];
  faqs: { question: string; answer: string }[];
}

export const careersData: Career[] = [
  {
    id: '1',
    title: 'Account Executive',
    category: 'Sales',
    location: 'Islamabad',
    type: 'Full time',
    slug: 'account-executive',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.',
    department: 'Sales',
    experience: '3+ Years',
    workMode: 'On-site',
    overview: 'As an Account Executive, you will be responsible for driving revenue growth by acquiring new enterprise clients and maintaining strong relationships with existing ones.',
    responsibilities: [
      'Identify and close new business opportunities.',
      'Manage the entire sales cycle from prospecting to closing.',
      'Deliver compelling presentations and product demonstrations.',
      'Maintain accurate forecasting and pipeline management.'
    ],
    requirements: [
      'Proven track record of B2B sales success.',
      'Strong communication and negotiation skills.',
      'Experience with CRM software (e.g., Salesforce).',
      'Ability to thrive in a fast-paced environment.'
    ],
    preferredQualifications: [
      'Experience in the SaaS industry.',
      'Existing network of enterprise contacts.',
      'Bachelor’s degree in Business or a related field.'
    ],
    benefits: [
      'Competitive base salary + uncapped commission.',
      'Comprehensive health insurance.',
      'Flexible working hours.',
      'Annual sales club trips.'
    ],
    hiringProcess: [
      { step: 1, title: 'Application Review', description: 'Our team will review your resume and cover letter.' },
      { step: 2, title: 'Initial Screening', description: 'A 30-minute phone call with our recruiter.' },
      { step: 3, title: 'Sales Presentation', description: 'Present a mock pitch to our sales leadership.' },
      { step: 4, title: 'Final Interview', description: 'Meet with the VP of Sales and CEO.' }
    ],
    faqs: [
      { question: 'What is the commission structure?', answer: 'We offer an uncapped commission structure with accelerators for overachievement.' },
      { question: 'Is travel required?', answer: 'Yes, occasional travel to client sites and industry events is required.' }
    ]
  },
  {
    id: '2',
    title: 'React Frontend Developer',
    category: 'frontend',
    location: 'Islamabad',
    type: 'Full time',
    slug: 'react-frontend-developer',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.',
    department: 'Engineering',
    experience: '2-4 Years',
    workMode: 'Hybrid',
    overview: 'We are looking for a skilled React Developer to join our frontend team. You will be responsible for building highly responsive, scalable, and accessible user interfaces.',
    responsibilities: [
      'Develop new user-facing features using React.js and Next.js.',
      'Build reusable components and front-end libraries for future use.',
      'Translate designs and wireframes into high-quality code.',
      'Optimize components for maximum performance across a vast array of web-capable devices and browsers.'
    ],
    requirements: [
      'Strong proficiency in JavaScript, including DOM manipulation and the JavaScript object model.',
      'Thorough understanding of React.js and its core principles.',
      'Experience with popular React.js workflows (such as Redux or Context API).',
      'Familiarity with newer specifications of ECMAScript (ES6+).'
    ],
    preferredQualifications: [
      'Experience with Next.js and Server-Side Rendering (SSR).',
      'Knowledge of TypeScript.',
      'Familiarity with Tailwind CSS or similar utility-first CSS frameworks.'
    ],
    benefits: [
      'Competitive salary and equity package.',
      'Medical, dental, and vision insurance.',
      'Remote work flexibility.',
      'Continuous learning and development budget.'
    ],
    hiringProcess: [
      { step: 1, title: 'Application Review', description: 'Initial review of your resume and portfolio.' },
      { step: 2, title: 'Technical Screen', description: 'A 45-minute technical conversation focusing on React fundamentals.' },
      { step: 3, title: 'Take-home Assignment', description: 'A small practical assignment to showcase your coding skills.' },
      { step: 4, title: 'Culture Fit & Final Interview', description: 'Meet with the team and engineering leadership.' }
    ],
    faqs: [
      { question: 'Can this role be fully remote?', answer: 'This specific role is hybrid, requiring 2 days a week in the Islamabad office.' },
      { question: 'What tech stack do you use?', answer: 'We primarily use Next.js, React, TypeScript, and Tailwind CSS.' }
    ]
  },
  {
    id: '3',
    title: 'Flutter Developer',
    category: 'frontend',
    location: 'Islamabad',
    type: 'Full time',
    slug: 'flutter-developer',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.',
    department: 'Mobile Engineering',
    experience: '3+ Years',
    workMode: 'On-site',
    overview: 'Join our mobile engineering team as a Flutter Developer. You will create beautiful, fast, and native-quality cross-platform applications for iOS and Android.',
    responsibilities: [
      'Design and build advanced applications for the Flutter platform.',
      'Collaborate with cross-functional teams to define, design, and ship new features.',
      'Unit-test code for robustness, including edge cases, usability, and general reliability.',
      'Work on bug fixing and improving application performance.'
    ],
    requirements: [
      'Proven working experience in software development and mobile app development.',
      'Deep experience with Flutter and Dart.',
      'Experience with third-party libraries and APIs.',
      'Working knowledge of the general mobile landscape, architectures, trends, and emerging technologies.'
    ],
    preferredQualifications: [
      'Native iOS (Swift) or Android (Kotlin) experience.',
      'Experience with state management libraries like Provider, Riverpod, or BLoC.',
      'Published apps on the App Store and Google Play.'
    ],
    benefits: [
      'Competitive salary and performance bonuses.',
      'Health insurance coverage.',
      'Modern hardware and development tools provided.',
      'Regular team building events.'
    ],
    hiringProcess: [
      { step: 1, title: 'Application Review', description: 'We review your resume and any published apps.' },
      { step: 2, title: 'Technical Interview', description: 'Deep dive into Dart and Flutter concepts.' },
      { step: 3, title: 'Live Coding / Architecture Design', description: 'Collaborative problem-solving session.' },
      { step: 4, title: 'Final Interview', description: 'Meeting with the CTO and team members.' }
    ],
    faqs: [
      { question: 'Do you build native apps as well?', answer: 'Most of our new projects are Flutter-first, but we maintain some native legacy apps.' }
    ]
  },
  {
    id: '4',
    title: 'NodeJS Developer',
    category: 'backend',
    location: 'Islamabad',
    type: 'Full time',
    slug: 'nodejs-developer',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.',
    department: 'Engineering',
    experience: '3-5 Years',
    workMode: 'Hybrid',
    overview: 'We are seeking a Backend Developer with strong Node.js skills to build robust APIs and scalable microservices that power our core applications.',
    responsibilities: [
      'Integration of user-facing elements developed by front-end developers with server-side logic.',
      'Writing reusable, testable, and efficient code.',
      'Design and implementation of low-latency, high-availability, and performant applications.',
      'Implementation of security and data protection.'
    ],
    requirements: [
      'Strong proficiency with JavaScript (and TypeScript).',
      'Knowledge of Node.js and frameworks available for it (such as Express, NestJS).',
      'Understanding the nature of asynchronous programming and its quirks and workarounds.',
      'Good understanding of server-side templating languages.'
    ],
    preferredQualifications: [
      'Experience with SQL (PostgreSQL) and NoSQL (MongoDB) databases.',
      'Knowledge of Docker and Kubernetes.',
      'Familiarity with AWS or Google Cloud Platform services.'
    ],
    benefits: [
      'Competitive compensation package.',
      'Health and wellness stipend.',
      'Flexible work hours.',
      'Annual retreat.'
    ],
    hiringProcess: [
      { step: 1, title: 'Initial Screen', description: 'Brief call to discuss your experience and expectations.' },
      { step: 2, title: 'Technical Challenge', description: 'An API design and implementation task.' },
      { step: 3, title: 'System Design Interview', description: 'Discussion on scaling and backend architecture.' },
      { step: 4, title: 'Final Interview', description: 'Meet with Engineering Management.' }
    ],
    faqs: [
      { question: 'What database technologies do you use?', answer: 'We primarily use PostgreSQL and Redis.' }
    ]
  },
  {
    id: '5',
    title: 'Shopify Developer',
    category: 'frontend',
    location: 'Islamabad',
    type: 'Full time',
    slug: 'shopify-developer',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.',
    department: 'E-commerce',
    experience: '2+ Years',
    workMode: 'On-site',
    overview: 'As a Shopify Developer, you will build and customize high-performing e-commerce storefronts for our top-tier clients, utilizing Liquid, HTML, CSS, and JavaScript.',
    responsibilities: [
      'Develop custom Shopify themes from scratch or modify existing ones.',
      'Integrate third-party apps and APIs into Shopify stores.',
      'Optimize store performance and ensure cross-browser compatibility.',
      'Collaborate with designers to implement UI/UX best practices.'
    ],
    requirements: [
      'Proven experience in Shopify theme development.',
      'Strong knowledge of Liquid templating language.',
      'Proficiency in HTML5, CSS3, and JavaScript.',
      'Experience with responsive design and mobile-first approach.'
    ],
    preferredQualifications: [
      'Experience with headless Shopify setups (e.g., Hydrogen, Next.js).',
      'Familiarity with Shopify Storefront API.',
      'Basic understanding of SEO principles.'
    ],
    benefits: [
      'Competitive salary.',
      'Health insurance.',
      'Generous paid time off.',
      'Modern tech setup.'
    ],
    hiringProcess: [
      { step: 1, title: 'Portfolio Review', description: 'We evaluate the stores and themes you have built.' },
      { step: 2, title: 'Technical Interview', description: 'Discussion covering Liquid, CSS, and JS.' },
      { step: 3, title: 'Practical Task', description: 'A short Shopify theme customization challenge.' },
      { step: 4, title: 'Final Interview', description: 'Meet the E-commerce team lead.' }
    ],
    faqs: [
      { question: 'Do you work with Shopify Plus?', answer: 'Yes, many of our clients are on Shopify Plus and require complex customizations.' }
    ]
  },
  {
    id: '6',
    title: 'UI UX Designer',
    category: 'other',
    location: 'Remote',
    type: 'Full time',
    slug: 'ui-ux-designer',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.',
    department: 'Design',
    experience: '4+ Years',
    workMode: 'Remote',
    overview: 'We are looking for an experienced UI/UX Designer to craft intuitive, engaging, and beautiful user experiences for web and mobile applications.',
    responsibilities: [
      'Gather and evaluate user requirements in collaboration with product managers and engineers.',
      'Illustrate design ideas using storyboards, process flows, and sitemaps.',
      'Design graphic user interface elements, like menus, tabs, and widgets.',
      'Build page navigation buttons and search fields.'
    ],
    requirements: [
      'Proven work experience as a UI/UX Designer or similar role.',
      'Portfolio of design projects.',
      'Knowledge of wireframe tools (e.g. Wireframe.cc and InVision).',
      'Up-to-date knowledge of design software like Figma and Sketch.'
    ],
    preferredQualifications: [
      'Experience designing for B2B SaaS applications.',
      'Basic knowledge of HTML/CSS to better collaborate with developers.',
      'Experience with user testing and research methodologies.'
    ],
    benefits: [
      'Competitive salary (100% remote).',
      'Hardware and home office stipend.',
      'Health, dental, and vision insurance.',
      'Flexible vacation policy.'
    ],
    hiringProcess: [
      { step: 1, title: 'Portfolio Review', description: 'Initial review of your design portfolio.' },
      { step: 2, title: 'Design Interview', description: 'Discussion of your design process and past projects.' },
      { step: 3, title: 'Whiteboard Session', description: 'A collaborative problem-solving and ideation session.' },
      { step: 4, title: 'Culture Fit Interview', description: 'Meet with the broader team.' }
    ],
    faqs: [
      { question: 'What is your primary design tool?', answer: 'We are a 100% Figma shop.' }
    ]
  },
];

export const getCareerBySlug = (slug: string): Career | undefined => {
  return careersData.find(career => career.slug === slug);
};
