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

        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-2 px-4 sm:flex-row sm:justify-between sm:gap-0 sm:px-6">
          <Link href="/" className="flex items-center gap-2 sm:flex-1 sm:justify-center">
            <Image
              src="/icons/icon-192.png"
              alt="Logo Web Bikes Brasil"
              width={64}
              height={64}
              className="h-9 w-9 rounded-lg shadow-lg sm:h-16 sm:w-16 sm:rounded-xl"
            />
            <h1 className="text-2xl font-bold text-white drop-shadow-lg sm:text-5xl">
              Web Bikes <span className="text-yellow-300">Brasil.com</span>
            </h1>
          </Link>

          <Link
            href="/anunciar"
            className="rounded-lg bg-yellow-400 px-5 py-2.5 text-sm font-extrabold text-emerald-900 shadow-lg shrink-0 animate-pulse hover:animate-none sm:rounded-xl sm:px-8 sm:py-4 sm:text-lg"
          >
            Anuncie aqui!
          </Link>
        </div>
      </div>
    </header>
  );
}