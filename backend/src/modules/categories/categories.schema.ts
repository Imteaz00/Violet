import { relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { products } from "../products/products.schema.js";

export const categories = pgTable("categories", {
  slug: text("slug").notNull().unique().primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const categoryRelations = relations(categories, ({ many }) => ({
  product: many(products),
}));
