import NavbarLogo from "@/components/NavbarLogo";
import PlanosContent from "@/components/PlanosContent";
import Link from "next/link";
import { Suspense } from "react";

export const metadata = {
  title: "Planos — Web Bikes Brasil",
  description:
    "Planos mensais e anúncios avulsos para vender no Web Bikes Brasil.",
};

export default function PlanosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarLogo />

      <header className="border-b border-gray-200 bg-white px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/"
            className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            ← Voltar ao início
          </Link>
          <h1 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
            Planos e pagamentos
          </h1>
          <p className="mt-2 max-w-2xl text-gray-600">
            Assine um plano mensal ou publique um anúncio avulso. Pagamento
            seguro via Mercado Pago (Checkout Bricks).
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <Suspense
          fallback={
            <p className="text-center text-gray-500">Carregando planos...</p>
          }
        >
          <PlanosContent />
        </Suspense>
      </main>
    </div>
  );
}
