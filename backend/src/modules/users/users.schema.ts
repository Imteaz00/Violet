import { decimal, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { products } from "../products/products.schema.js";
import { productImages } from "../productImages/productImages.schema.js";
import { transactions } from "../transactions/transactions.schema.js";
import { ROLE } from "../../constants.js";

export const roleEnum = pgEnum("role", [ROLE.ADMIN, ROLE.USER]);
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").unique(),
  name: text("name").notNull(),
  imageUrl: text("image_url"),
  phone: text("phone").unique(),
  balance: decimal("balance").notNull().default("0").$type<number>(),
  location: text("location"),
  role: roleEnum("role").notNull().default(ROLE.USER),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const usersRelations = relations(users, ({ many }) => ({
  productImages: many(productImages),
  products: many(products),
  transactions: many(transactions),
}));
