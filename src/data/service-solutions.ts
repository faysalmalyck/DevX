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

export const serviceSolutions = [
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
] as const satisfies readonly ServiceSolution[];

export function getServiceSolutionBySlug(
  slug: string,
): ServiceSolution | undefined {
  return serviceSolutions.find((solution) => solution.slug === slug);
}