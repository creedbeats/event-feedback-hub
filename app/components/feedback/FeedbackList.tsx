"use client";

import { gql } from "@apollo/client/core";
import { useQuery, useSubscription } from "@apollo/client/react";
import { useState } from "react";
import { PaginationControls } from "../filters/PaginationControls";
import { FeedbackItem } from "./FeedbackItem";

const GET_FEEDBACK = gql`
  query GetFeedback($filter: FeedbackFilterInput, $pagination: PaginationInput) {
    feedback(filter: $filter, pagination: $pagination) {
      items {
        id
        eventId
        authorName
        content
        rating
        createdAt
        event {
          id
          name
        }
      }
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
        currentPage
        totalPages
      }
    }
  }
`;

const FEEDBACK_SUBSCRIPTION = gql`
  subscription FeedbackAdded($eventId: ID) {
    feedbackAdded(eventId: $eventId) {
      id
      eventId
      authorName
      content
      rating
      createdAt
      event {
        id
        name
      }
    }
  }
`;

interface FeedbackFilter {
  eventId?: string | null;
  minRating?: number | null;
  maxRating?: number | null;
}

interface FeedbackListProps {
  filter: FeedbackFilter;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

interface FeedbackData {
  id: string;
  eventId: string;
  authorName: string;
  content: string;
  rating: number;
  createdAt: number;
  event: {
    id: string;
    name: string;
  };
}

interface FeedbackSubscriptionData {
  feedbackAdded: FeedbackData;
}

interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  currentPage: number;
  totalPages: number;
}

interface FeedbackQueryData {
  feedback: {
    items: FeedbackData[];
    totalCount: number;
    pageInfo: PageInfo;
  };
}

export function FeedbackList({
  filter,
  page,
  pageSize,
  onPageChange,
}: FeedbackListProps) {
  const [newFeedbackIds, setNewFeedbackIds] = useState<Set<string>>(new Set());

  const graphqlFilter: Record<string, unknown> = {};
  if (filter.eventId) graphqlFilter.eventId = filter.eventId;
  if (filter.minRating) graphqlFilter.minRating = filter.minRating;
  if (filter.maxRating) graphqlFilter.maxRating = filter.maxRating;

  const { data, loading, error, refetch } = useQuery<FeedbackQueryData>(GET_FEEDBACK, {
    variables: {
      filter: Object.keys(graphqlFilter).length > 0 ? graphqlFilter : null,
      pagination: { page, pageSize },
    },
    fetchPolicy: "cache-and-network",
  });

  useSubscription<FeedbackSubscriptionData>(FEEDBACK_SUBSCRIPTION, {
    variables: { eventId: filter.eventId || null },
    onData: ({ data: subData }) => {
      if (subData.data?.feedbackAdded) {
        const newFeedback = subData.data.feedbackAdded;

        const matchesRating =
          (!filter.minRating || newFeedback.rating >= filter.minRating) &&
          (!filter.maxRating || newFeedback.rating <= filter.maxRating);

        if (matchesRating) {
          setNewFeedbackIds((prev) => new Set([...prev, newFeedback.id]));
          refetch();

          setTimeout(() => {
            setNewFeedbackIds((prev) => {
              const next = new Set(prev);
              next.delete(newFeedback.id);
              return next;
            });
          }, 5000);
        }
      }
    },
  });

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-8 bg-red-50 dark:bg-red-900/20 rounded-lg">
        Failed to load feedback: {error.message}
      </div>
    );
  }

  const feedbackData = data?.feedback;
  const items = feedbackData?.items || [];
  const pageInfo = feedbackData?.pageInfo;

  if (items.length === 0) {
    return (
      <div className="text-gray-500 dark:text-gray-400 text-center py-12 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <svg
          className="w-12 h-12 mx-auto mb-3 text-gray-400 dark:text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <p>No feedback yet. Be the first to share!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {feedbackData?.totalCount || 0} feedback
          {feedbackData?.totalCount !== 1 ? " entries" : " entry"}
        </p>
        {newFeedbackIds.size > 0 && (
          <span className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Live updates
          </span>
        )}
      </div>

      <div className="space-y-3">
        {items.map((feedback: FeedbackData) => (
          <FeedbackItem
            key={feedback.id}
            feedback={feedback}
            isNew={newFeedbackIds.has(feedback.id)}
          />
        ))}
      </div>

      {pageInfo && pageInfo.totalPages > 1 && (
        <PaginationControls
          currentPage={pageInfo.currentPage}
          totalPages={pageInfo.totalPages}
          hasNextPage={pageInfo.hasNextPage}
          hasPreviousPage={pageInfo.hasPreviousPage}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
