import type { HTMLAttributes } from "react";

import { workspaceCn } from "./cn";

type WorkspaceSurfaceProps = HTMLAttributes<HTMLDivElement> & {
  tone?: "default" | "muted" | "command";
};

export function WorkspaceSurface({
  className,
  tone = "default",
  ...props
}: WorkspaceSurfaceProps) {
  return (
    <div
      className={workspaceCn(
        "workspace-surface",
        tone === "muted" && "workspace-surface-muted",
        tone === "command" && "workspace-surface-command",
        className
      )}
      {...props}
    />
  );
}
