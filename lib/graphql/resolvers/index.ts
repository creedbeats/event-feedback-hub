import { queryResolvers } from "./queries";
import { mutationResolvers } from "./mutations";
import { subscriptionResolvers } from "./subscriptions";

export const resolvers = {
  ...queryResolvers,
  ...mutationResolvers,
  ...subscriptionResolvers,
};
