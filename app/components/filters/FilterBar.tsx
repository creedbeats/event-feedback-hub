"use client";

import { EventSelector } from "../events/EventSelector";
import { StarRating } from "../feedback/StarRating";

interface FilterBarProps {
  eventId: string | null;
  minRating: number | null;
  onEventChange: (eventId: string | null) => void;
  onMinRatingChange: (rating: number | null) => void;
}

export function FilterBar({
  eventId,
  minRating,
  onEventChange,
  onMinRatingChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Filter by Event
        </label>
        <EventSelector
          selectedEventId={eventId}
          onEventChange={onEventChange}
          showAllOption={true}
        />
      </div>

      <div className="sm:w-48">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Minimum Rating
        </label>
        <div className="flex items-center gap-2">
          <StarRating
            value={minRating || 0}
            onChange={(rating) =>
              onMinRatingChange(rating === minRating ? null : rating)
            }
            size="sm"
          />
          {minRating && (
            <button
              onClick={() => onMinRatingChange(null)}
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
