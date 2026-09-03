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
    <nav className="flex gap-1 overflow-x-auto whitespace-nowrap border-b border-gray-100 bg-white px-3 py-2 sm:flex-wrap sm:justify-center sm:overflow-visible sm:whitespace-normal sm:px-0">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="shrink-0 rounded-lg px-3 py-1.5 text-sm font-semibold text-gray-700 transition hover:bg-emerald-50 hover:text-emerald-800"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
