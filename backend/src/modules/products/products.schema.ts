import {
  check,
  date,
  decimal,
  index,
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
import { categories } from "../categories/categories.schema.js";

export const typeEnum = pgEnum("type", [TYPE.SELL, TYPE.SHARE]);
export const productStatusEnum = pgEnum("product_status", [
  STATUS.VALIDATING,
  STATUS.SOLD,
  STATUS.ACTIVE,
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
    status: productStatusEnum("status").notNull().default(STATUS.VALIDATING),
    slug: text("slug").references(() => categories.slug, { onDelete: "set null" }),
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
    sharesCheck: check("shares_check", sql`${table.remainingShares} <= ${table.noOfShares}`),
    notZeroCheck: check("not_zero_check", sql`${table.noOfShares} > 0`),
    titleIdx: index("title_idx").on(table.title),
    descriptionIdx: index("description_idx").on(table.description),
    locationIdx: index("location_idx").on(table.location),
    conditionIdx: index("condition_idx").on(table.condition),
    slugIdx: index("slug_idx").on(table.slug),
  })
);

export const productRelations = relations(products, ({ one, many }) => ({
  productImages: many(productImages),
  transactions: many(transactions),
  user: one(users, { fields: [products.userId], references: [users.id] }),
  category: one(categories, { fields: [products.slug], references: [categories.slug] }),
}));
