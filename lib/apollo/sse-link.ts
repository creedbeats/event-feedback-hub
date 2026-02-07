import { ApolloLink, Observable } from "@apollo/client";
import type { ExecutionResult } from "graphql";
import { print } from "graphql";
import { createClient, type ClientOptions } from "graphql-sse";

type ApolloOperation = {
  query: import("graphql").DocumentNode;
  variables: Record<string, unknown>;
  operationName: string | undefined;
};

export class SSELink extends ApolloLink {
  private client: ReturnType<typeof createClient>;

  constructor(options: ClientOptions) {
    super();
    this.client = createClient(options);
  }

  public request(operation: ApolloOperation): Observable<ExecutionResult> {
    return new Observable((sink) => {
      return this.client.subscribe(
        {
          query: print(operation.query),
          variables: operation.variables,
          operationName: operation.operationName,
        },
        {
          next: (value) => sink.next(value as ExecutionResult),
          complete: () => sink.complete(),
          error: (err) => sink.error(err),
        }
      );
    });
  }
}
