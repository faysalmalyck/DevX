"use client";

import { useSyncExternalStore } from "react";
import type { HeaderItem } from "@/types/menu";

type NavigationTarget = {
  hash: string;
  pathname: string;
};

const normalizeHash = (hash: string) =>
  hash.length > 0 && !hash.startsWith("#") ? `#${hash}` : hash;

export const splitNavigationHref = (href: string): NavigationTarget => {
  const [pathname, fragment = ""] = href.split("#", 2);

  return {
    pathname: pathname || "/",
    hash: fragment ? `#${fragment}` : "",
  };
};

export const isNavigationHrefActive = (
  href: string,
  pathname: string,
  hash: string,
) => {
  const target = splitNavigationHref(href);
  const currentHash = normalizeHash(hash);

  if (target.hash) {
    return pathname === target.pathname && currentHash === target.hash;
  }

  return pathname === target.pathname && currentHash === "";
};

const matchesRouteFamily = (href: string, pathname: string) => {
  const { pathname: targetPathname } = splitNavigationHref(href);

  return (
    pathname === targetPathname ||
    (targetPathname !== "/" && pathname.startsWith(`${targetPathname}/`))
  );
};

export const isNavigationParentActive = (
  item: HeaderItem,
  pathname: string,
) =>
  matchesRouteFamily(item.href, pathname) ||
  (item.submenu?.some((subItem) =>
    matchesRouteFamily(subItem.href, pathname),
  ) ?? false);

const subscribeToHash = (onStoreChange: () => void) => {
  window.addEventListener("hashchange", onStoreChange);
  window.addEventListener("popstate", onStoreChange);

  return () => {
    window.removeEventListener("hashchange", onStoreChange);
    window.removeEventListener("popstate", onStoreChange);
  };
};

const getHashSnapshot = () => window.location.hash;
const getServerHashSnapshot = () => "";

export const useLocationHash = () =>
  useSyncExternalStore(
    subscribeToHash,
    getHashSnapshot,
    getServerHashSnapshot,
  );
