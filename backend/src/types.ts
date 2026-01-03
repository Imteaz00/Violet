import {
  productImages,
  products,
  users,
  //   listings,
  transactions,
  connections,
} from "./config/schema.js";

export type Connection = typeof connections.$inferSelect;
export type NewConnection = typeof connections.$inferInsert;

// export type Listing = typeof listings.$inferSelect;
// export type NewListing = typeof listings.$inferInsert;

export type ProductImage = typeof productImages.$inferSelect;
export type NewProductImage = typeof productImages.$inferInsert;

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
