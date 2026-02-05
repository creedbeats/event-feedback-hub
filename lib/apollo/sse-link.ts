import {
  ApolloLink,
  Operation,
  FetchResult,
  Observable,
} from "@apollo/client/core";
import { print } from "graphql";
import { createClient, ClientOptions } from "graphql-sse";

export class SSELink extends ApolloLink {
  private client: ReturnType<typeof createClient>;

  constructor(options: ClientOptions) {
    super();
    this.client = createClient(options);
  }

  public request(operation: Operation): Observable<FetchResult> {
    return new Observable((sink) => {
      return this.client.subscribe(
        {
          query: print(operation.query),
          variables: operation.variables,
          operationName: operation.operationName,
        },
        {
          next: (data) => sink.next(data as FetchResult),
          complete: () => sink.complete(),
          error: (err) => sink.error(err),
        }
      );
    });
  }
}
