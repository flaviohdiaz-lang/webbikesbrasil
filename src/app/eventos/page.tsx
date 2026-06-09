import EventosFilters from "@/components/EventosFilters";
import NavbarLogo from "@/components/NavbarLogo";
import Link from "next/link";

export default function EventosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarLogo />

      <header className="bg-emerald-600 px-4 py-10 text-white">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/"
            className="text-sm font-medium text-emerald-100 transition hover:text-white"
          >
            ← Voltar ao início
          </Link>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Eventos
          </h1>
          <p className="mt-2 max-w-xl text-emerald-100">
            Campeonatos, feiras, lançamentos e workshops do mundo da bike.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <EventosFilters />
      </main>
    </div>
  );
}
