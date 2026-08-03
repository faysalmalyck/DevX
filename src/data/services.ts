// data/servicesData.ts

export interface ServiceCard {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
}

export const servicesData: ServiceCard[] = [
  {
    title: "Website/App Development",
    description: "Building responsive, modern, and scalable web applications tailored to your business needs.",
    imageSrc: "https://cdn.prod.website-files.com/6217ab51d0be6929e3513ef6/623f4c033a9f2ec475bdb200_image-frontend-development-services-dev-webflow-template.png",
    imageAlt: "Frontend Development - Dev X Webflow Template",
  },
  {
    title: "Backend Development",
    description: "Powering your digital infrastructure with scalable backend solutions built with modern technologies.",
    imageSrc: "/images/services/backend.png",
    imageAlt: "Backend Development - Dev X Webflow Template",
  },
  {
    title: "Mobile App Development",
    description: "Seamless & high-performance mobile applications for iOS and Android that keep your users engaged.",
    imageSrc: "/images/services/mobileapp.png",
    imageAlt: "Mobile App Development - Dev X Webflow Template",
  },
  {
    title: "AI & Machine Learning",
    description: "Transform data into intelligence with custom AI/ML solutions from predictive analytics to intelligent automation systems.",
    imageSrc: "/images/services/ai:ml.png",
    imageAlt: "AI & Machine Learning - Dev X Webflow Template",
  },
  {
    title: "Databases & Data Science",
    description: "Designing secure databases and transforming data into actionable intelligence for business growth.",
    imageSrc: "/images/services/database.png",
    imageAlt: "Databases & Data Science - Dev X Webflow Template",
  },
  {
    title: "Servers & Cloud Infrastructure",
    description: "End to end cloud infrastructure services with secure deployments, automated scaling, and continuous monitoring.",
    imageSrc: "/images/services/cloud.png",
    imageAlt: "Servers & Cloud Infrastructure - Dev X Webflow Template",
  },
];