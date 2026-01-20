import { PgTransaction } from "drizzle-orm/pg-core";
import { db } from "../../config/db.js";
import type { NewProductImage } from "../../types.js";
import { productImages } from "./productImages.schema.js";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import { ExtractTablesWithRelations, eq } from "drizzle-orm";
import * as schema from "../../config/schema.js";

export const createProductImage = async (
  tx: PgTransaction<NodePgQueryResultHKT, typeof schema, ExtractTablesWithRelations<typeof schema>>,
  data: NewProductImage,
) => {
  const [productImage] = await tx.insert(productImages).values(data).returning();
  return productImage;
};

export const deleteProductImage = async (
  tx: PgTransaction<NodePgQueryResultHKT, typeof schema, ExtractTablesWithRelations<typeof schema>>,
  imageId: string,
) => {
  await tx.delete(productImages).where(eq(productImages.id, imageId)).returning();
};
