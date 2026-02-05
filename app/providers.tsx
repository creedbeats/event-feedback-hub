"use client";

import { ApolloProvider } from "@apollo/client/react";
import { getClient } from "@/lib/apollo/client";
import { ThemeProvider } from "./providers/ThemeProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  const client = getClient();

  return (
    <ApolloProvider client={client}>
      <ThemeProvider>{children}</ThemeProvider>
    </ApolloProvider>
  );
}
