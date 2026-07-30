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
  responsibilitiesDescription: string;
  responsibilities: string[];
  requirementsDescription: string;
  requirements: string[];
  preferredQualifications: string[];
  hiringProcess: { step: number; title: string; description: string }[];
}

export const careersData: Career[] = [
 {
  id: '1',
  title: 'Account Executive',
  category: 'Sales',
  location: 'Islamabad',
  type: 'Full time',
  slug: 'account-executive',
  description: 'Drive revenue growth by building strategic client relationships, identifying new business opportunities, and delivering tailored solutions that create measurable business value.',
  department: 'Sales',
  experience: '3+ Years',
  workMode: 'On-site',

  overview: 'We are seeking an ambitious Account Executive to accelerate business growth by acquiring new clients, expanding existing accounts, and delivering consultative sales solutions. You will work closely with prospects and customers to understand their business challenges, recommend suitable products and services, and build long term partnerships that drive customer success.',

  responsibilitiesDescription: 'As an Account Executive, you will be responsible for managing the entire sales lifecycle while consistently achieving revenue and customer acquisition goals.',

  responsibilities: [
    'Identify, qualify, and convert new business opportunities through outbound prospecting, referrals, and inbound leads.',
    'Manage the complete sales cycle from lead generation and discovery to negotiation and deal closure.',
    'Build and maintain long term relationships with clients to maximize retention and account growth.',
    'Conduct product presentations, solution demonstrations, and client meetings to showcase business value.',
    'Prepare proposals, quotations, contracts, and sales documentation accurately and professionally.',
    'Maintain an organized sales pipeline and forecast opportunities using CRM platforms.',
    'Collaborate with marketing, customer success, and technical teams to deliver tailored client solutions.',
    'Achieve monthly, quarterly, and annual sales targets while maintaining high customer satisfaction.',
    'Monitor industry trends, competitor activities, and market opportunities to identify new business prospects.',
    'Represent the company at client meetings, networking events, exhibitions, and industry conferences when required.'
  ],

  requirementsDescription: 'Successful candidates should possess strong sales expertise, excellent relationship management skills, and the ability to thrive in a target driven environment.',

  requirements: [
    '3+ years of professional experience in B2B sales, account management, or business development.',
    'Excellent communication, presentation, negotiation, and relationship building skills.',
    'Proven track record of consistently achieving or exceeding sales targets.',
    'Experience using CRM platforms such as Salesforce, HubSpot, Zoho CRM, or similar tools.',
    'Strong understanding of consultative and solution based selling methodologies.',
    'Ability to identify customer pain points and recommend value driven solutions.',
    'Excellent time management, organizational, and pipeline management skills.',
    'Ability to prepare sales proposals, quotations, and commercial agreements.',
    'Strong analytical and problem solving abilities.',
    'Proficiency in Microsoft Office and sales productivity tools.'
  ],

  preferredQualifications: [
    'Experience selling SaaS, software, IT services, or technology solutions.',
    'Established network of corporate or enterprise decision makers.',
    'Bachelor’s degree in Business Administration, Marketing, Sales, or a related field.',
    'Experience with enterprise sales, account expansion, and strategic account management.',
    'Knowledge of sales forecasting, market analysis, and revenue planning.',
    'Experience working in a fast paced, target driven sales environment.'
  ],

  hiringProcess: [
    {
      step: 1,
      title: 'Application Review',
      description: 'Our recruitment team reviews your resume, sales achievements, and relevant industry experience.'
    },
    {
      step: 2,
      title: 'Recruiter Screening',
      description: 'A discussion covering your professional background, communication skills, sales experience, and career aspirations.'
    },
    {
      step: 3,
      title: 'Sales Assessment',
      description: 'Participate in a practical sales interview involving prospect discovery, objection handling, negotiation, and solution presentation.'
    },
    {
      step: 4,
      title: 'Final Interview',
      description: 'Meet with sales leadership to discuss your experience, business development strategy, and long term growth within the organization.'
    }
  ]
},
{
  id: '2',
  title: 'React Native Developer',
  category: 'frontend',
  location: 'Islamabad',
  type: 'Full time',
  slug: 'react-native-developer',
  description: 'Develop scalable, high performance cross platform mobile applications using React Native, delivering seamless user experiences across iOS and Android devices.',
  department: 'Engineering',
  experience: '2-4 Years',
  workMode: 'Hybrid',

  overview: 'We are seeking a talented React Native Developer to build and maintain modern mobile applications for iOS and Android. You will collaborate with product managers, designers, backend engineers, and QA teams to develop feature rich, responsive, and scalable applications while following modern mobile development best practices.',

  responsibilitiesDescription: 'As a React Native Developer, you will be responsible for designing, developing, testing, and maintaining production ready mobile applications with a strong focus on performance, usability, and code quality.',

  responsibilities: [
    'Develop and maintain cross platform mobile applications using React Native and TypeScript.',
    'Build reusable, modular, and maintainable components following industry best practices.',
    'Integrate RESTful APIs, GraphQL services, Firebase, and third party SDKs.',
    'Collaborate with UI/UX designers to implement responsive and pixel perfect user interfaces.',
    'Manage application state using Redux, Context API, Zustand, or React Query.',
    'Optimize application performance, startup time, memory usage, and rendering efficiency.',
    'Debug, troubleshoot, and resolve application issues across Android and iOS platforms.',
    'Write clean, well documented, and testable code with unit and integration tests.',
    'Implement push notifications, authentication, offline storage, and secure data handling.',
    'Participate in code reviews, sprint planning, and Agile software development processes.'
  ],

  requirementsDescription: 'Successful candidates should have solid React Native development experience and a strong understanding of modern mobile application architecture.',

  requirements: [
    '2 to 4 years of professional experience developing mobile applications with React Native.',
    'Strong proficiency in JavaScript, TypeScript, React, and React Native.',
    'Experience integrating REST APIs, GraphQL APIs, and Firebase services.',
    'Hands on experience with state management libraries such as Redux, Context API, Zustand, or React Query.',
    'Knowledge of mobile application lifecycle, navigation, and performance optimization.',
    'Experience using Git and collaborative development workflows.',
    'Understanding of responsive design, accessibility, and platform specific UI guidelines.',
    'Experience implementing authentication using JWT, OAuth, or Firebase Authentication.',
    'Ability to write clean, maintainable, and scalable code.',
    'Strong debugging, analytical, and problem solving skills.'
  ],

  preferredQualifications: [
    'Experience publishing applications to the Apple App Store and Google Play Store.',
    'Knowledge of native Android development with Kotlin or iOS development with Swift.',
    'Experience with Firebase Cloud Messaging, Crashlytics, Analytics, and Remote Config.',
    'Familiarity with Expo, React Navigation, and native module integration.',
    'Experience with CI/CD pipelines, Fastlane, GitHub Actions, or Bitrise.',
    'Knowledge of automated testing using Jest, React Native Testing Library, or Detox.'
  ],

  hiringProcess: [
    {
      step: 1,
      title: 'Application Review',
      description: 'Our recruitment team reviews your resume, portfolio, and previous mobile application development experience.'
    },
    {
      step: 2,
      title: 'Technical Interview',
      description: 'Discussion covering React Native, TypeScript, mobile architecture, state management, API integration, and performance optimization.'
    },
    {
      step: 3,
      title: 'Technical Assessment',
      description: 'Complete a practical React Native coding assignment involving UI implementation, API integration, and application architecture.'
    },
    {
      step: 4,
      title: 'Final Interview',
      description: 'Meet with engineering leadership to discuss technical expertise, collaboration, and long term career growth.'
    }
  ]
},
  {
  id: '3',
  title: 'Flutter Developer',
  category: 'frontend',
  location: 'Islamabad',
  type: 'Full time',
  slug: 'flutter-developer',
  description: 'Develop high performance, scalable, and cross platform mobile applications for iOS and Android using Flutter and Dart.',
  department: 'Mobile Engineering',
  experience: '3+ Years',
  workMode: 'On-site',
  overview: 'We are looking for a skilled Flutter Developer to build and maintain modern mobile applications with a strong focus on performance, usability, and clean architecture. You will collaborate with designers, backend engineers, and product teams to deliver reliable, scalable, and user friendly mobile experiences.',

  responsibilitiesDescription: 'As a Flutter Developer, you will be responsible for designing, developing, and maintaining production ready mobile applications while ensuring high quality code and excellent user experience.',

  responsibilities: [
    'Design, develop, test, and maintain high quality Flutter applications for iOS and Android.',
    'Build reusable, maintainable, and scalable application architecture following Flutter best practices.',
    'Collaborate with UI/UX designers, backend developers, and product managers to deliver new features.',
    'Integrate RESTful APIs, Firebase services, and third party SDKs.',
    'Implement responsive UI components with pixel perfect designs.',
    'Manage application state using Provider, Riverpod, BLoC, or similar state management solutions.',
    'Write clean, well documented, and testable Dart code.',
    'Perform debugging, bug fixing, and performance optimization.',
    'Ensure application security, stability, and compatibility across multiple devices.',
    'Participate in code reviews, sprint planning, and Agile development processes.'
  ],

  requirementsDescription: 'Successful candidates should possess strong Flutter development experience and a solid understanding of modern mobile application architecture.',

  requirements: [
    '3+ years of professional experience in Flutter application development.',
    'Strong proficiency in Dart and Flutter SDK.',
    'Experience integrating REST APIs, GraphQL, or Firebase services.',
    'Hands on experience with state management solutions such as Provider, Riverpod, or BLoC.',
    'Strong understanding of mobile UI principles, animations, and responsive layouts.',
    'Experience with Git and collaborative development workflows.',
    'Knowledge of dependency injection, clean architecture, and design patterns.',
    'Understanding of mobile application lifecycle, performance optimization, and memory management.',
    'Experience writing unit, widget, and integration tests.',
    'Strong analytical, debugging, and problem solving skills.'
  ],

  preferredQualifications: [
    'Experience publishing applications to Google Play Store and Apple App Store.',
    'Knowledge of native Android (Kotlin) or iOS (Swift) development.',
    'Experience with CI/CD pipelines for Flutter applications.',
    'Experience with Firebase Authentication, Firestore, Cloud Messaging, and Analytics.',
    'Familiarity with offline storage solutions such as Hive or SQLite.',
    'Knowledge of secure authentication methods including OAuth and JWT.'
  ],

  hiringProcess: [
    {
      step: 1,
      title: 'Application Review',
      description: 'Our recruitment team reviews your resume, portfolio, and published mobile applications.'
    },
    {
      step: 2,
      title: 'Technical Interview',
      description: 'Discussion covering Flutter, Dart, state management, architecture, and mobile development best practices.'
    },
    {
      step: 3,
      title: 'Technical Assessment',
      description: 'Complete a practical coding task involving UI implementation, API integration, or application architecture.'
    },
    {
      step: 4,
      title: 'Final Interview',
      description: 'Meet with the engineering leadership to discuss technical expertise, collaboration, and overall team fit.'
    }
  ]
},
 {
  id: '4',
  title: 'NodeJS Developer',
  category: 'backend',
  location: 'Islamabad',
  type: 'Full time',
  slug: 'nodejs-developer',
  description: 'Build scalable, secure, and high performance backend applications, APIs, and microservices using Node.js, TypeScript, and modern backend technologies.',
  department: 'Engineering',
  experience: '3-5 Years',
  workMode: 'Hybrid',

  overview: 'We are looking for an experienced Node.js Developer to design, develop, and maintain scalable backend systems that power our web and mobile applications. You will work closely with frontend developers, DevOps engineers, and product teams to build secure, reliable, and high availability services while following modern software engineering best practices.',

  responsibilitiesDescription: 'As a Node.js Developer, you will be responsible for developing backend services, designing scalable architectures, and ensuring application performance, security, and reliability.',

  responsibilities: [
    'Design, develop, and maintain scalable RESTful APIs and backend services using Node.js and TypeScript.',
    'Build modular, reusable, and maintainable server side applications following clean architecture principles.',
    'Develop microservices and integrate them with internal and third party services.',
    'Collaborate with frontend developers to integrate user facing applications with backend APIs.',
    'Design efficient database schemas and optimize complex SQL and NoSQL queries.',
    'Implement authentication, authorization, and security best practices using JWT, OAuth, and role based access control.',
    'Write clean, well documented, and testable code with comprehensive unit and integration tests.',
    'Optimize application performance, scalability, and server resource utilization.',
    'Troubleshoot production issues, monitor system health, and resolve performance bottlenecks.',
    'Participate in Agile ceremonies, code reviews, and technical architecture discussions.'
  ],

  requirementsDescription: 'Candidates should have strong backend development experience with Node.js and modern server side technologies.',

  requirements: [
    '3 to 5 years of professional experience in Node.js backend development.',
    'Strong proficiency in JavaScript and TypeScript.',
    'Hands on experience with Express.js, NestJS, or similar backend frameworks.',
    'Solid understanding of asynchronous programming, event driven architecture, and the Node.js event loop.',
    'Experience designing and consuming RESTful APIs and GraphQL services.',
    'Strong knowledge of relational databases such as PostgreSQL or MySQL and NoSQL databases such as MongoDB.',
    'Experience using ORM libraries such as Prisma, TypeORM, Sequelize, or Mongoose.',
    'Understanding of authentication, authorization, API security, and data protection best practices.',
    'Experience with Git, automated testing, and CI/CD workflows.',
    'Strong debugging, analytical, and problem solving skills.'
  ],

  preferredQualifications: [
    'Experience with Docker, Kubernetes, and containerized deployments.',
    'Knowledge of cloud platforms including AWS, Google Cloud Platform, or Microsoft Azure.',
    'Experience working with Redis, RabbitMQ, Kafka, or other messaging systems.',
    'Understanding of microservices architecture and distributed systems.',
    'Experience with monitoring tools such as Prometheus, Grafana, or ELK Stack.',
    'Knowledge of serverless architectures and cloud native development.'
  ],

  hiringProcess: [
    {
      step: 1,
      title: 'Application Review',
      description: 'Our recruitment team reviews your resume, backend project experience, and technical background.'
    },
    {
      step: 2,
      title: 'Technical Interview',
      description: 'Discussion covering Node.js, TypeScript, backend architecture, databases, APIs, and security best practices.'
    },
    {
      step: 3,
      title: 'Technical Assessment',
      description: 'Complete a practical backend coding assignment involving API development, database design, or system architecture.'
    },
    {
      step: 4,
      title: 'Final Interview',
      description: 'Meet with engineering leadership to discuss technical expertise, collaboration, and long term growth opportunities.'
    }
  ]
},
 {
  id: '5',
  title: 'Shopify Developer',
  category: 'frontend',
  location: 'Islamabad',
  type: 'Full time',
  slug: 'shopify-developer',
  description: 'Build high performance, conversion focused Shopify stores, custom themes, and scalable e-commerce solutions using modern Shopify technologies.',
  department: 'E-commerce',
  experience: '2+ Years',
  workMode: 'On-site',

  overview: 'We are looking for a talented Shopify Developer to design, develop, and maintain custom Shopify stores for global brands. You will work closely with designers, marketers, and backend developers to deliver fast, responsive, and scalable e-commerce experiences that maximize performance, usability, and conversions.',

  responsibilitiesDescription: 'As a Shopify Developer, you will be responsible for building and optimizing Shopify storefronts while ensuring exceptional user experience, maintainability, and performance.',

  responsibilities: [
    'Develop custom Shopify themes from scratch using Liquid, HTML, CSS, and JavaScript.',
    'Customize existing Shopify themes to meet client requirements and branding guidelines.',
    'Build responsive, mobile first, and cross browser compatible storefronts.',
    'Integrate third party applications, payment gateways, and external APIs.',
    'Develop custom Shopify sections, templates, snippets, and reusable components.',
    'Optimize website speed, Core Web Vitals, and overall storefront performance.',
    'Collaborate with UI/UX designers to implement pixel perfect and conversion focused interfaces.',
    'Implement Shopify best practices for SEO, accessibility, and user experience.',
    'Troubleshoot bugs, maintain existing stores, and deploy new features.',
    'Participate in code reviews, sprint planning, and Agile development processes.'
  ],

  requirementsDescription: 'Candidates should have strong Shopify development experience and a solid understanding of modern frontend technologies and e-commerce best practices.',

  requirements: [
    '2+ years of professional experience in Shopify development.',
    'Strong expertise in Shopify Liquid templating language.',
    'Proficiency in HTML5, CSS3, JavaScript, and responsive web development.',
    'Experience building custom Shopify themes and modifying existing themes.',
    'Hands on experience integrating Shopify Apps, REST APIs, and GraphQL APIs.',
    'Knowledge of Shopify Online Store 2.0 architecture and theme customization.',
    'Understanding of Git version control and collaborative development workflows.',
    'Experience optimizing website performance, SEO, and accessibility.',
    'Strong debugging and problem solving skills.',
    'Excellent communication and teamwork abilities.'
  ],

  preferredQualifications: [
    'Experience with Shopify Hydrogen, Remix, or Next.js for headless commerce.',
    'Knowledge of Shopify Storefront API and Admin API.',
    'Experience with Shopify Functions, Flow, and Checkout Extensibility.',
    'Understanding of conversion rate optimization and e-commerce analytics.',
    'Familiarity with Google Analytics, Google Tag Manager, and Meta Pixel integration.',
    'Basic knowledge of React and modern JavaScript frameworks.'
  ],

  hiringProcess: [
    {
      step: 1,
      title: 'Application Review',
      description: 'Our recruitment team reviews your resume, Shopify portfolio, and previous e-commerce projects.'
    },
    {
      step: 2,
      title: 'Technical Interview',
      description: 'Discussion covering Shopify architecture, Liquid, JavaScript, performance optimization, and theme development.'
    },
    {
      step: 3,
      title: 'Technical Assessment',
      description: 'Complete a practical Shopify development task involving custom theme implementation or feature development.'
    },
    {
      step: 4,
      title: 'Final Interview',
      description: 'Meet with the E-commerce and Engineering teams to discuss technical expertise, collaboration, and career growth.'
    }
  ]
},
  {
  id: '6',
  title: 'UI UX Designer',
  category: 'other',
  location: 'Remote',
  type: 'Full time',
  slug: 'ui-ux-designer',
  description: 'Design intuitive, user centered digital experiences for web and mobile applications through research, wireframing, prototyping, and modern interface design.',
  department: 'Design',
  experience: '4+ Years',
  workMode: 'Remote',

  overview: 'We are seeking an experienced UI/UX Designer to create engaging, accessible, and visually appealing digital products. You will collaborate with product managers, developers, and stakeholders to transform business requirements and user insights into intuitive user experiences that improve usability, engagement, and customer satisfaction.',

  responsibilitiesDescription: 'As a UI/UX Designer, you will lead the design process from research to implementation while ensuring consistency, usability, and exceptional user experiences across all digital products.',

  responsibilities: [
    'Conduct user research, stakeholder interviews, and competitive analysis to understand user needs and business objectives.',
    'Create user personas, customer journey maps, user flows, and information architecture.',
    'Design wireframes, mockups, interactive prototypes, and high fidelity user interfaces.',
    'Build and maintain scalable design systems and reusable UI components.',
    'Collaborate closely with product managers and developers throughout the product lifecycle.',
    'Design responsive interfaces for desktop, tablet, and mobile devices.',
    'Validate design decisions through usability testing and user feedback.',
    'Ensure accessibility standards and UX best practices are followed across all products.',
    'Work with developers during implementation to maintain design consistency.',
    'Continuously improve existing products based on analytics, customer feedback, and usability insights.'
  ],

  requirementsDescription: 'Successful candidates should possess strong UI and UX design expertise with experience delivering user focused digital products.',

  requirements: [
    '4+ years of professional experience as a UI/UX Designer or Product Designer.',
    'Strong portfolio demonstrating web and mobile application design projects.',
    'Expert proficiency with Figma and modern design tools.',
    'Experience creating wireframes, prototypes, user flows, and design systems.',
    'Strong understanding of typography, color theory, layout, spacing, and visual hierarchy.',
    'Knowledge of user centered design principles and usability best practices.',
    'Experience conducting user research, usability testing, and design validation.',
    'Understanding of responsive design and accessibility standards.',
    'Ability to collaborate effectively with developers and cross functional teams.',
    'Excellent communication, presentation, and problem solving skills.'
  ],

  preferredQualifications: [
    'Experience designing SaaS, enterprise, or B2B applications.',
    'Knowledge of HTML, CSS, and frontend development principles.',
    'Experience with design systems and component based design workflows.',
    'Familiarity with motion design, micro interactions, and animation tools.',
    'Understanding of product analytics tools such as Hotjar, Google Analytics, or Mixpanel.',
    'Experience working in Agile or Scrum development environments.'
  ],

  hiringProcess: [
    {
      step: 1,
      title: 'Application Review',
      description: 'Our design team reviews your resume, portfolio, and previous product design experience.'
    },
    {
      step: 2,
      title: 'Design Interview',
      description: 'Discussion covering your design process, user research methods, design systems, and problem solving approach.'
    },
    {
      step: 3,
      title: 'Design Assessment',
      description: 'Complete a practical design challenge involving user flows, wireframes, and high fidelity interface design using Figma.'
    },
    {
      step: 4,
      title: 'Final Interview',
      description: 'Meet with product and design leadership to discuss collaboration, design thinking, and long term career growth.'
    }
  ]
}
];

export const getCareerBySlug = (slug: string): Career | undefined => {
  return careersData.find(career => career.slug === slug);
};