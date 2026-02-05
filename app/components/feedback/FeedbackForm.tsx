"use client";

import { useState } from "react";
import { gql } from "@apollo/client/core";
import { useMutation } from "@apollo/client/react";
import { StarRating } from "./StarRating";
import { EventSelector } from "../events/EventSelector";

const CREATE_FEEDBACK = gql`
  mutation CreateFeedback($input: CreateFeedbackInput!) {
    createFeedback(input: $input) {
      id
      eventId
      authorName
      content
      rating
      createdAt
    }
  }
`;

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

interface FeedbackFormProps {
  preselectedEventId?: string | null;
}

export function FeedbackForm({ preselectedEventId }: FeedbackFormProps) {
  const [eventId, setEventId] = useState<string | null>(
    preselectedEventId || null
  );
  const [authorName, setAuthorName] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");

  const [createFeedback, { loading, error }] = useMutation(CREATE_FEEDBACK, {
    refetchQueries: [{ query: GET_FEEDBACK }],
    onCompleted: () => {
      setAuthorName("");
      setContent("");
      setRating(0);
      if (!preselectedEventId) {
        setEventId(null);
      }
      setSuccessMessage("Feedback submitted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!eventId || !authorName.trim() || !content.trim() || rating === 0) {
      return;
    }

    await createFeedback({
      variables: {
        input: {
          eventId,
          authorName: authorName.trim(),
          content: content.trim(),
          rating,
        },
      },
    });
  };

  const isValid =
    eventId && authorName.trim() && content.trim() && rating > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Event
        </label>
        <EventSelector
          selectedEventId={eventId}
          onEventChange={setEventId}
          showAllOption={false}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Your Name
        </label>
        <input
          type="text"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          placeholder="Enter your name"
          className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400"
          maxLength={100}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Rating
        </label>
        <StarRating value={rating} onChange={setRating} size="lg" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Your Feedback
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your experience..."
          rows={4}
          className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none dark:placeholder-gray-400"
          maxLength={1000}
        />
        <div className="text-xs text-gray-500 dark:text-gray-400 text-right mt-1">
          {content.length}/1000
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
          {error.message}
        </div>
      )}

      {successMessage && (
        <div className="text-green-600 dark:text-green-400 text-sm bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
          {successMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={!isValid || loading}
        className="w-full py-2.5 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Submitting..." : "Submit Feedback"}
      </button>
    </form>
  );
}
