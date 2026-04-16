import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  serverExternalPackages: ["@prisma/client", "better-sqlite3", "libreoffice-convert", "pizzip", "docxtemplater"],
};

export default nextConfig;
