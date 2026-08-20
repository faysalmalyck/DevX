export type WhyDevxCard = {
  id: string;
  title: string;
  description: string;
  image: {
    src: string;
    alt: string;
  };
};

export const whyDevxData: WhyDevxCard[] = [
  {
    id: "business-first",
    title: "Business First",
    description:
      "We align technology with your goals, priorities, and outcomes to create lasting business value.",
    image: {
      src: "/images/whydevx/business-first(1).png",
      alt: "Business First illustration",
    },
  },

  {
    id: "scalable-architecture",
    title: "Scalable Architecture",
    description:
      "We design scalable foundations that grow smoothly with customers, teams, data, operations, and needs.",
    image: {
      src: "/images/whydevx/scalable-architecture.png",
      alt: "Scalable Architecture illustration",
    },
  },

  {
    id: "modern-technology",
    title: "Modern Technology",
    description:
      "We use modern technologies keeping your product secure, maintainable, efficient, adaptable, and growth-ready.",
    image: {
      src: "/images/whydevx/modern-tech.png",
      alt: "Modern Technology illustration",
    },
  },

  {
    id: "transparent-process",
    title: "Transparent Process",
    description:
      "We provide clear goals, visible progress, honest updates, and direct communication throughout every project.",
    image: {
      src: "/images/whydevx/transparent-process.png",
      alt: "Transparent Process illustration",
    },
  },

  {
    id: "long-term-partnership",
    title: "Long-Term Partnership",
    description:
      "We support your product beyond launch, helping it evolve with users, markets, and needs.",
    image: {
      src: "/images/whydevx/long-term-partnership.png",
      alt: "Long-Term Partnership illustration",
    },
  },

  {
    id: "cost-efficient",
    title: "Cost Efficient",
    description:
      "We focus development on high-impact priorities, helping you maximize budgets and long-term business value.",
    image: {
      src: "/images/whydevx/cost-efficient(1).png",
      alt: "Cost Efficient illustration",
    },
  },
];