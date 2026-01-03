import {
  decimal,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { users } from "../users/users.schema.js";
import { productImages } from "../productImages/productImages.schema.js";
import { products } from "../products/products.schema.js";
import { relations } from "drizzle-orm";
import { listings } from "../listings/listings.schema.js";

export const transactions = pgTable("transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  productName: text("product_name").notNull(),
  buyerName: text("product_name").notNull(),
  sellerName: text("product_name").notNull(),
  noOfShares: integer("no_of_shares").default(1),
  sharePrice: decimal("share_price").notNull().$type<number>(),
  listingId: uuid("listing_id")
    .notNull()
    .references(() => listings.id),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id),
  buyerId: text("seller_id")
    .notNull()
    .references(() => users.id),
  sellerId: text("seller_id")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const transactionRelations = relations(
  transactions,
  ({ one, many }) => ({
    listing: one(listings, {
      fields: [transactions.listingId],
      references: [listings.id],
    }),
    productImages: many(productImages),
    product: one(products, {
      fields: [transactions.productId],
      references: [products.id],
    }),
    buyer: one(users, {
      fields: [transactions.buyerId],
      references: [users.id],
    }),
    seller: one(users, {
      fields: [transactions.sellerId],
      references: [users.id],
    }),
  })
);
