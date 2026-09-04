export const serviceSolutionSlugs = [
  "custom-software",
  "web-applications",
  "mobile-applications",
  "crm-erp",
  "business-automation",
  "ai-solutions",
  "system-integration",
  "legacy-modernization",
  "saas",
  "databases-data-science",
] as const;

export type ServiceSolutionSlug = (typeof serviceSolutionSlugs)[number];

export type ServiceSolutionIcon =
  | "blocks"
  | "browser"
  | "mobile"
  | "database"
  | "workflow"
  | "sparkles"
  | "network"
  | "refresh";

export type ServiceSolutionCapability = Readonly<{
  title: string;
  description: string;
}>;

export type ServiceTechnologyOption = Readonly<{
  technologyId: TechnologyId;
  fit: string;
}>;

export type ServiceImplementationOption = Readonly<{
  title: string;
  bestFor: string;
  description: string;
  technologyIds: readonly TechnologyId[];
}>;

export type ServiceProblemSolution = Readonly<{
  problemId: BusinessProblemId;
  solution: string;
}>;

export type ServiceUseCase = Readonly<{
  title: string;
  description: string;
}>;

export type ServiceSolutionOutcome = Readonly<{
  title: string;
  description: string;
}>;

export type ServiceSolutionStep = Readonly<{
  title: string;
  description: string;
}>;

export type ServiceSolution = Readonly<{
  slug: ServiceSolutionSlug;
  title: string;
  heroImage?: Readonly<{
    src: string;
    alt: string;
  }>;
  summary: string;
  heroStatement: string;
  icon: ServiceSolutionIcon;
  challenge: Readonly<{
    title: string;
    description: string;
  }>;
  capabilities: readonly ServiceSolutionCapability[];
  technologyOptions: readonly ServiceTechnologyOption[];
  implementationOptions: readonly ServiceImplementationOption[];
  problemSolutions: readonly ServiceProblemSolution[];
  useCases: readonly ServiceUseCase[];
  outcomes: readonly ServiceSolutionOutcome[];
  delivery: readonly [
    ServiceSolutionStep,
    ServiceSolutionStep,
    ServiceSolutionStep,
  ];
  related: readonly [
    ServiceSolutionSlug,
    ServiceSolutionSlug,
    ServiceSolutionSlug,
  ];
}>;

type ServiceSolutionBase = Omit<
  ServiceSolution,
  "technologyOptions" | "implementationOptions" | "problemSolutions" | "useCases"
>;

type ServiceSolutionExpansion = Pick<
  ServiceSolution,
  "technologyOptions" | "implementationOptions" | "problemSolutions" | "useCases"
>;

const serviceSolutionBase = [
  {
    slug: "custom-software",
    title: "Custom Software",
    heroImage: {
      src: "/images/services/customsoftware.png",
      alt: "Custom Software illustration",
    },
    summary:
      "Purpose-built software engineered around your business processes, operational goals, teams, customers, and long-term growth strategy.",
    heroStatement:
      "Replace disconnected tools, manual workarounds, and restrictive off-the-shelf platforms with software designed specifically around the way your business operates.",
    icon: "blocks",
    challenge: {
      title: "Your business should define the software, not adapt itself around it.",
      description:
        "Generic platforms often force growing businesses into rigid workflows, fragmented processes, unnecessary subscriptions, and manual workarounds. We design custom software around your actual operating model, giving your teams a centralized platform that supports current processes while remaining flexible enough to evolve as your business grows.",
    },
    capabilities: [
      {
        title: "Custom business platforms",
        description:
          "Design centralized applications for managing complex business processes, users, permissions, data, reporting, approvals, and operational workflows.",
      },
      {
        title: "Internal business tools",
        description:
          "Replace spreadsheets, disconnected databases, repetitive administration, and manual coordination with secure applications built specifically for your teams.",
      },
      {
        title: "Customer and partner portals",
        description:
          "Provide customers, vendors, and partners with secure self-service access to accounts, documents, orders, requests, services, payments, and business information.",
      },
      {
        title: "Digital product engineering",
        description:
          "Transform a product concept into a scalable digital platform through architecture, UX design, frontend development, backend engineering, APIs, infrastructure, testing, and continuous improvement.",
      },
    ],
    outcomes: [
      {
        title: "Software aligned with your operation",
        description:
          "Your teams work inside a platform designed around their responsibilities, processes, terminology, permissions, and day-to-day decisions.",
      },
      {
        title: "Higher operational efficiency",
        description:
          "Centralized workflows reduce repetitive administration, fragmented communication, duplicated information, and unnecessary manual coordination.",
      },
      {
        title: "A scalable digital foundation",
        description:
          "Modular architecture gives your business a maintainable foundation for adding new workflows, integrations, users, products, and capabilities over time.",
      },
    ],
    delivery: [
      {
        title: "Discover and define",
        description:
          "We analyze your users, workflows, business rules, technical environment, pain points, integrations, priorities, and measurable objectives before defining the product roadmap.",
      },
      {
        title: "Design and build",
        description:
          "We convert validated requirements into intuitive interfaces, reliable architecture, secure APIs, scalable infrastructure, and production-ready product capabilities.",
      },
      {
        title: "Launch and evolve",
        description:
          "We support deployment, adoption, monitoring, optimization, and continuous development so the software keeps delivering value as your requirements change.",
      },
    ],
    related: ["web-applications", "system-integration", "business-automation"],
  },

  {
    slug: "web-applications",
    title: "Web Applications",
    heroImage: {
      src: "/images/services/website.png",
      alt: "Frontend Development - Dev X Webflow Template",
    },
    summary:
      "Fast, scalable, and user-focused web applications built to support customers, teams, transactions, and complex digital workflows.",
    heroStatement:
      "Build a modern browser-based product that combines strong user experience with reliable engineering, scalable architecture, security, and long-term maintainability.",
    icon: "browser",
    challenge: {
      title: "A successful web application must perform as well as it looks.",
      description:
        "Modern users expect responsive interfaces, fast loading, simple navigation, reliable transactions, consistent behavior across devices, and secure access to their information. We combine product design, frontend engineering, backend systems, APIs, databases, and cloud infrastructure to create web applications that remain dependable as traffic, features, and business requirements increase.",
    },
    capabilities: [
      {
        title: "SaaS platforms",
        description:
          "Build subscription-based platforms with authentication, organizations, role-based access, billing, dashboards, workflows, reporting, notifications, and scalable multi-user architecture.",
      },
      {
        title: "Customer-facing applications",
        description:
          "Create secure portals, marketplaces, booking systems, commerce experiences, account dashboards, service platforms, and other digital customer journeys.",
      },
      {
        title: "Operational applications",
        description:
          "Give internal teams browser-based systems for managing customers, projects, transactions, workflows, resources, documents, reporting, and operational activity.",
      },
      {
        title: "API-driven web products",
        description:
          "Develop modern applications that securely connect frontend experiences with internal services, third-party platforms, databases, payment systems, and external APIs.",
      },
    ],
    outcomes: [
      {
        title: "Better digital experiences",
        description:
          "Clear interfaces and optimized user journeys help customers and employees complete important tasks with fewer unnecessary steps.",
      },
      {
        title: "Reliable performance at scale",
        description:
          "Structured application architecture supports growing traffic, larger datasets, increased user activity, and expanding product functionality.",
      },
      {
        title: "Faster product iteration",
        description:
          "Maintainable components, APIs, and development workflows make future releases easier to build, test, deploy, and improve.",
      },
    ],
    delivery: [
      {
        title: "Define the product experience",
        description:
          "We identify target users, critical journeys, business rules, integrations, content requirements, technical constraints, and success criteria.",
      },
      {
        title: "Design and engineer",
        description:
          "We create responsive interfaces and connect them to secure backend services, databases, APIs, authentication, infrastructure, and third-party systems.",
      },
      {
        title: "Test, deploy, and optimize",
        description:
          "We validate functionality, responsiveness, performance, accessibility, security, and production readiness before deployment and continuous improvement.",
      },
    ],
    related: ["custom-software", "mobile-applications", "system-integration"],
  },

  {
    slug: "mobile-applications",
    title: "Mobile Applications",
    heroImage: {
      src: "/images/services/mobileapp.png",
      alt: "Mobile App Development - Dev X Webflow Template",
    },
    summary:
      "High-performance mobile applications designed around real user behavior, reliable integrations, and the business services people need wherever they are.",
    heroStatement:
      "Turn your product, service, or internal workflow into an intuitive mobile experience engineered for speed, usability, security, and continuous growth.",
    icon: "mobile",
    challenge: {
      title: "Mobile experiences leave little room for unnecessary complexity.",
      description:
        "Users expect applications to feel immediate, intuitive, and reliable regardless of screen size, network quality, platform, or location. We design mobile products around focused user journeys while connecting them securely to backend services, payments, notifications, authentication, analytics, business systems, and real-time data.",
    },
    capabilities: [
      {
        title: "iOS and Android applications",
        description:
          "Build polished mobile experiences for customer services, commerce, communication, productivity, operations, booking, logistics, and digital products.",
      },
      {
        title: "Cross-platform development",
        description:
          "Deliver applications across iOS and Android from a shared development foundation while maintaining responsive layouts and platform-aware behavior.",
      },
      {
        title: "Enterprise and field applications",
        description:
          "Equip employees, field teams, technicians, sales staff, and operations teams with applications for tasks, data collection, approvals, reporting, communication, and remote workflows.",
      },
      {
        title: "Connected mobile capabilities",
        description:
          "Integrate authentication, push notifications, payments, location services, cameras, media, maps, analytics, APIs, offline functionality, and existing business platforms.",
      },
    ],
    outcomes: [
      {
        title: "Services available anywhere",
        description:
          "Customers and employees can access essential workflows without depending on a desktop environment.",
      },
      {
        title: "Higher customer engagement",
        description:
          "Convenient mobile access creates more opportunities for customers to interact with your products, services, accounts, and business.",
      },
      {
        title: "Connected digital experiences",
        description:
          "Your mobile application operates as part of the wider technology ecosystem rather than becoming another isolated system.",
      },
    ],
    delivery: [
      {
        title: "Define the mobile experience",
        description:
          "We identify the mobile use cases, primary users, platform requirements, integrations, device capabilities, and actions that create the most business value.",
      },
      {
        title: "Prototype and engineer",
        description:
          "We validate essential journeys before building interfaces, application logic, APIs, backend services, integrations, and platform-specific capabilities.",
      },
      {
        title: "Test and release",
        description:
          "We test functionality across target devices, optimize performance, prepare production environments, and support App Store, Play Store, or enterprise deployment.",
      },
    ],
    related: ["web-applications", "custom-software", "system-integration"],
  },

  {
    slug: "crm-erp",
    title: "CRM / ERP",
    heroImage: {
      src: "/images/services/backend.png",
      alt: "CRM & ERP illustration",
    },
    summary:
      "Connected CRM and ERP solutions that centralize customer relationships, sales, resources, operations, finance, inventory, and management information.",
    heroStatement:
      "Create a reliable operating system for your business by connecting customer data, operational processes, resources, reporting, and departmental workflows.",
    icon: "database",
    challenge: {
      title: "Disconnected business data creates disconnected decisions.",
      description:
        "When sales, customer service, finance, operations, inventory, and management rely on separate systems, information quickly becomes duplicated, inconsistent, and difficult to trust. We implement, extend, and integrate CRM and ERP solutions around your real workflows so teams can work from shared information and standardized processes.",
    },
    capabilities: [
      {
        title: "CRM implementation",
        description:
          "Centralize leads, contacts, companies, pipelines, communications, activities, opportunities, customer service processes, ownership, and relationship history.",
      },
      {
        title: "ERP development and integration",
        description:
          "Connect purchasing, inventory, resources, operations, finance, order management, vendors, projects, fulfillment, and other core business processes.",
      },
      {
        title: "Custom CRM and ERP extensions",
        description:
          "Develop additional modules, workflows, dashboards, integrations, and automation when standard platform functionality does not fully support your operation.",
      },
      {
        title: "Reporting and business intelligence",
        description:
          "Create centralized dashboards and structured reporting that give teams and management a clearer view of sales, operations, performance, and business activity.",
      },
    ],
    outcomes: [
      {
        title: "One source of business information",
        description:
          "Customer, operational, and financial data becomes easier to access, maintain, reconcile, and use across departments.",
      },
      {
        title: "Consistent operational workflows",
        description:
          "Standardized processes create clearer ownership, fewer manual handoffs, and more predictable execution across the organization.",
      },
      {
        title: "Stronger management visibility",
        description:
          "Connected data gives leadership more dependable insight into performance, workload, customers, resources, and operational bottlenecks.",
      },
    ],
    delivery: [
      {
        title: "Map processes and data",
        description:
          "We analyze departments, records, workflows, reporting requirements, integrations, ownership, bottlenecks, and business rules.",
      },
      {
        title: "Configure, customize, and integrate",
        description:
          "We implement the required platform capabilities, custom modules, APIs, automation, permissions, dashboards, and system integrations.",
      },
      {
        title: "Migrate and roll out",
        description:
          "We validate data, support migration, test business-critical processes, prepare users, and roll out the platform with a controlled transition plan.",
      },
    ],
    related: ["system-integration", "business-automation", "legacy-modernization"],
  },

  {
    slug: "business-automation",
    title: "Business Automation",
    heroImage: {
      src: "/images/services/Businessautomation.png",
      alt: "Business Automation illustration",
    },
    summary:
      "Automate repetitive business processes, approvals, data movement, notifications, reporting, and system updates without losing operational control.",
    heroStatement:
      "Reduce manual effort by turning repeatable business processes into reliable digital workflows that keep teams, customers, and systems synchronized.",
    icon: "workflow",
    challenge: {
      title: "Manual processes become more expensive as your business scales.",
      description:
        "Repeated data entry, approval chasing, spreadsheet updates, status requests, manual notifications, and cross-system copying consume productive time and introduce unnecessary errors. We identify the processes where automation creates measurable operational value, then implement workflows with clear triggers, validation, ownership, exception handling, and visibility.",
    },
    capabilities: [
      {
        title: "Workflow automation",
        description:
          "Automate requests, approvals, assignments, escalations, routing, status changes, document handling, and recurring operational processes.",
      },
      {
        title: "Sales and CRM automation",
        description:
          "Automate lead distribution, follow-ups, pipeline updates, customer communication, onboarding steps, reminders, and service workflows.",
      },
      {
        title: "Data and reporting automation",
        description:
          "Automatically collect, transform, synchronize, generate, and distribute operational information across systems and stakeholders.",
      },
      {
        title: "Cross-system automation",
        description:
          "Connect applications so events in one platform can trigger actions, updates, notifications, or workflows across other business systems.",
      },
    ],
    outcomes: [
      {
        title: "Lower operational workload",
        description:
          "Routine administrative work moves automatically, reducing the amount of repetitive coordination required from your teams.",
      },
      {
        title: "More consistent execution",
        description:
          "Defined triggers, rules, approvals, and checkpoints create predictable processes and reduce avoidable human error.",
      },
      {
        title: "Faster business processes",
        description:
          "Automated routing and system communication reduce delays between departments, platforms, approvals, and customer interactions.",
      },
    ],
    delivery: [
      {
        title: "Identify automation opportunities",
        description:
          "We analyze repetitive work, process volume, decision rules, dependencies, exceptions, systems, manual effort, and potential business impact.",
      },
      {
        title: "Build controlled workflows",
        description:
          "We automate the selected process with reliable triggers, business rules, permissions, integrations, auditability, notifications, and recovery paths.",
      },
      {
        title: "Measure and improve",
        description:
          "We monitor execution, identify exceptions, evaluate operational impact, and refine workflows as your processes and requirements evolve.",
      },
    ],
    related: ["custom-software", "crm-erp", "ai-solutions"],
  },

  {
    slug: "ai-solutions",
    title: "AI Solutions",
    heroImage: {
      src: "/images/services/ai.png",
      alt: "AI & Machine Learning - Dev X Webflow Template",
    },
    summary:
      "Business-focused AI solutions that improve access to information, automate knowledge-intensive work, support decisions, and introduce intelligent capabilities into existing products.",
    heroStatement:
      "Turn AI from an experiment into a useful business capability by connecting the right models, data, workflows, integrations, and human oversight.",
    icon: "sparkles",
    challenge: {
      title: "AI delivers value when it solves a specific business problem.",
      description:
        "Adding a model without clear data boundaries, workflow integration, evaluation, monitoring, and human oversight often creates unreliable results. We begin with the business process and determine where AI can improve speed, access to information, decision support, content processing, customer experience, or operational efficiency.",
    },
    capabilities: [
      {
        title: "AI assistants and copilots",
        description:
          "Build internal or customer-facing assistants that can retrieve approved information, answer questions, support tasks, and interact with business systems.",
      },
      {
        title: "Document intelligence",
        description:
          "Extract, classify, summarize, validate, search, and organize information from contracts, reports, forms, invoices, applications, and other business documents.",
      },
      {
        title: "AI workflow automation",
        description:
          "Combine language models, business rules, APIs, and human review to automate defined parts of operational and knowledge-based workflows.",
      },
      {
        title: "AI-powered product features",
        description:
          "Introduce search, recommendations, content generation, summarization, analysis, classification, conversational interfaces, and intelligent assistance into existing software products.",
      },
    ],
    outcomes: [
      {
        title: "Faster access to knowledge",
        description:
          "Employees and customers can retrieve relevant information from approved sources without manually searching across multiple systems.",
      },
      {
        title: "Higher productivity",
        description:
          "AI can reduce the time required for repetitive research, summarization, document processing, information retrieval, and structured content tasks.",
      },
      {
        title: "Controlled AI adoption",
        description:
          "Defined permissions, evaluation criteria, human review, logging, feedback, and monitoring make AI capabilities easier to manage responsibly.",
      },
    ],
    delivery: [
      {
        title: "Validate the use case",
        description:
          "We define the business problem, users, data sources, expected outputs, risks, quality requirements, integrations, and measurable success criteria.",
      },
      {
        title: "Prototype and evaluate",
        description:
          "We test model behavior, retrieval quality, prompts, data access, workflows, security boundaries, human oversight, and integration feasibility.",
      },
      {
        title: "Deploy and monitor",
        description:
          "We integrate the AI capability into production workflows with observability, evaluation, usage controls, feedback mechanisms, and continuous optimization.",
      },
    ],
    related: ["business-automation", "custom-software", "system-integration"],
  },

  {
    slug: "system-integration",
    title: "System Integration",
    heroImage: {
      src: "/images/services/systemintegration.png",
      alt: "Connected cloud, database, application, and server systems",
    },
    summary:
      "Secure system integrations that connect applications, APIs, databases, cloud platforms, CRM, ERP, payments, accounting, and operational tools.",
    heroStatement:
      "Create one connected technology ecosystem where business data moves reliably between the systems your customers, teams, and operations depend on.",
    icon: "network",
    challenge: {
      title: "Disconnected systems create duplicated work and unreliable information.",
      description:
        "When platforms cannot communicate effectively, employees copy information manually, customers receive inconsistent updates, data becomes fragmented, and simple workflows require constant intervention. We design secure integration layers that define how systems exchange information, handle failures, synchronize records, authenticate requests, and remain observable in production.",
    },
    capabilities: [
      {
        title: "API development and integration",
        description:
          "Design, build, consume, and maintain APIs that securely connect internal applications, third-party platforms, mobile products, partner systems, and external services.",
      },
      {
        title: "CRM and ERP integration",
        description:
          "Synchronize customer, sales, inventory, order, operational, financial, and resource data between CRM, ERP, ecommerce, support, and internal systems.",
      },
      {
        title: "Payment and financial integration",
        description:
          "Connect payment gateways, subscription systems, invoicing platforms, accounting tools, transaction services, and financial workflows.",
      },
      {
        title: "Data synchronization",
        description:
          "Implement reliable real-time or scheduled synchronization with validation, transformation, conflict handling, retries, monitoring, and clearly defined data ownership.",
      },
    ],
    outcomes: [
      {
        title: "Connected business operations",
        description:
          "Information moves automatically between platforms as part of the workflow rather than requiring employees to transfer it manually.",
      },
      {
        title: "More reliable business data",
        description:
          "Defined sources of truth, validation rules, and synchronization logic reduce duplicated, outdated, and conflicting information.",
      },
      {
        title: "Maintainable integrations",
        description:
          "Monitoring, logging, retries, documentation, and failure handling make integrations easier to diagnose, support, and extend.",
      },
    ],
    delivery: [
      {
        title: "Map systems and data flows",
        description:
          "We identify applications, APIs, records, events, authentication methods, business rules, data ownership, dependencies, transformation requirements, and failure scenarios.",
      },
      {
        title: "Design and connect",
        description:
          "We build secure integration services with validation, authentication, transformation, retries, logging, observability, and controlled access.",
      },
      {
        title: "Monitor and maintain",
        description:
          "We establish testing, alerting, documentation, support procedures, performance monitoring, and recovery processes for reliable long-term operation.",
      },
    ],
    related: ["crm-erp", "business-automation", "legacy-modernization"],
  },

  {
    slug: "legacy-modernization",
    title: "Legacy Modernization",
    heroImage: {
      src: "/images/services/legecymodernization.png",
      alt: "Legacy Modernization illustration",
    },
    summary:
      "Modernize aging applications, infrastructure, architecture, and data without unnecessarily disrupting the business processes that still depend on them.",
    heroStatement:
      "Transform difficult-to-maintain legacy systems into secure, scalable, and adaptable platforms through a controlled modernization strategy.",
    icon: "refresh",
    challenge: {
      title: "Legacy systems often contain critical business value and growing technical risk.",
      description:
        "Older applications can become expensive to maintain, difficult to integrate, slow to change, dependent on outdated technologies, and increasingly vulnerable to reliability or security problems. Replacing everything at once can create even greater operational risk. We modernize systems incrementally, protecting critical business workflows while improving architecture, infrastructure, performance, maintainability, security, and developer productivity.",
    },
    capabilities: [
      {
        title: "Legacy application assessment",
        description:
          "Evaluate architecture, codebase health, dependencies, infrastructure, integrations, security exposure, data structures, performance constraints, operational importance, and modernization risk.",
      },
      {
        title: "Application reengineering",
        description:
          "Refactor, rebuild, or progressively replace legacy components with maintainable services, modern interfaces, APIs, frameworks, and architectural patterns.",
      },
      {
        title: "Cloud and data migration",
        description:
          "Move applications, databases, files, workloads, and infrastructure through controlled migration stages with validation, rollback planning, and continuity safeguards.",
      },
      {
        title: "Performance and reliability modernization",
        description:
          "Improve slow queries, fragile services, deployment processes, observability, scalability, infrastructure, testing, and operational resilience.",
      },
    ],
    outcomes: [
      {
        title: "Faster future development",
        description:
          "Cleaner architecture and modern development practices reduce the complexity involved in adding features, integrations, and product improvements.",
      },
      {
        title: "Reduced operational risk",
        description:
          "Incremental modernization protects critical workflows while reducing dependence on fragile components, outdated infrastructure, and difficult-to-support technologies.",
      },
      {
        title: "A more sustainable platform",
        description:
          "Modern infrastructure, clearer architecture, automated deployment, better observability, and improved documentation make the system easier to operate and maintain.",
      },
    ],
    delivery: [
      {
        title: "Assess the current platform",
        description:
          "We examine architecture, code, dependencies, infrastructure, integrations, data, users, security concerns, operational requirements, and business-critical functionality.",
      },
      {
        title: "Design the modernization roadmap",
        description:
          "We prioritize changes according to business value, technical risk, dependencies, migration complexity, continuity requirements, and realistic validation points.",
      },
      {
        title: "Modernize incrementally",
        description:
          "We rebuild, migrate, integrate, test, deploy, and stabilize prioritized components in controlled stages while keeping essential business operations available.",
      },
    ],
    related: ["system-integration", "custom-software", "crm-erp"],
  },

  {
    slug: "saas",
    title: "SaaS Platforms",
    heroImage: {
      src: "/images/services/saas.png",
      alt: "SaaS illustration",
    },
    summary:
      "Scalable, multi-tenant SaaS products designed around your target audience, recurring business model, and operational needs.",
    heroStatement:
      "Transform software concepts into reliable subscription platforms engineered for performance, security, organization management, and user retention.",
    icon: "browser",
    challenge: {
      title:
        "SaaS products require architecture built for multi-tenancy, reliability, and growth.",
      description:
        "Building a successful SaaS application goes beyond basic software development. It demands secure user and organization management, subscription billing, role-based permissions, responsive interfaces, and infrastructure capable of handling expanding tenant bases without performance degradation.",
    },
    capabilities: [
      {
        title: "Multi-tenant architecture",
        description:
          "Engineered data separation, scalable database design, organization management, and secure role-based access control.",
      },
      {
        title: "Subscription & billing systems",
        description:
          "Seamless integration with Stripe or payment gateways for plans, usage metering, automated invoicing, and trial management.",
      },
      {
        title: "User onboarding & dashboards",
        description:
          "Intuitive self-service signups, guided onboarding flows, and actionable admin & customer analytics dashboards.",
      },
      {
        title: "API & integration ecosystem",
        description:
          "RESTful and GraphQL APIs allowing customers and partners to extend your SaaS product into their existing workflows.",
      },
    ],
    outcomes: [
      {
        title: "Accelerated time-to-market",
        description:
          "Launch market-ready SaaS platforms built with proven architecture patterns and reusable components.",
      },
      {
        title: "Predictable scalability",
        description:
          "Cloud infrastructure designed to handle sudden traffic spikes and user growth with consistent uptime.",
      },
      {
        title: "Higher user retention",
        description:
          "Fast performance and polished UX keep subscribers engaged and reduce platform churn.",
      },
    ],
    delivery: [
      {
        title: "Product Strategy & Architecture",
        description:
          "We map tenant structures, feature tiers, subscription models, security boundaries, and core technical requirements.",
      },
      {
        title: "Engineering & Integration",
        description:
          "We build multi-tenant APIs, user interfaces, authentication, billing pipelines, and administrative controls.",
      },
      {
        title: "Launch & Scale",
        description:
          "We deploy to production cloud infrastructure, monitor user activity, optimize performance, and iterate based on real feedback.",
      },
    ],
    related: ["web-applications", "custom-software", "system-integration"],
  },

  {
    slug: "databases-data-science",
    title: "Databases & Data Science",
    heroImage: {
      src: "/images/services/database.png",
      alt: "Databases & Data Science - Dev X Webflow Template",
    },
    summary:
      "Designing secure, high-performance database architectures and transforming business data into actionable analytics and predictive models.",
    heroStatement:
      "Turn raw organizational data into structured intelligence with optimized database design, analytics pipelines, and data-driven insights.",
    icon: "database",
    challenge: {
      title:
        "Data fragmentation and slow queries slow down business growth.",
      description:
        "As datasets grow, unoptimized schemas, inefficient queries, and disconnected data silos lead to sluggish application performance and missed strategic insights. We design reliable data architectures and analytics pipelines that turn complex business data into clear, fast, and actionable intelligence.",
    },
    capabilities: [
      {
        title: "Database design & optimization",
        description:
          "Relational and NoSQL database modeling, index tuning, schema migration, partitioning, and high-availability configuration.",
      },
      {
        title: "Data engineering & pipelines",
        description:
          "ETL/ELT pipeline development, real-time data streaming, warehousing, and cross-system data synchronization.",
      },
      {
        title: "Business intelligence & analytics",
        description:
          "Custom reporting dashboards, operational KPIs, visualization tools, and automated executive reporting.",
      },
      {
        title: "Predictive modeling & ML",
        description:
          "Data science workflows for trend forecasting, customer segmentation, anomaly detection, and predictive analytics.",
      },
    ],
    outcomes: [
      {
        title: "Blazing-fast query performance",
        description:
          "Optimized database structures and indexes reduce query latency and application response times.",
      },
      {
        title: "Unified data visibility",
        description:
          "Centralize scattered business data into coherent warehouses and dashboards for accurate decision-making.",
      },
      {
        title: "Data-driven business decisions",
        description:
          "Leverage predictive insights and analytics to identify operational opportunities and growth channels.",
      },
    ],
    delivery: [
      {
        title: "Data Audit & Architecture",
        description:
          "We evaluate existing databases, data flows, query performance, and analytics goals to design the optimal data strategy.",
      },
      {
        title: "Modeling & Pipeline Engineering",
        description:
          "We structure database schemas, build automated ETL pipelines, configure warehouses, and optimize query engines.",
      },
      {
        title: "Analytics & Continuous Tuning",
        description:
          "We deploy interactive dashboards, integrate data science models, and perform continuous index and performance tuning.",
      },
    ],
    related: ["system-integration", "ai-solutions", "business-automation"],
  },
] as const satisfies readonly ServiceSolutionBase[];

const serviceSolutionExpansions = {
  "custom-software": {
    technologyOptions: [
      { technologyId: "react", fit: "Interactive portals, dashboards, and operational interfaces." },
      { technologyId: "nextjs", fit: "High-performance web products that benefit from a production React framework." },
      { technologyId: "angular", fit: "Structured, feature-rich interfaces for larger application teams." },
      { technologyId: "vue", fit: "Adaptable frontend delivery for evolving product interfaces." },
      { technologyId: "typescript", fit: "Maintainable application code across frontend and service boundaries." },
      { technologyId: "nodejs", fit: "Application APIs, workflow services, and integration layers." },
      { technologyId: "nestjs", fit: "Structured Node.js APIs with clear modules and conventions." },
      { technologyId: "dotnet", fit: "Enterprise services with established Microsoft ecosystems." },
      { technologyId: "laravel", fit: "Modern PHP application framework for customized operational tools and admin portals." },
      { technologyId: "django", fit: "Structured Python framework for rapid backend development and admin tools." },
      { technologyId: "cpp", fit: "Specialized high-performance services and systems work." },
      { technologyId: "python", fit: "Versatile backend language for automation, integrations, background workers, and data processing." },
      { technologyId: "postgresql", fit: "Structured operational data, reporting, and transactional workloads." },
      { technologyId: "mongodb", fit: "Document database for flexible data structures and rapidly evolving business models." },
      { technologyId: "mysql", fit: "Proven relational database system for transactional applications and operational reporting." },
      { technologyId: "firebase", fit: "Realtime backend services, managed authentication, and serverless capabilities." },
      { technologyId: "supabase", fit: "Managed Postgres backend platform with instant APIs, authentication, and realtime subscriptions." },
      { technologyId: "redis", fit: "In-memory caching layer for low-latency queries and real-time operations." },
      { technologyId: "figma", fit: "Collaborative design and user flow mapping before custom software engineering." },
      { technologyId: "make", fit: "Visual workflow automation connecting custom software APIs with enterprise applications." },
      { technologyId: "langchain", fit: "Embedding intelligent LLM agents and contextual search into custom software products." },
    ],
    implementationOptions: [
      { title: "Purpose-built platform", bestFor: "Teams with distinct workflows that off-the-shelf tools cannot support.", description: "Design and engineer a tailored product around roles, approvals, records, reporting, and integrations.", technologyIds: ["react", "nextjs", "nodejs", "postgresql"] },
      { title: "Extend an existing ecosystem", bestFor: "Businesses that need new capabilities without replacing every trusted system.", description: "Add focused modules, APIs, and connected interfaces around the tools your teams already use.", technologyIds: ["dotnet", "nodejs", "postgresql"] },
    ],
    problemSolutions: [
      { problemId: "manual-processes", solution: "Convert repetitive coordination into guided workflows with clear ownership and audit trails." },
      { problemId: "spreadsheet-dependency", solution: "Replace fragile files with structured records, permissions, and shared reporting." },
      { problemId: "scaling-problems", solution: "Create modular foundations that can add users, processes, and integrations as needs grow." },
    ],
    useCases: [
      { title: "Operations hubs", description: "Unify requests, approvals, assignments, documents, and operational reporting." },
      { title: "Self-service portals", description: "Give customers, partners, or employees secure access to the work that concerns them." },
      { title: "Internal product tools", description: "Turn specialist team knowledge into reliable, repeatable software workflows." },
    ],
  },
  "web-applications": {
    technologyOptions: [
      { technologyId: "wordpress", fit: "Content-led websites with an approachable editorial workflow." },
      { technologyId: "webflow", fit: "High-polish marketing sites with visual content management." },
      { technologyId: "shopify", fit: "Hosted commerce stores and operationally simple online selling." },
      { technologyId: "woocommerce", fit: "Content and commerce experiences built around WordPress." },
      { technologyId: "react", fit: "Highly interactive application and customer-account experiences." },
      { technologyId: "nextjs", fit: "Performant web products that combine content, application, and SEO needs." },
      { technologyId: "angular", fit: "Structured web applications with complex user workflows." },
      { technologyId: "vue", fit: "Progressive application interfaces and adaptable product frontends." },
      { technologyId: "javascript", fit: "Dynamic browser behavior and lightweight interactive experiences." },
      { technologyId: "typescript", fit: "Typed JavaScript for maintainable frontend code and type-safe server integrations." },
      { technologyId: "html5", fit: "Semantic, accessible web page foundations." },
      { technologyId: "css3", fit: "Responsive layouts and polished visual systems across devices." },
      { technologyId: "nodejs", fit: "Custom APIs, integrations, and server-side product capabilities." },
      { technologyId: "nestjs", fit: "Maintainable API architecture for feature-rich web products." },
      { technologyId: "django", fit: "High-level Python web framework for clean backend architecture and fast API delivery." },
      { technologyId: "php", fit: "Server-side web delivery for content and commerce ecosystems." },
      { technologyId: "laravel", fit: "Structured PHP applications with established business workflows and admin portals." },
      { technologyId: "ruby-on-rails", fit: "Convention-driven delivery for focused product workflows." },
      { technologyId: "postgresql", fit: "Relational database foundation for web application data, user accounts, and transactions." },
      { technologyId: "mongodb", fit: "Document storage for content-heavy, catalog-driven, or dynamic web application data." },
      { technologyId: "mysql", fit: "Widely supported relational database for web platforms, content management, and e-commerce." },
      { technologyId: "firebase", fit: "Managed authentication, realtime data sync, and serverless web app backend infrastructure." },
      { technologyId: "supabase", fit: "Open-source backend with Postgres database, auth, and auto-generated REST APIs." },
      { technologyId: "redis", fit: "Fast in-memory caching for session management and optimized page loading." },
      { technologyId: "figma", fit: "Interactive UI/UX design, wireframes, and design systems for web experiences." },
      { technologyId: "make", fit: "Visual automation and integration scenarios powering web application workflows." },
    ],
    implementationOptions: [
      { title: "Content or commerce platform", bestFor: "Businesses prioritizing publishing, marketing agility, or a proven commerce foundation.", description: "Configure and tailor a platform around brand, content, product catalog, and customer journeys.", technologyIds: ["wordpress", "webflow", "shopify", "woocommerce"] },
      { title: "Custom web application", bestFor: "Products with unique workflows, portals, transactions, or connected services.", description: "Engineer a responsive application with the appropriate frontend, backend, data, and integration layers.", technologyIds: ["react", "nextjs", "nodejs", "postgresql"] },
    ],
    problemSolutions: [
      { problemId: "outdated-software", solution: "Modernize slow or difficult web experiences with responsive interfaces and maintainable architecture." },
      { problemId: "disconnected-systems", solution: "Connect customer journeys to payments, CRM, inventory, and business services through reliable APIs." },
      { problemId: "poor-reporting", solution: "Surface meaningful account, transaction, and operational data in focused application dashboards." },
    ],
    useCases: [
      { title: "Customer account portals", description: "Secure account management, requests, documents, and service journeys in the browser." },
      { title: "Commerce experiences", description: "Product discovery, checkout, subscriptions, and post-purchase customer journeys." },
      { title: "Operational web tools", description: "Browser-based systems for teams managing work, records, and reporting." },
    ],
  },
  "mobile-applications": {
    technologyOptions: [
      { technologyId: "reactnative", fit: "Cross-platform mobile applications built with React Native for iOS and Android." },
      { technologyId: "flutter", fit: "A shared application foundation for iOS and Android delivery." },
      { technologyId: "swift", fit: "Native Apple experiences that use platform-specific capabilities." },
      { technologyId: "kotlin", fit: "Native Android experiences designed around Android conventions." },
      { technologyId: "typescript", fit: "Type-safe codebases for React Native and cross-platform mobile application development." },
      { technologyId: "nodejs", fit: "Connected APIs, notifications, and mobile application services." },
      { technologyId: "nestjs", fit: "Structured Node.js framework for scalable mobile API gateways and microservices." },
      { technologyId: "firebase", fit: "Realtime database, push notifications, authentication, and analytics tailored for mobile apps." },
      { technologyId: "supabase", fit: "Mobile products that need managed data, authentication, and realtime foundations." },
      { technologyId: "postgresql", fit: "Robust relational data layer powering mobile backend services and reporting." },
      { technologyId: "mongodb", fit: "Flexible document database for mobile user profiles, offline sync, and app content." },
      { technologyId: "figma", fit: "Mobile screen designs, component libraries, and interactive product prototypes." },
    ],
    implementationOptions: [
      { title: "Cross-platform mobile product", bestFor: "Organizations that need consistent iOS and Android delivery with a shared foundation.", description: "Build focused mobile journeys while keeping platform-specific behavior where it matters.", technologyIds: ["reactnative", "flutter", "nodejs", "supabase"] },
      { title: "Native mobile experience", bestFor: "Products that depend heavily on platform performance, device features, or native conventions.", description: "Design and engineer separately optimized iOS and Android experiences around the required capabilities.", technologyIds: ["swift", "kotlin", "nodejs"] },
    ],
    problemSolutions: [
      { problemId: "manual-processes", solution: "Put data collection, approvals, and field workflows into a focused mobile experience." },
      { problemId: "disconnected-systems", solution: "Connect mobile users to the same trusted data and services used across the business." },
      { problemId: "scaling-problems", solution: "Create a mobile foundation that can grow from one core journey to a broader product." },
    ],
    useCases: [
      { title: "Field operations", description: "Support technicians, sales teams, and distributed staff with reliable mobile workflows." },
      { title: "Customer services", description: "Offer booking, account, commerce, communication, and support experiences on the go." },
      { title: "Connected products", description: "Bring notifications, location, cameras, payments, and APIs together in one experience." },
    ],
  },
  "crm-erp": {
    technologyOptions: [
      { technologyId: "hubspot", fit: "Customer, sales, marketing, and service processes in a connected CRM." },
      { technologyId: "dotnet", fit: "Custom extensions and enterprise integration services." },
      { technologyId: "nodejs", fit: "API adapters, workflow services, and cross-platform synchronization." },
      { technologyId: "postgresql", fit: "Structured operational data and reporting foundations." },
      { technologyId: "zapier", fit: "Focused workflow connections between supported business tools." },
      { technologyId: "make", fit: "Automating data handoffs between CRM platforms, reporting, and customer tools." },
    ],
    implementationOptions: [
      { title: "Configure and connect a business platform", bestFor: "Teams that can standardize core processes around an established CRM or ERP.", description: "Set up workflows, permissions, reports, and integrations around the way departments work together.", technologyIds: ["hubspot", "zapier", "make"] },
      { title: "Build custom extensions", bestFor: "Organizations with specialized processes that need more than standard platform features.", description: "Add custom modules, dashboards, APIs, and data services without losing the benefits of the core platform.", technologyIds: ["dotnet", "nodejs", "postgresql"] },
    ],
    problemSolutions: [
      { problemId: "disconnected-systems", solution: "Create shared customer and operational records across the systems teams depend on." },
      { problemId: "poor-reporting", solution: "Establish dependable dashboards and reporting from governed operational data." },
      { problemId: "manual-processes", solution: "Standardize sales, service, approvals, and handoffs with structured workflows." },
    ],
    useCases: [
      { title: "Sales and service operations", description: "Connect lead management, account history, activities, and customer support." },
      { title: "Resource and order management", description: "Bring purchasing, inventory, fulfillment, and operational records into clearer workflows." },
      { title: "Management reporting", description: "Give decision-makers timely views of performance, workload, and business activity." },
    ],
  },
  "business-automation": {
    technologyOptions: [
      { technologyId: "zapier", fit: "Fast, focused automations between supported business tools." },
      { technologyId: "make", fit: "Visual multi-step workflows with transformations, branching, and automated triggers." },
      { technologyId: "n8n", fit: "Fair-code workflow automation platform for connecting APIs, databases, and AI models." },
      { technologyId: "langchain", fit: "AI-driven decision workflows, automated document processing, and smart agent actions." },
      { technologyId: "nodejs", fit: "Custom workflow logic, validations, and integration services." },
      { technologyId: "python", fit: "Data-heavy automation and document-processing workflows." },
      { technologyId: "hubspot", fit: "Customer lifecycle automation inside CRM processes." },
    ],
    implementationOptions: [
      { title: "Connected workflow automation", bestFor: "Repeatable work spanning established SaaS tools with predictable rules.", description: "Automate triggers, routing, notifications, and record updates while retaining clear ownership.", technologyIds: ["zapier", "make", "hubspot"] },
      { title: "Custom automation service", bestFor: "Workflows with complex validation, data transformation, security, or exception handling.", description: "Build a controlled service that integrates the required systems and exposes operational visibility.", technologyIds: ["nodejs", "python", "postgresql"] },
    ],
    problemSolutions: [
      { problemId: "manual-processes", solution: "Turn repeatable handoffs, approvals, and updates into reliable automated flows." },
      { problemId: "lack-of-automation", solution: "Prioritize high-volume work where automation can remove delay and avoidable errors." },
      { problemId: "high-operational-costs", solution: "Reduce recurring administrative effort by removing low-value manual coordination." },
    ],
    useCases: [
      { title: "Approval flows", description: "Route requests to the right people with checks, reminders, and status visibility." },
      { title: "Customer lifecycle actions", description: "Coordinate onboarding, follow-ups, handovers, and service communications." },
      { title: "Automated reporting", description: "Collect, transform, and distribute operational information on a dependable schedule." },
    ],
  },
  "ai-solutions": {
    technologyOptions: [
      { technologyId: "python", fit: "Data processing, model evaluation, and AI workflow services." },
      { technologyId: "langchain", fit: "Framework for chaining LLM prompts, agentic workflows, vector retrieval, and document intelligence." },
      { technologyId: "nodejs", fit: "Product APIs and integrations that place AI in existing workflows." },
      { technologyId: "postgresql", fit: "Governed application data, feedback, and evaluation records." },
      { technologyId: "supabase", fit: "Managed data, authentication, and API foundations for AI-enabled products." },
      { technologyId: "react", fit: "Clear human-in-the-loop interfaces for AI-assisted work." },
    ],
    implementationOptions: [
      { title: "AI-assisted workflow", bestFor: "Teams with a defined knowledge task that benefits from review and clear controls.", description: "Connect approved data, model behavior, business rules, and human oversight in a practical flow.", technologyIds: ["python", "nodejs", "postgresql"] },
      { title: "AI-enabled product feature", bestFor: "Digital products that need intelligent search, summarization, classification, or assistance.", description: "Embed an evaluated AI capability into the existing user experience and application architecture.", technologyIds: ["react", "nextjs", "supabase"] },
    ],
    problemSolutions: [
      { problemId: "poor-reporting", solution: "Make approved information easier to find, summarize, and interpret for decisions." },
      { problemId: "manual-processes", solution: "Assist with repetitive research, document handling, and structured knowledge work." },
      { problemId: "lack-of-automation", solution: "Apply AI only where it can improve a defined workflow with measurable controls." },
    ],
    useCases: [
      { title: "Knowledge assistants", description: "Help teams retrieve approved information and complete defined tasks more quickly." },
      { title: "Document intelligence", description: "Classify, extract, summarize, and validate information from business documents." },
      { title: "Product intelligence", description: "Add assisted search, recommendations, analysis, and conversational support." },
    ],
  },
  "system-integration": {
    technologyOptions: [
      { technologyId: "nodejs", fit: "Custom API adapters, integration services, and event-driven workflows." },
      { technologyId: "dotnet", fit: "Enterprise integration services and Microsoft-aligned environments." },
      { technologyId: "zapier", fit: "Supported SaaS-tool connections with clear, focused automation needs." },
      { technologyId: "make", fit: "Visual orchestration for multi-step SaaS and internal integration workflows." },
      { technologyId: "n8n", fit: "Flexible node-based integration flows for syncing data across cloud platforms." },
      { technologyId: "postgresql", fit: "Reliable synchronization state, audit records, and operational reporting." },
    ],
    implementationOptions: [
      { title: "Platform-to-platform connection", bestFor: "Teams connecting supported SaaS applications with defined data handoffs.", description: "Configure observable workflows that keep records, notifications, and status changes synchronized.", technologyIds: ["zapier", "make", "hubspot"] },
      { title: "Custom integration layer", bestFor: "Critical systems requiring tailored validation, transformations, retries, and monitoring.", description: "Engineer APIs and services around ownership, security, failure recovery, and long-term maintainability.", technologyIds: ["nodejs", "dotnet", "postgresql"] },
    ],
    problemSolutions: [
      { problemId: "disconnected-systems", solution: "Define dependable data flows between the systems that make up daily operations." },
      { problemId: "spreadsheet-dependency", solution: "Replace manual reconciliation with governed synchronization and clear sources of truth." },
      { problemId: "high-operational-costs", solution: "Reduce repeated data entry, error correction, and cross-team status chasing." },
    ],
    useCases: [
      { title: "CRM and finance connections", description: "Keep customer, invoice, order, and operational data aligned across platforms." },
      { title: "Payment and subscription events", description: "Connect payment activity to customer records, access, communication, and reporting." },
      { title: "Integration observability", description: "Make failures, retries, ownership, and data movement visible to the right teams." },
    ],
  },
  "legacy-modernization": {
    technologyOptions: [
      { technologyId: "dotnet", fit: "Modernizing and extending Microsoft-aligned enterprise applications." },
      { technologyId: "react", fit: "Replacing difficult legacy interfaces with responsive user experiences." },
      { technologyId: "nodejs", fit: "Introducing APIs and integration layers around existing systems." },
      { technologyId: "postgresql", fit: "Modern relational data design, migration, and performance work." },
      { technologyId: "docker", fit: "Repeatable application environments during staged modernization." },
      { technologyId: "kubernetes", fit: "Scalable orchestration where operational requirements justify it." },
    ],
    implementationOptions: [
      { title: "Incremental modernization", bestFor: "Business-critical systems that must remain available throughout change.", description: "Prioritize high-value components, improve interfaces and integrations, and validate each migration stage.", technologyIds: ["react", "nodejs", "docker", "postgresql"] },
      { title: "Platform and infrastructure renewal", bestFor: "Applications constrained by outdated runtimes, delivery processes, or operational reliability.", description: "Establish maintainable services, repeatable environments, and a roadmap for controlled replacement.", technologyIds: ["dotnet", "docker", "kubernetes", "postgresql"] },
    ],
    problemSolutions: [
      { problemId: "outdated-software", solution: "Assess risk and modernize the parts of the platform that limit delivery, security, or support." },
      { problemId: "scaling-problems", solution: "Improve architecture, data access, and operational capacity without disrupting critical workflows." },
      { problemId: "disconnected-systems", solution: "Introduce APIs and integration layers that let trusted legacy systems participate in modern processes." },
    ],
    useCases: [
      { title: "Legacy interface renewal", description: "Replace difficult-to-use screens with accessible, responsive, maintainable experiences." },
      { title: "Data and infrastructure migration", description: "Move databases, workloads, and dependencies through controlled validation stages." },
      { title: "Strangler-style replacement", description: "Safely replace high-risk components while essential operations stay available." },
    ],
  },
  saas: {
    technologyOptions: [
      { technologyId: "react", fit: "Responsive product interfaces, dashboards, and customer experiences." },
      { technologyId: "nextjs", fit: "Production web delivery for product, marketing, and performance needs." },
      { technologyId: "angular", fit: "Structured product frontends with complex workspace workflows." },
      { technologyId: "vue", fit: "Adaptable SaaS interfaces for evolving product needs." },
      { technologyId: "typescript", fit: "Safer long-term product development across the codebase." },
      { technologyId: "nodejs", fit: "Multi-tenant APIs, application services, and integrations." },
      { technologyId: "nestjs", fit: "Modular backend services for growing product domains." },
      { technologyId: "django", fit: "Scalable Python backend for multi-tenant web applications and security services." },
      { technologyId: "laravel", fit: "PHP application foundation for multi-tenant subscription products and APIs." },
      { technologyId: "dotnet", fit: "Enterprise SaaS services in Microsoft-aligned environments." },
      { technologyId: "python", fit: "Data pipelines, AI/ML integrations, and background task processing for SaaS applications." },
      { technologyId: "postgresql", fit: "Tenant-aware transactional data and reporting." },
      { technologyId: "mongodb", fit: "Document database for multi-tenant schema flexibility and dynamic SaaS data storage." },
      { technologyId: "mysql", fit: "Reliable transactional relational database for SaaS customer records and analytics." },
      { technologyId: "firebase", fit: "Turnkey user authentication, realtime database, and serverless background tasks." },
      { technologyId: "supabase", fit: "Managed product foundations for data, authentication, and storage." },
      { technologyId: "redis", fit: "High-performance caching and session storage for active web application users." },
      { technologyId: "stripe", fit: "Subscriptions, payments, invoicing, and plan management." },
      { technologyId: "figma", fit: "SaaS interface design, dashboard layouts, and scalable design systems." },
      { technologyId: "make", fit: "Connecting SaaS platform webhooks with external tools and partner ecosystems." },
    ],
    implementationOptions: [
      { title: "Focused SaaS MVP", bestFor: "Founders validating a clearly defined product workflow and market need.", description: "Prioritize the core tenant experience, onboarding, permissions, and feedback loops needed to learn quickly.", technologyIds: ["nextjs", "supabase", "stripe"] },
      { title: "Scalable multi-tenant platform", bestFor: "Products with growing organizations, feature tiers, integrations, and operational demands.", description: "Engineer tenant boundaries, APIs, billing, observability, and administration for sustainable growth.", technologyIds: ["react", "nodejs", "postgresql", "stripe"] },
    ],
    problemSolutions: [
      { problemId: "scaling-problems", solution: "Design tenant, data, and service boundaries that can grow with product adoption." },
      { problemId: "manual-processes", solution: "Turn recurring customer or internal work into self-service product workflows." },
      { problemId: "poor-reporting", solution: "Give product and operations teams clearer usage, account, and performance visibility." },
    ],
    useCases: [
      { title: "Subscription products", description: "Launch plans, trials, payments, and account management around a recurring business model." },
      { title: "Customer workspaces", description: "Provide organizations with secure members, permissions, records, and workflows." },
      { title: "Partner ecosystems", description: "Expose APIs, integrations, and administrative controls as the product matures." },
    ],
  },
  "databases-data-science": {
    technologyOptions: [
      { technologyId: "postgresql", fit: "Relational data modeling, performance, and reliable analytics foundations." },
      { technologyId: "mongodb", fit: "Flexible document data for evolving application requirements." },
      { technologyId: "mysql", fit: "Established web and operational database environments." },
      { technologyId: "firebase", fit: "Realtime application data, authentication, and managed mobile backends." },
      { technologyId: "redis", fit: "Sub-millisecond in-memory data store for caching, queues, and fast indexing." },
      { technologyId: "sqlite", fit: "Embedded relational database engine for lightweight local data storage." },
      { technologyId: "python", fit: "Data processing, analytics pipelines, and predictive workflows." },
      { technologyId: "docker", fit: "Repeatable environments for data services and pipeline delivery." },
    ],
    implementationOptions: [
      { title: "Operational data foundation", bestFor: "Applications needing reliable schemas, fast queries, migration discipline, and governed records.", description: "Model and optimize the data layer around transactions, access patterns, integrations, and long-term maintainability.", technologyIds: ["postgresql", "mongodb", "mysql", "docker"] },
      { title: "Analytics and intelligence pipeline", bestFor: "Teams that need data from multiple systems turned into reporting, analysis, or predictive insight.", description: "Build dependable collection, transformation, quality, and delivery steps around the decisions people need to make.", technologyIds: ["python", "postgresql", "nodejs"] },
    ],
    problemSolutions: [
      { problemId: "poor-reporting", solution: "Create trusted data models and pipelines that make operational insight more timely and reliable." },
      { problemId: "disconnected-systems", solution: "Bring distributed records together through governed data movement and clear ownership." },
      { problemId: "scaling-problems", solution: "Improve schemas, queries, and data architecture before growing volume becomes a constraint." },
    ],
    useCases: [
      { title: "Database performance work", description: "Improve schemas, indexes, queries, and reliability for responsive applications." },
      { title: "Data pipelines", description: "Collect and transform information from operational systems into usable data products." },
      { title: "Decision support", description: "Build dashboards, KPIs, and predictive analysis around important business questions." },
    ],
  },
} as const satisfies Record<ServiceSolutionSlug, ServiceSolutionExpansion>;

export const serviceSolutions: readonly ServiceSolution[] = serviceSolutionBase.map(
  (solution) => ({
    ...solution,
    ...serviceSolutionExpansions[solution.slug],
  }),
);

export function getServiceSolutionBySlug(
  slug: string,
): ServiceSolution | undefined {
  return serviceSolutions.find((solution) => solution.slug === slug);
}
import type { TechnologyId } from "@/data/service-technologies";
import type { BusinessProblemId } from "@/data/services-experience";
