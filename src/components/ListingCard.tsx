import type { BikeListing } from "@/data/listings";

type ListingCardProps = {
  listing: BikeListing;
};

export default function ListingCard({ listing }: ListingCardProps) {
  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="flex h-40 items-center justify-center bg-gray-50 text-6xl">
        {listing.emoji}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900">{listing.title}</h3>
        <p className="mt-1 text-lg font-bold text-emerald-600">
          R$ {listing.price.toLocaleString("pt-BR")}
        </p>
        <p className="mt-1 text-sm text-gray-500">📍 {listing.city}</p>
      </div>
    </article>
  );
}
