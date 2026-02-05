import { pubsub } from "@/lib/graphql/pubsub";
import { pipe, filter } from "@graphql-yoga/subscription";
import type { Feedback } from "@/lib/db/schema";

export const subscriptionResolvers = {
  Subscription: {
    feedbackAdded: {
      subscribe: (_: unknown, args: { eventId?: string }) => {
        return pipe(
          pubsub.subscribe("feedbackAdded"),
          filter((feedback: Feedback) => {
            if (!args.eventId) return true;
            return feedback.eventId === args.eventId;
          })
        );
      },
      resolve: (payload: Feedback) => payload,
    },
  },
};
