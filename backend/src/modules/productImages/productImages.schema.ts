import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { products } from "../products/products.schema";

export const productImages = pgTable("product_images", {
  id: text("id").notNull().primaryKey(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const productImagesRelations = relations(
  productImages,
  ({ one, many }) => ({
    // users: one(users, {fields: [productImages.userId], references: [users.id]}),
    // groups: one(groups),
    products: one(products, {
      fields: [productImages.productId],
      references: [products.id],
    }),
  })
);
