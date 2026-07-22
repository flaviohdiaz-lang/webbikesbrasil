import { escapeHtml } from "@/lib/emails/html";

type AnuncioPublicadoEmailParams = {
  firstName?: string | null;
  titulo: string;
  precoFormatado: string;
  fotoUrl?: string | null;
  anuncioUrl: string;
};

export function buildAnuncioPublicadoEmailHtml({
  firstName,
  titulo,
  precoFormatado,
  fotoUrl,
  anuncioUrl,
}: AnuncioPublicadoEmailParams): string {
  const greeting = firstName?.trim()
    ? `Olá, ${escapeHtml(firstName.trim())}!`
    : "Olá!";
  const safeTitulo = escapeHtml(titulo);
  const safePreco = escapeHtml(precoFormatado);
  const safeAnuncioUrl = escapeHtml(anuncioUrl);
  const safeFotoUrl = fotoUrl ? escapeHtml(fotoUrl) : null;

  const photoBlock = safeFotoUrl
    ? `<tr>
         <td style="padding:0 0 20px;">
           <img src="${safeFotoUrl}" alt="${safeTitulo}" width="504" style="display:block;width:100%;max-width:504px;height:auto;border-radius:12px;border:1px solid #e5e7eb;" />
         </td>
       </tr>`
    : "";

  return `<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Seu anúncio já está no ar</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f9fafb;font-family:Arial,Helvetica,sans-serif;color:#111827;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f9fafb;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background-color:#ffffff;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="background-color:#064e3b;padding:24px 28px;text-align:center;">
                <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;">
                  Web Bikes <span style="color:#fde047;">Brasil</span>
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">
                <h1 style="margin:0 0 12px;font-size:22px;line-height:1.3;color:#064e3b;">
                  Seu anúncio já está no ar! ✅
                </h1>
                <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#374151;">
                  ${greeting} Confirmamos que seu anúncio foi publicado com sucesso no WebBikesBrasil.
                </p>
                ${photoBlock}
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 24px;background-color:#ecfdf5;border:1px solid #d1fae5;border-radius:12px;">
                  <tr>
                    <td style="padding:16px 18px;">
                      <p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;color:#065f46;">
                        Anúncio publicado
                      </p>
                      <p style="margin:0 0 8px;font-size:17px;font-weight:700;color:#111827;">
                        ${safeTitulo}
                      </p>
                      <p style="margin:0;font-size:20px;font-weight:800;color:#064e3b;">
                        ${safePreco}
                      </p>
                    </td>
                  </tr>
                </table>
                <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 auto 8px;">
                  <tr>
                    <td align="center" style="border-radius:10px;background-color:#064e3b;">
                      <a href="${safeAnuncioUrl}" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;">
                        Ver meu anúncio
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="margin:24px 0 0;font-size:13px;line-height:1.5;color:#6b7280;">
                  Boas vendas! Qualquer dúvida, responda este e-mail ou fale conosco em contato@webbikesbrasil.com.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 28px;background-color:#ecfdf5;border-top:1px solid #d1fae5;text-align:center;">
                <p style="margin:0;font-size:12px;color:#065f46;">
                  © WebBikesBrasil · webbikesbrasil.com
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function buildAnuncioPublicadoEmailText({
  firstName,
  titulo,
  precoFormatado,
  anuncioUrl,
}: AnuncioPublicadoEmailParams): string {
  const greeting = firstName?.trim()
    ? `Olá, ${firstName.trim()}!`
    : "Olá!";

  return `${greeting}

Seu anúncio já está no ar!

Título: ${titulo}
Preço: ${precoFormatado}

Ver anúncio: ${anuncioUrl}

WebBikesBrasil · webbikesbrasil.com`;
}
