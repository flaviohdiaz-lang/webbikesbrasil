import type { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes";

export type PixPaymentDetails = {
  paymentId: string;
  qrCodeBase64: string;
  qrCode: string;
  ticketUrl: string;
};

export function isPixPayment(payment: PaymentResponse): boolean {
  const methodId = payment.payment_method_id?.toLowerCase();
  const poiType = payment.point_of_interaction?.type?.toUpperCase();

  return methodId === "pix" || poiType === "PIX";
}

export function extractPixPaymentDetails(
  payment: PaymentResponse,
): PixPaymentDetails | null {
  if (!isPixPayment(payment)) {
    return null;
  }

  const transactionData = payment.point_of_interaction?.transaction_data;

  if (!transactionData?.qr_code && !transactionData?.qr_code_base64) {
    return null;
  }

  return {
    paymentId: String(payment.id),
    qrCodeBase64: transactionData.qr_code_base64 ?? "",
    qrCode: transactionData.qr_code ?? "",
    ticketUrl: transactionData.ticket_url ?? "",
  };
}
