import { integer, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
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
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone").notNull(),
  district: text("district").notNull(),
  address: text("location").notNull(),
  noOfShares: integer("no_of_shares").default(1).notNull(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  status: connectionStatusEnum("status").notNull().default(STATUS.PENDING),
  sellerId: text("seller_id")
    .notNull()
    .references(() => users.id),
  buyerId: text("buyer_id").references(() => users.id),
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
