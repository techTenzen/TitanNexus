// server/db.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@shared/schema";
import 'dotenv/config';

// Hardcode the connection string as a fallback
const connectionString = process.env.DATABASE_URL ||
    "postgresql://neondb_owner:npg_tjJn97dkDSEv@ep-twilight-dust-a5f2qn82-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require";

console.log("Database connection string available:", connectionString ? "Yes" : "No");

// Create postgres connection with proper parameters for Neon DB
const client = postgres(connectionString, {
    ssl: true,  // Changed from 'require' to true
    connection: {
        options: undefined  // Remove this line - it's causing the error
    }
});

// Create drizzle database instance
export const db = drizzle(client, { schema });