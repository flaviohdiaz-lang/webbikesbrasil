import NavbarLogo from "@/components/NavbarLogo";
import { SignOutButton } from "@clerk/nextjs";
import Link from "next/link";

export const metadata = {
  title: "Sair — Web Bikes Brasil",
  description: "Encerre sua sessão no Web Bikes Brasil.",
};

export default function SignOutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarLogo />

      <main className="mx-auto flex max-w-6xl flex-col items-center px-4 py-12">
        <Link
          href="/"
          className="mb-8 self-start text-sm font-medium text-emerald-600 hover:text-emerald-700"
        >
          ← Voltar ao início
        </Link>

        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">Sair da conta</h1>
          <p className="mt-2 text-sm text-gray-600">
            Deseja encerrar sua sessão no Web Bikes Brasil?
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <SignOutButton redirectUrl="/">
              <button
                type="button"
                className="w-full rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 sm:w-auto"
              >
                Sim, sair
              </button>
            </SignOutButton>

            <Link
              href="/"
              className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 sm:w-auto"
            >
              Cancelar
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
