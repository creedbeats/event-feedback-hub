import { ApolloClient, InMemoryCache, HttpLink, split } from "@apollo/client/core";
import { getMainDefinition } from "@apollo/client/utilities";
import { SSELink } from "./sse-link";

function makeClient() {
  const httpLink = new HttpLink({
    uri: "/api/graphql",
  });

  const sseLink = new SSELink({
    url: "/api/graphql",
  });

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    sseLink,
    httpLink
  );

  return new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            feedback: {
              keyArgs: ["filter"],
              merge(_, incoming) {
                return incoming;
              },
            },
          },
        },
      },
    }),
  });
}

let clientSingleton: ReturnType<typeof makeClient> | undefined;

export function getClient() {
  if (typeof window === "undefined") {
    return makeClient();
  }

  if (!clientSingleton) {
    clientSingleton = makeClient();
  }

  return clientSingleton;
}
