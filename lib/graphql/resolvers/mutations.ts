import { db, schema } from "@/lib/db";
import { pubsub } from "@/lib/graphql/pubsub";
import { eq } from "drizzle-orm";

interface CreateFeedbackInput {
  eventId: string;
  authorName: string;
  content: string;
  rating: number;
}

export const mutationResolvers = {
  Mutation: {
    createFeedback: async (
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

      const events = await db
        .select()
        .from(schema.events)
        .where(eq(schema.events.id, input.eventId));

      if (events.length === 0) {
        throw new Error("Event not found");
      }

      const [feedback] = await db
        .insert(schema.feedback)
        .values({
          eventId: input.eventId,
          authorName: input.authorName.trim(),
          content: input.content.trim(),
          rating: input.rating,
        })
        .returning();

      if (feedback) {
        pubsub.publish("feedbackAdded", feedback);
      }

      return feedback;
    },
  },
};
