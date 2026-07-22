import { formatBrazilianCurrency } from "@/lib/currency";
import {
  buildAnuncioPublicadoEmailHtml,
  buildAnuncioPublicadoEmailText,
} from "@/lib/emails/anuncio-publicado";
import { createResendClient, EMAIL_FROM, getSiteUrl } from "@/lib/emails/resend";
import {
  buildWelcomeEmailHtml,
  buildWelcomeEmailText,
} from "@/lib/emails/welcome";

type SendWelcomeEmailParams = {
  to: string;
  firstName?: string | null;
};

type SendAnuncioPublicadoEmailParams = {
  to: string;
  firstName?: string | null;
  anuncioId: string;
  titulo: string;
  preco: number;
  fotoUrl?: string | null;
};

export async function sendWelcomeEmail({
  to,
  firstName,
}: SendWelcomeEmailParams): Promise<boolean> {
  const resend = createResendClient();
  if (!resend) return false;

  const anunciarUrl = `${getSiteUrl()}/anunciar`;

  const { error } = await resend.emails.send({
    from: EMAIL_FROM,
    to,
    subject: "Bem-vindo ao WebBikesBrasil! 🚲",
    html: buildWelcomeEmailHtml({ firstName, anunciarUrl }),
    text: buildWelcomeEmailText({ firstName, anunciarUrl }),
  });

  if (error) {
    console.error("[emails/welcome]", error);
    return false;
  }

  return true;
}

export async function sendAnuncioPublicadoEmail({
  to,
  firstName,
  anuncioId,
  titulo,
  preco,
  fotoUrl,
}: SendAnuncioPublicadoEmailParams): Promise<boolean> {
  const resend = createResendClient();
  if (!resend) return false;

  const anuncioUrl = `${getSiteUrl()}/anuncios/${anuncioId}`;
  const precoFormatado = formatBrazilianCurrency(preco);

  const { error } = await resend.emails.send({
    from: EMAIL_FROM,
    to,
    subject: "Seu anúncio já está no ar! ✅",
    html: buildAnuncioPublicadoEmailHtml({
      firstName,
      titulo,
      precoFormatado,
      fotoUrl,
      anuncioUrl,
    }),
    text: buildAnuncioPublicadoEmailText({
      firstName,
      titulo,
      precoFormatado,
      fotoUrl,
      anuncioUrl,
    }),
  });

  if (error) {
    console.error("[emails/anuncio-publicado]", error);
    return false;
  }

  return true;
}
