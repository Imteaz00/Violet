import {
  check,
  date,
  decimal,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { users } from "../users/users.schema.js";
import { productImages } from "../productImages/productImages.schema.js";
import { transactions } from "../transactions/transactions.schema.js";
import { STATUS, TYPE } from "../../constants.js";

export const typeEnum = pgEnum("type", [TYPE.SELL, TYPE.SHARE]);
export const statusEnum = pgEnum("status", [
  STATUS.CONFIRMING,
  STATUS.VALIDATING,
  STATUS.DELIVERING,
  STATUS.DONE,
  STATUS.OPEN,
  STATUS.POPULATING,
  STATUS.RECEIVING,
]);

export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    boughtFrom: text("bought_from").notNull(),
    askingPrice: decimal("asking_price").notNull().$type<number>(),
    sellingReason: text("selling_reason"),
    expiryDate: date("expiry_date").notNull(),
    location: text("location").notNull(),
    type: typeEnum("type").notNull().default(TYPE.SELL),
    noOfShares: integer("no_of_shares").default(1).notNull(),
    quantity: text("quantity").notNull(),
    condition: text("condition").notNull(),
    remainingShares: integer("remaining_shares").default(1).notNull(),
    status: statusEnum("status").notNull().default(STATUS.VALIDATING),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    sharesCheck: check(
      "shares_check",
      sql`${table.remainingShares} <= ${table.noOfShares}`
    ),
  })
);

export const productRelations = relations(products, ({ one, many }) => ({
  productImages: many(productImages),
  transactions: many(transactions),
  user: one(users, { fields: [products.userId], references: [users.id] }),
}));
