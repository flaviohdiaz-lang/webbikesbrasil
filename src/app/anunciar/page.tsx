import AnunciarForm from "@/components/AnunciarForm";
import NavbarLogo from "@/components/NavbarLogo";
import Link from "next/link";

export const metadata = {
  title: "Anunciar — Web Bikes Brasil",
  description:
    "Cadastre seu anúncio de bikes, peças, acessórios, serviços ou eventos no Web Bikes Brasil.",
};

export default function AnunciarPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarLogo />

      <header className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-yellow-400 px-4 py-10 text-white">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/"
            className="text-sm font-medium text-emerald-100 transition hover:text-white"
          >
            ← Voltar ao início
          </Link>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Anunciar no Web Bikes Brasil
          </h1>
          <p className="mt-2 max-w-xl text-emerald-50">
            Publique bikes, peças, acessórios, serviços ou eventos e alcance
            ciclistas em todo o Brasil.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10">
        <AnunciarForm />
      </main>
    </div>
  );
}
