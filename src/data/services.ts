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

      "Tailored software solutions built around your unique business needs.",

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

      "Modern web applications built for scalable business growth.",

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

      "High-performance mobile apps for iOS and Android platforms.",

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

      "Flexible SaaS products designed for growing modern businesses.",

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

      "Intelligent AI solutions that transform complex business data.",

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

      "Modernizing legacy systems for reliable long-term future growth.",

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

      "Connected systems that streamline essential business efficiently.",

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

      "Smart automation that simplifies repetitive everyday business.",

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

      "Secure databases turning complex data into actionable intelligence.",

    icon: {

      src: "/images/services/database.png",

      alt: "Databases & Data Science - Dev X Webflow Template",

    },

    href: "/services/databases-data-science",

    status: "existing",

  },

];