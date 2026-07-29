export type ClientStatus = "ACTIVE" | "HIDDEN";

export type ClientRecord = {
  id: string;
  companyName: string;
  slug: string;
  logo: string;
  website: string;
  description: string;
  industry: string;
  country: string;
  displayOrder: number;
  featured: boolean;
  status: ClientStatus;
  openInNewTab: boolean;
  seoTitle: string;
  seoDescription: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export function slugify(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function validateClient(client: ClientRecord, clients: ClientRecord[]) {
  const errors: Partial<Record<keyof ClientRecord, string>> = {};
  if (!client.companyName.trim()) errors.companyName = "Company name is required.";
  if (!client.logo.trim()) errors.logo = "A company logo is required.";
  try { const url = new URL(client.website); if (url.protocol !== "https:") errors.website = "Website must use HTTPS."; } catch { errors.website = "Enter a valid HTTPS URL."; }
  if (!Number.isInteger(client.displayOrder) || client.displayOrder < 0) errors.displayOrder = "Display order must be a positive whole number.";
  if (clients.some((item) => item.id !== client.id && item.companyName.trim().toLowerCase() === client.companyName.trim().toLowerCase() && !item.deletedAt)) errors.companyName = "A client with this name already exists.";
  return errors;
}
