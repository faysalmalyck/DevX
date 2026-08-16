import type { Metadata } from "next";
import NotFound from "@/components/not-found";

export const metadata: Metadata = {
  title: "404 Page | DevX",
  description: "The page you are looking for does not exist.",
};

export default function ErrorPage() {
  return <NotFound />;
}
