import { pgTable, uuid, text, integer, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  date: text("date").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const feedback = pgTable("feedback", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id")
    .notNull()
    .references(() => events.id),
  authorName: text("author_name").notNull(),
  content: text("content").notNull(),
  rating: integer("rating").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const eventsRelations = relations(events, ({ many }) => ({
  feedback: many(feedback),
}));

export const feedbackRelations = relations(feedback, ({ one }) => ({
  event: one(events, {
    fields: [feedback.eventId],
    references: [events.id],
  }),
}));

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
export type Feedback = typeof feedback.$inferSelect;
export type NewFeedback = typeof feedback.$inferInsert;
