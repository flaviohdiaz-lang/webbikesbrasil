"use client";

import PixPaymentPanel from "@/components/PixPaymentPanel";
import type { PixPaymentDetails } from "@/lib/mercadopago-pix";
import { initMercadoPago, Payment, StatusScreen } from "@mercadopago/sdk-react";
import type { IPaymentFormData } from "@mercadopago/sdk-react/esm/bricks/payment/type";
import { useEffect, useState } from "react";

type PaymentBrickCheckoutProps = {
  preferenceId: string;
  amount: number;
  planName: string;
  onClose: () => void;
  onBrickReady?: () => void;
};

type CheckoutView = "payment" | "pix" | "status";

export default function PaymentBrickCheckout({
  preferenceId,
  amount,
  planName,
  onClose,
  onBrickReady,
}: PaymentBrickCheckoutProps) {
  const [ready, setReady] = useState(false);
  const [view, setView] = useState<CheckoutView>("payment");
  const [pixPayment, setPixPayment] = useState<PixPaymentDetails | null>(null);
  const [statusPaymentId, setStatusPaymentId] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const publicKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY;

  useEffect(() => {
    if (
      !publicKey ||
      publicKey === "sua_public_key" ||
      publicKey === "cole_aqui_sua_public_key"
    ) {
      return;
    }

    initMercadoPago(publicKey, { locale: "pt-BR" });
    setReady(true);
  }, [publicKey]);

  async function handleSubmit(formData: IPaymentFormData) {
    setPaymentError(null);

    const response = await fetch("/api/mercadopago/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = (await response.json()) as {
      paymentId?: string;
      pix?: PixPaymentDetails | null;
      error?: string;
    };

    if (!response.ok) {
      throw new Error(data.error ?? "Erro ao processar pagamento.");
    }

    if (data.pix) {
      setPixPayment(data.pix);
      setView("pix");
      onBrickReady?.();
      return;
    }

    if (data.paymentId) {
      setStatusPaymentId(data.paymentId);
      setView("status");
      onBrickReady?.();
    }
  }

  function handleBackToPayment() {
    setView("payment");
    setPixPayment(null);
    setStatusPaymentId(null);
    setPaymentError(null);
  }

  if (
    !publicKey ||
    publicKey === "sua_public_key" ||
    publicKey === "cole_aqui_sua_public_key"
  ) {
    return (
      <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900">
        Configure a chave pública em{" "}
        <code className="font-mono text-xs">NEXT_PUBLIC_MP_PUBLIC_KEY</code> no
        arquivo <code className="font-mono text-xs">.env.local</code>.
      </p>
    );
  }

  if (!ready) {
    return (
      <p className="py-8 text-center text-sm text-gray-500">
        Carregando checkout do Mercado Pago...
      </p>
    );
  }

  if (view === "pix" && pixPayment) {
    return (
      <div id="checkout-payment-methods">
        <PixPaymentPanel
          pix={pixPayment}
          amount={amount}
          onBack={handleBackToPayment}
        />
      </div>
    );
  }

  if (view === "status" && statusPaymentId) {
    return (
      <div id="checkout-payment-methods">
        <StatusScreen
          initialization={{ paymentId: statusPaymentId }}
          customization={{
            visual: {
              hidePixQrCode: false,
            },
            backUrls: {
              return: `${window.location.origin}/planos`,
            },
          }}
          locale="pt-BR"
          onReady={() => onBrickReady?.()}
        />
        <button
          type="button"
          onClick={handleBackToPayment}
          className="mt-4 text-sm font-medium text-gray-600 underline hover:text-gray-900"
        >
          Escolher outro meio de pagamento
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            Pagamento — {planName}
          </h3>
          <p className="text-sm text-gray-500">
            Total:{" "}
            <span className="font-semibold text-emerald-700">
              {amount.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg px-2 py-1 text-sm font-medium text-gray-500 hover:bg-gray-100"
          aria-label="Fechar checkout"
        >
          ✕
        </button>
      </div>

      <div
        className="mb-4 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-950"
        role="note"
      >
        <p className="font-semibold">Pagamento via PIX</p>
        <p className="mt-1 text-sky-900">
          Ao escolher PIX e confirmar, você verá três formas de pagar:
        </p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>QR Code para escanear no app do banco</li>
          <li>Código Pix Copia e Cola</li>
          <li>Botão para abrir direto no app do banco</li>
        </ul>
      </div>

      {paymentError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {paymentError}
        </div>
      )}

      <div id="checkout-payment-methods">
        <Payment
          initialization={{
            amount,
            preferenceId,
          }}
          customization={{
            paymentMethods: {
              creditCard: "all",
              debitCard: "all",
              ticket: "all",
              bankTransfer: "all",
              mercadoPago: "all",
            },
          }}
          locale="pt-BR"
          onSubmit={async (formData) => {
            try {
              await handleSubmit(formData);
            } catch (error) {
              const message =
                error instanceof Error
                  ? error.message
                  : "Erro ao processar pagamento.";
              setPaymentError(message);
              throw error;
            }
          }}
          onReady={() => onBrickReady?.()}
          onError={(error) => console.error("[Payment Brick]", error)}
        />
      </div>
    </div>
  );
}
