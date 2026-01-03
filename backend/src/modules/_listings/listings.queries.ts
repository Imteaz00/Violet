import { and, eq, ExtractTablesWithRelations, gte, sql } from "drizzle-orm";
import { db } from "../../config/db.js";
import type { Listing, NewListing } from "../../types.js";
import { listings } from "./listings.schema.js";
import { PgTransaction } from "drizzle-orm/pg-core";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import * as schema from "./listings.schema.js";

export const createListing = async (
  tx: PgTransaction<
    NodePgQueryResultHKT,
    typeof schema,
    ExtractTablesWithRelations<typeof schema>
  >,
  data: NewListing
) => {
  const [listing] = await tx.insert(listings).values(data).returning();
  return listing;
};

export const getListingById = async (id: string) => {
  return db.query.listings.findFirst({
    where: eq(listings.id, id),
    with: {
      seller: true,
      product: true,
    },
  });
};

export const updateListing = async (
  tx: PgTransaction<
    NodePgQueryResultHKT,
    typeof schema,
    ExtractTablesWithRelations<typeof schema>
  >,
  id: string,
  data: Partial<NewListing>
) => {
  const [listing] = await tx
    .update(listings)
    .set(data)
    .where(eq(listings.id, id))
    .returning();
  return listing;
};

export const decreaseListing = async (
  tx: PgTransaction<
    NodePgQueryResultHKT,
    typeof schema,
    ExtractTablesWithRelations<typeof schema>
  >,
  noOfShare: number,
  id: string
) => {
  const [listing] = await tx
    .update(listings)
    .set({ remainingShares: sql`${listings.remainingShares}-${noOfShare}` })
    .where(and(eq(listings.id, id), gte(listings.remainingShares, noOfShare)))
    .returning();
  return listing;
};

export const deleteListing = async (id: string) => {
  const [listing] = await db
    .delete(listings)
    .where(eq(listings.id, id))
    .returning();
  return listing;
};
