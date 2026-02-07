"use client";

import { gql } from "@apollo/client/core";
import { useQuery } from "@apollo/client/react";
import type { EventsResponse } from "@/lib/types";

const GET_EVENTS = gql`
  query GetEvents {
    events {
      id
      name
      date
    }
  }
`;

interface EventSelectorProps {
  selectedEventId: string | null;
  onEventChange: (eventId: string | null) => void;
  showAllOption?: boolean;
}

export function EventSelector({
  selectedEventId,
  onEventChange,
  showAllOption = true,
}: EventSelectorProps) {
  const { data, loading, error } = useQuery<EventsResponse>(GET_EVENTS);

  if (error) {
    return <div className="text-red-500 text-sm">Failed to load events</div>;
  }

  return (
    <div className="relative">
      <select
        value={selectedEventId || ""}
        onChange={(e) => onEventChange(e.target.value || null)}
        disabled={loading}
        className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed appearance-none cursor-pointer"
      >
        {showAllOption && <option value="">All Events</option>}
        {!showAllOption && !selectedEventId && (
          <option value="">Select an event...</option>
        )}
        {data?.events.map((event) => (
          <option key={event.id} value={event.id}>
            {event.name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
}
