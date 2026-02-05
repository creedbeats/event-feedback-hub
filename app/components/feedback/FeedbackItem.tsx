"use client";

import { StarRating } from "./StarRating";

interface FeedbackItemProps {
  feedback: {
    id: string;
    authorName: string;
    content: string;
    rating: number;
    createdAt: string;
    event: {
      id: string;
      name: string;
    };
  };
  isNew?: boolean;
}

export function FeedbackItem({ feedback, isNew = false }: FeedbackItemProps) {
  const formattedDate = new Date(Number(feedback.createdAt)).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  return (
    <div
      className={`bg-white dark:bg-gray-700 rounded-lg border p-4 transition-all ${isNew
        ? "border-blue-400 shadow-md ring-2 ring-blue-100 dark:ring-blue-900"
        : "border-gray-200 dark:border-gray-600 shadow-sm"
        }`}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-gray-900 dark:text-white">
              {feedback.authorName}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{formattedDate}</span>
            {isNew && (
              <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
                New
              </span>
            )}
          </div>
          <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded">
            {feedback.event.name}
          </span>
        </div>
        <StarRating value={feedback.rating} readonly size="sm" />
      </div>
      <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap">
        {feedback.content}
      </p>
    </div>
  );
}
