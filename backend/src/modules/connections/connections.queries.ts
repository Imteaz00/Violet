import { and, count, eq, ExtractTablesWithRelations, or } from "drizzle-orm";
import { db } from "../../config/db.js";
import type { NewConnection } from "../../types.js";
import { PgTransaction } from "drizzle-orm/pg-core";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import * as schema from "./connections.schema.js";
import { connections } from "./connections.schema.js";

export const createConnection = async (
  tx: PgTransaction<NodePgQueryResultHKT, typeof schema, ExtractTablesWithRelations<typeof schema>>,
  data: NewConnection,
) => {
  const [connection] = await tx.insert(connections).values(data).returning();
  return connection;
};

export const getAllConnections = async () => {
  return db.query.connections.findMany({
    with: { buyer: true, seller: true, product: true },
  });
};

// export const getConnectionById = async (id: string) => {
//   return db.query.connections.findFirst({
//     where: eq(connections.id, id),
//     with: { buyer: true, seller: true, product: true },
//   });
// };

export const getUserConnection = async (userId: string) => {
  return db.query.connections.findMany({
    where: eq(connections.buyerId, userId),
    with: { buyer: true, seller: true, product: true },
    orderBy: (connections, { desc }) => [desc(connections.createdAt)],
  });
};

export const getConnectionCount = async (userId: string) => {
  const [connection] = await db
    .select({ count: count() })
    .from(connections)
    .where(
      and(
        eq(connections.buyerId, userId),
        or(
          eq(connections.status, "awaiting"),
          eq(connections.status, "pending"),
          eq(connections.status, "delivering"),
        ),
      ),
    );
  return connection.count;
};

export const updateConnectionStatus = async (
  id: string,
  status: "pending" | "delivering" | "confirming" | "done",
) => {
  const connection = await db
    .update(connections)
    .set({ status })
    .where(eq(connections.id, id))
    .returning();
  return connection;
};

export const deleteConnection = async (
  tx: PgTransaction<NodePgQueryResultHKT, typeof schema, ExtractTablesWithRelations<typeof schema>>,
  id: string,
) => {
  const [connection] = await tx.delete(connections).where(eq(connections.id, id)).returning();
  return connection;
};
