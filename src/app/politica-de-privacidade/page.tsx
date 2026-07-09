import NavbarLogo from "@/components/NavbarLogo";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade — Web Bikes Brasil",
  description:
    "Saiba como o Web Bikes Brasil coleta, usa e protege seus dados pessoais em conformidade com a LGPD.",
};

const ULTIMA_ATUALIZACAO = "8 de julho de 2026";

export default function PoliticaDePrivacidadePage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <NavbarLogo />

      <header className="border-b border-gray-200 bg-white px-4 py-8">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/"
            className="text-sm font-medium text-emerald-900 transition hover:text-emerald-700"
          >
            ← Voltar ao início
          </Link>
          <h1 className="mt-3 text-3xl font-bold text-emerald-900 sm:text-4xl">
            Política de Privacidade
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Última atualização: {ULTIMA_ATUALIZACAO}
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
        <article className="rounded-2xl border border-gray-200 bg-white px-6 py-8 shadow-sm sm:px-10 sm:py-10">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-900">
            WebBikesBrasil
          </p>

          <section className="mt-8">
            <h2 className="text-xl font-bold text-emerald-900">Introdução</h2>
            <p className="mt-3 leading-relaxed text-gray-700">
              O WebBikesBrasil (&quot;nós&quot;, &quot;nosso site&quot;) respeita a
              privacidade dos usuários e está comprometido em proteger os dados
              pessoais coletados através do site webbikesbrasil.com, em
              conformidade com a Lei Geral de Proteção de Dados (Lei nº
              13.709/2018 — LGPD).
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-bold text-emerald-900">
              Quais dados coletamos
            </h2>
            <p className="mt-3 leading-relaxed text-gray-700">
              Ao usar nosso site, podemos coletar:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-gray-700">
              <li className="leading-relaxed">
                <strong className="text-gray-900">Dados de cadastro:</strong>{" "}
                nome e e-mail (via login com Google ou e-mail)
              </li>
              <li className="leading-relaxed">
                <strong className="text-gray-900">Dados de anúncios:</strong>{" "}
                título, descrição, categoria, preço, cidade, estado, fotos e
                número de WhatsApp informados por você ao criar um anúncio
              </li>
              <li className="leading-relaxed">
                <strong className="text-gray-900">Dados de navegação:</strong>{" "}
                informações técnicas como endereço IP e cookies, para melhorar
                sua experiência no site
              </li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-bold text-emerald-900">
              Como usamos seus dados
            </h2>
            <p className="mt-3 leading-relaxed text-gray-700">
              Utilizamos os dados coletados para:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-gray-700">
              <li className="leading-relaxed">
                Permitir a criação e gerenciamento da sua conta e dos seus
                anúncios
              </li>
              <li className="leading-relaxed">
                Exibir seus anúncios publicamente para outros usuários
                interessados
              </li>
              <li className="leading-relaxed">
                Possibilitar o contato entre compradores e vendedores via
                WhatsApp
              </li>
              <li className="leading-relaxed">
                Processar pagamentos, quando aplicável (via Mercado Pago)
              </li>
              <li className="leading-relaxed">
                Melhorar e manter o funcionamento do site
              </li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-bold text-emerald-900">
              Compartilhamento de dados
            </h2>
            <p className="mt-3 leading-relaxed text-gray-700">
              Não vendemos seus dados pessoais. Compartilhamos informações apenas
              com:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-gray-700">
              <li className="leading-relaxed">
                Prestadores de serviço que operam o site (Clerk para
                autenticação, Supabase para armazenamento de dados, Vercel para
                hospedagem, Mercado Pago para pagamentos)
              </li>
              <li className="leading-relaxed">
                Outros usuários, no caso de informações que você optar por
                publicar em seus anúncios (como fotos, preço, cidade e
                WhatsApp)
              </li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-bold text-emerald-900">Cookies</h2>
            <p className="mt-3 leading-relaxed text-gray-700">
              Usamos cookies para manter você conectado à sua conta e melhorar a
              navegação no site.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-bold text-emerald-900">
              Seus direitos como titular dos dados
            </h2>
            <p className="mt-3 leading-relaxed text-gray-700">
              De acordo com a LGPD, você tem direito a:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-gray-700">
              <li className="leading-relaxed">
                Confirmar a existência de tratamento dos seus dados
              </li>
              <li className="leading-relaxed">
                Acessar, corrigir ou solicitar a exclusão dos seus dados
              </li>
              <li className="leading-relaxed">
                Revogar o consentimento a qualquer momento
              </li>
              <li className="leading-relaxed">
                Solicitar a portabilidade dos seus dados
              </li>
            </ul>
            <p className="mt-4 leading-relaxed text-gray-700">
              Para exercer esses direitos, entre em contato pelo e-mail:{" "}
              <a
                href="mailto:contato@webbikesbrasil.com"
                className="font-medium text-emerald-900 underline underline-offset-2 hover:text-emerald-700"
              >
                contato@webbikesbrasil.com
              </a>
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-bold text-emerald-900">Segurança</h2>
            <p className="mt-3 leading-relaxed text-gray-700">
              Adotamos medidas técnicas razoáveis para proteger seus dados
              contra acesso não autorizado, perda ou alteração indevida.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-bold text-emerald-900">
              Alterações nesta política
            </h2>
            <p className="mt-3 leading-relaxed text-gray-700">
              Esta política pode ser atualizada periodicamente. Recomendamos que
              você a revise regularmente.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-bold text-emerald-900">Contato</h2>
            <p className="mt-3 leading-relaxed text-gray-700">
              Dúvidas sobre esta Política de Privacidade podem ser enviadas
              para:{" "}
              <a
                href="mailto:contato@webbikesbrasil.com"
                className="font-medium text-emerald-900 underline underline-offset-2 hover:text-emerald-700"
              >
                contato@webbikesbrasil.com
              </a>
            </p>
          </section>
        </article>
      </main>
    </div>
  );
}
