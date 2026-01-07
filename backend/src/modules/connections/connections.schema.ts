import { boolean, integer, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "../users/users.schema.js";
import { productImages } from "../productImages/productImages.schema.js";
import { products } from "../products/products.schema.js";
import { relations } from "drizzle-orm";
import { STATUS } from "../../constants.js";

export const connectionStatusEnum = pgEnum("connection_status", [
  STATUS.PENDING,
  STATUS.DELIVERING,
  STATUS.CONFIRMING,
  STATUS.DONE,
]);

export const connections = pgTable("connections", {
  id: uuid("id").defaultRandom().primaryKey(),
  noOfShares: integer("no_of_shares").default(1).notNull(),
  status: connectionStatusEnum("status").notNull().default(STATUS.PENDING),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  buyerId: text("buyer_id").references(() => users.id),
  guestBuyer: boolean("guest_buyer").notNull().default(false),
  sellerId: text("seller_id")
    .notNull()
    .references(() => users.id),
  location: text("location").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const connectionRelations = relations(connections, ({ one, many }) => ({
  product: one(products, {
    fields: [connections.productId],
    references: [products.id],
  }),
  buyer: one(users, { fields: [connections.buyerId], references: [users.id] }),
  seller: one(users, {
    fields: [connections.sellerId],
    references: [users.id],
  }),
}));
