import { relations, sql } from "drizzle-orm";
import { check, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { products } from "../products/products.schema.js";

export const categories = pgTable(
  "categories",
  {
    slug: text("slug").notNull().unique().primaryKey(),
    name: text("name").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    slugFormat: check("slug_format", sql`${table.slug} ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'`),
  })
);

export const categoryRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));
