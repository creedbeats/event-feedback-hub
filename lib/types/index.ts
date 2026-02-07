// Shared types for GraphQL operations
// Used by both client and server

export interface Event {
  id: string;
  name: string;
  description: string | null;
  date: string;
  createdAt: string;
  feedback?: Feedback[];
  feedbackCount?: number;
  averageRating?: number | null;
}

export interface Feedback {
  id: string;
  eventId: string;
  event?: Event;
  authorName: string;
  content: string;
  rating: number;
  createdAt: string;
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  currentPage: number;
  totalPages: number;
}

export interface FeedbackConnection {
  items: Feedback[];
  totalCount: number;
  pageInfo: PageInfo;
}

// Input types
export interface FeedbackFilterInput {
  eventId?: string | null;
  minRating?: number | null;
  maxRating?: number | null;
}

export interface PaginationInput {
  page?: number;
  pageSize?: number;
}

export interface CreateFeedbackInput {
  eventId: string;
  authorName: string;
  content: string;
  rating: number;
}

// API Response types
export interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

export interface EventsResponse {
  events: Event[];
}

export interface EventResponse {
  event: Event | null;
}

export interface FeedbackResponse {
  feedback: FeedbackConnection;
}

export interface CreateFeedbackResponse {
  createFeedback: Feedback;
}
