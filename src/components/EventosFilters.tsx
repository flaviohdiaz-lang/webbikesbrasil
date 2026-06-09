"use client";

import { useState } from "react";
import EventCard from "@/components/EventCard";
import type { EventCategory } from "@/data/events";
import { eventCategories, events } from "@/data/events";

const filterOptions: Array<EventCategory | "Todas"> = [
  "Todas",
  ...eventCategories,
];

export default function EventosFilters() {
  const [activeFilter, setActiveFilter] = useState<EventCategory | "Todas">(
    "Todas",
  );

  const filteredEvents =
    activeFilter === "Todas"
      ? events
      : events.filter((event) => event.category === activeFilter);

  return (
    <>
      <div className="mb-8 flex flex-wrap gap-2">
        {filterOptions.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setActiveFilter(option)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeFilter === option
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center text-gray-500">
          Nenhum evento encontrado nesta categoria.
        </p>
      )}
    </>
  );
}
