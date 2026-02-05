"use client";

import { useState } from "react";
import { FeedbackForm } from "./components/feedback/FeedbackForm";
import { FeedbackList } from "./components/feedback/FeedbackList";
import { FilterBar } from "./components/filters/FilterBar";
import { ThemeToggle } from "./components/ThemeToggle";

export default function Home() {
  const [filterEventId, setFilterEventId] = useState<string | null>(null);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const handleEventChange = (eventId: string | null) => {
    setFilterEventId(eventId);
    setCurrentPage(1);
  };

  const handleMinRatingChange = (rating: number | null) => {
    setMinRating(rating);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Event Feedback Hub
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Share your feedback on events and see what others think in real-time
            </p>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Submit Feedback
              </h2>
              <FeedbackForm />
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Feedback Stream
              </h2>
              <FilterBar
                eventId={filterEventId}
                minRating={minRating}
                onEventChange={handleEventChange}
                onMinRatingChange={handleMinRatingChange}
              />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <FeedbackList
                filter={{
                  eventId: filterEventId,
                  minRating: minRating,
                }}
                page={currentPage}
                pageSize={5}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
