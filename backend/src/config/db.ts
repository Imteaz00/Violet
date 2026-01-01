import { Pool } from "pg";
import { ENV } from "./env";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

if (!ENV.database_url) {
  throw new Error("Database_URL is missing.");
}

const pool = new Pool({
  connectionString: ENV.database_url,
  max: ENV.database_pool_size ? parseInt(ENV.database_pool_size) : 10, // Default pool size: 10
});

pool.on("connect", () => console.log("Database connected."));
pool.on("error", (err) => console.log("Database connection error:", err));

export const db = drizzle({ client: pool, schema });
