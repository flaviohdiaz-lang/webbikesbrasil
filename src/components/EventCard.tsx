import type { BikeEvent } from "@/data/events";

const badgeStyles: Record<BikeEvent["category"], string> = {
  Campeonato: "bg-blue-100 text-blue-800",
  Feira: "bg-purple-100 text-purple-800",
  Lançamento: "bg-amber-100 text-amber-800",
  Workshop: "bg-teal-100 text-teal-800",
};

type EventCardProps = {
  event: BikeEvent;
};

export default function EventCard({ event }: EventCardProps) {
  return (
    <article className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <span
        className={`mb-3 w-fit rounded-full px-3 py-1 text-xs font-semibold ${badgeStyles[event.category]}`}
      >
        {event.category}
      </span>
      <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
      <p className="mt-2 text-sm text-gray-600">📅 {event.date}</p>
      <p className="mt-1 text-sm text-gray-500">📍 {event.city}</p>
      <button
        type="button"
        className="mt-4 w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
      >
        Ver Evento
      </button>
    </article>
  );
}
