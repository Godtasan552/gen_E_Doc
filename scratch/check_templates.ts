import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import path from 'path'

const dbPath = path.join(process.cwd(), 'dev.db')
const adapter = new PrismaBetterSqlite3({ url: dbPath })
const prisma = new PrismaClient({ adapter })

async function main() {
  const templates = await prisma.documentTemplate.findMany();
  templates.forEach(t => {
      console.log(`Template: ${t.name}`);
      console.log(`Fields: ${t.fields}`);
  });
}

main();
