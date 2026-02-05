import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Load .env.local for CLI scripts (Next.js loads this automatically)
config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const queryClient = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(queryClient, { schema });

export async function initializeDatabase() {
  try {
    await queryClient`SELECT 1`;
    console.log("Database connection verified");
  } catch (error) {
    console.error("Failed to connect to database:", error);
    throw error;
  }
}

export async function closeDatabase() {
  await queryClient.end();
}

export { schema };
