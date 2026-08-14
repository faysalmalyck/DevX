// Development already uses image illustrations for card visuals rather than an
// IconComponent system, so `icon` preserves that existing visual contract.
export type ServiceCardIcon = {
  src: string;
  alt: string;
};

export type ServiceCard = {
  id: string;
  title: string;
  description: string;
  icon: ServiceCardIcon;
  href: string;
  status: "existing" | "draft";
};

export const servicesData: readonly ServiceCard[] = [
  {
    id: "custom-software",
    title: "Custom Software",
    // DRAFT — NEEDS REVIEW: service-offering copy requires human sign-off.
    description:
      "Creating tailored software that supports your workflows, priorities, and evolving business needs.",
    icon: {
      src: "/images/services/customsoftware.png",
      alt: "Custom Software illustration",
    },
    href: "/services/custom-software",
    status: "draft",
  },
  {
    id: "website-app-development",
    title: "Website/App Development",
    description:
      "Building responsive, modern, and scalable web applications tailored to your business needs.",
    icon: {
      src: "/images/services/website.png",
      alt: "Frontend Development - Dev X Webflow Template",
    },
    href: "/services/web-applications",
    status: "existing",
  },
  {
    id: "mobile-app-development",
    title: "Mobile App Development",
    description:
      "Seamless & high-performance mobile applications for iOS and Android that keep your users engaged.",
    icon: {
      src: "/images/services/mobileapp.png",
      alt: "Mobile App Development - Dev X Webflow Template",
    },
    href: "/services/mobile-applications",
    status: "existing",
  },
  {
    id: "saas",
    title: "SaaS",
    // DRAFT — NEEDS REVIEW: service-offering copy requires human sign-off.
    description:
      "Shaping flexible SaaS products around your idea, users, and the needs of a growing business.",
    icon: {
      src: "/images/services/saas.png",
      alt: "SaaS illustration",
    },
    href: "/services/saas",
    status: "draft",
  },
  {
    id: "ai-machine-learning",
    title: "AI & Machine Learning",
    description:
      "Transform data into intelligence with custom AI/ML solutions from predictive analytics to intelligent automation systems.",
    // The prior ai:ml.png source is deleted; ai.png is the supplied replacement.
    icon: {
      src: "/images/services/ai.png",
      alt: "AI & Machine Learning - Dev X Webflow Template",
    },
    href: "/services/ai-solutions",
    status: "existing",
  },
  {
    id: "legacy-modernization",
    title: "Legacy Modernization",
    // DRAFT — NEEDS REVIEW: service-offering copy requires human sign-off.
    description:
      "Refreshing established software to better support current needs, future change, and reliable operations.",
    icon: {
      src: "/images/services/legecymodernization.png",
      alt: "Legacy Modernization illustration",
    },
    href: "/services/legacy-modernization",
    status: "draft",
  },
  {
    id: "crm-erp",
    title: "CRM & ERP",
    // DRAFT — NEEDS REVIEW: service-offering copy requires human sign-off.
    description:
      "Bringing essential business workflows together in systems designed for clearer, more connected work.",
    icon: {
      src: "/images/services/backend.png",
      alt: "CRM & ERP illustration",
    },
    href: "/services/crm-erp",
    status: "draft",
  },
  {
    id: "business-automation",
    title: "Business Automation",
    // DRAFT — NEEDS REVIEW: service-offering copy requires human sign-off.
    description:
      "Simplifying repeatable work with thoughtful automation designed around your team and business processes.",
    icon: {
      src: "/images/services/Businessautomation.png",
      alt: "Business Automation illustration",
    },
    href: "/services/business-automation",
    status: "draft",
  },
  {
    id: "databases-data-science",
    title: "Databases & Data Science",
    description:
      "Designing secure databases and transforming data into actionable intelligence for business growth.",
    icon: {
      src: "/images/services/database.png",
      alt: "Databases & Data Science - Dev X Webflow Template",
    },
    href: "/services/databases-data-science",
    status: "existing",
  },
];
