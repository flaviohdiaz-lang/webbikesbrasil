"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { listingTypes } from "@/data/listing-form";

const heroCategories = [
  { name: "Bicicletas", emoji: "🚲", href: "/anuncios?categoria=Bicicletas" },
  {
    name: "Elétricas",
    emoji: "⚡",
    href: `/anuncios?categoria=${encodeURIComponent("Bicicletas Elétricas")}`,
  },
  {
    name: "Peças",
    emoji: "🔧",
    href: `/anuncios?categoria=${encodeURIComponent("Peças")}`,
  },
  {
    name: "Acessórios",
    emoji: "🎒",
    href: `/anuncios?categoria=${encodeURIComponent("Acessórios")}`,
  },
  {
    name: "Serviços",
    emoji: "🛠️",
    href: `/anuncios?categoria=${encodeURIComponent("Serviços")}`,
  },
  { name: "Eventos", emoji: "📅", href: "/eventos" },
] as const;

const categoriasBusca = ["Todas", ...listingTypes];

export default function Hero() {
  const router = useRouter();
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("Todas");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = new URLSearchParams();
    if (busca.trim()) params.set("busca", busca.trim());
    if (categoria !== "Todas") params.set("categoria", categoria);

    const query = params.toString();
    router.push(`/anuncios${query ? `?${query}` : ""}`);
  }

  return (
    <section className="bg-emerald-900 px-4 py-14 text-white">
      <div className="mx-auto max-w-6xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Encontre o pedal perfeito
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-emerald-100">
          Compre e venda bicicletas novas e usadas de ciclistas perto de você.
        </p>

        <div className="mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-4 sm:gap-6">
          {heroCategories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="flex w-24 flex-col items-center gap-2 rounded-xl bg-white/10 px-3 py-4 transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            >
              <span className="text-3xl" aria-hidden>
                {category.emoji}
              </span>
              <span className="text-xs font-semibold sm:text-sm">
                {category.name}
              </span>
            </Link>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-8 flex max-w-lg flex-col gap-3 sm:flex-row"
        >
          <input
            type="text"
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
            placeholder="Buscar bicicleta, peça, acessório..."
            className="flex-[2] rounded-lg border-0 bg-white px-4 py-3 text-sm font-medium text-gray-800 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-300"
          />
          <select
            value={categoria}
            onChange={(event) => setCategoria(event.target.value)}
            className="flex-1 rounded-lg border-0 bg-white px-4 py-3 text-sm font-medium text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
          >
            {categoriasBusca.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-lg bg-emerald-800 px-6 py-3 text-sm font-semibold shadow-sm transition hover:bg-emerald-900"
          >
            Buscar
          </button>
        </form>
      </div>
    </section>
  );
}
