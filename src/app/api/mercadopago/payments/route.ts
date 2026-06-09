import { NextResponse } from "next/server";
import { isMercadoPagoConfigured } from "@/lib/mercadopago";
import { createPaymentFromBrick } from "@/lib/mercadopago-payment";

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

    const payload = await request.json();

    const result = await createPaymentFromBrick(payload);

    return NextResponse.json(result);
  } catch (error) {
    const detail = getMercadoPagoErrorMessage(error);
    console.error("[mercadopago/payments]", detail, error);

    const isDev = process.env.NODE_ENV === "development";

    return NextResponse.json(
      {
        error: isDev
          ? `Erro ao processar pagamento: ${detail}`
          : "Erro ao processar pagamento.",
      },
      { status: 500 },
    );
  }
}
