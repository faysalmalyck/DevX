import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function workspaceCn(...values: ClassValue[]) {
  return twMerge(clsx(values));
}
