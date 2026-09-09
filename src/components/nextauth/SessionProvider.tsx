"use client";
import React from "react";

export default function SessionProviderComp({
  children,
}: {
  children: React.ReactNode;
  session?: unknown;
}) {
  return <>{children}</>;
}
