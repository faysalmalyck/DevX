import type { ClientRecord } from "@/lib/validation/client";
import { slugify } from "@/lib/validation/client";

export const CLIENT_STORAGE_KEY = "DevX-clients";

const seed = [
  ["Gazelle", "/images/portfolio/gazelle.png", "https://gazelle.com/", "E-commerce", "United States"],
  ["Dierks Company", "/images/portfolio/dc.png", "https://www.dierks.company/", "Legal & Strategy", "Germany"],
  ["Doctor SaaS", "/images/portfolio/Doctor.png", "https://clinicos.codeshop.biz/dashboard/", "Healthcare", "Pakistan"],
  ["VanGuard", "/images/portfolio/VanGuard.png", "https://investor.vanguard.com/", "Financial Services", "United States"],
  ["Servcorp", "/images/portfolio/serve.png", "https://www.servcorp.ae/en/", "Workspace", "UAE"],
  ["Haze & Hue", "/images/portfolio/Haze.png", "https://hazeandhues.com/", "E-commerce", "United States"],
  ["Jubilee Gift Shop", "/images/portfolio/jubilee.png", "https://jubileegiftshop.com/", "Retail", "Pakistan"],
  ["DCI", "/images/portfolio/DCI.png", "https://dcisolutions.com/", "Technology", "Jamaica"],
  ["Beautox Bar", "/images/portfolio/Beauty.png", "https://www.beautoxbar.com/", "Beauty", "United States"],
  ["AnganStay", "/images/portfolio/angan.png", "https://development.anganstay.com/", "Real Estate", "Pakistan"],
] as const;

export const defaultClients: ClientRecord[] = seed.map(([companyName, logo, website, industry, country], index) => ({ id: slugify(companyName), companyName, slug: slugify(companyName), logo, website, description: "", industry, country, displayOrder: index + 1, featured: index < 3, status: "ACTIVE", openInNewTab: true, seoTitle: "", seoDescription: "", createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z", deletedAt: null }));

export const clientSort = (a: ClientRecord, b: ClientRecord) => Number(b.featured) - Number(a.featured) || a.displayOrder - b.displayOrder || a.companyName.localeCompare(b.companyName); 