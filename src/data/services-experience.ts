export type SelectableServiceItem = Readonly<{
  id: string;
  title: string;
  description: string;
  icon: ServiceExperienceIcon;
}>;

export type ServiceExperienceIcon =
  | "workflow"
  | "history"
  | "unplug"
  | "sheet"
  | "report"
  | "automation"
  | "scale"
  | "cost"
  | "gauge"
  | "api"
  | "crm"
  | "erp"
  | "database"
  | "cloud"
  | "refresh"
  | "bell"
  | "sync"
  | "website"
  | "mobile"
  | "payment"
  | "accounting"
  | "analytics";

export const businessProblems: readonly SelectableServiceItem[] = [
  {
    id: "manual-processes",
    title: "Manual Processes",
    description: "Repeated handoffs and data entry are consuming time your team could spend on higher-value work.",
    icon: "workflow",
  },
  {
    id: "outdated-software",
    title: "Outdated Software",
    description: "Older tools are difficult to maintain, slow to change, and increasingly disconnected from daily operations.",
    icon: "history",
  },
  {
    id: "disconnected-systems",
    title: "Disconnected Systems",
    description: "Critical information lives in separate tools, forcing teams to reconcile it by hand.",
    icon: "unplug",
  },
  {
    id: "spreadsheet-dependency",
    title: "Spreadsheet Dependency",
    description: "Core workflows rely on fragile files, duplicated versions, and knowledge held by a few people.",
    icon: "sheet",
  },
  {
    id: "poor-reporting",
    title: "Poor Reporting",
    description: "Decision-makers wait too long for reliable answers because reporting is incomplete or labor-intensive.",
    icon: "report",
  },
  {
    id: "lack-of-automation",
    title: "Lack of Automation",
    description: "Predictable work still needs constant attention, creating delays and avoidable operational mistakes.",
    icon: "automation",
  },
  {
    id: "scaling-problems",
    title: "Scaling Problems",
    description: "Processes that once worked now strain under more customers, employees, transactions, or locations.",
    icon: "scale",
  },
  {
    id: "high-operational-costs",
    title: "High Operational Costs",
    description: "Inefficient systems create recurring effort, rework, and support costs across the business.",
    icon: "cost",
  },
] as const;

export type BusinessProblemId = (typeof businessProblems)[number]["id"];

export const modernizationCapabilities: readonly SelectableServiceItem[] = [
  {
    id: "software-optimization",
    title: "Software Optimization",
    description: "Simplify slow or complex software so it supports the way your team works today.",
    icon: "gauge",
  },
  {
    id: "api-integration",
    title: "API Integration",
    description: "Connect trusted platforms through clear, secure interfaces and dependable data exchange.",
    icon: "api",
  },
  {
    id: "crm-integration",
    title: "CRM Integration",
    description: "Keep customer information consistent across sales, service, marketing, and operations.",
    icon: "crm",
  },
  {
    id: "erp-integration",
    title: "ERP Integration",
    description: "Bring finance, inventory, fulfillment, and operational systems into a connected workflow.",
    icon: "erp",
  },
  {
    id: "database-migration",
    title: "Database Migration",
    description: "Move important data carefully while protecting integrity, access, and business continuity.",
    icon: "database",
  },
  {
    id: "cloud-migration",
    title: "Cloud Migration",
    description: "Modernize infrastructure with a practical transition plan shaped around your application.",
    icon: "cloud",
  },
  {
    id: "legacy-modernization",
    title: "Legacy Modernization",
    description: "Renew established software incrementally without discarding the business logic that matters.",
    icon: "history",
  },
  {
    id: "performance-optimization",
    title: "Performance Optimization",
    description: "Find bottlenecks and improve the responsiveness, stability, and efficiency of existing systems.",
    icon: "gauge",
  },
] as const;

export type AutomationOption = SelectableServiceItem &
  Readonly<{
    manual: string;
    automated: string;
  }>;

export const automationOptions: readonly AutomationOption[] = [
  {
    id: "workflow-automation",
    title: "Workflow Automation",
    description: "Move routine work forward without repeated follow-ups.",
    icon: "workflow",
    manual: "A team member checks every request, assigns the next task, and follows up for missing information.",
    automated: "Rules validate each request, route it to the right owner, and keep every participant informed.",
  },
  {
    id: "crm-automation",
    title: "CRM Automation",
    description: "Keep customer activity moving through a consistent process.",
    icon: "crm",
    manual: "Sales teams copy lead details, create reminders, and update customer stages across several screens.",
    automated: "New leads are enriched, assigned, followed up, and moved between stages using agreed business rules.",
  },
  {
    id: "reporting-automation",
    title: "Reporting Automation",
    description: "Turn current business data into dependable recurring reports.",
    icon: "report",
    manual: "People export files, reconcile figures, and rebuild the same report before every review meeting.",
    automated: "Connected data produces a consistent report on schedule, ready for review when your team needs it.",
  },
  {
    id: "notifications",
    title: "Notifications",
    description: "Send useful alerts when an action or decision is needed.",
    icon: "bell",
    manual: "Teams monitor inboxes and dashboards, then contact colleagues when an important status changes.",
    automated: "The right people receive a useful alert as soon as a threshold, deadline, or event occurs.",
  },
  {
    id: "data-synchronization",
    title: "Data Synchronization",
    description: "Keep shared records aligned across the tools you trust.",
    icon: "sync",
    manual: "The same customer or transaction is updated in multiple systems, often at different times.",
    automated: "Approved changes move between connected systems and maintain one dependable operational view.",
  },
  {
    id: "business-process-automation",
    title: "Business Process Automation",
    description: "Coordinate a complete process across people and systems.",
    icon: "automation",
    manual: "A multi-step process depends on personal reminders, status meetings, and individual knowledge to progress.",
    automated: "A shared workflow coordinates decisions, approvals, handoffs, and records from beginning to completion.",
  },
] as const;

export const integrations: readonly SelectableServiceItem[] = [
  {
    id: "crm",
    title: "CRM",
    description: "Customer relationships and pipeline",
    icon: "crm",
  },
  {
    id: "erp",
    title: "ERP",
    description: "Operations and resource planning",
    icon: "erp",
  },
  {
    id: "website",
    title: "Website",
    description: "Digital enquiries and customer activity",
    icon: "website",
  },
  {
    id: "mobile-app",
    title: "Mobile App",
    description: "On-the-go customer and team access",
    icon: "mobile",
  },
  {
    id: "payment-systems",
    title: "Payment Systems",
    description: "Transactions, invoices, and status",
    icon: "payment",
  },
  {
    id: "accounting",
    title: "Accounting",
    description: "Financial records and reconciliation",
    icon: "accounting",
  },
  {
    id: "analytics",
    title: "Analytics",
    description: "Reporting and decision support",
    icon: "analytics",
  },
  {
    id: "apis",
    title: "APIs",
    description: "Secure exchange between platforms",
    icon: "api",
  },
] as const;
