import {
  Blocks,
  Database,
  Network,
  PanelsTopLeft,
  RefreshCw,
  Smartphone,
  Sparkles,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import type { ServiceSolutionIcon } from "@/data/service-solutions";

const solutionIcons: Record<ServiceSolutionIcon, LucideIcon> = {
  blocks: Blocks,
  browser: PanelsTopLeft,
  mobile: Smartphone,
  database: Database,
  workflow: Workflow,
  sparkles: Sparkles,
  network: Network,
  refresh: RefreshCw,
};

type SolutionIconProps = Readonly<{
  icon: ServiceSolutionIcon;
  className?: string;
  strokeWidth?: number;
}>;

export default function SolutionIcon({
  icon,
  className,
  strokeWidth = 1.5,
}: SolutionIconProps) {
  const Icon = solutionIcons[icon];

  return <Icon aria-hidden="true" className={className} strokeWidth={strokeWidth} />;
}
