import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 sm:flex-row">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} Web Bikes Brasil
        </p>
        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          <Link
            href="/anuncie-sua-marca"
            className="text-sm font-medium text-emerald-900 transition hover:text-emerald-700"
          >
            Anuncie sua marca
          </Link>
          <Link
            href="/politica-de-privacidade"
            className="text-sm font-medium text-emerald-900 transition hover:text-emerald-700"
          >
            Política de Privacidade
          </Link>
        </nav>
      </div>
    </footer>
  );
}
