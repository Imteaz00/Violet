import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid, boolean } from "drizzle-orm/pg-core";
import { users } from "../users/users.schema.js";

export const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  text: text("text").notNull(),
  receiver: text("receiver").references(() => users.id, { onDelete: "no action" }),
  sender: text("sender").references(() => users.id, { onDelete: "no action" }),
  seen: boolean("seen").notNull().default(false),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const messageRelations = relations(messages, ({ one }) => ({
  senderUser: one(users, { fields: [messages.sender], references: [users.id] }),
  receiverUser: one(users, { fields: [messages.receiver], references: [users.id] }),
}));
