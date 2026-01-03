import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { products } from "../products/products.schema.js";
import { listings } from "../listings/listings.schema.js";
import { users } from "../users/users.schema.js";
import { transactions } from "../transactions/transactions.schema.js";

export const productImages = pgTable("product_images", {
  id: text("id").notNull().primaryKey(),
  listingId: uuid("listing_id")
    .notNull()
    .references(() => listings.id, { onDelete: "cascade" }),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const productImagesRelations = relations(
  productImages,
  ({ one, many }) => ({
    listing: one(listings, {
      fields: [productImages.listingId],
      references: [listings.id],
    }),
    product: one(products, {
      fields: [productImages.productId],
      references: [products.id],
    }),
    transactions: many(transactions),
    user: one(users, {
      fields: [productImages.userId],
      references: [users.id],
    }),
  })
);
