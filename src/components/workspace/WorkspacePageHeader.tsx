import type { ReactNode } from "react";

import { workspaceCn } from "./cn";

type WorkspacePageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
};

export function WorkspacePageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: WorkspacePageHeaderProps) {
  return (
    <header
      className={workspaceCn(
        "workspace-page-header flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div className="min-w-0">
        {eyebrow ? <p className="workspace-kicker">{eyebrow}</p> : null}
        <h1 className="workspace-page-title">{title}</h1>
        {description ? <p className="workspace-page-description">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}
