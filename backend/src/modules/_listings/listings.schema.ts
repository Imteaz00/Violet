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
import { transactions } from "../transactions/transactions.schema.js";
import { STATUS } from "../../constants.js";

export const listings = pgTable("listings", {
  id: uuid("id").defaultRandom().primaryKey(),
  remainingShares: integer("remainging_shares").default(1).notNull(),
  sharePrice: decimal("share_price").notNull().$type<number>(),
  status: text("status").notNull().default(STATUS.VALIDATING),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  sellerId: text("seller_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const listingRelations = relations(listings, ({ one, many }) => ({
  productImages: many(productImages),
  product: one(products, {
    fields: [listings.productId],
    references: [products.id],
  }),
  transactions: many(transactions),
  seller: one(users, { fields: [listings.sellerId], references: [users.id] }),
}));
