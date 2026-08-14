"use client";

import { useEffect, useMemo, useState } from "react";
import { CLIENT_STORAGE_KEY, clientSort, defaultClients } from "@/data/clients";
import type { ClientRecord } from "@/lib/validation/client";
import ClientCard from "@/components/admin/clients/ClientCard";
import { HoverCard, StaggerContainer, StaggerItem } from "@/components/motion";

export default function ClientGrid() {
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CLIENT_STORAGE_KEY);
      if (stored) {
        setClients(JSON.parse(stored));
      } else {
        setClients(defaultClients);
      }
    } catch {
      localStorage.removeItem(CLIENT_STORAGE_KEY);
      setClients(defaultClients);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const activeClients = useMemo(() => {
    return clients
      .filter((client) => !client.deletedAt && client.status === "ACTIVE")
      .sort(clientSort);
  }, [clients]);

  if (!isLoaded) {
    return null;
  }

  return (
    <section id="portfolio" className="premium-shell p-0 my-0 dark:bg-darkmode">
      <StaggerContainer className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-x-6 gap-y-1 px-4 sm:px-6 lg:px-8 sm:grid-cols-2 lg:grid-cols-3">
        {activeClients.map((client) => (
          <StaggerItem key={client.id} className="h-full">
            <HoverCard className="h-full rounded-lg">
              <ClientCard client={client} />
            </HoverCard>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}
