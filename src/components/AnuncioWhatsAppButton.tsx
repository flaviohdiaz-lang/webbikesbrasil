import { buildWhatsAppUrl } from "@/lib/phone";

type AnuncioWhatsAppButtonProps = {
  whatsapp: string;
  titulo: string;
};

export default function AnuncioWhatsAppButton({
  whatsapp,
  titulo,
}: AnuncioWhatsAppButtonProps) {
  const message = `Olá! Vi seu anúncio '${titulo}' no WebBikesBrasil e tenho interesse!`;
  const href = buildWhatsAppUrl(whatsapp, message);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-8 py-4 text-base font-bold text-white shadow-lg transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-300 sm:text-lg"
    >
      💬 Chamar no WhatsApp
    </a>
  );
}
