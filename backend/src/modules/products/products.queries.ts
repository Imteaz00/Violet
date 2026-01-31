import { and, count, eq, ExtractTablesWithRelations, gte, ilike, or, SQL, sql } from "drizzle-orm";
import { db } from "../../config/db.js";
import { products } from "./products.schema.js";
import type { NewProduct } from "../../types.js";
import { PgTransaction } from "drizzle-orm/pg-core";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import * as schema from "../../config/schema.js";
import { STATUS } from "../../constants.js";

type DbTransaction = PgTransaction<
  NodePgQueryResultHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>;

const isUuid = (value: string) =>
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(value);

export const createProduct = async (tx: DbTransaction, data: NewProduct) => {
  const [product] = await tx.insert(products).values(data).returning();
  return product;
};

export const countProduct = async (userId: string) => {
  const [product] = await db
    .select({ count: count() })
    .from(products)
    .where(
      and(
        or(eq(products.status, STATUS.ACTIVE), eq(products.status, STATUS.VALIDATING)),
        eq(products.userId, userId),
      ),
    );
  return product.count;
};

export const getAllProducts = async ({
  category,
  search,
  sort,
  limit,
  offset,
  status,
  type,
}: {
  category: string;
  search: string;
  sort: string;
  limit: number;
  offset: number;
  status: string;
  type: string;
}) => {
  // Normalize inputs: treat empty strings as absent
  let qCategory = category?.trim() || undefined;
  const qSearch = search?.trim() || undefined;
  if (qCategory === "all") qCategory = undefined;
  // Build conditions safely
  const conditions: (SQL | undefined)[] = [];
  if (qSearch) {
    const pattern = sql`'%' || ${qSearch} || '%'`;
    conditions.push(
      or(
        ilike(products.title, pattern),
        ilike(products.description, pattern),
        ilike(products.location, pattern),
        ilike(products.condition, pattern),
      ),
    );
  }
  if (qCategory) {
    conditions.push(eq(products.category, qCategory));
  }
  if (status === "active" || status === "validating" || status === "sold") {
    conditions.push(eq(products.status, status));
  } else if (status !== "all") {
    conditions.push(eq(products.status, STATUS.ACTIVE));
  }

  if (type === "sell" || type === "share") {
    conditions.push(eq(products.type, type));
  }

  // Base query options
  const queryOptions: any = {
    limit,
    offset,
    with: { productImages: true },
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
  if (!isUuid(id)) return null;

  return db.query.products.findFirst({
    where: eq(products.id, id),
    with: { productImages: true },
  });
};

export const getProductByIdAdmin = async (id: string) => {
  if (!isUuid(id)) return null;

  return db.query.products.findFirst({
    where: eq(products.id, id),
    with: { productImages: true, user: true },
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

export const deleteProduct = async (tx: DbTransaction, id: string) => {
  const [product] = await tx.delete(products).where(eq(products.id, id)).returning();
  return product;
};

export const decreaseRemainingShare = async (tx: DbTransaction, noOfShares: number, id: string) => {
  const [product] = await tx
    .update(products)
    .set({ remainingShares: sql`${products.remainingShares}-${noOfShares}` })
    .where(and(eq(products.id, id), gte(products.remainingShares, noOfShares)))
    .returning();
  return product;
};
