export const listingTypes = [
  "Bicicletas",
  "Peças",
  "Acessórios",
  "Serviços",
  "Eventos",
] as const;

export type ListingType = (typeof listingTypes)[number];

export const listingSubcategories: Record<
  ListingType,
  readonly string[]
> = {
  Bicicletas: [
    "Mountain Bike (MTB)",
    "Speed/Road",
    "Bike de Cidade",
    "BMX",
    "Gravel",
    "Elétrica (e-Bike)",
    "Infantil",
    "Dobrável",
  ],
  Peças: [
    "Quadro",
    "Garfo",
    "Rodas/Aros",
    "Pneus",
    "Câmbio/Transmissão",
    "Freios",
    "Selim",
    "Guidão",
    "Pedais",
    "Corrente/Cassete",
    "Suspensão",
  ],
  Acessórios: [
    "Capacete",
    "Luzes/Iluminação",
    "Cadeado",
    "GPS/Computador",
    "Bolsa/Mochila",
    "Bomba de Ar",
    "Roupas",
  ],
  Serviços: [],
  Eventos: [],
};

export function hasSubcategories(type: ListingType): boolean {
  return listingSubcategories[type].length > 0;
}

export function isValidSubcategory(
  type: ListingType,
  subcategory: string,
): boolean {
  return listingSubcategories[type].includes(subcategory);
}

/** @deprecated Use listingTypes */
export const listingCategories = listingTypes;
/** @deprecated Use ListingType */
export type ListingCategory = ListingType;

export const brazilianStates = [
  { uf: "AC", name: "Acre" },
  { uf: "AL", name: "Alagoas" },
  { uf: "AP", name: "Amapá" },
  { uf: "AM", name: "Amazonas" },
  { uf: "BA", name: "Bahia" },
  { uf: "CE", name: "Ceará" },
  { uf: "DF", name: "Distrito Federal" },
  { uf: "ES", name: "Espírito Santo" },
  { uf: "GO", name: "Goiás" },
  { uf: "MA", name: "Maranhão" },
  { uf: "MT", name: "Mato Grosso" },
  { uf: "MS", name: "Mato Grosso do Sul" },
  { uf: "MG", name: "Minas Gerais" },
  { uf: "PA", name: "Pará" },
  { uf: "PB", name: "Paraíba" },
  { uf: "PR", name: "Paraná" },
  { uf: "PE", name: "Pernambuco" },
  { uf: "PI", name: "Piauí" },
  { uf: "RJ", name: "Rio de Janeiro" },
  { uf: "RN", name: "Rio Grande do Norte" },
  { uf: "RS", name: "Rio Grande do Sul" },
  { uf: "RO", name: "Rondônia" },
  { uf: "RR", name: "Roraima" },
  { uf: "SC", name: "Santa Catarina" },
  { uf: "SP", name: "São Paulo" },
  { uf: "SE", name: "Sergipe" },
  { uf: "TO", name: "Tocantins" },
] as const;
