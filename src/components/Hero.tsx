import Link from "next/link";

const bikeCategories = [
  "Todas",
  "Estrada",
  "Montanha",
  "Urbana",
  "Elétrica",
  "Infantil",
  "Gravel",
];

const heroCategories = [
  { name: "Bicicletas", emoji: "🚲", href: "/" },
  { name: "Peças", emoji: "🔧", href: "/" },
  { name: "Acessórios", emoji: "🎒", href: "/" },
  { name: "Serviços", emoji: "🛠️", href: "/" },
  { name: "Eventos", emoji: "📅", href: "/eventos" },
] as const;

export default function Hero() {
  return (
    <section className="bg-emerald-600 px-4 py-14 text-white">
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

        <div className="mx-auto mt-8 flex max-w-lg flex-col gap-3 sm:flex-row">
          <select
            className="flex-1 rounded-lg border-0 bg-white px-4 py-3 text-sm font-medium text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
            defaultValue="Todas"
          >
            {bikeCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="rounded-lg bg-emerald-800 px-6 py-3 text-sm font-semibold shadow-sm transition hover:bg-emerald-900"
          >
            Buscar
          </button>
        </div>
      </div>
    </section>
  );
}
