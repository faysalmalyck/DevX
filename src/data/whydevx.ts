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
      "We begin with your goals and measure every decision against real business value.",
    image: {
      src: "/images/whydevx/business-first(1).png",
      alt: "Business First illustration",
    },
  },
  {
    id: "scalable-architecture",
    title: "Scalable Architecture",
    description:
      "We design dependable foundations that can grow alongside your customers, team, and ambition.",
    image: {
      src: "/images/whydevx/scalable-architecture.png",
      alt: "Scalable Architecture illustration",
    },
  },
  {
    id: "modern-technology",
    title: "Modern Technology",
    description:
      "We choose proven modern tools that keep your product secure, maintainable, and ready for what is next.",
    image: {
      src: "/images/whydevx/modern-tech.png",
      alt: "Modern Technology illustration",
    },
  },
  {
    id: "transparent-process",
    title: "Transparent Process",
    description:
      "You get clear milestones, visible progress, and straightforward communication from discovery through delivery.",
    image: {
      src: "/images/whydevx/transparent-process.png",
      alt: "Transparent Process illustration",
    },
  },
  {
    id: "long-term-partnership",
    title: "Long-Term Partnership",
    description:
      "We stay invested after launch to help your software evolve as new opportunities emerge.",
    image: {
      src: "/images/whydevx/long-term-partnership.png",
      alt: "Long-Term Partnership illustration",
    },
  },
  {
    id: "cost-efficient",
    title: "Cost Efficient",
    description:
      "We focus effort where it creates the most impact, helping you make smart use of every budget.",
    image: {
      src: "/images/whydevx/cost-efficient(1).png",
      alt: "Cost Efficient illustration",
    },
  },
];
