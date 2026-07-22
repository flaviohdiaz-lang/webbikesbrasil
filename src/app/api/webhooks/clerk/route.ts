import { sendWelcomeEmail } from "@/lib/emails/send";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

export const runtime = "nodejs";

type ClerkEmailAddress = {
  id?: string;
  email_address?: string;
};

type ClerkUserCreatedData = {
  id?: string;
  first_name?: string | null;
  last_name?: string | null;
  email_addresses?: ClerkEmailAddress[];
  primary_email_address_id?: string | null;
};

type ClerkWebhookEvent = {
  type?: string;
  data?: ClerkUserCreatedData;
};

function getPrimaryEmail(data: ClerkUserCreatedData): string | null {
  const emails = data.email_addresses ?? [];
  if (emails.length === 0) return null;

  const primary = data.primary_email_address_id
    ? emails.find((item) => item.id === data.primary_email_address_id)
    : null;

  const email = (primary ?? emails[0])?.email_address?.trim();
  return email || null;
}

export async function POST(request: Request) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("[webhooks/clerk] CLERK_WEBHOOK_SECRET não configurada.");
    return NextResponse.json(
      { error: "Webhook não configurado." },
      { status: 500 },
    );
  }

  const payload = await request.text();
  const svixId = request.headers.get("svix-id");
  const svixTimestamp = request.headers.get("svix-timestamp");
  const svixSignature = request.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json(
      { error: "Cabeçalhos Svix ausentes." },
      { status: 400 },
    );
  }

  let event: ClerkWebhookEvent;

  try {
    const wh = new Webhook(webhookSecret);
    event = wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkWebhookEvent;
  } catch (error) {
    console.error("[webhooks/clerk] Assinatura inválida:", error);
    return NextResponse.json({ error: "Assinatura inválida." }, { status: 400 });
  }

  if (event.type === "user.created") {
    const data = event.data ?? {};
    const email = getPrimaryEmail(data);

    if (!email) {
      console.warn("[webhooks/clerk] user.created sem e-mail.");
      return NextResponse.json({ ok: true, skipped: "no_email" });
    }

    try {
      await sendWelcomeEmail({
        to: email,
        firstName: data.first_name,
      });
    } catch (error) {
      console.error("[webhooks/clerk] Falha ao enviar boas-vindas:", error);
      // Ainda retorna 200 para o Clerk não reenviar indefinidamente por falha de e-mail.
      return NextResponse.json({ ok: true, emailed: false });
    }
  }

  return NextResponse.json({ ok: true });
}
