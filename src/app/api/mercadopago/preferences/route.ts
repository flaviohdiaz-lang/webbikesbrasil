import { NextResponse } from "next/server";
import type { PlanId } from "@/data/plans";
import { createPaymentPreference, isMercadoPagoConfigured } from "@/lib/mercadopago";
const validPlanIds: PlanId[] = ["basico", "pro", "loja", "avulso"];

function getMercadoPagoErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return "Erro desconhecido ao comunicar com o Mercado Pago.";
}

export async function POST(request: Request) {
  try {
    if (!isMercadoPagoConfigured()) {
      return NextResponse.json(
        {
          error:
            "Mercado Pago não configurado. Adicione suas chaves em .env.local.",
        },
        { status: 503 },
      );
    }

    const body = (await request.json()) as { planId?: string };
    const planId = body.planId as PlanId | undefined;

    if (!planId || !validPlanIds.includes(planId)) {
      return NextResponse.json({ error: "Plano inválido." }, { status: 400 });
    }

    const origin = request.headers.get("origin") ?? "http://localhost:3000";
    const preference = await createPaymentPreference(planId, origin);

    return NextResponse.json(preference);
  } catch (error) {
    const detail = getMercadoPagoErrorMessage(error);
    console.error("[mercadopago/preferences]", detail, error);

    const isDev = process.env.NODE_ENV === "development";

    return NextResponse.json(
      {
        error: isDev
          ? `Erro ao criar preferência de pagamento: ${detail}`
          : "Erro ao criar preferência de pagamento.",
      },
      { status: 500 },
    );
  }
}
