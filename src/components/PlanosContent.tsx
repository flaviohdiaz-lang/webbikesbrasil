"use client";

import dynamic from "next/dynamic";
import {
  avulsoPlan,
  formatPlanPrice,
  monthlyPlans,
  type Plan,
  type PlanId,
} from "@/data/plans";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const PaymentBrickCheckout = dynamic(
  () => import("@/components/PaymentBrickCheckout"),
  {
    ssr: false,
    loading: () => (
      <p className="py-8 text-center text-sm text-gray-500">
        Carregando checkout do Mercado Pago...
      </p>
    ),
  },
);

type CheckoutState = {
  preferenceId: string;
  amount: number;
  planName: string;
} | null;

export default function PlanosContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const planoStatus = searchParams.get("plano");

  const [loadingPlanId, setLoadingPlanId] = useState<PlanId | null>(null);
  const [checkout, setCheckout] = useState<CheckoutState>(null);
  const [error, setError] = useState<string | null>(null);
  const checkoutRef = useRef<HTMLElement>(null);

  const scrollToCheckout = useCallback((element?: HTMLElement | null) => {
    const target = element ?? checkoutRef.current;
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    if (!checkout) return;

    const frame = requestAnimationFrame(() => {
      scrollToCheckout();
    });

    return () => cancelAnimationFrame(frame);
  }, [checkout, scrollToCheckout]);

  async function handlePay(planId: PlanId) {
    setLoadingPlanId(planId);
    setError(null);
    setCheckout(null);

    try {
      const response = await fetch("/api/mercadopago/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      const data = (await response.json()) as {
        preferenceId?: string;
        amount?: number;
        planName?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Erro ao iniciar pagamento.");
      }

      if (!data.preferenceId || data.amount == null || !data.planName) {
        throw new Error("Resposta inválida do servidor.");
      }

      setCheckout({
        preferenceId: data.preferenceId,
        amount: data.amount,
        planName: data.planName,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setLoadingPlanId(null);
    }
  }

  return (
    <>
      {status && (
        <div
          className={`mb-8 rounded-xl border px-4 py-3 text-sm ${
            status === "aprovado"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : status === "pendente"
                ? "border-amber-200 bg-amber-50 text-amber-900"
                : "border-red-200 bg-red-50 text-red-900"
          }`}
        >
          {status === "aprovado" && (
            <p>
              Pagamento aprovado
              {planoStatus ? ` para o plano ${planoStatus}` : ""}. Obrigado!
            </p>
          )}
          {status === "pendente" && (
            <p>Pagamento pendente. Você será notificado quando for confirmado.</p>
          )}
          {status === "recusado" && (
            <p>Pagamento não concluído. Tente novamente ou escolha outro meio.</p>
          )}
        </div>
      )}

      {error && (
        <div className="mb-8 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <section>
        <h2 className="text-2xl font-bold text-gray-900">Planos mensais</h2>
        <p className="mt-2 text-gray-600">
          Escolha o plano ideal para vender mais no Web Bikes Brasil.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {monthlyPlans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              loading={loadingPlanId === plan.id}
              onPay={() => handlePay(plan.id)}
            />
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900">Anúncio avulso</h2>
        <p className="mt-2 text-gray-600">
          Precisa publicar só um anúncio? Pague uma vez, sem mensalidade.
        </p>
        <div className="mt-8 max-w-md">
          <PlanCard
            plan={avulsoPlan}
            loading={loadingPlanId === avulsoPlan.id}
            onPay={() => handlePay(avulsoPlan.id)}
          />
        </div>
      </section>

      {checkout && (
        <section
          ref={checkoutRef}
          className="mt-12 scroll-mt-4"
          id="checkout-mercadopago"
        >
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            Finalizar pagamento
          </h2>
          <PaymentBrickCheckout
            preferenceId={checkout.preferenceId}
            amount={checkout.amount}
            planName={checkout.planName}
            onClose={() => setCheckout(null)}
            onBrickReady={() => {
              const paymentMethods = document.getElementById(
                "checkout-payment-methods",
              );
              scrollToCheckout(paymentMethods);
            }}
          />
        </section>
      )}
    </>
  );
}

function PlanCard({
  plan,
  loading,
  onPay,
}: {
  plan: Plan;
  loading: boolean;
  onPay: () => void;
}) {
  return (
    <article
      className={`relative flex flex-col rounded-2xl border bg-white p-6 shadow-sm ${
        plan.badge ? "border-emerald-500 ring-2 ring-emerald-500/20" : "border-gray-200"
      }`}
    >
      {plan.badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white">
          {plan.badge}
        </span>
      )}
      <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
      <p className="mt-1 text-sm text-gray-500">{plan.description}</p>
      <p className="mt-4">
        <span className="text-3xl font-extrabold text-emerald-600">
          {formatPlanPrice(plan.price)}
        </span>
        <span className="ml-1 text-sm text-gray-500">/{plan.billingLabel}</span>
      </p>
      <ul className="mt-6 flex-1 space-y-2 text-sm text-gray-600">
        {plan.features.map((feature) => (
          <li key={feature} className="flex gap-2">
            <span className="text-emerald-600" aria-hidden>
              ✓
            </span>
            {feature}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={onPay}
        disabled={loading}
        className="mt-6 w-full rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Preparando pagamento..." : "Pagar com Mercado Pago"}
      </button>
    </article>
  );
}
