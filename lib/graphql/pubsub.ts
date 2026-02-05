import { createPubSub } from "graphql-yoga";
import type { Feedback } from "@/lib/db/schema";

export type PubSubEvents = {
  feedbackAdded: [Feedback];
};

export const pubsub = createPubSub<PubSubEvents>();
