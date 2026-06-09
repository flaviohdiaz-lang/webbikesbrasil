import EventsSection from "@/components/EventsSection";
import Hero from "@/components/Hero";
import ListingCard from "@/components/ListingCard";
import NavbarLogo from "@/components/NavbarLogo";
import { listings } from "@/data/listings";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarLogo />
      <Hero />

      <main className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">
          Anúncios recentes
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </main>

      <EventsSection />
    </div>
  );
}
