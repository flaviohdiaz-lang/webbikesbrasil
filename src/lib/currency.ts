export function formatBrazilianCurrencyInput(value: string): string {
  const digits = value.replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  const amount = Number(digits) / 100;

  return amount.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function parseBrazilianCurrency(value: string): number {
  const normalized = value.trim().replace(/\./g, "").replace(",", ".");

  if (!normalized) {
    return Number.NaN;
  }

  return Number(normalized);
}

export function formatBrazilianCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
