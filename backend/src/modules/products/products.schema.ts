import {
  date,
  decimal,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "../users/users.schema.js";
import { productImages } from "../productImages/productImages.schema.js";
import { transactions } from "../transactions/transactions.schema.js";
import { STATUS, TYPE } from "../../constants.js";

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  boughtFrom: text("bought_from").notNull(),
  askingPrice: decimal("askingPrice").notNull().$type<number>(),
  sellingReason: text("selling_reason"),
  expiryDate: date("expiry_date").notNull(),
  location: text("location").notNull(),
  type: text("type").notNull().default(TYPE.SELL),
  noOfShares: integer("no_of_shares").default(1).notNull(),
  quantity: text("quantity").notNull(),
  condition: text("condition").notNull(),
  remainingShares: integer("remainging_shares").default(1).notNull(),
  status: text("status").notNull().default(STATUS.VALIDATING),
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
  productImages: many(productImages),
  transactions: many(transactions),
  user: one(users, { fields: [products.userId], references: [users.id] }),
}));
