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

        <div className="absolute left-2.5 top-2.5 z-20 sm:left-4 sm:top-4">
          <Image
            src="/icons/icon-192.png"
            alt="Logo Web Bikes Brasil"
            width={64}
            height={64}
            className="h-11 w-11 rounded-xl shadow-lg sm:h-16 sm:w-16"
          />
        </div>

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
    </header>
  );
}