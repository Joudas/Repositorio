import { PrismaClient } from './generated/prisma'
import { PrismaNeon } from '@prisma/adapter-neon'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('Variable de entorno faltante: DATABASE_URL. Revisa .env.example')
}

const adapter = new PrismaNeon({
  connectionString,
  max: 3,
})

const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export { prisma }
