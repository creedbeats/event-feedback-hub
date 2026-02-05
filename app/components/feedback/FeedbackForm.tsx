"use client";

import { useState } from "react";
import { gql } from "@apollo/client/core";
import { useMutation } from "@apollo/client/react";
import { StarRating } from "./StarRating";
import { EventSelector } from "../events/EventSelector";
import { Input, TextArea, Button } from "../ui";

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

      <Input
        id="authorName"
        label="Your Name"
        type="text"
        value={authorName}
        onChange={(e) => setAuthorName(e.target.value)}
        placeholder="Enter your name"
        maxLength={100}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Rating
        </label>
        <StarRating value={rating} onChange={setRating} size="lg" />
      </div>

      <div>
        <TextArea
          id="content"
          label="Your Feedback"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your experience..."
          rows={4}
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

      <Button
        type="submit"
        disabled={!isValid || loading}
        variant="primary"
        size="lg"
        fullWidth
      >
        {loading ? "Submitting..." : "Submit Feedback"}
      </Button>
    </form>
  );
}
