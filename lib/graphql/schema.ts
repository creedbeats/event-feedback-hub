export const typeDefs = /* GraphQL */ `
  type Event {
    id: ID!
    name: String!
    description: String
    date: String!
    createdAt: String!
    feedback: [Feedback!]!
    feedbackCount: Int!
    averageRating: Float
  }

  type Feedback {
    id: ID!
    eventId: ID!
    event: Event!
    authorName: String!
    content: String!
    rating: Int!
    createdAt: String!
  }

  type FeedbackConnection {
    items: [Feedback!]!
    totalCount: Int!
    pageInfo: PageInfo!
  }

  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    currentPage: Int!
    totalPages: Int!
  }

  input FeedbackFilterInput {
    eventId: ID
    minRating: Int
    maxRating: Int
  }

  input PaginationInput {
    page: Int = 1
    pageSize: Int = 10
  }

  input CreateFeedbackInput {
    eventId: ID!
    authorName: String!
    content: String!
    rating: Int!
  }

  type Query {
    events: [Event!]!
    event(id: ID!): Event
    feedback(
      filter: FeedbackFilterInput
      pagination: PaginationInput
    ): FeedbackConnection!
  }

  type Mutation {
    createFeedback(input: CreateFeedbackInput!): Feedback!
  }

  type Subscription {
    feedbackAdded(eventId: ID): Feedback!
  }
`
