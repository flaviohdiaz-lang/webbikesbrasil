"use client";

import type { PixPaymentDetails } from "@/lib/mercadopago-pix";
import { useState } from "react";

type PixPaymentPanelProps = {
  pix: PixPaymentDetails;
  amount: number;
  onBack: () => void;
};

export default function PixPaymentPanel({
  pix,
  amount,
  onBack,
}: PixPaymentPanelProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(pix.qrCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }

  const qrSrc = pix.qrCodeBase64.startsWith("data:")
    ? pix.qrCodeBase64
    : `data:image/png;base64,${pix.qrCodeBase64}`;

  return (
    <div className="pix-payment-panel space-y-6">
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
        <p className="font-bold text-emerald-900">Pagamento PIX gerado</p>
        <p className="mt-1 text-sm text-emerald-800">
          Valor:{" "}
          <span className="font-semibold">
            {amount.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </span>
          . Escolha uma das opções abaixo para concluir o pagamento.
        </p>
      </div>

      <section className="pix-option-card">
        <div className="pix-option-card__header">
          <span className="pix-option-card__icon" aria-hidden>
            📷
          </span>
          <div>
            <h3 className="pix-option-card__title">1. QR Code</h3>
            <p className="pix-option-card__subtitle">
              Escaneie com o app do seu banco ou carteira digital
            </p>
          </div>
        </div>
        {pix.qrCodeBase64 ? (
          <div className="flex justify-center rounded-xl bg-white p-4 ring-1 ring-gray-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrSrc}
              alt="QR Code PIX para pagamento"
              className="h-52 w-52 object-contain"
            />
          </div>
        ) : (
          <p className="text-sm text-gray-500">QR Code indisponível no momento.</p>
        )}
      </section>

      <section className="pix-option-card">
        <div className="pix-option-card__header">
          <span className="pix-option-card__icon" aria-hidden>
            📋
          </span>
          <div>
            <h3 className="pix-option-card__title">2. Pix Copia e Cola</h3>
            <p className="pix-option-card__subtitle">
              Copie o código e cole na área PIX do seu banco
            </p>
          </div>
        </div>
        <textarea
          readOnly
          value={pix.qrCode}
          rows={4}
          className="w-full resize-none rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 font-mono text-xs text-gray-800"
          aria-label="Código Pix Copia e Cola"
        />
        <button
          type="button"
          onClick={handleCopy}
          className="mt-3 w-full rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          {copied ? "Código copiado!" : "Copiar código Pix"}
        </button>
      </section>

      <section className="pix-option-card">
        <div className="pix-option-card__header">
          <span className="pix-option-card__icon" aria-hidden>
            📱
          </span>
          <div>
            <h3 className="pix-option-card__title">3. Abrir no app do banco</h3>
            <p className="pix-option-card__subtitle">
              Pague direto no aplicativo do seu banco com um toque
            </p>
          </div>
        </div>
        {pix.ticketUrl ? (
          <a
            href={pix.ticketUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-950"
          >
            Abrir no app do banco
          </a>
        ) : (
          <p className="text-sm text-gray-500">
            Link do banco indisponível. Use o QR Code ou Copia e Cola.
          </p>
        )}
      </section>

      <button
        type="button"
        onClick={onBack}
        className="text-sm font-medium text-gray-600 underline hover:text-gray-900"
      >
        Escolher outro meio de pagamento
      </button>
    </div>
  );
}
