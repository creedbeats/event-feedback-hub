'use client'

import { ApolloClient, HttpLink, InMemoryCache, split } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { SSELink } from './sse-link'

const GRAPHQL_ENDPOINT = '/api/graphql'

let apolloClient: ApolloClient | null = null

function createApolloClient() {
  const httpLink = new HttpLink({
    uri: GRAPHQL_ENDPOINT,
  })

  const sseLink = new SSELink({
    url: GRAPHQL_ENDPOINT,
  })

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query)
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      )
    },
    sseLink,
    httpLink
  )

  return new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
      },
    },
  })
}

export function getClient() {
  if (typeof window === 'undefined') {
    return createApolloClient()
  }

  if (!apolloClient) {
    apolloClient = createApolloClient()
  }

  return apolloClient
}
