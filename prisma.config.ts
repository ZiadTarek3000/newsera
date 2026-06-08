import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// Prisma 7 moves connection config out of schema.prisma into this file.
// Migrations / introspection use the DIRECT (non-pooled) connection.
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DIRECT_URL"),
  },
  migrations: {
    seed: "npx tsx prisma/seed.ts",
  },
});
