import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Singleton de PrismaClient con driver adapter para PostgreSQL.
 *
 * Usa `@prisma/adapter-pg` para conectar Prisma 7.x con el driver `pg`.
 * El singleton evita múltiples instancias durante hot-reload con tsx.
 */
function createPrismaClient(): PrismaClient {
  const adapter = new PrismaPg({
    connectionString: process.env["DATABASE_URL"],
  });

  return new PrismaClient({
    adapter,
    log:
      process.env["NODE_ENV"] === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
}

export const prisma: PrismaClient =
  globalForPrisma.prisma ?? createPrismaClient();

if (process.env["NODE_ENV"] !== "production") {
  globalForPrisma.prisma = prisma;
}
