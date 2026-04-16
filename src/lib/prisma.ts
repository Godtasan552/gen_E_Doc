import { PrismaClient } from '../generated/prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import path from 'path'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

const createPrismaClient = () => {
  const dbPath = path.join(process.cwd(), 'dev.db')
  // In Prisma 7, the adapter takes an object with the URL directly
  const adapter = new PrismaBetterSqlite3({ url: dbPath })
  return new PrismaClient({ adapter, log: ['query'] })
}

export const prisma = globalForPrisma.prisma || createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
