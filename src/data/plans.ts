export type PlanId = "basico" | "pro" | "loja" | "avulso";

export type Plan = {
  id: PlanId;
  name: string;
  price: number;
  description: string;
  features: string[];
  badge?: string;
  billingLabel: string;
};

export const monthlyPlans: Plan[] = [
  {
    id: "basico",
    name: "Básico",
    price: 9.9,
    description: "Ideal para quem publica poucos anúncios por mês.",
    billingLabel: "mensal",
    features: [
      "Até 3 anúncios ativos",
      "Destaque por 7 dias",
      "Suporte por e-mail",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 29.9,
    description: "Para vendedores frequentes que querem mais visibilidade.",
    billingLabel: "mensal",
    badge: "Mais popular",
    features: [
      "Até 15 anúncios ativos",
      "Destaque por 30 dias",
      "Estatísticas de visualizações",
      "Suporte prioritário",
    ],
  },
  {
    id: "loja",
    name: "Loja",
    price: 79.9,
    description: "Para lojas e revendedores com alto volume de anúncios.",
    billingLabel: "mensal",
    features: [
      "Anúncios ilimitados",
      "Página da loja personalizada",
      "Destaque máximo",
      "Suporte dedicado",
    ],
  },
];

export const avulsoPlan: Plan = {
  id: "avulso",
  name: "Anúncio avulso",
  price: 14.9,
  description: "Publique um anúncio sem assinatura mensal.",
  billingLabel: "pagamento único",
  features: [
    "1 anúncio ativo por 14 dias",
    "Renovável a qualquer momento",
    "Sem compromisso mensal",
  ],
};

export const allPlans: Plan[] = [...monthlyPlans, avulsoPlan];

export function getPlanById(id: PlanId): Plan | undefined {
  return allPlans.find((plan) => plan.id === id);
}

export function formatPlanPrice(price: number): string {
  return price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
