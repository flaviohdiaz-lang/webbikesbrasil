import Link from "next/link";

const links = [
  { href: "/", label: "Início" },
  { href: "/anuncios", label: "Ver anúncios" },
  { href: "/eventos", label: "Eventos" },
  { href: "/planos", label: "Planos" },
  { href: "/minha-conta", label: "Minha conta" },
];

export default function SiteNav() {
  return (
    <nav className="flex flex-wrap justify-center gap-1 border-b border-gray-100 bg-white py-2">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="rounded-lg px-3 py-1.5 text-sm font-semibold text-gray-700 transition hover:bg-emerald-50 hover:text-emerald-800"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
