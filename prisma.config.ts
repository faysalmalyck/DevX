// Prisma configuration — Prisma v7
// npm install --save-dev prisma dotenv
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // For migrations use the direct Postgres URL (not the prisma+postgres proxy).
    // When `prisma dev` is running locally the direct connection is on 51214.
    // In production set DIRECT_DATABASE_URL to your Postgres connection string.
    url: process.env["DIRECT_DATABASE_URL"] ?? process.env["DATABASE_URL"],
  },
});
