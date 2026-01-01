import { date, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// export const groups = pgTable("groups", {
//     id: uuid("id").defaultRandom().primaryKey(),
//     userId: text("user_id").notNull().references(()=> users.id),
//     type: text("type").notNull()
//     createdAt: timestamp("created_at", {mode: "date"}).notNull().defaultNow(),
//     updatedAt: timestamp("updated_at", {mode: "date"}).notNull().defaultNow()
// })

// export const groupRelations = relations(groups, ({one, many}) => ({
//     users: many(users),
//     // groups: one(groups),
//     products: one(products)
// }))
