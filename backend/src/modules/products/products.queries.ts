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
  const baseQuery = {
    where: search
      ? or(
          ilike(products.title, sql`%${search}%`),
          ilike(products.description, sql`%${search}%`),
          ilike(products.location, sql`%${search}%`),
          ilike(products.condition, sql`%${search}%`),
          ilike(products.slug, sql`%${category}%`)
        )
      : undefined,
    limit,
    offset,
  };

  switch (sort) {
    case "asc":
      return db.query.products.findMany({
        ...baseQuery,
        with: {
          user: true,
          productImages: true,
        },
        orderBy: (_, { asc }) => [asc(sql`${products.askingPrice} / ${products.noOfShares}`)],
      });
    case "desc":
      return db.query.products.findMany({
        ...baseQuery,
        with: {
          user: true,
          productImages: true,
        },
        orderBy: (_, { desc }) => [desc(sql`${products.askingPrice} / ${products.noOfShares}`)],
      });
    default:
      return db.query.products.findMany({
        ...baseQuery,
        with: {
          user: true,
          productImages: true,
        },
        orderBy: (_, { desc }) => [desc(products.createdAt)],
      });
  }
};

export const getProductById = async (id: string) => {
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
