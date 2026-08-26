import type { ReactNode } from "react";

import { workspaceCn } from "./cn";

type WorkspaceMetricCardProps = {
  label: string;
  value: ReactNode;
  detail?: ReactNode;
  icon?: ReactNode;
  accent?: "brand" | "cyan" | "violet" | "emerald" | "amber";
  className?: string;
};

export function WorkspaceMetricCard({
  label,
  value,
  detail,
  icon,
  accent = "brand",
  className,
}: WorkspaceMetricCardProps) {
  return (
    <section className={workspaceCn("workspace-metric-card", className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="workspace-metric-label">{label}</p>
        {icon ? (
          <span className={workspaceCn("workspace-metric-icon", `workspace-accent-${accent}`)}>
            {icon}
          </span>
        ) : null}
      </div>
      <p className="workspace-metric-value">{value}</p>
      {detail ? <p className="workspace-metric-detail">{detail}</p> : null}
    </section>
  );
}
