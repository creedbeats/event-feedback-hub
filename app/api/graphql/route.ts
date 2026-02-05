import { initializeDatabase } from '@/lib/db'
import { seed } from '@/lib/db/seed'
import { resolvers } from '@/lib/graphql/resolvers'
import { typeDefs } from '@/lib/graphql/schema'
import { createSchema, createYoga } from 'graphql-yoga'
import { NextRequest } from 'next/server'

initializeDatabase()
seed()

const yoga = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers,
  }),
  graphqlEndpoint: '/api/graphql',
  fetchAPI: { Response },
})

export async function GET(request: NextRequest) {
  return yoga.handleRequest(request, {})
}

export async function POST(request: NextRequest) {
  return yoga.handleRequest(request, {})
}

export async function OPTIONS(request: NextRequest) {
  return yoga.handleRequest(request, {})
}
