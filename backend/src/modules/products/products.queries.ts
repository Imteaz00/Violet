import { and, eq, ExtractTablesWithRelations, gte, ilike, or, sql } from "drizzle-orm";
import { db } from "../../config/db.js";
import { products } from "./products.schema.js";
import type { NewProduct } from "../../types.js";
import { PgTransaction } from "drizzle-orm/pg-core";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import * as schema from "../../config/schema.js";

export const createProduct = async (data: NewProduct) => {
  const [product] = await db.insert(products).values(data).returning();
  return product;
};
export const getAllProducts = async ({
  category,
  search,
  sort,
  limit,
  offset,
}: {
  category: string;
  search: string;
  sort: string;
  limit: number;
  offset: number;
}) => {
  // Normalize inputs: treat empty strings as absent
  const qCategory = category?.trim() || undefined;
  const qSearch = search?.trim() || undefined;

  // Build conditions safely
  const conditions: any[] = [];
  if (qSearch) {
    const pattern = sql`'%' || ${qSearch} || '%'`;
    conditions.push(
      or(
        ilike(products.title, pattern),
        ilike(products.description, pattern),
        ilike(products.location, pattern),
        ilike(products.condition, pattern)
      )
    );
  }
  if (qCategory) {
    conditions.push(eq(products.category, qCategory));
  }

  // Base query options
  const queryOptions: any = {
    limit,
    offset,
    with: { user: true, productImages: true },
  };
  if (conditions.length) queryOptions.where = and(...conditions);

  // Single place to compute ordering based on `sort`
  const orderBy = (p: typeof products, helpers: any) => {
    const { asc, desc } = helpers;
    if (sort === "asc") return [asc(sql`${p.askingPrice} / ${p.noOfShares}`)];
    if (sort === "desc") return [desc(sql`${p.askingPrice} / ${p.noOfShares}`)];
    return [desc(p.createdAt)];
  };

  return db.query.products.findMany({ ...queryOptions, orderBy });
};

export const getProductById = async (id: string) => {
  const isUuid = (value: string) =>
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(value);
  if (!isUuid(id)) return null;

  return db.query.products.findFirst({
    where: eq(products.id, id),
    with: {
      user: true,
      productImages: true,
    },
  });
};

export const getProductsByUserId = async (userId: string) => {
  return db.query.products.findMany({
    where: eq(products.userId, userId),
    with: { user: true, productImages: true },
    orderBy: (products, { desc }) => [desc(products.createdAt)],
  });
};

export const updateProduct = async (id: string, data: Partial<NewProduct>) => {
  const [product] = await db.update(products).set(data).where(eq(products.id, id)).returning();
  return product;
};

export const deleteProduct = async (id: string) => {
  const [product] = await db.delete(products).where(eq(products.id, id)).returning();
  return product;
};

export const decreaseRemainingShare = async (
  tx: PgTransaction<NodePgQueryResultHKT, typeof schema, ExtractTablesWithRelations<typeof schema>>,
  noOfShares: number,
  id: string
) => {
  const [product] = await tx
    .update(products)
    .set({ remainingShares: sql`${products.remainingShares}-${noOfShares}` })
    .where(and(eq(products.id, id), gte(products.remainingShares, noOfShares)))
    .returning();
  return product;
};
