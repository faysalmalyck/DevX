export const APPLICATION_STATUS_VALUES = [
  "NEW",
  "REVIEWING",
  "SHORTLISTED",
  "INTERVIEW",
  "REJECTED",
  "HIRED",
  "WITHDRAWN",
] as const;

export type ApplicationStatusValue =
  (typeof APPLICATION_STATUS_VALUES)[number];

export const APPLICATION_STATUS_LABELS: Record<
  ApplicationStatusValue,
  string
> = {
  NEW: "New",
  REVIEWING: "Reviewing",
  SHORTLISTED: "Shortlisted",
  INTERVIEW: "Interview",
  REJECTED: "Rejected",
  HIRED: "Hired",
  WITHDRAWN: "Withdrawn",
};

export interface ApplicationCareer {
  id: string;
  title: string;
  slug: string;
}

export interface ApplicationListItem {
  id: string;
  careerId: string;
  fullName: string;
  email: string;
  phone: string;
  yearsOfExperience: number;
  resumeOriginalFilename: string;
  status: ApplicationStatusValue;
  createdAt: string;
  updatedAt: string;
  career: ApplicationCareer;
}

export interface ApplicationDetail extends ApplicationListItem {
  currentLocation: string;
  linkedinUrl: string | null;
  portfolioUrl: string | null;
  coverLetter: string;
  resumeMimeType: string;
  resumeSize: number;
  consentConfirmed: boolean;
  internalNotes: string | null;
}

export interface ApplicationStatistics {
  total: number;
  new: number;
  reviewing: number;
  shortlisted: number;
  interview: number;
  hired: number;
  rejected: number;
}

export interface ApplicationPagination {
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
}

export interface ApplicationsListResponse {
  applications: ApplicationListItem[];
  pagination: ApplicationPagination;
  stats: ApplicationStatistics;
}

export interface ApplicationJobFilter {
  id: string;
  title: string;
}

export function isApplicationStatus(
  value: string
): value is ApplicationStatusValue {
  return (APPLICATION_STATUS_VALUES as readonly string[]).includes(value);
}

export function formatApplicationStatus(status: ApplicationStatusValue): string {
  return APPLICATION_STATUS_LABELS[status];
}
