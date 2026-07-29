import { ArrowUpRight } from "lucide-react";
import type { ClientRecord } from "@/lib/validation/client";

export default function ClientCard({ client }: { client: any }) {
  // Use client.logo OR fallback to client.image
  const logoSrc = client.logo || client.image;

  return (
    <a
      href={client.website || client.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      <article className="flex aspect-square flex-col justify-between p-6 transition duration-300 hover:-translate-y-1">
        <div className="flex flex-1 items-center justify-center">
          <img
            src={logoSrc}
            alt={`${client.companyName || client.title} logo`}
            className="max-h-[120px] max-w-full object-contain transition duration-300 group-hover:scale-105"
          />
        </div>
      </article>
    </a>
  );
}