import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import path from 'path'

const dbPath = path.join(process.cwd(), 'dev.db')
const adapter = new PrismaBetterSqlite3({ url: dbPath })
const prisma = new PrismaClient({ adapter })

async function main() {
  const templates = await prisma.documentTemplate.findMany();
  console.log("TEMPLATES:", JSON.stringify(templates, null, 2));
  
  const submissions = await prisma.submission.findMany();
  console.log("SUBMISSIONS:", JSON.stringify(submissions, null, 2));
}

main();
