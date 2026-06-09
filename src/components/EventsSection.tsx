import Link from "next/link";
import EventCard from "@/components/EventCard";
import { events } from "@/data/events";

export default function EventsSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-gray-900">Eventos</h2>
        <Link
          href="/eventos"
          className="text-sm font-semibold text-emerald-600 transition hover:text-emerald-700"
        >
          Ver todos →
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}
