import EventsSection from "@/components/EventsSection";
import Hero from "@/components/Hero";
import AnuncioCard from "@/components/AnuncioCard";
import NavbarLogo from "@/components/NavbarLogo";
import { fetchAnuncios, type Anuncio } from "@/lib/supabase/anuncios";

export default async function Home() {
  let anuncios: Anuncio[] = [];

  try {
    anuncios = await fetchAnuncios();
  } catch (error) {
    console.error("[Home] Falha ao buscar anúncios recentes:", error);
  }

  const anunciosRecentes = anuncios.slice(0, 6);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarLogo />
      <Hero />

      <main className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">
          Anúncios recentes
        </h2>
        {anunciosRecentes.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {anunciosRecentes.map((anuncio) => (
              <AnuncioCard key={anuncio.id} anuncio={anuncio} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            Ainda não há anúncios publicados. Seja o primeiro a anunciar!
          </p>
        )}
      </main>

      <EventsSection />
    </div>
  );
}
