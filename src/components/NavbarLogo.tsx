import Link from "next/link";
import Image from "next/image";

export default function NavbarLogo() {
  return (
    <header className="site-banner w-full shadow-md">
      <div className="relative h-[140px] w-full overflow-hidden">
        
        <Image
          src="/ciclista.png"
          alt="Ciclista"
          fill
          className="object-cover object-center"
          priority
        />

        <div className="absolute inset-0 bg-emerald-900/60" />

        <div className="relative z-10 flex h-full items-center justify-between px-6">
          
          <Link href="/" className="flex-1 text-center">
            <h1 className="text-3xl font-bold text-white drop-shadow-lg sm:text-5xl">
              Web Bikes <span className="text-yellow-300">Brasil.com</span>
            </h1>
          </Link>

          <Link
            href="/anunciar"
            className="rounded-xl bg-yellow-400 px-8 py-4 text-lg font-extrabold text-emerald-900 shadow-lg shrink-0 animate-pulse hover:animate-none"
          >
            Anuncie aqui!
          </Link>
        </div>
      </div>

      <nav className="flex justify-center gap-1 py-2 bg-white border-b border-gray-100">
        <Link href="/" className="rounded-lg px-3 py-1.5 text-sm font-semibold text-gray-700 transition hover:bg-emerald-50 hover:text-emerald-800">
          Início
        </Link>
        <Link href="/anuncios" className="rounded-lg px-3 py-1.5 text-sm font-semibold text-gray-700 transition hover:bg-emerald-50 hover:text-emerald-800">
          Ver anúncios
        </Link>
        <Link href="/eventos" className="rounded-lg px-3 py-1.5 text-sm font-semibold text-gray-700 transition hover:bg-emerald-50 hover:text-emerald-800">
          Eventos
        </Link>
        <Link href="/planos" className="rounded-lg px-3 py-1.5 text-sm font-semibold text-gray-700 transition hover:bg-emerald-50 hover:text-emerald-800">
          Planos
        </Link>
        <Link href="/minha-conta" className="rounded-lg px-3 py-1.5 text-sm font-semibold text-gray-700 transition hover:bg-emerald-50 hover:text-emerald-800">
          Minha conta
        </Link>
      </nav>
    </header>
  );
}