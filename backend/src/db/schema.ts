import { date, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm"; 

export const users = pgTable("users", {
    id: text("id").primaryKey(),
    email: text("email").unique(),
    name: text("name").notNull(),
    imageUrl: text("image_url"),
    phone: text("phone").unique(),
    createdAt: timestamp("created_at", {mode: "date"}).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", {mode: "date"}).notNull().defaultNow()
})

export const products =  pgTable("products", {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    description : text("description").notNull(),
    bought_from : text("bought_from").notNull(),
    selling_reason : text("selling_reason").notNull(),
    expiry_date : date("expiry_date").notNull(),
    location : text("location"),
    userId: text("user_id").notNull().references(()=> users.id,  { onDelete : "cascade"  }),
    createdAt: timestamp("created_at", {mode: "date"}).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", {mode: "date"}).notNull().defaultNow()
})

export const productImages = pgTable("product_images", {
    id: text("id").notNull().primaryKey(),
    productId: uuid("product_id").notNull().references(()=> products.id, {onDelete: "cascade"}),
    createdAt: timestamp("created_at", {mode: "date"}).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", {mode: "date"}).notNull().defaultNow()
})

// export const groups = pgTable("groups", {
    //     id: uuid("id").defaultRandom().primaryKey(),
    //     userId: text("user_id").notNull().references(()=> users.id),
    //     type: text("type").notNull()
    //     createdAt: timestamp("created_at", {mode: "date"}).notNull().defaultNow(),
    //     updatedAt: timestamp("updated_at", {mode: "date"}).notNull().defaultNow()
// })

export const usersRelations = relations(users, ({many}) => ({
    products: many(products),
    // groups = many(groups),
}))

export const productRelations = relations(products, ({one, many}) => ({
    users: one(users, {fields: [products.userId], references: [users.id]}),
    // groups: one(groups, {fields: [products.userId], references: [groups.id]}),
    product_images: many(productImages)
}))

export const productImagesRelations = relations(productImages, ({one, many}) => ({
    // users: one(users, {fields: [productImages.userId], references: [users.id]}),
    // groups: one(groups),
    products: one(products)
}))

// export const groupRelations = relations(groups, ({one, many}) => ({
//     users: many(users),
//     // groups: one(groups),
//     products: one(products)
// }))

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export type Product = typeof products.$inferSelect
export type NewProduct = typeof products.$inferInsert

export type ProductImage = typeof productImages.$inferSelect
export type NewProductImage = typeof productImages.$inferInsert