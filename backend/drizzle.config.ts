import { defineConfig } from "drizzle-kit";
import { ENV } from "./src/config/env";

export default defineConfig({
  schema: "./src/config/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: ENV.database_url!,
  },
});
