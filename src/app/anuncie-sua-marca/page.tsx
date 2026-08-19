import NavbarLogo from "@/components/NavbarLogo";
import { buildWhatsAppUrl } from "@/lib/phone";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Anuncie sua marca — Web Bikes Brasil",
  description:
    "Divulgue sua marca para ciclistas em todo o Brasil com banners em destaque e anúncios patrocinados no WebBikesBrasil.",
};

const WHATSAPP_NUMBER = "5519996756797";
const WHATSAPP_MESSAGE =
  "Olá! Tenho interesse em anunciar minha marca no WebBikesBrasil.";

const whatsappHref = buildWhatsAppUrl(WHATSAPP_NUMBER, WHATSAPP_MESSAGE);

const opcoes = [
  {
    title: "Banner em destaque",
    description:
      "Seu banner aparece em posição privilegiada na página inicial e em seções estratégicas do site, garantindo alta visibilidade para ciclistas que navegam diariamente pelo WebBikesBrasil.",
    features: [
      "Exibição em destaque na home e páginas principais",
      "Alcance de ciclistas em todo o Brasil",
      "Formato visual impactante com link direto para sua marca",
    ],
  },
  {
    title: "Anúncio patrocinado",
    description:
      "Seu produto ou serviço aparece integrado aos resultados de busca e listagens do site, com identificação de patrocínio, alcançando compradores no momento certo da jornada.",
    features: [
      "Posicionamento entre os anúncios mais relevantes",
      "Segmentação por categoria e região",
      "Ideal para lojas, marcas e serviços do universo ciclístico",
    ],
  },
];

export default function AnuncieSuaMarcaPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <NavbarLogo />

      <header className="bg-gradient-to-r from-emerald-700 via-emerald-900 to-yellow-400 px-4 py-10 text-white">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/"
            className="text-sm font-medium text-emerald-100 transition hover:text-white"
          >
            ← Voltar ao início
          </Link>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Anuncie sua marca no WebBikesBrasil
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-emerald-50">
            O WebBikesBrasil conecta ciclistas de todo o Brasil que buscam
            bikes, peças, acessórios, serviços e eventos. Anuncie aqui e
            coloque sua marca na frente de um público apaixonado por ciclismo,
            no momento em que ele está pronto para comprar e descobrir novidades.
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10">
        <p className="text-center text-gray-600">
          Escolha o formato ideal para sua campanha:
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {opcoes.map((opcao) => (
            <article
              key={opcao.title}
              className="flex flex-col rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm"
            >
              <div className="border-b-4 border-yellow-400 pb-4">
                <h2 className="text-xl font-bold text-emerald-900">
                  {opcao.title}
                </h2>
              </div>
              <p className="mt-4 flex-1 leading-relaxed text-gray-700">
                {opcao.description}
              </p>
              <ul className="mt-5 space-y-2 text-sm text-gray-600">
                {opcao.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <span className="text-emerald-600" aria-hidden>
                      ✓
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-yellow-50 px-6 py-8 text-center shadow-sm">
          <p className="text-lg font-semibold text-emerald-900">
            Pronto para começar?
          </p>
          <p className="mt-2 text-gray-600">
            Fale conosco pelo WhatsApp e montamos a melhor proposta para sua
            marca.
          </p>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-emerald-700 via-emerald-600 to-yellow-400 px-8 py-3.5 text-sm font-bold text-white shadow-md transition hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-yellow-300"
          >
            💬 Falar no WhatsApp
          </a>
        </div>
      </main>
    </div>
  );
}
