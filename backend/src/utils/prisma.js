import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import path from "path";

// Manually load .env from the root to ensure cross-workspace compatibility
const rootEnv = path.resolve(process.cwd(), "../../.env");
const projectEnv = path.resolve(process.cwd(), "../.env");
const localEnv = path.resolve(process.cwd(), ".env");

dotenv.config({ path: rootEnv });
dotenv.config({ path: projectEnv });
dotenv.config({ path: localEnv });

if (!process.env.DATABASE_URL) {
  console.warn("⚠️ DATABASE_URL not found in process.env. Attempting fallback...");
}

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma || new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL || "postgresql://postgres.uuzsndzbjsqdymlaayah:Krish%4066336@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
      }
    }
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
