import { Pool } from "pg";
import { ENV } from "../config/env.js";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema"

if (!ENV.database_url){
    throw new Error("Database_URL is not missing.")
}

const pool = new Pool({ connectionString: ENV.database_url }) //can be increased by using max

pool.on("connect", () => console.log("Database connected."))
pool.on("error", (err) => console.log("Database connection error:", err))

export const dc = drizzle({client:pool, schema })