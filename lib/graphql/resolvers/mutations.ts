import { db, schema } from "@/lib/db";
import { pubsub } from "@/lib/graphql/pubsub";
import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";

interface CreateFeedbackInput {
  eventId: string;
  authorName: string;
  content: string;
  rating: number;
}

export const mutationResolvers = {
  Mutation: {
    createFeedback: (
      _: unknown,
      { input }: { input: CreateFeedbackInput }
    ) => {
      if (input.rating < 1 || input.rating > 5) {
        throw new Error("Rating must be between 1 and 5");
      }

      if (!input.content.trim()) {
        throw new Error("Content is required");
      }

      if (!input.authorName.trim()) {
        throw new Error("Author name is required");
      }

      const event = db
        .select()
        .from(schema.events)
        .where(eq(schema.events.id, input.eventId))
        .get();

      if (!event) {
        throw new Error("Event not found");
      }

      const id = uuidv4();
      const createdAt = new Date().toISOString();

      db.insert(schema.feedback)
        .values({
          id,
          eventId: input.eventId,
          authorName: input.authorName.trim(),
          content: input.content.trim(),
          rating: input.rating,
          createdAt,
        })
        .run();

      const feedback = db
        .select()
        .from(schema.feedback)
        .where(eq(schema.feedback.id, id))
        .get();

      if (feedback) {
        pubsub.publish("feedbackAdded", feedback);
      }

      return feedback;
    },
  },
};
