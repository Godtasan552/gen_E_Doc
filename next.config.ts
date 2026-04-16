import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // We include puppeteer and other heavy libraries as external packages
  serverExternalPackages: ["@prisma/client", "better-sqlite3", "puppeteer", "mammoth", "pizzip", "docxtemplater"],
};

export default nextConfig;
