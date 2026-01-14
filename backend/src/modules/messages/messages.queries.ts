import { and, count, eq } from "drizzle-orm";
import { db } from "../../config/db.js";
import { messages } from "./messages.schema.js";
import type { NewMessage } from "../../types.js";

export const createMessage = async (data: NewMessage) => {
  const [message] = await db.insert(messages).values(data).returning();
  return message;
};

export const countMessage = async (userId: string) => {
  const [message] = await db
    .select({ count: count() })
    .from(messages)
    .where(and(eq(messages.receiver, userId), eq(messages.seen, false)));
  return message.count;
};

export const getAllMessages = async () => {
  return db.query.messages.findMany({
    orderBy: (messages, { desc }) => [desc(messages.createdAt)],
  });
};
export const getUserMessages = async (userId: string) => {
  return db.query.messages.findMany({
    where: eq(messages.receiver, userId),
    orderBy: (messages, { desc }) => [desc(messages.createdAt)],
  });
};

export const markMessagesAsSeen = async (userId: string) => {
  await db.update(messages).set({ seen: true }).where(eq(messages.receiver, userId));
};
