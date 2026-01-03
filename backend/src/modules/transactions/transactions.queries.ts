import { eq, ExtractTablesWithRelations } from "drizzle-orm";
import { db } from "../../config/db.js";
import type { NewTransaction } from "../../types.js";
import { transactions } from "./transactions.schema.js";
import { PgTransaction } from "drizzle-orm/pg-core";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import * as schema from "./transactions.schema.js";

export const createTransaction = async (
  tx: PgTransaction<
    NodePgQueryResultHKT,
    typeof schema,
    ExtractTablesWithRelations<typeof schema>
  >,
  data: NewTransaction
) => {
  const [newTransaction] = await tx
    .insert(transactions)
    .values(data)
    .returning();
  return { newTransaction };
};

export const getTransactionById = async (id: string) => {
  return db.query.transactions.findFirst({
    where: eq(transactions.id, id),
    with: {},
  });
};
