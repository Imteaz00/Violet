import { defineConfig } from "drizzle-kit";
import { ENV } from "./src/config/env";

export default defineConfig({
  schema: "./dist/config/schema.js",
  dialect: "postgresql",
  dbCredentials: {
    url: ENV.database_url!,
  },
});
