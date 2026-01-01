import { date, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "../users/users.schema.js";
import { productImages } from "../productImages/productImages.schema.js";

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  boughtFrom: text("bought_from").notNull(),
  sellingReason: text("selling_reason").notNull(),
  expiryDate: date("expiry_date").notNull(),
  location: text("location").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const productRelations = relations(products, ({ one, many }) => ({
  user: one(users, { fields: [products.userId], references: [users.id] }),
  // groups: one(groups, {fields: [products.userId], references: [groups.id]}),
  productImages: many(productImages),
}));
