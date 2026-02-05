import { initializeDatabase } from "@/lib/db";
import { seed } from "@/lib/db/seed";
import { resolvers } from "@/lib/graphql/resolvers";
import { typeDefs } from "@/lib/graphql/schema";
import { createSchema, createYoga } from "graphql-yoga";
import { NextRequest } from "next/server";

let initialized = false;
let initPromise: Promise<void> | null = null;

async function ensureInitialized() {
  if (initialized) return;

  if (!initPromise) {
    initPromise = (async () => {
      await initializeDatabase();
      await seed();
      initialized = true;
    })();
  }

  await initPromise;
}

const yoga = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers,
  }),
  graphqlEndpoint: "/api/graphql",
  fetchAPI: { Response },
});

export async function GET(request: NextRequest) {
  await ensureInitialized();
  return yoga.handleRequest(request, {});
}

export async function POST(request: NextRequest) {
  await ensureInitialized();
  return yoga.handleRequest(request, {});
}

export async function OPTIONS(request: NextRequest) {
  await ensureInitialized();
  return yoga.handleRequest(request, {});
}
