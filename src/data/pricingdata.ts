// ==========================================
// 1. Types & Interfaces
// ==========================================

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  numericPrice: number;
  description: string;
  link: string;
  isPopular?: boolean;
  features: string[];
}

export interface FeatureItem {
  id: string;
  text: string;
}

export interface DurationOption {
  label: string;
  value: string;
  discount?: string;
}

export interface SimpleProductDetails {
  title: string;
  description: string;
  price: number;
  cardTitle: string;
  cardDescription: string;
  features: FeatureItem[];
  durationOptions: DurationOption[];
}

export interface BottomSectionContent {
  heading: string;
  subheading: string;
  paragraph1: string;
  paragraph2: string;
  bullets: string[];
  paragraph3: string;
  paragraph4: string;
}

export interface FullProductDetails {
  title: string;
  description: string;
  price: number;
  cardTitle: string;
  cardDescription: string;
  features: FeatureItem[];
  durationOptions: DurationOption[];
  bottomContent?: BottomSectionContent;
}

export type AnyProductData = SimpleProductDetails | FullProductDetails;

export interface AddToCartContent {
  cardTitle: string;
  cardDescription: string;
  price: number;
  durationOptions: DurationOption[];
  labels: {
    durationSelect: string;
    durationPlaceholder: string;
    addToCartBtn: string;
    loadingBtn: string;
    buyNowBtn: string;
    validationAlert: string;
    successAlert: string;
  };
  checkoutUrl: string;
}

// ==========================================
// 2. Base Plans Definition (Single Source of Truth)
// ==========================================

const plansMap = {
  standard: {
    id: "standard",
    name: "Standard Plan",
    price: "$600 USD",
    numericPrice: 600,
    description:
      "Ideal for startups and small businesses that need reliable development support for routine updates, bug fixes, and feature enhancements.",
    link: "/pricing/standard-plan",
    isPopular: false,
    features: [
      "200 Hours of Development Time",
      "Extra hours at $30/hr",
      "Frontend and Backend only",
      "Business Hours Email Support",
    ],
  },
  professional: {
    id: "professional",
    name: "Professional Plan",
    price: "$1000 USD",
    numericPrice: 1000,
    description:
      "Designed for growing businesses that require faster delivery, broader technical expertise, and priority engineering support.",
    link: "/pricing/professional-plan",
    isPopular: true,
    features: [
      "300 Hours of Development Time",
      "Extra hours at $35/hr",
      "Data Science & Infrastructure",
      "Priority Email & Chat Support",
    ],
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise",
    price: "$2500 USD",
    numericPrice: 2500,
    description:
      "Built for organizations with complex projects that require a dedicated engineering team, advanced technologies, and premium support.",
    link: "/pricing/enterprise-plan",
    isPopular: false,
    features: [
      "400 Hours of Development Time",
      "Extra hours at $40/hr",
      "AI & Machine Learning",
      "Dedicated Team with Premium Support",
    ],
  },
};

// Array export for pricing grid cards
export const pricingPlansData: PricingPlan[] = Object.values(plansMap);

// ==========================================
// 3. Product Page Detail Configurations
// ==========================================

export const standardProductData: SimpleProductDetails = {
  title: plansMap.standard.name,
  description: plansMap.standard.description,
  price: plansMap.standard.numericPrice, // Fixed: Uses numericPrice (600) instead of string
  cardTitle: "Order your Standard dev package today!",
  cardDescription:
    "Ready to grow your company? Order your plan today, and we will contact you within 24hrs to get started.",
  features: plansMap.standard.features.map((feature, idx) => ({
    id: `std-f${idx + 1}`,
    text: feature,
  })),
  durationOptions: [
    { label: "200 Hours", value: "200-hours" },
    { label: "+1hr ($30/hr)", value: "plus-1hr" },
  ],
};

export const professionalProductData: FullProductDetails = {
  title: plansMap.professional.name,
  description: plansMap.professional.description,
  price: plansMap.professional.numericPrice,
  cardTitle: "Order your Professional dev package today!",
  cardDescription:
    "Accelerate your build pipeline with our most popular engineering package. Get started within 24 hours.",
  features: plansMap.professional.features.map((feature, idx) => ({
    id: `prof-f${idx + 1}`,
    text: feature,
  })),
  durationOptions: [
    { label: "300 Hours", value: "300-hours" },
    { label: "Quarterly Commitment", value: "quarterly", discount: "10% OFF" },
    { label: "Annual Commitment", value: "annual", discount: "20% OFF" },
  ],
  bottomContent: {
    heading: "Get your priority engineering support",
    subheading: "High-velocity delivery for scaling startups and enterprises",
    paragraph1:
      "Our Professional Plan delivers end-to-end expertise across modern web stacks, cloud infrastructure, and data systems. We integrate directly into your workflow to execute backlog items rapidly.",
    paragraph2:
      "Avoid the hiring overhead and scale your velocity immediately. Every engineering resource assigned to your project follows strict code review, continuous integration, and automated testing standards.",
    bullets: [
      "300 committed development hours every billing cycle",
      "Access to full-stack, data science, and cloud infrastructure specialists",
      "Priority SLA response times across direct email and chat channels",
    ],
    paragraph3:
      "We handle everything from system design and API architecture to production monitoring and UI execution. Focus on core business strategy while our engineering group manages technical execution.",
    paragraph4:
      "Transparent billing at competitive rates with standard hour extensions available on demand. Upgrade, adjust, or adapt your allocation as project roadmap priorities shift.",
  },
};

export const enterpriseProductData: FullProductDetails = {
  title: plansMap.enterprise.name,
  description: plansMap.enterprise.description,
  price: plansMap.enterprise.numericPrice,
  cardTitle: "Order your Enterprise dev package today!",
  cardDescription:
    "Deploy a dedicated engineering unit equipped for custom AI integrations and heavy architecture.",
  features: plansMap.enterprise.features.map((feature, idx) => ({
    id: `ent-f${idx + 1}`,
    text: feature,
  })),
  durationOptions: [
    { label: "400 Hours", value: "400-hours" },
    { label: "Half-Year Contract", value: "6m", discount: "15% OFF" },
    { label: "Annual Contract", value: "12m", discount: "25% OFF" },
  ],
  bottomContent: {
    heading: "Dedicated engineering for complex technical challenges",
    subheading: "Advanced artificial intelligence, machine learning, and core architecture",
    paragraph1:
      "The Enterprise plan provides a fully dedicated team tailored specifically to your technology stack. Build custom AI solutions, train LLMs, optimize databases, and scale high-throughput infrastructure.",
    paragraph2:
      "Get complete priority access across every tier of our development ecosystem. Our senior technical leads and architects work alongside your team leaders to ensure zero friction.",
    bullets: [
      "400 committed engineering hours with a fully dedicated team setup",
      "Deep expertise in Machine Learning, Artificial Intelligence, and System Architecture",
      "24/7 priority support and direct emergency technical channels",
    ],
    paragraph3:
      "Transform ambitious product blueprints into battle-tested production environments. We handle advanced data modeling, secure deployments, and complex feature development under strict performance standards.",
    paragraph4:
      "Custom billing schedules and dedicated technical leadership ensure your long-term goals are achieved cleanly, efficiently, and predictably.",
  },
};

// ==========================================
// 4. Products Map & Helper Lookup Function
// ==========================================

export const productsMap: Record<string, AnyProductData> = {
  standard: standardProductData,
  "standard-plan": standardProductData,
  professional: professionalProductData,
  "professional-plan": professionalProductData,
  enterprise: enterpriseProductData,
  "enterprise-plan": enterpriseProductData,
};

export function getPlanData(slug: string): AnyProductData {
  const normalizedKey = (slug || "").toLowerCase().trim();
  return productsMap[normalizedKey] || productsMap[normalizedKey.replace("-plan", "")] || professionalProductData;
}

// ==========================================
// 5. Default Add To Cart Configuration
// ==========================================

export const defaultAddToCartData: AddToCartContent = {
  cardTitle: "Order your dev package today!",
  cardDescription:
    "Ready to grow your company? Order your plan today, and we will contact you within 24hrs to get started.",
  price: 1000,
  durationOptions: [
    { label: "300 Hours", value: "300-hours" },
    { label: "+1hr", value: "plus-1hr" },
  ],
  labels: {
    durationSelect: "Select your package duration",
    durationPlaceholder: "Select duration",
    addToCartBtn: "Add to Cart",
    loadingBtn: "Adding to cart...",
    buyNowBtn: "Buy now",
    validationAlert: "Please select a package duration.",
    successAlert: "Added to cart successfully!",
  },
  checkoutUrl: "/checkout",
};