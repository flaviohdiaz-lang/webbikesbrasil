import { MercadoPagoConfig, Preference } from "mercadopago";
import type { PlanId } from "@/data/plans";
import { getPlanById } from "@/data/plans";

export function isMercadoPagoConfigured(): boolean {
  const publicKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY;
  const accessToken = process.env.MP_ACCESS_TOKEN;

  const placeholders = [
    "sua_public_key",
    "seu_access_token",
    "cole_aqui_sua_public_key",
    "cole_aqui_seu_access_token",
  ];

  return Boolean(
    publicKey &&
      accessToken &&
      !placeholders.includes(publicKey) &&
      !placeholders.includes(accessToken),
  );
}

export function getMercadoPagoClient() {
  const accessToken = process.env.MP_ACCESS_TOKEN;

  if (
    !accessToken ||
    accessToken === "seu_access_token" ||
    accessToken === "cole_aqui_seu_access_token"
  ) {
    throw new Error("MP_ACCESS_TOKEN não configurado.");
  }

  return new MercadoPagoConfig({ accessToken });
}

export async function createPaymentPreference(planId: PlanId, origin: string) {
  const plan = getPlanById(planId);

  if (!plan) {
    throw new Error("Plano inválido.");
  }

  const client = getMercadoPagoClient();
  const preference = new Preference(client);
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? origin).replace(
    /\/$/,
    "",
  );
  const isHttps = baseUrl.startsWith("https://");

  const response = await preference.create({
    body: {
      items: [
        {
          id: plan.id,
          title: `Web Bikes Brasil — ${plan.name}`,
          description: plan.description,
          quantity: 1,
          currency_id: "BRL",
          unit_price: plan.price,
        },
      ],
      back_urls: {
        success: `${baseUrl}/planos?status=aprovado&plano=${plan.id}`,
        failure: `${baseUrl}/planos?status=recusado&plano=${plan.id}`,
        pending: `${baseUrl}/planos?status=pendente&plano=${plan.id}`,
      },
      // auto_return só funciona com URLs HTTPS (ex.: produção)
      ...(isHttps ? { auto_return: "approved" as const } : {}),
      external_reference: `web-bikes-${plan.id}-${Date.now()}`,
      statement_descriptor: "WEB BIKES BR",
      metadata: {
        plan_id: plan.id,
        plan_type: plan.id === "avulso" ? "avulso" : "mensal",
      },
    },
  });

  const preferenceId = response.id;
  const initPoint = response.init_point;

  if (!preferenceId) {
    throw new Error("Não foi possível criar a preferência de pagamento.");
  }

  return {
    preferenceId,
    initPoint: initPoint ?? null,
    amount: plan.price,
    planName: plan.name,
  };
}
