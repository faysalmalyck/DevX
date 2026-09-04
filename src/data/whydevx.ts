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
      "We align technology with your goals to create lasting business value.",
    image: {
      src: "/images/whydevx/business-first(1).png",
      alt: "Business First illustration",
    },
  },

  {
    id: "scalable-architecture",
    title: "Scalable Architecture",
    description:
      "We build scalable foundations that grow smoothly with your business.",
    image: {
      src: "/images/whydevx/scalable-architecture.png",
      alt: "Scalable Architecture illustration",
    },
  },

  {
    id: "modern-technology",
    title: "Modern Technology",
    description:
      "We use modern technologies for secure, efficient, adaptable products.",
    image: {
      src: "/images/whydevx/modern-tech.png",
      alt: "Modern Technology illustration",
    },
  },

  {
    id: "transparent-process",
    title: "Transparent Process",
    description:
      "We provide clear goals, visible progress, and honest communication.",
    image: {
      src: "/images/whydevx/transparent-process.png",
      alt: "Transparent Process illustration",
    },
  },

  {
    id: "long-term-partnership",
    title: "Long-Term Partnership",
    description:
      "We help your product evolve with users, markets, and needs.",
    image: {
      src: "/images/whydevx/long-term-partnership.png",
      alt: "Long-Term Partnership illustration",
    },
  },

  {
    id: "cost-efficient",
    title: "Cost Efficient",
    description:
      "We prioritize high-impact development to maximize your long-term business value.",
    image: {
      src: "/images/whydevx/cost-efficient(1).png",
      alt: "Cost Efficient illustration",
    },
  },
];