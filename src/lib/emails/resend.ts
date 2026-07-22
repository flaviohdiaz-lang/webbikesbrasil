import { Resend } from "resend";

export const EMAIL_FROM = "WebBikesBrasil <contato@send.webbikesbrasil.com>";

export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://webbikesbrasil.com"
  );
}

export function createResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error("[resend] RESEND_API_KEY não configurada.");
    return null;
  }

  return new Resend(apiKey);
}
