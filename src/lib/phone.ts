export function formatBrazilianPhoneInput(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length === 0) {
    return "";
  }

  if (digits.length <= 2) {
    return `(${digits}`;
  }

  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function parseBrazilianPhone(value: string): string {
  return value.replace(/\D/g, "");
}

export function isValidBrazilianPhone(value: string): boolean {
  const digits = parseBrazilianPhone(value);
  return digits.length === 10 || digits.length === 11;
}

export function toWhatsAppNumber(phone: string): string {
  const digits = parseBrazilianPhone(phone);

  if (digits.startsWith("55")) {
    return digits;
  }

  return `55${digits}`;
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  return `https://wa.me/${toWhatsAppNumber(phone)}?text=${encodeURIComponent(message)}`;
}
