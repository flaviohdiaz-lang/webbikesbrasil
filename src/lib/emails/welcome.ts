import { escapeHtml } from "@/lib/emails/html";

type WelcomeEmailParams = {
  firstName?: string | null;
  anunciarUrl: string;
};

export function buildWelcomeEmailHtml({
  firstName,
  anunciarUrl,
}: WelcomeEmailParams): string {
  const greeting = firstName?.trim()
    ? `Olá, ${escapeHtml(firstName.trim())}!`
    : "Olá!";
  const safeAnunciarUrl = escapeHtml(anunciarUrl);

  return `<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Bem-vindo ao WebBikesBrasil</title>
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
                  Bem-vindo ao WebBikesBrasil! 🚲
                </h1>
                <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#374151;">
                  ${greeting} É ótimo ter você com a gente.
                </p>
                <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#374151;">
                  No WebBikesBrasil você pode comprar e vender bicicletas, peças, acessórios e serviços com a comunidade ciclista de todo o Brasil.
                </p>
                <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#374151;">
                  <strong style="color:#064e3b;">Anúncios 100% grátis até o fim do ano!</strong>
                  Publique quantos anúncios quiser sem pagar nada. Essa é a hora de vender sua bike mais rápido.
                </p>
                <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 auto 8px;">
                  <tr>
                    <td align="center" style="border-radius:10px;background-color:#064e3b;">
                      <a href="${safeAnunciarUrl}" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;">
                        Publicar meu primeiro anúncio
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="margin:24px 0 0;font-size:13px;line-height:1.5;color:#6b7280;">
                  Se você não criou uma conta no WebBikesBrasil, pode ignorar este e-mail.
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

export function buildWelcomeEmailText({
  firstName,
  anunciarUrl,
}: WelcomeEmailParams): string {
  const greeting = firstName?.trim()
    ? `Olá, ${firstName.trim()}!`
    : "Olá!";

  return `${greeting}

Bem-vindo ao WebBikesBrasil!

É ótimo ter você com a gente. Anúncios são 100% grátis até o fim do ano — publique quantos quiser sem pagar nada.

Publique seu primeiro anúncio: ${anunciarUrl}

WebBikesBrasil · webbikesbrasil.com`;
}
