export const technologyCategories = [
  "CMS",
  "Ecommerce",
  "Frontend",
  "Backend",
  "Mobile",
  "Data",
  "Cloud",
  "Automation",
  "Design",
  "Business platform",
] as const;

export type TechnologyCategory = (typeof technologyCategories)[number];

export const technologyIconKeys = [
  "wordpress",
  "shopify",
  "woocommerce",
  "webflow",
  "react",
  "reactnative",
  "nextjs",
  "angular",
  "vue",
  "javascript",
  "html5",
  "css3",
  "nodejs",
  "nestjs",
  "dotnet",
  "php",
  "laravel",
  "ruby-on-rails",
  "django",
  "cpp",
  "typescript",
  "postgresql",
  "mongodb",
  "mysql",
  "firebase",
  "redis",
  "sqlite",
  "python",
  "flutter",
  "swift",
  "kotlin",
  "docker",
  "kubernetes",
  "stripe",
  "supabase",
  "zapier",
  "make",
  "n8n",
  "langchain",
  "figma",
  "hubspot",
] as const;

export type TechnologyIconKey = (typeof technologyIconKeys)[number];

export type ServiceTechnology = Readonly<{
  id: string;
  name: string;
  category: TechnologyCategory;
  description: string;
  icon: TechnologyIconKey;
}>;

export const serviceTechnologies = [
  { id: "wordpress", name: "WordPress", category: "CMS", description: "Flexible content management for editorial, marketing, and business websites.", icon: "wordpress" },
  { id: "shopify", name: "Shopify", category: "Ecommerce", description: "Hosted commerce foundations for stores, products, checkout, and operations.", icon: "shopify" },
  { id: "woocommerce", name: "WooCommerce", category: "Ecommerce", description: "WordPress-native commerce for content-led stores and tailored checkout flows.", icon: "woocommerce" },
  { id: "webflow", name: "Webflow", category: "CMS", description: "Visual web delivery for polished marketing sites and manageable content.", icon: "webflow" },
  { id: "react", name: "React", category: "Frontend", description: "Component-based interfaces for interactive web products and dashboards.", icon: "react" },
  { id: "reactnative", name: "React Native", category: "Mobile", description: "Cross-platform mobile framework using React for native iOS and Android apps.", icon: "reactnative" },
  { id: "nextjs", name: "Next.js", category: "Frontend", description: "Production React framework for performant, scalable web experiences.", icon: "nextjs" },
  { id: "angular", name: "Angular", category: "Frontend", description: "Structured frontend framework for large, feature-rich web applications.", icon: "angular" },
  { id: "vue", name: "Vue.js", category: "Frontend", description: "Progressive framework for adaptable interfaces and product experiences.", icon: "vue" },
  { id: "javascript", name: "JavaScript", category: "Frontend", description: "Core browser language for dynamic interfaces and web behavior.", icon: "javascript" },
  { id: "html5", name: "HTML5", category: "Frontend", description: "Semantic markup foundation for accessible, durable web experiences.", icon: "html5" },
  { id: "css3", name: "CSS3", category: "Frontend", description: "Responsive visual styling for polished cross-device user interfaces.", icon: "css3" },
  { id: "nodejs", name: "Node.js", category: "Backend", description: "JavaScript runtime for APIs, application services, and integrations.", icon: "nodejs" },
  { id: "nestjs", name: "NestJS", category: "Backend", description: "Structured Node.js framework for maintainable APIs and business services.", icon: "nestjs" },
  { id: "dotnet", name: ".NET", category: "Backend", description: "Enterprise application platform for secure services and business systems.", icon: "dotnet" },
  { id: "php", name: "PHP", category: "Backend", description: "Server-side platform for content, commerce, and established web systems.", icon: "php" },
  { id: "laravel", name: "Laravel", category: "Backend", description: "PHP framework for structured, maintainable business web applications.", icon: "laravel" },
  { id: "ruby-on-rails", name: "Ruby on Rails", category: "Backend", description: "Product framework for convention-driven web application delivery.", icon: "ruby-on-rails" },
  { id: "django", name: "Django", category: "Backend", description: "High-level Python web framework for rapid, secure, and scalable backend services.", icon: "django" },
  { id: "cpp", name: "C++", category: "Backend", description: "High-performance language for specialized application and systems work.", icon: "cpp" },
  { id: "typescript", name: "TypeScript", category: "Frontend", description: "Typed JavaScript for more maintainable application code and integrations.", icon: "typescript" },
  { id: "postgresql", name: "PostgreSQL", category: "Data", description: "Relational data platform for dependable transactional and analytical workloads.", icon: "postgresql" },
  { id: "mongodb", name: "MongoDB", category: "Data", description: "Document database for flexible application data and evolving schemas.", icon: "mongodb" },
  { id: "mysql", name: "MySQL", category: "Data", description: "Widely adopted relational database for web and operational systems.", icon: "mysql" },
  { id: "firebase", name: "Firebase", category: "Data", description: "Managed backend services for realtime data, authentication, and mobile products.", icon: "firebase" },
  { id: "redis", name: "Redis", category: "Data", description: "In-memory data store for caching, real-time messaging, and high-performance data access.", icon: "redis" },
  { id: "sqlite", name: "SQLite", category: "Data", description: "Lightweight, embedded relational database engine for local data storage and edge apps.", icon: "sqlite" },
  { id: "python", name: "Python", category: "Data", description: "Versatile language for automation, data processing, and AI workflows.", icon: "python" },
  { id: "flutter", name: "Flutter", category: "Mobile", description: "Cross-platform toolkit for consistent iOS and Android experiences.", icon: "flutter" },
  { id: "swift", name: "Swift", category: "Mobile", description: "Native Apple platform development for iOS and related devices.", icon: "swift" },
  { id: "kotlin", name: "Kotlin", category: "Mobile", description: "Modern language for native Android applications and services.", icon: "kotlin" },
  { id: "docker", name: "Docker", category: "Cloud", description: "Containerized delivery for repeatable application environments.", icon: "docker" },
  { id: "kubernetes", name: "Kubernetes", category: "Cloud", description: "Container orchestration for resilient, scalable service operations.", icon: "kubernetes" },
  { id: "stripe", name: "Stripe", category: "Business platform", description: "Payments and subscription infrastructure for digital products and commerce.", icon: "stripe" },
  { id: "supabase", name: "Supabase", category: "Data", description: "Managed Postgres platform with authentication, storage, and APIs.", icon: "supabase" },
  { id: "zapier", name: "Zapier", category: "Automation", description: "Connector platform for no-code and low-code business workflows.", icon: "zapier" },
  { id: "make", name: "Make", category: "Automation", description: "Visual automation platform for multi-step integrations and workflows.", icon: "make" },
  { id: "n8n", name: "n8n", category: "Automation", description: "Fair-code workflow automation platform for connecting APIs, databases, and AI models.", icon: "n8n" },
  { id: "langchain", name: "LangChain", category: "Automation", description: "Framework for building context-aware applications powered by LLMs and agentic workflows.", icon: "langchain" },
  { id: "figma", name: "Figma", category: "Design", description: "Collaborative interface design, design systems, and prototyping for web and mobile products.", icon: "figma" },
  { id: "hubspot", name: "HubSpot", category: "Business platform", description: "CRM platform for marketing, sales, service, and customer operations.", icon: "hubspot" },
] as const satisfies readonly ServiceTechnology[];

export type TechnologyId = (typeof serviceTechnologies)[number]["id"];

export function getServiceTechnologyById(
  id: string,
): ServiceTechnology | undefined {
  return serviceTechnologies.find((technology) => technology.id === id);
}
