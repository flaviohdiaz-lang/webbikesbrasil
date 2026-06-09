import { Payment } from "mercadopago";
import { randomUUID } from "crypto";
import type { PaymentCreateRequest } from "mercadopago/dist/clients/payment/create/types";
import { getMercadoPagoClient } from "@/lib/mercadopago";
import { extractPixPaymentDetails } from "@/lib/mercadopago-pix";

type BrickPaymentPayload = {
  formData?: Record<string, unknown>;
  paymentType?: string;
  selectedPaymentMethod?: string;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : null;
}

function normalizeBrickPayload(payload: BrickPaymentPayload) {
  const innerFormData = asRecord(payload.formData);
  const raw: Record<string, unknown> = innerFormData ?? {
    ...payload,
  };

  const transactionAmount = Number(
    raw.transaction_amount ?? raw.transactionAmount,
  );
  const paymentMethodId = String(
    raw.payment_method_id ?? raw.paymentMethodId ?? "",
  ).toLowerCase();

  const payerRaw = asRecord(raw.payer) ?? {};
  const identificationRaw = asRecord(payerRaw.identification) ?? {};

  const payer: PaymentCreateRequest["payer"] = {
    email: String(payerRaw.email ?? ""),
    first_name: payerRaw.first_name
      ? String(payerRaw.first_name)
      : payerRaw.firstName
        ? String(payerRaw.firstName)
        : undefined,
    last_name: payerRaw.last_name
      ? String(payerRaw.last_name)
      : payerRaw.lastName
        ? String(payerRaw.lastName)
        : undefined,
    identification:
      identificationRaw.type && identificationRaw.number
        ? {
            type: String(identificationRaw.type),
            number: String(identificationRaw.number).replace(/\D/g, ""),
          }
        : undefined,
  };

  const body: PaymentCreateRequest = {
    transaction_amount: transactionAmount,
    payment_method_id: paymentMethodId,
    payer,
    description: "Web Bikes Brasil — pagamento",
    statement_descriptor: "WEB BIKES BR",
    external_reference: `web-bikes-payment-${Date.now()}`,
  };

  if (raw.token) body.token = String(raw.token);
  if (raw.installments) body.installments = Number(raw.installments);
  if (raw.issuer_id) body.issuer_id = Number(raw.issuer_id);
  if (raw.issuer) body.issuer_id = Number(raw.issuer);

  return body;
}

export async function createPaymentFromBrick(payload: BrickPaymentPayload) {
  const body = normalizeBrickPayload(payload);

  if (!body.transaction_amount || Number.isNaN(body.transaction_amount)) {
    throw new Error("Valor da transação inválido.");
  }

  if (!body.payment_method_id) {
    throw new Error("Método de pagamento não informado.");
  }

  if (!body.payer?.email) {
    throw new Error("E-mail do pagador é obrigatório.");
  }

  const client = getMercadoPagoClient();
  const paymentClient = new Payment(client);

  const payment = await paymentClient.create({
    body,
    requestOptions: { idempotencyKey: randomUUID() },
  });

  const pix = extractPixPaymentDetails(payment);

  return {
    paymentId: String(payment.id),
    status: payment.status,
    statusDetail: payment.status_detail,
    pix,
  };
}
