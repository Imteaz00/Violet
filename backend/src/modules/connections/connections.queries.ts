import { eq, ExtractTablesWithRelations } from "drizzle-orm";
import { db } from "../../config/db.js";
import type { NewConnection } from "../../types.js";
import { PgTransaction } from "drizzle-orm/pg-core";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import * as schema from "./connections.schema.js";
import { connections } from "./connections.schema.js";

export const createConnection = async (
  tx: PgTransaction<
    NodePgQueryResultHKT,
    typeof schema,
    ExtractTablesWithRelations<typeof schema>
  >,
  data: NewConnection
) => {
  const [connection] = await tx.insert(connections).values(data).returning();
  return connection;
};

export const getConnectionById = async (id: string) => {
  return db.query.connections.findFirst({
    where: eq(connections.id, id),
    with: {},
  });
};

export const updateConnection = async (
  tx: PgTransaction<
    NodePgQueryResultHKT,
    typeof schema,
    ExtractTablesWithRelations<typeof schema>
  >,
  id: string,
  data: Partial<NewConnection>
) => {
  const [connection] = await tx
    .update(connections)
    .set(data)
    .where(eq(connections.id, id))
    .returning();
  return connection;
};

export const deleteConnection = async (id: string) => {
  const [connection] = await db
    .delete(connections)
    .where(eq(connections.id, id))
    .returning();
  return connection;
};
