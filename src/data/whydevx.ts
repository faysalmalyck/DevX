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
      "We align technology decisions with your strategic goals, organizational priorities, and measurable business outcomes from launch.",
    image: {
      src: "/images/whydevx/business-first(1).png",
      alt: "Business First illustration",
    },
  },
  {
    id: "scalable-architecture",
    title: "Scalable Architecture",
    description:
      "We build strong foundations that grow smoothly with your customers, team, data, operations, and long-term ambitions.",
    image: {
      src: "/images/whydevx/scalable-architecture.png",
      alt: "Scalable Architecture illustration",
    },
  },
  {
    id: "modern-technology",
    title: "Modern Technology",
    description:
      "We select dependable modern technologies that keep your product secure, maintainable, and ready for future growth.",
    image: {
      src: "/images/whydevx/modern-tech.png",
      alt: "Modern Technology illustration",
    },
  },
  {
    id: "transparent-process",
    title: "Transparent Process",
    description:
      "You get clear goals, visible progress, honest updates, and direct communication from discovery through final delivery.",
    image: {
      src: "/images/whydevx/transparent-process.png",
      alt: "Transparent Process illustration",
    },
  },
  {
    id: "long-term-partnership",
    title: "Long-Term Partnership",
    description:
      "We stay invested after launch, helping your software evolve with changing needs, users, markets, and opportunities.",
    image: {
      src: "/images/whydevx/long-term-partnership.png",
      alt: "Long-Term Partnership illustration",
    },
  },
  {
    id: "cost-efficient",
    title: "Cost Efficient",
    description:
      "We concentrate development where it creates maximum impact, helping you allocate available budgets responsibly and confidently.",
    image: {
      src: "/images/whydevx/cost-efficient(1).png",
      alt: "Cost Efficient illustration",
    },
  },
];
